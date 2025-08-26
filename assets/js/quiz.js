(() => {
  const SPEC_URL = "/data/traits.json";
  const ROOT_ID = "quiz-root";
  const STORAGE_KEY = "five-traits-seq-answers";

  let flatItems = [];     // 모든 문항 [ {catKey, item}, ... ]
  let currentIndex = 0;   // 현재 문항 인덱스
  let responses = {};     // { item.id: true/false }
  let specCache = null;

  async function loadSpec() {
    const r = await fetch(SPEC_URL, { cache: "no-store" });
    if (!r.ok) throw new Error("traits.json 로드 실패");
    return r.json();
  }

  function scoreSurvey(responses, spec) {
    const scores = {};
    for (const cat of spec.categories) {
      let adj = 0;
      for (const it of cat.items) {
        const ans = !!responses[it.id];
        adj += it.reverse ? (ans ? 0 : 1) : (ans ? 1 : 0);
      }
      scores[cat.key] = cat.items.length ? adj / cat.items.length : 0;
    }
    return scores;
  }

  function renderQuestion(root, itemObj) {
    const total = flatItems.length;
    const idx = currentIndex + 1;
    const pct = Math.floor((currentIndex / total) * 100);

    root.innerHTML = `
      <div style="margin:2rem 0;">
        <div style="font-size:.95rem; color:#666;">
          문항 ${idx}/${total} · ${pct}%
        </div>
        <p style="margin:1rem 0; line-height:1.6;">
          ${itemObj.item.text}
        </p>
        <div style="margin-top:1rem; display:flex; gap:.75rem;">
          <button id="btn-true" class="btn">참</button>
          <button id="btn-false" class="btn">거짓</button>
        </div>
        <div style="margin-top:1rem; height:6px; background:#eee; border-radius:999px; overflow:hidden;">
          <div style="height:100%; width:${(currentIndex/total)*100}%; background:#999;"></div>
        </div>
      </div>
    `;

    root.querySelector("#btn-true").onclick  = () => handleAnswer(itemObj.item.id, true);
    root.querySelector("#btn-false").onclick = () => handleAnswer(itemObj.item.id, false);
  }

  function renderRadarOnly(root, scores, spec) {
    const labels = spec.categories.map(c => c.label);
    const dataVals = spec.categories.map(c => scores[c.key] ?? 0);

    root.innerHTML = `
      <section style="margin:1rem 0;">
        <h2 style="margin:0 0 .75rem 0;">결과 레이더</h2>
        <div style="max-width:740px; width:100%; aspect-ratio:1.6/1; position:relative;">
          <canvas id="radar"></canvas>
        </div>
        <p style="margin:.75rem 0; color:#666; font-size:.95rem;">
          각 축은 0~1로 정규화된 점수입니다. 포인트에 마우스를 올리면 정확한 값을 볼 수 있어요.
        </p>
        <div style="display:flex; gap:.5rem; margin-top:.5rem;">
          <button id="btn-restart" class="btn">다시하기</button>
          <button id="btn-copy" class="btn" title="로컬 진행상태 공유용 링크">진행상태 링크 복사</button>
        </div>
      </section>
    `;

    ensureChartJS().then(() => {
      const ctx = document.getElementById("radar").getContext("2d");
      new Chart(ctx, {
        type: "radar",
        data: {
          labels,
          datasets: [{
            label: "정규화 점수",
            data: dataVals,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: { r: { min: 0, max: 1, ticks: { stepSize: 0.2 } } },
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.r).toFixed(3)} (${(ctx.parsed.r*100).toFixed(1)}%)`
              }
            }
          },
          elements: { line: { tension: 0.2 } }
        }
      });
    });

    root.querySelector("#btn-restart").onclick = () => {
      responses = {};
      currentIndex = 0;
      save();
      step();
    };
    root.querySelector("#btn-copy").onclick = async () => {
      // 간단히 localStorage 기반 진행상태 공유: 현재 응답 JSON을 URL 해시로 인코딩
      try {
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ r: responses }))));
        const url = new URL(location.href);
        url.hash = `r=${payload}`;
        await navigator.clipboard.writeText(url.toString());
        root.querySelector("#btn-copy").textContent = "복사됨!";
        setTimeout(()=> root.querySelector("#btn-copy").textContent = "진행상태 링크 복사", 1200);
      } catch {}
    };
  }

  async function ensureChartJS() {
    if (window.Chart) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/chart.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function handleAnswer(id, val) {
    responses[id] = val;
    currentIndex++;
    save();
    step();
  }

  function step() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (currentIndex < flatItems.length) {
      renderQuestion(root, flatItems[currentIndex]);
    } else {
      const scores = scoreSurvey(responses, specCache);
      renderRadarOnly(root, scores, specCache);
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, currentIndex })); } catch {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { responses: r = {}, currentIndex: i = 0 } = JSON.parse(raw);
        responses = r; currentIndex = i;
      }
      // 해시 공유 복원 (선택)
      if (location.hash.startsWith("#r=")) {
        const b64 = location.hash.slice(3);
        try {
          const parsed = JSON.parse(decodeURIComponent(escape(atob(b64))));
          if (parsed && parsed.r && typeof parsed.r === "object") {
            responses = parsed.r;
            // 응답 개수만큼 진행 인덱스를 추정
            const answeredIds = new Set(Object.keys(responses));
            currentIndex = flatItems.findIndex(f => !answeredIds.has(f.item.id));
            if (currentIndex === -1) currentIndex = flatItems.length;
        }
        } catch {}
      }
    } catch {}
  }

  (async () => {
    try {
      specCache = await loadSpec();
      flatItems = [];
      specCache.categories.forEach(cat => {
        cat.items.forEach(it => flatItems.push({ catKey: cat.key, item: it }));
      });
      // 진행상태 복원은 flatItems 생성 이후에
      load();
      step();
    } catch (e) {
      const root = document.getElementById(ROOT_ID);
      if (root) root.innerHTML = `<p>로딩 오류: ${String(e)}</p>`;
    }
  })();
})();
