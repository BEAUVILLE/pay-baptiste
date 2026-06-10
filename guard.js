
/* guard.js — DIGIY PAY Baptiste
   Protection privée : session 8h + PIN + menu ABOS
   Attention : ceci protège côté navigateur. Pour coffre fort réel :
   ajouter plus tard une protection avant chargement de page.
*/

(function(){
  "use strict";

  const SESSION_KEY = "digiy_pay_baptiste_validated_at";
  const SESSION_MS = 8 * 60 * 60 * 1000;
  const PIN_PAGE = "./pin.html";
  const ABOS_PAGE = "./abos-ready.html?v=from-menu";

  function valid(){
    const ts = Number(localStorage.getItem(SESSION_KEY) || 0);
    return !!ts && Number.isFinite(ts) && Date.now() - ts < SESSION_MS;
  }

  function currentFile(){
    const path = window.location.pathname || "";
    return path.split("/").pop() || "index.html";
  }

  function isPin(){
    return /\/pin\.html$/i.test(window.location.pathname);
  }

  function safeNext(){
    const file = currentFile();
    if (!file || /pin\.html/i.test(file)) return "index.html";
    return file;
  }

  function redirectToPin(){
    window.location.replace(PIN_PAGE + "?next=" + encodeURIComponent(safeNext()));
  }

  function logout(){
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.clear();
    window.location.replace(PIN_PAGE + "?next=index.html");
  }

  function goAbos(e){
    if(e) e.preventDefault();

    if(!valid()){
      redirectToPin();
      return;
    }

    window.location.href = ABOS_PAGE;
  }

  function addAbosToMenus(){
    const fabPanel = document.getElementById("fabPanel");

    if(fabPanel && !fabPanel.querySelector('[data-fab="abos-ready"]')){
      const btn = document.createElement("button");
      btn.className = "fab-action gold";
      btn.type = "button";
      btn.setAttribute("data-fab", "abos-ready");
      btn.innerHTML = "<span>💳 ABOS</span><small>abonnés ready</small>";
      btn.addEventListener("click", goAbos);
      fabPanel.insertBefore(btn, fabPanel.firstChild);
    }

    const menuGrid = document.querySelector("#menuModal .menu-grid");

    if(menuGrid && !document.getElementById("menuAbosReady")){
      const btn = document.createElement("button");
      btn.id = "menuAbosReady";
      btn.type = "button";
      btn.innerHTML = "💳<br>ABOS";
      btn.addEventListener("click", goAbos);
      menuGrid.insertBefore(btn, menuGrid.firstChild);
    }
  }

  function bindLogoutButtons(){
    document
      .querySelectorAll("[data-digiy-logout], #btnLogout, #logoutBtn, #btnCloseSession")
      .forEach(function(btn){
        btn.addEventListener("click", function(e){
          e.preventDefault();
          logout();
        });
      });
  }

  window.DIGIY_PAY_BAPTISTE_GUARD = {
    isSessionValid: valid,
    logout: logout,
    goAbos: goAbos
  };

  // pin.html peut charger ce guard sans boucle.
  if(!isPin() && !valid()){
    redirectToPin();
    return;
  }

  document.addEventListener("DOMContentLoaded", function(){
    bindLogoutButtons();

    if(!isPin()){
      addAbosToMenus();
    }
  });

  // Si la session expire pendant que l’onglet dort, on rebloque au retour.
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible" && !isPin() && !valid()){
      redirectToPin();
    }
  });

  // Protection après retour navigateur / cache mobile.
  window.addEventListener("pageshow", function(){
    if(!isPin() && !valid()){
      redirectToPin();
    }
  });

})();
