(function(){
  "use strict";
  const SESSION_KEY="digiy_pay_baptiste_validated_at";
  const SESSION_MS=8*60*60*1000;
  const PIN_PAGE="./pin.html";
  const ABOS_PAGE="./abos-ready.html?v=from-menu";

  function valid(){
    const ts=Number(localStorage.getItem(SESSION_KEY)||0);
    return !!ts && Number.isFinite(ts) && Date.now()-ts<SESSION_MS;
  }
  function isPin(){
    return /\/pin\.html$/i.test(window.location.pathname);
  }
  function logout(){
    localStorage.removeItem(SESSION_KEY);
    window.location.replace(PIN_PAGE);
  }
  function goAbos(e){
    if(e) e.preventDefault();
    window.location.href=ABOS_PAGE;
  }
  function addAbosToMenus(){
    const fabPanel=document.getElementById("fabPanel");
    if(fabPanel && !fabPanel.querySelector('[data-fab="abos-ready"]')){
      const btn=document.createElement("button");
      btn.className="fab-action gold";
      btn.type="button";
      btn.setAttribute("data-fab","abos-ready");
      btn.innerHTML="<span>💳 ABOS</span><small>abonnés ready</small>";
      btn.addEventListener("click",goAbos);
      fabPanel.insertBefore(btn,fabPanel.firstChild);
    }

    const menuGrid=document.querySelector("#menuModal .menu-grid");
    if(menuGrid && !document.getElementById("menuAbosReady")){
      const btn=document.createElement("button");
      btn.id="menuAbosReady";
      btn.type="button";
      btn.innerHTML="💳<br>ABOS";
      btn.addEventListener("click",goAbos);
      menuGrid.insertBefore(btn,menuGrid.firstChild);
    }
  }

  window.DIGIY_PAY_BAPTISTE_GUARD={isSessionValid:valid,logout:logout};

  if(!isPin()&&!valid()){
    window.location.replace(PIN_PAGE);
    return;
  }

  document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll("[data-digiy-logout], #btnLogout, #logoutBtn, #btnCloseSession").forEach(function(btn){
      btn.addEventListener("click",function(e){e.preventDefault();logout();});
    });
    addAbosToMenus();
  });
})();
