(() => {
  const SPEC_URL = "/data/traits.json";
  const ROOT_ID = "quiz-root";
  const STORAGE_KEY = "five-traits-seq-answers";
  const TRAIT_DESCRIPTIONS = {
    "탐": {
      title: "탐(탐욕/애착)",
      desc: "원하는 대상에 대한 집착과 기쁨에 집착하는 경향. 만족이 지속되기 어렵고 의존을 낳기 쉽습니다."
    },
    "진에": {
      title: "진에(분노/혐오)",
      desc: "사소한 자극에도 거부·분노가 일어나 타인/자신에게 상처를 주기 쉬운 상태입니다."
    },
    "우치": {
      title: "우치(무지/혼미)",
      desc: "사태를 또렷이 보지 못해 오해·착각이 늘고, 판단/집중이 흐려지는 경향입니다."
    },
    "자만": {
      title: "자만(교만)",
      desc: "자신을 높이고 타인을 낮추려는 경향. 배움과 관계의 유연성을 해칠 수 있습니다."
    },
    "심사": {
      title: "심사(산만/들뜸)",
      desc: "마음이 쉽게 요동·분산되어 현재에 머물기 어려운 상태입니다."
    }
  };
  let flatItems = [];     // 모든 문항 [ {catKey, item}, ... ]
  let currentIndex = 0;   // 현재 문항 인덱스
  let responses = {};     // { item.id: true/false }
  let specCache = null;

  // 점수대별 짧은 권장 실천 문구
  function briefAdvice(key, s) {
    // s: 0~1
    if (s >= 0.67) {
      switch (key) {
        case "탐":  return "충족감의 무상함을 자주 관찰하고, 기쁨을 ‘소유’보다 ‘경험’으로 전환해보세요.";
        case "진에":return "감정이 오를 때 심호흡을 3회 → 멈춤 → 부드러운 말 한마디를 실천해보세요.";
        case "우치":return "하루 10분 ‘사실/생각 구분’ 기록해보기: 보이는 사실과 해석을 분리해 적어보세요.";
        case "자만":return "하루 한 번 ‘감사 인사·존중 표현’을 먼저 건네는 연습을 해보세요.";
        case "심사":return "5분 타이머 명상(호흡 1~10 세기)을 자주 끊어서 시행해보세요.";
      }
    } else if (s >= 0.34) {
      switch (key) {
        case "탐":  return "욕구 인지 시 ‘지금 필요한가?’ 한 번만 자문하고 선택하세요.";
        case "진에":return "불편함을 느낄 때 감정 라벨링(‘나는 지금 짜증났다’)만 해도 강도가 완화됩니다.";
        case "우치":return "중요 판단은 한 문장으로 요지 정리 후 결정하세요.";
        case "자만":return "타인의 강점 한 가지를 찾아 말로 칭찬해보세요.";
        case "심사":return "작업 단위를 25~30분으로 쪼개 집중-휴식을 분리해보세요.";
      }
    } else {
      switch (key) {
        case "탐":  return "충족된 순간을 알아차리며 ‘여기서 멈춤’을 맛보세요.";
        case "진에":return "부드러운 어조를 유지하는 차분함을 지속해보세요.";
        case "우치":return "모르는 것을 인정하고 확인하는 습관을 유지하세요.";
        case "자만":return "겸손한 질문으로 대화를 여는 습관을 이어가세요.";
        case "심사":return "현재 신체의 감각(발바닥·숨)에 10초간 집중해보는 것(앵커링)을 자주 해보세요.";
      }
    }
    return "";
  }

  function buildTraitNotesHTML(scores, spec) {
    const byKey = Object.fromEntries(spec.categories.map(c => [c.key, c.label]));
    const items = spec.categories.map(c => {
      const s = scores[c.key] ?? 0;
      const d = TRAIT_DESCRIPTIONS[c.key];
      const pct = (s * 100).toFixed(1);
      return `
        <details style="border:1px solid #eee; border-radius:12px; padding:.75rem 1rem; margin:.5rem 0;">
          <summary style="cursor:pointer; display:flex; justify-content:space-between; gap:1rem;">
            <span><strong>${d?.title || byKey[c.key] || c.key}</strong></span>
            <span>${pct}%</span>
          </summary>
          <div style="margin:.5rem 0 .25rem 0; line-height:1.6;">
            ${d?.desc || ""}
          </div>
          <div style="margin-top:.75rem; font-size:1.1rem; font-weight:600; line-height:1.6;">
            <em>제안:</em> ${briefAdvice(c.key, s)}
          </div>
        </details>
      `;
    }).join("");
    return `
      <section style="max-width:740px; width:100%; margin-top:1rem;">
        <h5 style="margin:.5rem 0 0 0;">특성별 설명 & 짧은 제안</h3>
        ${items}
      </section>
    `;
  }

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
        <div style="font-size:.95rem;">
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
        <p style="margin:.75rem 0; font-size:.95rem;">
          각 축은 0~1로 정규화된 점수입니다. 포인트에 마우스를 올리면 정확한 값을 볼 수 있어요.
        </p>
        <div style="display:flex; gap:.5rem; margin-top:.5rem;">
          <button id="btn-restart" class="btn">다시하기</button>
          <button id="btn-copy" class="btn" title="로컬 진행상태 공유용 링크">진행상태 링크 복사</button>
        </div>

        ${buildTraitNotesHTML(scores, spec)}
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
      specCache.categories.forEach(cat=>{
        cat.items.forEach(it=> flatItems.push({ catKey: cat.key, item: it }));
      });

      // Fisher–Yates 셔플
      for (let i = flatItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flatItems[i], flatItems[j]] = [flatItems[j], flatItems[i]];
      }
      load();
      step();
    } catch (e) {
      const root = document.getElementById(ROOT_ID);
      if (root) root.innerHTML = `<p>로딩 오류: ${String(e)}</p>`;
    }
  })();
})();
