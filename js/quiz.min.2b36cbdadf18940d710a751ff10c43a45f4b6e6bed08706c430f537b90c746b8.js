(()=>{const f="/data/traits.json",r="quiz-root",a="five-traits-seq-answers";let n=[],e=0,t={},s=null;async function l(){const e=await fetch(f,{cache:"no-store"});if(!e.ok)throw new Error("traits.json 로드 실패");return e.json()}function d(e,t){const n={};for(const s of t.categories){let o=0;for(const t of s.items){const n=!!e[t.id];o+=t.reverse?n?0:1:n?1:0}n[s.key]=s.items.length?o/s.items.length:0}return n}function u(t,s){t.innerHTML=`
      <div style="margin:2rem 0;">
        <div style="font-size:.95rem; color:#666;">
          <strong>${s.catKey}</strong> • ${e+1}/${n.length}
        </div>
        <p style="margin:1rem 0; line-height:1.6;">
          ${s.item.text} ${s.item.reverse?'<span style="font-size:.85em;color:#888;">(역채점)</span>':""}
        </p>
        <div style="margin-top:1rem; display:flex; gap:.75rem;">
          <button id="btn-true" class="btn">참</button>
          <button id="btn-false" class="btn">거짓</button>
        </div>
        <div style="margin-top:1rem; height:6px; background:#eee; border-radius:999px; overflow:hidden;">
          <div style="height:100%; width:${e/n.length*100}%; background:#999;"></div>
        </div>
      </div>
    `,t.querySelector("#btn-true").onclick=()=>i(s.item.id,!0),t.querySelector("#btn-false").onclick=()=>i(s.item.id,!1)}function h(n,s,i){const a=i.categories.map(e=>e.label),r=i.categories.map(e=>s[e.key]??0);n.innerHTML=`
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
    `,m().then(()=>{const e=document.getElementById("radar").getContext("2d");new Chart(e,{type:"radar",data:{labels:a,datasets:[{label:"정규화 점수",data:r,fill:!0}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{r:{min:0,max:1,ticks:{stepSize:.2}}},plugins:{legend:{display:!0},tooltip:{callbacks:{label:e=>`${e.dataset.label}: ${e.parsed.r.toFixed(3)} (${(e.parsed.r*100).toFixed(1)}%)`}}},elements:{line:{tension:.2}}}})}),n.querySelector("#btn-restart").onclick=()=>{t={},e=0,c(),o()},n.querySelector("#btn-copy").onclick=async()=>{try{const s=btoa(unescape(encodeURIComponent(JSON.stringify({r:t})))),e=new URL(location.href);e.hash=`r=${s}`,await navigator.clipboard.writeText(e.toString()),n.querySelector("#btn-copy").textContent="복사됨!",setTimeout(()=>n.querySelector("#btn-copy").textContent="진행상태 링크 복사",1200)}catch{}}}async function m(){if(window.Chart)return;await new Promise((e,t)=>{const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js",n.onload=e,n.onerror=t,document.head.appendChild(n)})}function i(n,s){t[n]=s,e++,c(),o()}function o(){const o=document.getElementById(r);if(!o)return;if(e<n.length)u(o,n[e]);else{const e=d(t,s);h(o,e,s)}}function c(){try{localStorage.setItem(a,JSON.stringify({responses:t,currentIndex:e}))}catch{}}function p(){try{const s=localStorage.getItem(a);if(s){const{responses:n={},currentIndex:o=0}=JSON.parse(s);t=n,e=o}if(location.hash.startsWith("#r=")){const s=location.hash.slice(3);try{const o=JSON.parse(decodeURIComponent(escape(atob(s))));if(o&&o.r&&typeof o.r=="object"){t=o.r;const s=new Set(Object.keys(t));e=n.findIndex(e=>!s.has(e.item.id)),e===-1&&(e=n.length)}}catch{}}}catch{}}(async()=>{try{s=await l(),n=[],s.categories.forEach(e=>{e.items.forEach(t=>n.push({catKey:e.key,item:t}))}),p(),o()}catch(t){const e=document.getElementById(r);e&&(e.innerHTML=`<p>로딩 오류: ${String(t)}</p>`)}})()})()