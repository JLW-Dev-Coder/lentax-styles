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
  if (scope) scope.style.setProperty('--frm-color-primary', '#1a1a1a', 'important');

  // 2. Fix .main-wrapper white background (platform inline style war)
  var mw = document.querySelector('.main-wrapper.column1-portal-page');
  if (mw) mw.style.setProperty('background', '#ffffff', 'important');

  // 3. Fix CTA buttons via text-content matching (hardened from numeric IDs)
  var btnSpecs = [
    { text: 'Order Processing',  bg: '#f97316', border: '#f97316' },
    { text: 'Book A Demo',       bg: '#1a1a1a', border: '#f97316' },
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
    el.style.setProperty('background', '#1a1a1a', 'important');
    el.style.setProperty('border', '2px solid #1a1a1a', 'important');
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
      el.style.setProperty('color', '#ffffff', 'important');
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
      host.style.setProperty('color', '#1a1a1a', 'important');
      host.style.setProperty('transition', 'none', 'important');
      // Fix every descendant
      host.querySelectorAll('*').forEach(function (el) {
        // Gradient-text headings use -webkit-text-fill-color:transparent so
        // overriding `color` does not affect their orange gradient rendering.
        el.style.setProperty('color', '#1a1a1a', 'important');
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

(function () {
  // Retry cap (round 30): was polling indefinitely if the target never
  // rendered. MAX_RETRIES bounds the wait; the counter lives in this outer
  // closure so it persists across the self-recursive setTimeout calls.
  // NOTE: the existing structure is setTimeout-recursion (not setInterval),
  // so the cap warn-and-returns instead of clearInterval(). 60 retries at the
  // existing 400ms cadence ~= 24s, well past the slowest FOUC load.
  var MAX_RETRIES = 60;
  var retries = 0;
  (function applyDemoBorder() {
    var btn = document.querySelector('.vl-btn--support .cbe-block-button-element');
    if (btn) {
      btn.style.setProperty('border-color', '#888', 'important');
      return;
    }
    retries++;
    if (retries >= MAX_RETRIES) {
      console.warn('[lentax] applyDemoBorder gave up after ' + MAX_RETRIES + ' retries — target never appeared');
      return;
    }
    setTimeout(applyDemoBorder, 400);
  })();
})();


/* ═══════════════════════════════════════════════════════════════════════════
   VLP-default round 13 - Checkout page (view/169144) JS supplements
   Two new IIFEs parallel to applyDemoBorder (round 11), fixCalloutDescription
   and fixViewPlansBlock (round 10), and vlp-floating-bar-hide (round 6).
   Added 2026-06-20 - round 13, follow-up to 3874e0b.
   ═══════════════════════════════════════════════════════════════════════════ */


/* IIFE 1: applyCheckoutNavStrip
   Defeats SD platform's inline style="width:100%;background:#2a2a2a;color:#f2f2f2"
   on active .flow-nav-btn (step 1). Platform sets this via AngularJS after DOM
   ready; CSS !important loses to inline. Retry pattern: immediate fire + 5 retries
   at 800ms. Scope: #client-page-view .flow-nav-bar (checkout-page-only via class
   combination). */
(function applyCheckoutNavStrip() {
  'use strict';
  function apply() {
    var cpv = document.querySelector('#client-page-view');
    if (!cpv) return;
    var navBtns = cpv.querySelectorAll('.flow-nav-bar .flow-nav-btn');
    if (!navBtns.length) return;
    navBtns.forEach(function (btn, idx) {
      if (idx === 0) {
        btn.style.setProperty('background', '#f97316', 'important');
        btn.style.setProperty('background-color', '#f97316', 'important');
        btn.style.setProperty('color', '#ffffff', 'important');
      } else {
        btn.style.setProperty('background', 'transparent', 'important');
        btn.style.setProperty('background-color', 'transparent', 'important');
        btn.style.setProperty('color', '#ffffff', 'important');
      }
    });
  }
  apply();
  var retries = 0;
  var id = setInterval(function () {
    apply();
    retries++;
    if (retries >= 5) clearInterval(id);
  }, 800);
})();


/* IIFE 2: applySummaryNavy
   Defeats SD CORS-blocked sd.choose.items.widget.min.css rule that sets
   background-color:#fffaf4 on .choose-items-summary-wrapper with transition:all.
   CSS !important wins getComputedStyle but compositor uses cached transition
   start value. Fix: separate background-* properties (shorthand collapses
   under transition race) + kill transitions + animation. MutationObserver
   prevents Angular digest from reverting. Pattern: R11 applyDemoBorder root
   cause (CORS cascade + transition) with stronger reversion behavior.
   JLW-ratified: dual observers (target + body for lazy render). */
(function applySummaryNavy() {
  'use strict';
  function apply() {
    var cpv = document.querySelector('#client-page-view');
    if (!cpv) return;
    var sw = cpv.querySelector('.choose-items-summary-wrapper');
    var sb = cpv.querySelector('.choose-items-summary-body');
    var head = cpv.querySelector('.choose-items-summary-head');
    if (!sw) return;
    sw.style.setProperty('transition', 'none', 'important');
    sw.style.setProperty('animation', 'none', 'important');
    sw.style.setProperty('background-image', 'linear-gradient(180deg, #1a1a1a 0%, #1a1a1a 100%)', 'important');
    sw.style.setProperty('background-color', '#1a1a1a', 'important');
    sw.style.setProperty('background-size', '100% 400px', 'important');
    sw.style.setProperty('background-repeat', 'no-repeat', 'important');
    sw.style.setProperty('background-position', '0 0', 'important');
    sw.style.setProperty('border', '2px solid #f97316', 'important');
    sw.style.setProperty('border-radius', '20px', 'important');
    if (sb) {
      sb.style.setProperty('transition', 'none', 'important');
      sb.style.setProperty('background', 'transparent', 'important');
      sb.style.setProperty('background-color', 'transparent', 'important');
    }
    if (head) {
      head.style.setProperty('color', '#f97316', 'important');
    }
  }
  apply();
  var retries = 0;
  var id = setInterval(function () {
    apply();
    retries++;
    if (retries >= 8) clearInterval(id);
  }, 500);
  function watchTarget() {
    var target = document.querySelector('.choose-items-summary-wrapper');
    if (!target) return;
    var mo = new MutationObserver(function () { apply(); });
    mo.observe(target, { attributes: true, attributeFilter: ['style', 'class'] });
  }
  watchTarget();
  var docObs = new MutationObserver(function () {
    var t = document.querySelector('.choose-items-summary-wrapper');
    if (t) { watchTarget(); docObs.disconnect(); }
  });
  docObs.observe(document.body, { childList: true, subtree: true });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   VLP-default round 14 - Checkout page amendments (CC-revised IIFEs)
   Parallel to round 13's applyCheckoutNavStrip / applySummaryNavy (NOT
   replacements - both R13 IIFEs remain active per Path A additive policy).
   These V2 IIFEs apply additional inline-style overrides for amendments
   A3b/A4/A5/A6 that the R13 IIFEs did not cover.

   applySummaryNavyV2 hoists the MutationObserver to single-setup-on-find
   pattern (PE correction of CC's draft, which created a fresh observer
   inside apply() on every retry - up to 30 stacked observers per page
   load, never disconnecting). The hoisted pattern attaches exactly one
   observer once the target appears.

   Added 2026-06-20 - round 14, follow-up to 4cd697f.
   ═══════════════════════════════════════════════════════════════════════════ */


/* IIFE 1: applyCheckoutNavStripV2
   Active-state styling on .flow-nav-btn.active using class detection
   (round 13's V1 used :first-child / index-0 inference). Watches for
   class changes via MutationObserver scoped to .flow-nav-bar so step
   transitions re-apply automatically. */
(function applyCheckoutNavStripV2() {
  'use strict';
  var MAX_RETRIES = 30;
  var attempts = 0;

  function apply() {
    var btns = document.querySelectorAll('#client-page-view .flow-nav-btn');
    if (!btns.length && attempts < MAX_RETRIES) {
      attempts++;
      setTimeout(apply, 400);
      return;
    }
    btns.forEach(function (btn) {
      if (btn.classList.contains('active')) {
        btn.style.setProperty('color', '#f97316', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('border-bottom', '2px solid #f97316', 'important');
        btn.style.setProperty('background', 'transparent', 'important');
        btn.style.setProperty('background-color', 'transparent', 'important');
      } else {
        btn.style.setProperty('background', 'transparent', 'important');
        btn.style.setProperty('background-color', 'transparent', 'important');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  // Single MutationObserver attaches once the nav bar is in the DOM,
  // watches for class changes so step transitions re-apply automatically.
  function attachObserver() {
    var bar = document.querySelector('#client-page-view .flow-nav-bar');
    if (!bar) return false;
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          apply();
        }
      });
    });
    mo.observe(bar, { subtree: true, attributeFilter: ['class'], childList: true });
    return true;
  }
  if (!attachObserver()) {
    setTimeout(attachObserver, 1200);
  }
})();


/* IIFE 2: applySummaryNavyV2
   Sidebar wrapper paint + reversion guard. Same root cause as R13's
   applySummaryNavy (CORS-blocked widget CSS + transition:all) but with
   the observer HOISTED to single-setup-on-find. The retry loop only
   re-runs apply(); the observer is attached exactly once when the
   target appears, and persists for the page lifetime to catch Angular
   digest reversions. */
(function applySummaryNavyV2() {
  'use strict';
  var MAX_RETRIES = 30;
  var attempts = 0;
  var observerAttached = false;

  function paint(el) {
    el.style.setProperty('transition', 'none', 'important');
    el.style.setProperty('background-image', 'linear-gradient(180deg, #1a1a1a 0%, #1a1a1a 100%)', 'important');
    el.style.setProperty('background-size', '100% 400px', 'important');
    el.style.setProperty('background-color', '#1a1a1a', 'important');
    el.style.setProperty('background-repeat', 'no-repeat', 'important');
    el.style.setProperty('border', '2px solid #f97316', 'important');
    el.style.setProperty('border-radius', '20px', 'important');
    el.style.setProperty('color', '#ffffff', 'important');
  }

  function apply() {
    var el = document.querySelector('#client-page-view .choose-items-summary-wrapper');
    if (!el && attempts < MAX_RETRIES) {
      attempts++;
      setTimeout(apply, 400);
      return;
    }
    if (!el) return;
    paint(el);
    if (!observerAttached) {
      var mo = new MutationObserver(function () { paint(el); });
      mo.observe(el, { attributes: true, attributeFilter: ['style'] });
      observerAttached = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();


/* ═══════════════════════════════════════════════════════════════════════════
   VLP-default round 24 - Clear SD .main-wrapper white inline override
   SuiteDash platform JS injects style="background: rgb(255,255,255) !important"
   onto .main-wrapper on every portal page (views 168967, 168981, 169143,
   169144), masking the round-23 body-level #1a1a1a page-bg from
   vlp-default.css. Inline !important beats stylesheet !important per CSS spec
   regardless of selector specificity, so this is structurally unsolvable from
   CSS — JS is the only path.

   This IIFE overwrites the inline value in place with 'transparent' !important
   so the body-level #1a1a1a paints through (keeping vlp-default.css as the
   single source of truth for the actual page-bg color). A MutationObserver
   re-applies if SD platform JS resets the attribute later in the page
   lifecycle. Scoped to body.page-with-styling-options so the login page (which
   lacks that class) stays untouched. Placed at EOF so the transparent override
   wins the inline-property race against the round-9 explore-page white-set.
   Added 2026-06-21 - round 24, follow-up to 7397f45.
   ═══════════════════════════════════════════════════════════════════════════ */
(function clearMainWrapperWhite() {
  'use strict';
  if (!document.body || !document.body.classList.contains('page-with-styling-options')) return;
  var mainWrapper = document.querySelector('.main-wrapper');
  if (!mainWrapper) return;

  function clearWhite() {
    // Use 'transparent' (not #1a1a1a) so the body-level #1a1a1a paints through,
    // keeping vlp-default.css as the source of truth for the actual color.
    // Set both shorthand and longhand to cover platform-JS variations.
    mainWrapper.style.setProperty('background', 'transparent', 'important');
    mainWrapper.style.setProperty('background-color', 'transparent', 'important');
  }

  function isTransparent(v) {
    return !v || v.indexOf('transparent') !== -1 || v.indexOf('rgba(0, 0, 0, 0)') !== -1;
  }

  // Initial override — overwrite SD's inline white in place.
  clearWhite();

  // Re-apply if SD platform JS resets .main-wrapper background later. The
  // guard is self-clearing: when our own setProperty fires the observer the
  // value is already transparent, so the inner check does nothing (no loop).
  var mwObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'style') {
        if (!isTransparent(mainWrapper.style.background) ||
            !isTransparent(mainWrapper.style.backgroundColor)) {
          clearWhite();
        }
      }
    });
  });
  mwObserver.observe(mainWrapper, { attributes: true, attributeFilter: ['style'] });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   VLP-default round 43 - Checkout-form embed .form-oscar dark persistence
   Paired with the ROUND 43 CSS block in themes/vlp-default.css.

   .form-oscar is the one checkout container with no portable source-CSS
   path: it has no own ID and the CORS-blocked bundle paints it white with
   2-ID specificity, which no stylesheet selector can beat. Inline style +
   a narrow MutationObserver — scoped to the ext root, watching only style-
   attribute changes on .form-oscar plus childList additions for re-mount —
   is the only reliable fix. Same root-cause family as round 13's
   applySummaryNavy (CORS bundle paints over our surface).

   Per CC diagnostic round 3: routine step navigation does NOT wipe the
   inline style; the observer is defensive for full re-mounts only. If it
   never fires in production, that is expected.
   Added 2026-06-24 - round 43, follow-up to 6303328.
   ═══════════════════════════════════════════════════════════════════════════ */
(function applyFormOscarTransparent() {
  'use strict';
  function root() {
    return document.querySelector('.extended-form-wrapper.choice-step-styling-options');
  }
  function fix(r) {
    if (!r) return;
    r.querySelectorAll('.form.form-oscar').forEach(function (el) {
      if (el.style.getPropertyValue('background-color') !== 'transparent') {
        el.style.setProperty('background-color', 'transparent', 'important');
      }
    });
  }
  var r = root();
  fix(r);
  var queued = false;
  var obs = new MutationObserver(function (muts) {
    var hit = false;
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'attributes' && m.attributeName === 'style' &&
          m.target.classList && m.target.classList.contains('form-oscar')) {
        hit = true;
        break;
      }
      if (m.type === 'childList' && m.addedNodes.length) {
        hit = true;
        break;
      }
    }
    if (hit && !queued) {
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        fix(root());
      });
    }
  });
  if (r) {
    obs.observe(r, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }
})();


/* ═══════════════════════════════════════════════════════════════════════════
   VLP-default round 59 - Reveal .content-ribbon subnav when populated
   (everywhere EXCEPT /view/ pages)

   The ribbon is hidden by R7's GLOBAL rule in themes/vlp-default.css
   (`.content-ribbon { display:none !important }`) — NOT solely a CORS-blocked
   platform sheet as first diagnosed. That R7 rule stays as the safety-net
   default; this IIFE reveals the ribbon only where it carries a real subnav,
   so document/contract pages (whose ribbon holds only a platform-hidden
   .common-back back-link) keep R7's clean empty-bar suppression.

   Two gates — BOTH must pass to reveal:
     (a) not a /portal/dashboard/view/ path (those stay hidden by design), AND
     (b) the ribbon is populated — a .content-ribbon__left/__right wrapper with
         children, OR a non-.common-back child that isn't display:none.

   Reveal uses inline `display:flex !important`; an inline !important beats any
   stylesheet !important (incl. R7's) regardless of specificity — same inline-
   style override technique as rounds 11/13/24/43. Self-retries (30 x 400ms)
   because Angular may render / populate the ribbon after page load.

   NOTE on the populated check: when R59 runs, R7 has the ribbon at
   display:none, so offset/render-based visibility on children is unreliable
   (a display:none ancestor zeroes them). getComputedStyle(child).display
   returns the child's OWN computed value (unaffected by ancestor display:none),
   so it is a safe structural discriminator here.

   Added 2026-06-26 - round 59.
   ═══════════════════════════════════════════════════════════════════════════ */
(function revealContentRibbon() {
  'use strict';

  // Gate (a): stay hidden on /portal/dashboard/view/ pages — R7 default stands.
  if (window.location.pathname.indexOf('/portal/dashboard/view/') !== -1) return;

  // Gate (b): only reveal a ribbon that carries real subnav content. Document/
  // contract pages hold ONLY a platform-hidden .common-back back-link, so
  // revealing them would re-introduce R7's empty 50px sticky white bar.
  function isPopulated(ribbon) {
    var left  = ribbon.querySelector('.content-ribbon__left');
    var right = ribbon.querySelector('.content-ribbon__right');
    if ((left && left.children.length) || (right && right.children.length)) return true;
    var kids = ribbon.children;
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (c.classList && c.classList.contains('common-back')) continue;
      if (window.getComputedStyle(c).display !== 'none') return true;
    }

    // R64: CRM-style ribbons carry a .common-back__right (the record-selector)
    // inside .common-back; reveal those. Doc/contract pages have a .common-back__left
    // ("View Document" title) but NO __right, so keying on __right alone reveals CRM
    // ribbons while doc pages stay suppressed (R7's empty 50px back-bar). Precondition
    // #2 confirmed all three doc snapshots (doc_8879 / doc_agreement / doc_summary)
    // contain __left — __left||__right would have re-revealed them; only __right is
    // unique to CRM.
    var commonBack = ribbon.querySelector('.common-back');
    if (commonBack && commonBack.querySelector('.common-back__right')) return true;

    return false;
  }

  function apply() {
    var ribbon = document.querySelector('.content-ribbon');
    if (!ribbon) return false;              // not rendered yet — keep retrying
    if (!isPopulated(ribbon)) return false; // empty back-link bar — leave hidden
    ribbon.style.setProperty('display', 'flex', 'important');
    return true;
  }

  // First-attempt apply; retry pattern matches existing IIFE convention.
  if (!apply()) {
    var tries = 0;
    var id = setInterval(function () {
      if (apply() || ++tries >= 30) clearInterval(id);
    }, 400);
  }
})();
