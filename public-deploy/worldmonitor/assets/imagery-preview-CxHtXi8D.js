import{s as o,t as l,a as t}from"./panels-DwgpgDcB.js";import{g as c,s as d}from"./cross-domain-storage-BkfZ6fhr.js";const i="wm-layer-warning-dismissed";let r=null;function u(a){if(c(i)||r||window.self!==window.top||new URLSearchParams(window.location.search).get("alert")==="false")return;const e=document.createElement("div");e.className="layer-warn-overlay",o(e,l(`
    <div class="layer-warn-dialog">
      <div class="layer-warn-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div class="layer-warn-text">
        <strong>${t("components.deckgl.layerWarningTitle")}</strong>
        <p>${t("components.deckgl.layerWarningBody",{threshold:a})}</p>
      </div>
      <label class="layer-warn-dismiss">
        <input type="checkbox" />
        <span>${t("components.deckgl.layerWarningDismiss")}</span>
      </label>
      <button class="layer-warn-ok">${t("components.deckgl.layerWarningOk")}</button>
    </div>`,"legacy direct innerHTML migration"));const n=()=>{const s=e.querySelector(".layer-warn-dismiss input");s!=null&&s.checked&&d(i),e.classList.add("layer-warn-out"),setTimeout(()=>{e.remove(),r=null},200)};e.querySelector(".layer-warn-ok").addEventListener("click",n),e.addEventListener("click",s=>{s.target===e&&n()}),document.body.appendChild(e),r=e,requestAnimationFrame(()=>e.classList.add("layer-warn-in"))}const m=["sentinel-s1-l1c.s3.amazonaws.com","sentinel-cogs.s3.us-west-2.amazonaws.com","earth-search.aws.element84.com"];function g(a){if(!a)return!1;try{const e=new URL(a);return e.protocol==="https:"&&m.some(n=>e.hostname===n)}catch{return!1}}export{g as i,u as s};
