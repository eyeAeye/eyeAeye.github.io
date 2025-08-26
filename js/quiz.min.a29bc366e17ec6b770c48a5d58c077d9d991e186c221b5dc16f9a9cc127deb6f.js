(()=>{const s="/data/traits.json",e="quiz-root",t="five-traits-answers-v1.1";async function o(){if(window.Chart)return;await new Promise((e,t)=>{const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js",n.onload=e,n.onerror=t,document.head.appendChild(n)})}async function i(){const e=await fetch(s,{cache:"no-store"});if(!e.ok)throw new Error("spec fetch failed");return e.json()}function a(e,t){const n={};for(const i of t.categories){const s=i.items;let o=0;for(const t of s){const n=!!e[t.id];t.reverse?o+=n?0:1:o+=n?1:0}n[i.key]=s.length?o/s.length:0}return n}function r(e){try{localStorage.setItem(t,JSON.stringify(e))}catch{}}function c(){try{const e=localStorage.getItem(t);return e?JSON.parse(e):{}}catch{return{}}}function l(n){const s=document.getElementById(e);if(!s)return;s.innerHTML=`
      <article class="five-traits">
        <h1>${n.title||"자기점검"}</h1>
        <form id="traits-form"></form>
        <div id="actions" style="margin:1rem 0;">
          <button id="submit" type="button">점수 계산</button>
          <button id="reset" type="button" style="margin-left:.5rem;">초기화</button>
        </div>
        <section id="result" hidden>
          <h2>결과</h2>
          <div id="score-table-wrap"></div>
          <canvas id="radar" style="max-width:700px; width:100%; margin-top:1rem;"></canvas>
          <p id="explain" style="margin-top:.5rem; color:#555;">
            각 범주의 점수는 0~1 사이의 값으로, 문항 수에 맞춰 정규화되었습니다.
          </p>
        </section>
      </article>
    `;const o=s.querySelector("#traits-form"),l=c(),i=document.createDocumentFragment();n.categories.forEach((e)=>{const n=document.createElement("fieldset");n.style.margin="1rem 0",n.innerHTML=`<legend><strong>${e.label}</strong></legend>`,e.items.forEach((e)=>{const s=e.id,i=s,a=!!l[s],o=document.createElement("div");o.style.margin=".5rem 0",o.innerHTML=`
          <label style="display:flex; align-items:center; gap:.5rem;">
            <input type="checkbox" name="${i}" id="${s}" ${a?"checked":""}/>
            <span>${e.text}</span>
            ${e.reverse?`<em style="font-size:.85em; color:#888;">(역채점)</em>`:""}
          </label>
        `,n.appendChild(o)}),i.appendChild(n)}),o.appendChild(i),s.querySelector("#submit").addEventListener("click",async()=>{const e={};n.categories.forEach(t=>{t.items.forEach(t=>{const n=o.querySelector(`#${t.id}`);e[t.id]=!!(n&&n.checked)})}),r(e);const t=a(e,n);d(t,n)}),s.querySelector("#reset").addEventListener("click",()=>{localStorage.removeItem(t),n.categories.forEach(e=>{e.items.forEach(e=>{const t=o.querySelector(`#${e.id}`);t&&(t.checked=!1)})});const e=s.querySelector("#result");e&&(e.hidden=!0)})}let n=null;async function d(t,s){const i=document.getElementById(e),r=i.querySelector("#result"),c=i.querySelector("#score-table-wrap"),a=i.querySelector("#radar");r.hidden=!1;const l=Object.entries(t),d=s.categories.map(e=>e.label),u=Object.fromEntries(s.categories.map(e=>[e.key,e.label])),h=l.map(([e,t])=>{const n=(t*100).toFixed(1);return`<tr><td>${u[e]||e}</td><td>${t.toFixed(3)}</td><td>${n}%</td></tr>`}).join("");c.innerHTML=`
      <table style="border-collapse:collapse; width:100%; max-width:700px;">
        <thead>
          <tr>
            <th style="text-align:left; border-bottom:1px solid #ddd; padding:.5rem;">범주</th>
            <th style="text-align:right; border-bottom:1px solid #ddd; padding:.5rem;">점수(0~1)</th>
            <th style="text-align:right; border-bottom:1px solid #ddd; padding:.5rem;">백분율</th>
          </tr>
        </thead>
        <tbody>
          ${h}
        </tbody>
      </table>
    `,await o();const m=s.categories.map(e=>t[e.key]??0),f={type:"radar",data:{labels:d,datasets:[{label:"정규화 점수 (0~1)",data:m,fill:!0}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{r:{suggestedMin:0,suggestedMax:1,ticks:{stepSize:.2}}},plugins:{legend:{display:!0}}}};a.parentElement.style.minHeight="420px",n&&n.destroy(),n=new Chart(a.getContext("2d"),f)}(async()=>{try{const e=await i();l(e)}catch(n){const t=document.getElementById(e);t&&(t.innerHTML=`<p>설문 구성을 불러오지 못했습니다. (${String(n)})</p>`)}})()})()