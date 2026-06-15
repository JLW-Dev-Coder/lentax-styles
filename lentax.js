/* lentax.js — route-scoped helpers for the LenTax SuiteDash skin */

// ─────────────────────────────────────────────────────────────
//  LENTAX.CSS PRELOAD — FOUC PREVENTION
//  Loads lentax.css at highest priority using the preload-swap
//  pattern. Eliminates flash of unstyled content while the
//  external stylesheet downloads from Netlify.
// ─────────────────────────────────────────────────────────────
(function loadLentaxCSS() {
  var cssUrl = 'https://precious-lily-bbe555.netlify.app/lentax.css';

  // Skip injection if lentax.css is already loaded (e.g. via SuiteDash Custom CSS or duplicate JS load)
  var existing = document.querySelector('link[href="' + cssUrl + '"]');
  if (existing) {
    return;
  }

  // 1. High-priority preload — fetches the file but does not apply styles
  var preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'style';
  preload.href = cssUrl;

  // 2. On load, swap to stylesheet rel — styles apply instantly from cache
  preload.onload = function () {
    this.onload = null;
    this.rel = 'stylesheet';
  };

  // 3. Failure fallback — if the preload errors, attempt a standard stylesheet link
  preload.onerror = function () {
    var fallback = document.createElement('link');
    fallback.rel = 'stylesheet';
    fallback.href = cssUrl;
    document.head.appendChild(fallback);
  };

  document.head.appendChild(preload);

  // 4. <noscript> fallback for users with JS disabled
  var noscript = document.createElement('noscript');
  var noscriptLink = document.createElement('link');
  noscriptLink.rel = 'stylesheet';
  noscriptLink.href = cssUrl;
  noscript.appendChild(noscriptLink);
  document.head.appendChild(noscript);
})();

(function () {
  "use strict";

  function applyRouteClasses() {
    if (!document.body) return;
    var path = window.location.pathname || "";
    // Hide .content-ribbon only on portal dashboard pages
    var onDashboard = path.indexOf("/portal/dashboard") === 0;
    document.body.classList.toggle("lentax-dashboard", onDashboard);
  }

  // Initial run
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyRouteClasses);
  } else {
    applyRouteClasses();
  }

  // Re-run on client-side navigation (AngularJS pushState routing)
  ["pushState", "replaceState"].forEach(function (method) {
    var original = history[method];
    if (typeof original === "function") {
      history[method] = function () {
        var result = original.apply(this, arguments);
        applyRouteClasses();
        return result;
      };
    }
  });
  window.addEventListener("popstate", applyRouteClasses);
  window.addEventListener("hashchange", applyRouteClasses);
})();
