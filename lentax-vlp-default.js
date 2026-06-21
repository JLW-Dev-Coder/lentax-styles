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

/* ─────────────────────────────────────────────────────────────────
   Tax Monitor Setup explore page (view/169143) — JS supplement
   Paired with the CSS block in themes/vlp-default.css (round 9).
   Handles cases where platform inline styles or --frm-color-primary
   cascade contention cannot be defeated by CSS alone.
   CTA selectors are text-content based — survives auto-gen ID
   regeneration and class changes; only breaks on intentional rename.
   Hero title injection mutates DOM (innerHTML span-wrap) for the
   orange + navy color split — intentional structural change.
   Added 2026-06-20 — round 9, follow-up to 4dc0834.
   ───────────────────────────────────────────────────────────────── */
(function() {
  // 1. Set --frm-color-primary to dark navy
  var scope = document.getElementById('client-page-view');
  if (scope) scope.style.setProperty('--frm-color-primary', '#0a1228', 'important');

  // 2. Fix .main-wrapper white background (platform inline style war)
  var mw = document.querySelector('.main-wrapper.column1-portal-page');
  if (mw) mw.style.setProperty('background', '#ffffff', 'important');

  // 3. Fix CTA buttons via text-content matching (hardened from numeric IDs)
  var btnSpecs = [
    { text: 'Order Processing',  bg: '#f97316', border: '#f97316' },
    { text: 'Book A Demo',       bg: '#162444', border: '#f97316' },
    { text: 'Take A Sneak Peek', bg: '#f97316', border: '#f97316' }
  ];
  var allBtns = document.querySelectorAll('.cbe-block-button-element');
  allBtns.forEach(function(el) {
    var label = el.textContent.trim();
    btnSpecs.forEach(function(spec) {
      if (label === spec.text) {
        el.style.setProperty('background', spec.bg, 'important');
        el.style.setProperty('color', '#ffffff', 'important');
        el.style.setProperty('border', '2.5px solid ' + spec.border, 'important');
        el.style.setProperty('box-shadow', 'none', 'important');
      }
    });
  });

  // 4. Fix View Plans label
  var label = Array.from(document.querySelectorAll('label')).find(function(el) {
    return el.textContent.trim() === 'View Plans';
  });
  if (label) {
    label.style.setProperty('background', '#f97316', 'important');
    label.style.setProperty('color', '#ffffff', 'important');
    label.style.setProperty('border', '2px solid #f97316', 'important');
    label.style.setProperty('padding', '8px 20px', 'important');
    label.style.setProperty('border-radius', '6px', 'important');
    label.style.setProperty('font-weight', '600', 'important');
  }

  // 5. Fix card icons
  document.querySelectorAll('.vl-card-icon').forEach(function(el) {
    el.style.setProperty('background', '#162444', 'important');
    el.style.setProperty('border', '2px solid #162444', 'important');
  });

  // Sections 6 & 7 replaced in round 10 (SD platform contrast regression).
  //   See the fixCalloutDescription and fixViewPlansBlock IIFEs at EOF.

  // 8. Hero title split injection (DOM mutation — innerHTML span-wrap)
  var title = document.querySelector('h1.vl-hero__title');
  if (title && !title.querySelector('.vlp-title-orange')) {
    var txt = title.textContent;
    var split = txt.indexOf(' \u2014 ');
    if (split > -1) {
      title.innerHTML = '<span class="vlp-title-orange">' + txt.substring(0, split) + '</span>'
        + '<span class="vlp-title-dark"> \u2014 ' + txt.substring(split + 3) + '</span>';
    }
  }
})();

/* ═════════════════════════════════════════════════════════════════════════════
   VLP-default round 10 - Contrast regression fix for explore page (view/169143)
   Replaces round 9 IIFE sections #6 (callout description) and #7 (View Plans
   form plan block) due to SD platform update.

   Section #6 issue: round 9 walked .feature-block-description * but did not
   account for h3/.vl-body elements that have a higher-specificity color rule
   from vlp-default.css. New version explicitly handles h3 and uses a 400ms
   delayed re-fire to win AFTER the platform's 300ms color transition settles.

   Section #7 issue: SD added transition:color 0.3s to all form-plan-block
   elements, so getComputedStyle returned mid-animation values causing the old
   color-match check to silently bail. Additionally sd.app.min.css now sets
   rgba(255,255,255,0.9) on the [ng-non-bindable] HOST element directly; the
   old walker only touched descendants. New version targets the host directly,
   kills the transition, and walks all descendants unconditionally without a
   color-equality check (CSS !important rules restore gradient headings via
   background-clip:text).

   Added 2026-06-20 - round 10, follow-up to de8eb6d.
   ═════════════════════════════════════════════════════════════════════════════ */


/* Replacement for round 9 section #6 */
(function fixCalloutDescription() {
  function applyCalloutColors() {
    document.querySelectorAll(
      '#client-page-view .feature-block-description *'
    ).forEach(function (el) {
      el.style.setProperty('color', '#e8edf5', 'important');
      el.style.setProperty('transition', 'none', 'important');
    });
    // b/strong accent override (runs after the loop to win the cascade)
    document.querySelectorAll(
      '#client-page-view .feature-block-description b,' +
      '#client-page-view .feature-block-description strong'
    ).forEach(function (el) {
      el.style.setProperty('color', '#f97316', 'important');
    });
  }
  // Fire immediately + after transition window
  applyCalloutColors();
  setTimeout(applyCalloutColors, 400);
})();


/* Replacement for round 9 section #7 */
(function fixViewPlansBlock() {
  function applyPlanColors() {
    var hosts = document.querySelectorAll('#client-page-view [ng-non-bindable]');
    hosts.forEach(function (host) {
      // Fix the host element itself
      host.style.setProperty('color', '#0a1228', 'important');
      host.style.setProperty('transition', 'none', 'important');
      // Fix every descendant
      host.querySelectorAll('*').forEach(function (el) {
        // Gradient-text headings use -webkit-text-fill-color:transparent so
        // overriding `color` does not affect their orange gradient rendering.
        el.style.setProperty('color', '#0a1228', 'important');
        el.style.setProperty('transition', 'none', 'important');
      });
    });
  }
  // Fire immediately + after SD transition window (300ms) + safety buffer
  applyPlanColors();
  setTimeout(applyPlanColors, 400);
})();


/* ═════════════════════════════════════════════════════════════════════════════
   VLP-default round 11 - Book A Demo border override
   CORS-blocked sd.app.Theme.min.css sets border:2px solid #f97316 with
   !important on .vl-btn--support .cbe-block-button-element. CSS-level
   overrides lose cascade (CC live-tested). Inline style is the only
   reliable path. Self-retries every 400ms until the Angular template
   has rendered the button into the DOM.
   Added 2026-06-20 - round 11, follow-up to 38c2505.
   ═════════════════════════════════════════════════════════════════════════════ */

(function applyDemoBorder() {
  var btn = document.querySelector('.vl-btn--support .cbe-block-button-element');
  if (btn) {
    btn.style.setProperty('border-color', '#162444', 'important');
    return;
  }
  setTimeout(applyDemoBorder, 400);
})();
