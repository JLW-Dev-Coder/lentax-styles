/* lentax.js — route-scoped helpers for the LenTax SuiteDash skin */
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
