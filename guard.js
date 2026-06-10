/* =========================================================
   DIGIY PAY BAPTISTE — GUARD SESSION 8H
   Fichier : guard.js
   Rôle : protège index / cockpit / admin
   ========================================================= */

(function () {
  "use strict";

  const SESSION_KEY = "digiy_pay_baptiste_validated_at";
  const SESSION_MS = 8 * 60 * 60 * 1000; // 8 heures
  const PIN_PAGE = "pin.html";

  function now() {
    return Date.now();
  }

  function readValidatedAt() {
    const raw = localStorage.getItem(SESSION_KEY);
    const value = Number(raw || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function isSessionValid() {
    const validatedAt = readValidatedAt();
    if (!validatedAt) return false;
    return now() - validatedAt < SESSION_MS;
  }

  function isPinPage() {
    return /\/pin\.html$/i.test(window.location.pathname);
  }

  function redirectToPin() {
    const current =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    const url = new URL(PIN_PAGE, window.location.href);
    url.searchParams.set("next", current);

    window.location.replace(url.toString());
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.replace(PIN_PAGE);
  }

  window.DIGIY_PAY_BAPTISTE_GUARD = {
    isSessionValid,
    logout
  };

  if (!isPinPage() && !isSessionValid()) {
    redirectToPin();
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const logoutButtons = document.querySelectorAll(
      "[data-digiy-logout], #btnLogout, #logoutBtn, #btnCloseSession"
    );

    logoutButtons.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        logout();
      });
    });
  });
})();
