/* lentax-vlp-default.js
 * Theme-specific loader for the VLP Default (orange/navy/bronze/gold) skin.
 * Loads lentax-base.css + themes/vlp-default.css.
 *
 * Pasted into SuiteDash Custom JS on VLP portals.
 * For other themes, use the matching lentax-{theme}.js loader.
 */
(function loadLentaxStyles() {
  var baseUrl  = 'https://precious-lily-bbe555.netlify.app/lentax-base.css';
  var themeUrl = 'https://precious-lily-bbe555.netlify.app/themes/vlp-default.css';

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

/* ─────────────────────────────────────────────────────────────────
   Portal subpage UI hide: floating stack buttons
   Hides .floating-stack-item (timer clock, help/ask, GDPR icon) on
   all portal subpages under /portal/dashboard/view/*.
   CC-confirmed: buttons sit directly under <body> with no page
   wrapper, so a CSS-only scope is not possible from a global
   stylesheet — JS injects a scoped <style> tag conditionally.
   Added 2026-06-20 — round 6, follow-up to 02c5bbb.
   ───────────────────────────────────────────────────────────────── */
(function() {
  if (window.location.pathname.includes('/portal/dashboard/view')) {
    var style = document.createElement('style');
    style.id = 'vlp-floating-bar-hide';
    style.textContent = '.floating-stack-item { display: none !important; }';
    document.head.appendChild(style);
  }
})();
