(()=>{const h="/data/traits.json",p="quiz-root",i="five-traits-seq-answers";let t=[],e=0,s={};async function r(){const e=await fetch(h);return e.json()}function c(e,t){const n={};for(const i of t.categories){const s=i.items;let o=0;for(const t of s){const n=!!e[t.id];t.reverse?o+=n?0:1:o+=n?1:0}n[i.key]=s.length?o/s.length:0}return n}function l(n,s){n.innerHTML=`
      <div style="margin:2rem 0;">
        <p><strong>${s.catKey}</strong> 문항 ${e+1}/${t.length}</p>
        <p style="margin:1rem 0;">${s.item.text} ${s.item.reverse?"(역채점)":""}</p>
        <div style="margin-top:1rem;">
          <button id="btn-true">참</button>
          <button id="btn-false" style="margin-left:1rem;">거짓</button>
        </div>
      </div>
    `,n.querySelector("#btn-true").onclick=()=>a(s.item.id,!0),n.querySelector("#btn-false").onclick=()=>a(s.item.id,!1)}function d(e,t,n){const s=Object.entries(t).map(([e,t])=>{const s=n.categories.find(t=>t.key===e)?.label||e;return`<tr><td>${s}</td><td>${t.toFixed(3)}</td><td>${(t*100).toFixed(1)}%</td></tr>`}).join("");e.innerHTML=`
      <h2>결과</h2>
      <table border="1" cellpadding="6" style="border-collapse:collapse; margin-top:1rem;">
        <tr><th>범주</th><th>점수(0~1)</th><th>백분율</th></tr>
        ${s}
      </table>
      <canvas id="radar" style="max-width:600px; margin-top:1.5rem;"></canvas>
    `,u().then(()=>{const e=document.getElementById("radar").getContext("2d"),s=n.categories.map(e=>e.label),o=n.categories.map(e=>t[e.key]??0);new Chart(e,{type:"radar",data:{labels:s,datasets:[{label:"정규화 점수",data:o,fill:!0}]},options:{scales:{r:{min:0,max:1}}}})})}async function u(){if(window.Chart)return;await new Promise((e,t)=>{const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js",n.onload=e,n.onerror=t,document.head.appendChild(n)})}function a(t,n){s[t]=n,e++,m(),o()}function o(){const o=document.getElementById(p);if(!o)return;e<t.length?l(o,t[e]):d(o,c(s,n),n)}function m(){try{localStorage.setItem(i,JSON.stringify({responses:s,currentIndex:e}))}catch{}}function f(){try{const t=localStorage.getItem(i);if(t){const n=JSON.parse(t);s=n.responses||{},e=n.currentIndex||0}}catch{}}let n=null;(async()=>{n=await r(),t=[],n.categories.forEach(e=>{e.items.forEach(n=>t.push({catKey:e.key,item:n}))}),f(),o()})()})()