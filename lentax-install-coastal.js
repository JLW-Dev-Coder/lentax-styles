/* lentax-install-coastal.js
 * Theme-specific loader for the TPP Coastal (teal/navy/seafoam/sand) skin.
 * Loads lentax-base.css + themes/tpp-coastal.css.
 *
 * Pasted into SuiteDash Custom JS on TPP Coastal portals.
 * For other themes, use the matching lentax-{theme}.js loader.
 */

// R24: stamp a per-variant class on <body> so lentax-base.css rules can be
// scoped per install variant (see R25). Idempotent — safe if run twice.
(function () {
  var cls = 'lentax-install-coastal';
  if (document.body) {
    if (!document.body.classList.contains(cls)) document.body.classList.add(cls);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (!document.body.classList.contains(cls)) document.body.classList.add(cls);
    });
  }
})();

(function loadLentaxStyles() {
  var baseUrl  = 'https://precious-lily-bbe555.netlify.app/lentax-base.css';
  var themeUrl = 'https://precious-lily-bbe555.netlify.app/themes/tpp-coastal.css';

  function injectStylesheet(url) {
    // Skip if already loaded
    if (document.querySelector('link[href="' + url + '"]')) return;

    // High-priority preload, swap to stylesheet on load
    var preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'style';
    preload.href = url;
    preload.onload = function () { this.onload = null; this.rel = 'stylesheet'; };
    preload.onerror = function () {
      var fallback = document.createElement('link');
      fallback.rel = 'stylesheet';
      fallback.href = url;
      document.head.appendChild(fallback);
    };
    document.head.appendChild(preload);

    // <noscript> fallback
    var noscript = document.createElement('noscript');
    var noscriptLink = document.createElement('link');
    noscriptLink.rel = 'stylesheet';
    noscriptLink.href = url;
    noscript.appendChild(noscriptLink);
    document.head.appendChild(noscript);
  }

  // Load base FIRST (token fallbacks), theme SECOND (token overrides win cascade)
  injectStylesheet(baseUrl);
  injectStylesheet(themeUrl);
})();

// .content-ribbon route-scoped hide removed 2026-06-17 — CSS rule
// `body.lentax-dashboard .content-ribbon { display: none !important; }` in
// lentax-base.css is dormant. To re-enable, reintroduce a class toggle here.
