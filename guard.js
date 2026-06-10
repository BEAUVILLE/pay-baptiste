(function(){
  "use strict";
  const SESSION_KEY="digiy_pay_baptiste_validated_at";
  const SESSION_MS=8*60*60*1000;
  const PIN_PAGE="./pin.html";
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
  window.DIGIY_PAY_BAPTISTE_GUARD={isSessionValid:valid,logout:logout};
  if(!isPin()&&!valid()){
    window.location.replace(PIN_PAGE);
    return;
  }
  document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll("[data-digiy-logout], #btnLogout, #logoutBtn, #btnCloseSession").forEach(function(btn){
      btn.addEventListener("click",function(e){e.preventDefault();logout();});
    });
  });
})();
