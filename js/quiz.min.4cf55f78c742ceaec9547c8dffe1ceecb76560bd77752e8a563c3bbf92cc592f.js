(()=>{const g="/data/traits.json",a="quiz-root",r="five-traits-seq-answers",v={"탐":{title:"탐(탐욕/애착)",desc:"원하는 대상에 대한 집착과 기쁨에 집착하는 경향. 만족이 지속되기 어렵고 의존을 낳기 쉽습니다."},"진에":{title:"진에(분노/혐오)",desc:"사소한 자극에도 거부·분노가 일어나 타인/자신에게 상처를 주기 쉬운 상태입니다."},"우치":{title:"우치(무지/혼미)",desc:"사태를 또렷이 보지 못해 오해·착각이 늘고, 판단/집중이 흐려지는 경향입니다."},"자만":{title:"자만(교만)",desc:"자신을 높이고 타인을 낮추려는 경향. 배움과 관계의 유연성을 해칠 수 있습니다."},"심사":{title:"심사(산만/들뜸)",desc:"마음이 쉽게 요동·분산되어 현재에 머물기 어려운 상태입니다."}};let e=[],t=0,n={},s=null;function l(e,t){if(t>=.67)switch(e){case"탐":return"충족감의 무상함을 자주 관찰하고, 기쁨을 ‘소유’보다 ‘경험’으로 전환해보세요.";case"진에":return"감정이 오를 때 심호흡을 3회 → 멈춤 → 부드러운 말 한마디를 실천해보세요.";case"우치":return"하루 10분 ‘사실/생각 구분’ 기록해보기: 보이는 사실과 해석을 분리해 적어보세요.";case"자만":return"하루 한 번 ‘감사 인사·존중 표현’을 먼저 건네는 연습을 해보세요.";case"심사":return"5분 타이머 명상(호흡 1~10 세기)을 자주 끊어서 시행해보세요."}else if(t>=.34)switch(e){case"탐":return"욕구 인지 시 ‘지금 필요한가?’ 한 번만 자문하고 선택하세요.";case"진에":return"불편함을 느낄 때 감정 라벨링(‘나는 지금 짜증났다’)만 해도 강도가 완화됩니다.";case"우치":return"중요 판단은 한 문장으로 요지 정리 후 결정하세요.";case"자만":return"타인의 강점 한 가지를 찾아 말로 칭찬해보세요.";case"심사":return"작업 단위를 25~30분으로 쪼개 집중-휴식을 분리해보세요."}else switch(e){case"탐":return"충족된 순간을 알아차리며 ‘여기서 멈춤’을 맛보세요.";case"진에":return"부드러운 어조를 유지하는 차분함을 지속해보세요.";case"우치":return"모르는 것을 인정하고 확인하는 습관을 유지하세요.";case"자만":return"겸손한 질문으로 대화를 여는 습관을 이어가세요.";case"심사":return"현재 신체의 감각(발바닥·숨)에 10초간 집중해보는 것(앵커링)을 자주 해보세요."}return""}function p(e,t){const n=Object.fromEntries(t.categories.map(e=>[e.key,e.label])),s=t.categories.map(t=>{const s=e[t.key]??0,o=v[t.key],i=(s*100).toFixed(1);return`
        <details style="border:1px solid #eee; border-radius:12px; padding:.75rem 1rem; margin:.5rem 0;">
          <summary style="cursor:pointer; display:flex; justify-content:space-between; gap:1rem;">
            <span><strong>${o?.title||n[t.key]||t.key}</strong></span>
            <span style="color:#666;">${i}%</span>
          </summary>
          <div style="margin:.5rem 0 .25rem 0; line-height:1.6;">
            ${o?.desc||""}
          </div>
          <div style="margin-top:.75rem; color:#222; font-size:1.1rem; font-weight:600; line-height:1.6;">
            <em>제안:</em> ${l(t.key,s)}
          </div>
        </details>
      `}).join("");return`
      <section style="max-width:740px; width:100%; margin-top:1rem;">
        <h5 style="margin:.5rem 0 0 0;">특성별 설명 & 짧은 제안</h3>
        ${s}
      </section>
    `}async function d(){const e=await fetch(g,{cache:"no-store"});if(!e.ok)throw new Error("traits.json 로드 실패");return e.json()}function u(e,t){const n={};for(const s of t.categories){let o=0;for(const t of s.items){const n=!!e[t.id];o+=t.reverse?n?0:1:n?1:0}n[s.key]=s.items.length?o/s.items.length:0}return n}function h(n,s){const o=e.length,a=t+1,r=Math.floor(t/o*100);n.innerHTML=`
      <div style="margin:2rem 0;">
        <div style="font-size:.95rem; color:#666;">
          문항 ${a}/${o} · ${r}%
        </div>
        <p style="margin:1rem 0; line-height:1.6;">
          ${s.item.text}
        </p>
        <div style="margin-top:1rem; display:flex; gap:.75rem;">
          <button id="btn-true" class="btn">참</button>
          <button id="btn-false" class="btn">거짓</button>
        </div>
        <div style="margin-top:1rem; height:6px; background:#eee; border-radius:999px; overflow:hidden;">
          <div style="height:100%; width:${t/o*100}%; background:#999;"></div>
        </div>
      </div>
    `,n.querySelector("#btn-true").onclick=()=>i(s.item.id,!0),n.querySelector("#btn-false").onclick=()=>i(s.item.id,!1)}function m(e,s,i){const a=i.categories.map(e=>e.label),r=i.categories.map(e=>s[e.key]??0);e.innerHTML=`
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

        ${p(s,i)}
      </section>
    `,f().then(()=>{const e=document.getElementById("radar").getContext("2d");new Chart(e,{type:"radar",data:{labels:a,datasets:[{label:"정규화 점수",data:r,fill:!0}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{r:{min:0,max:1,ticks:{stepSize:.2}}},plugins:{legend:{display:!0},tooltip:{callbacks:{label:e=>`${e.dataset.label}: ${e.parsed.r.toFixed(3)} (${(e.parsed.r*100).toFixed(1)}%)`}}},elements:{line:{tension:.2}}}})}),e.querySelector("#btn-restart").onclick=()=>{n={},t=0,c(),o()},e.querySelector("#btn-copy").onclick=async()=>{try{const s=btoa(unescape(encodeURIComponent(JSON.stringify({r:n})))),t=new URL(location.href);t.hash=`r=${s}`,await navigator.clipboard.writeText(t.toString()),e.querySelector("#btn-copy").textContent="복사됨!",setTimeout(()=>e.querySelector("#btn-copy").textContent="진행상태 링크 복사",1200)}catch{}}}async function f(){if(window.Chart)return;await new Promise((e,t)=>{const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js",n.onload=e,n.onerror=t,document.head.appendChild(n)})}function i(e,s){n[e]=s,t++,c(),o()}function o(){const o=document.getElementById(a);if(!o)return;if(t<e.length)h(o,e[t]);else{const e=u(n,s);m(o,e,s)}}function c(){try{localStorage.setItem(r,JSON.stringify({responses:n,currentIndex:t}))}catch{}}function b(){try{const s=localStorage.getItem(r);if(s){const{responses:e={},currentIndex:o=0}=JSON.parse(s);n=e,t=o}if(location.hash.startsWith("#r=")){const s=location.hash.slice(3);try{const o=JSON.parse(decodeURIComponent(escape(atob(s))));if(o&&o.r&&typeof o.r=="object"){n=o.r;const s=new Set(Object.keys(n));t=e.findIndex(e=>!s.has(e.item.id)),t===-1&&(t=e.length)}}catch{}}}catch{}}(async()=>{try{s=await d(),e=[],s.categories.forEach(t=>{t.items.forEach(n=>e.push({catKey:t.key,item:n}))});for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}b(),o()}catch(t){const e=document.getElementById(a);e&&(e.innerHTML=`<p>로딩 오류: ${String(t)}</p>`)}})()})()