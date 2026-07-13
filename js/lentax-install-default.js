/* lentax-install-default.js
 * Theme-specific loader for the TPP Default (rose/crimson) skin.
 * Loads lentax-base.css + themes/tpp-default.css.
 *
 * Pasted into SuiteDash Custom JS on TPP portals.
 * For other themes, use the matching lentax-{theme}.js loader.
 */

// R24: stamp a per-variant class on <body> so lentax-base.css rules can be
// scoped per install variant (see R25). Idempotent — safe if run twice.
(function () {
  var cls = 'lentax-install-default';
  if (document.body) {
    if (!document.body.classList.contains(cls)) document.body.classList.add(cls);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (!document.body.classList.contains(cls)) document.body.classList.add(cls);
    });
  }
})();

// R36 Trap 2: paint the sidebar avatar placeholder to the variant mid-surface.
// The .default-user-avatar background is not token-fed and no stylesheet rule
// wins (SuiteDash owns it); an inline !important is the robust fix. Guarded for
// absence (user-uploaded avatars replace the placeholder); the bounded poll
// covers SuiteDash's Angular late-render. Client-side cosmetic only — no data.
(function () {
  var MID = '#3A2530'; // default mid-surface (avatar circle)
  var tries = 0;
  function paintAvatar() {
    var el = document.querySelector('aside.site-sidebar .default-user-avatar');
    if (el) { el.style.setProperty('background-color', MID, 'important'); return; }
    if (++tries < 20) setTimeout(paintAvatar, 250); // ~5s max, then stop
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paintAvatar);
  } else {
    paintAvatar();
  }
})();

(function loadLentaxStyles() {
  var baseUrl  = 'https://precious-lily-bbe555.netlify.app/lentax-base.css';
  var themeUrl = 'https://precious-lily-bbe555.netlify.app/themes/tpp-default.css';

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
  }

  // Load base FIRST (token fallbacks), theme SECOND (token overrides win cascade)
  injectStylesheet(baseUrl);
  injectStylesheet(themeUrl);
})();

// .content-ribbon route-scoped hide removed 2026-06-17 — CSS rule
// `body.lentax-dashboard .content-ribbon { display: none !important; }` in
// lentax-base.css is dormant. To re-enable, reintroduce a class toggle here.
