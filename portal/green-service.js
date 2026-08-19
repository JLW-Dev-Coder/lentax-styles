
(function () {
  var ITEM_NAME = "Green Service";
  var PHASE_ENDPOINT = "https://api.virtuallaunch.pro/v1/green/portal-phase";

  function accent(s) {
    return '<span class="vl-hero-accent">' + s + '</span>';
  }

  function overviewTitle() {
    var org = clientOrg();
    return (org ? esc(org) : ITEM_NAME) + ' \u2014 ' + accent('Ready To Move');
  }

  function overviewLead() {
    var first = clientFirst();
    return first
      ? esc(first) + ', here are the <b>seven steps from open matter to filed and closed.</b> This page maps how your engagement is scoped, disclosed, executed, and handed back.'
      : '<b>Seven steps from open matter to filed and closed.</b> This page maps how your engagement is scoped, disclosed, executed, and handed back.';
  }

  function overviewBody() {
    return '<h2 class="vl-subhead">' + overviewLead() + '</h2>' +
      '<h2 class="vl-subhead" style="margin-top:20px;">Need representation for your personal return or another entity? Each is a separate engagement with its own scope, its own deadlines, and its own progress bar in <b>My Order / Project</b> below.</h2>' +
      '<hr class="vl-divider">' +
      '<h2 class="vl-section-title">What You Get After Checkout</h2>' +
      '<div class="vl-list">' +
        '<div class="vl-list-item"><span class="vl-dot"></span><span>An opened matter with defined scope, named years, and named entities.</span></div>' +
        '<div class="vl-list-item"><span class="vl-dot"></span><span>A licensed EA of record \u2014 my PTIN, my signature, my judgment.</span></div>' +
        '<div class="vl-list-item"><span class="vl-dot"></span><span>A COGS workpaper and Form 8275-R disclosure that stands on its own.</span></div>' +
        '<div class="vl-list-item"><span class="vl-dot"></span><span>Every statutory deadline calendared before work begins.</span></div>' +
      '</div>' +
      '<p class="vl-body">Your bookkeeper and your CPA stay yours. I carry the license for the \u00a7280E position and the signature that goes with it.</p>' +
      '<hr class="vl-divider">' +
      '<h2 class="vl-section-title">What I Can and Cannot Promise</h2>' +
      '<p class="vl-body">The IRS has not issued guidance on retroactive \u00a7280E relief, so nobody can promise you a number \u2014 and I would be wary of anyone who does. What I can do is show you what I think is defensible, explain the reasoning, and put it in writing. Fixed scope, fixed price, honest odds.</p>' +
      '<hr class="vl-divider">' +
      '<h2 class="vl-section-title">Not Sure Which Tier?</h2>' +
      '<p class="vl-body">Start with a <a href="https://app.virtuallaunch.pro/portal/dashboard/view/171391" class="vl-cta-link"><strong>Risk Review</strong></a>. I scope your exposure and put it in writing \u2014 what\u2019s defensible, what isn\u2019t, and what I\u2019d put my name on. It credits in full toward your first engagement.</p>' +
      '<p class="vl-body">If the matter escalates into a full exam, Appeals, or collections, that is scoped and priced separately \u2014 so a fixed fee never rides on open-ended risk.</p>';
  }

  /* Client action is required in two phases only: 1 (intake flows) and
     7 (exit survey). Everything between runs on what came in at Step 1.
     Quiet phases still carry a "What We Need From You" block, because a
     client needs to be told that silence means nothing is waiting on them. */
  var STEPS = {
    1: {
      pct: 14,
      short: 'General Info Capture',
      title: 'Step 1 \u2014 ' + accent('General Info Capture'),
      lead: 'We open the matter and capture exactly who and what we\u2019re representing.',
      sub: 'Taxpayer identity, entity structure, license type, tax years, and every notice received \u2014 enough to confirm this is a matter I can take. <b>This is the phase that needs you.</b>',
      we: [
        'Your engagement is logged and a matter is opened.',
        'Entity structure and plant-touching status are mapped.',
        'A conflict check is run before anything else moves.',
        '<b>Flows are assigned to your portal</b>, scoped to this engagement \u2014 you are notified as each one lands.'
      ],
      you: [
        '<b>Complete the flows assigned to you.</b> Depending on scope those may include the Form 2848 for signature, document upload, and read-only access to your books \u2014 Xero, QuickBooks Online, or Digits.',
        'Send every IRS notice \u2014 with the date printed on the letter.',
        'Confirm you have signing authority for every entity in scope.'
      ],
      close: 'One thing worth knowing: IRS deadlines run from the date printed on the notice, not the day it was opened. If a final notice of intent to levy is in that stack, send it first \u2014 that clock is already running. Everything downstream builds on what comes in here, and we will follow up on each flow until it is done.'
    },
    2: {
      pct: 28,
      short: 'Project Fit & Scope Confirmation',
      title: 'Step 2 \u2014 ' + accent('Project Fit &amp; Scope'),
      lead: 'We lock exactly which years, which entities, and which positions are in play.',
      sub: 'Scope, disclosure posture, and every statutory deadline are fixed in writing before a single record is requested.',
      we: [
        'Scope locked: entities \u00d7 tax years \u00d7 matters. Nothing broader.',
        'Disclosure posture identified \u2014 whether a \u00a7471(c) or contrary position requires <b>Form 8275-R</b>.',
        'Every deadline calendared: CDP 30-day, deficiency 90-day, protest, IDR.'
      ],
      you: [
        '<b>Nothing right now.</b> Scope is built from what you sent in Step 1.',
        'If a gap turns up, I assign a flow and notify you \u2014 and the team follows up until it is complete.',
        'If the scope does not match what you had in mind, tell me \u2014 this is the easiest point to change it.'
      ],
      close: 'Adjustments are easiest here, before records are requested and work begins. Deadlines are the reason we lock this early \u2014 the 90-day deficiency clock cannot be extended by anyone, including the IRS, so every date gets calendared now.'
    },
    3: {
      pct: 43,
      short: 'Asset Collection & Setup',
      title: 'Step 3 \u2014 ' + accent('Asset Collection &amp; Setup'),
      lead: 'We assemble the evidence base and put the authorization on file.',
      sub: 'Returns, books, transcripts, and the executed Form 2848 \u2014 reconciled and organized into the working file. This phase is internal.',
      we: [
        'The signed <b>Form 2848</b> is filed and transcripts are pulled.',
        'Everything you sent in Step 1 is reconciled against the locked scope.',
        'Workpapers, schedules, and the COGS model are set up against your chart of accounts.'
      ],
      you: [
        '<b>Nothing.</b> This phase runs entirely on what you already sent.',
        'If a record is missing, unreadable, or contradicts another, I assign a flow and notify you \u2014 the team checks in until it is resolved.',
        'No news here means the assembly is going fine.'
      ],
      close: 'If this phase runs long, it is usually because one record is still outstanding. We will chase it down with you rather than let it sit.'
    },
    4: {
      pct: 57,
      short: 'Drafting & Client Review',
      title: 'Step 4 \u2014 ' + accent('Drafting &amp; Client Review'),
      lead: 'We build the workpaper and the disclosure. <b>You only need to look at it if I ask you to.</b>',
      sub: 'COGS allocation, the \u00a7471 position, and the disclosure that protects it \u2014 reviewed before anything carries my signature. Most of this phase runs without you.',
      we: [
        'COGS / \u00a7471 workpaper assembled against the records you provided.',
        '<b>Form 8275-R disclosure drafted</b> for any contrary position. This is not optional.',
        'If a judgment call needs your input, a draft is delivered to your portal and <b>you are notified</b>.'
      ],
      you: [
        '<b>Nothing, unless you are notified.</b> Silence here means the work is proceeding as scoped.',
        'If you are notified: review the workpaper and the disclosure together \u2014 they are one argument.',
        'Consolidate feedback into a single pass, and raise disagreements now rather than after filing.'
      ],
      close: 'A disclosure is what turns an aggressive position into a defensible one, so where the law calls for it we file it. If you would rather approach something differently, say so before we file \u2014 that conversation is much easier now than afterwards.'
    },
    5: {
      pct: 71,
      short: 'Delivery & Fulfillment',
      title: 'Step 5 \u2014 ' + accent('Delivery &amp; Fulfillment'),
      lead: 'Approved work gets signed, filed, and put in front of the IRS.',
      sub: 'The return is signed and filed, or the case is submitted \u2014 protest, CDP request, notice response, or offer package.',
      we: [
        'Final return signed and filed under my PTIN, or the case submitted.',
        'Filing confirmation and copies uploaded to your portal.',
        'Delivery notice sent to you, and to any second signer on the return.'
      ],
      you: [
        '<b>Nothing.</b> The filing confirmation arrives in your portal on its own.',
        'If a signature or authorization is needed before submission, I assign a flow and notify you \u2014 and follow up until it is signed.'
      ],
      close: 'My PTIN and my signature go on the filing, so nothing leaves without my review. That is what having an Enrolled Agent of record actually means \u2014 and it is part of what you are paying for.'
    },
    6: {
      pct: 85,
      short: 'Quality Review & Reporting',
      title: 'Step 6 \u2014 ' + accent('Quality Review &amp; Reporting'),
      lead: 'We verify the filing landed and the clocks are where we think they are.',
      sub: 'Acceptance confirmed, CAF posted, statutes recorded, and a written report of exactly what was filed and why.',
      we: [
        'Filing acceptance and CAF posting confirmed.',
        'Statute dates verified and recorded against the matter.',
        'Engagement report issued \u2014 positions taken, disclosures made, exposure remaining.'
      ],
      you: [
        '<b>Nothing is required.</b> The report arrives in your portal when it is issued.',
        'Worth reading when it does \u2014 it is the written record of the position taken on your behalf \u2014 but nothing is waiting on you.'
      ],
      close: 'The report is what you keep for your own file, and what your CPA or bookkeeper works from if this is ever questioned.'
    },
    7: {
      pct: 100,
      short: 'Exit/Offboarding Support',
      title: 'Step 7 \u2014 ' + accent('Exit/Offboarding Support'),
      lead: 'The work is done. <b>One short flow, and then we close things out together.</b>',
      sub: 'An exit survey is assigned to your portal, the exit call is opened for booking, and we decide together whether the authorization stays live.',
      we: [
        '<b>An exit survey flow is assigned</b> to your portal and you are notified.',
        'Your exit call is opened for booking.',
        'The 2848 is withdrawn \u2014 or deliberately left live if an appeal window is still open.',
        'Your files stay available in your portal.'
      ],
      you: [
        '<b>Complete the exit survey flow.</b> It takes a few minutes and it is the last thing I need.',
        'Book the exit call.',
        'Tell me which of your other entities is carrying the same exposure.'
      ],
      close: 'The 2848 is never withdrawn while an appeal window is open. Ready for the next one? <a href="https://app.virtuallaunch.pro/portal/dashboard/view/171081" class="vl-cta-link">Open the next engagement</a> \u2014 or move to <b>Standing Representation</b>, if you prefer not opening them one at a time.'
    }
  };

  /* Where the engagement actually is. 0 = not yet known, 8 = complete. */
  var livePhase = 0;

  /* Every engagement this contact holds, and which one is on screen. */
  var projects = [];
  var activeProject = 0;

  /* Which step the reader is looking at. 0 = overview. */
  var current = 0;

  /* True once the reader clicks anything. Stops a slow fetch from
     yanking them off a step they chose while it was in flight. */
  var userInteracted = false;

  /* Merge tags arrive as DOM attributes, never as JS string literals —
     an apostrophe in a name would break a literal, and an unresolved
     tag would render as {{...}}. */
  function clean(v) {
    if (!v) return '';
    v = String(v).replace(/\u00a0/g, ' ').trim();
    if (!v || v.indexOf('{{') === 0) return '';
    return v;
  }

  /* Two sources, because SuiteDash resolves merge tags in text nodes
     more reliably than in attributes. Attribute first, hidden span
     second. Whichever the page supports, one of them lands. */
  function attr(name, fallbackId) {
    var hero = document.getElementById('vl-hero');
    var v = clean(hero && hero.getAttribute(name));
    if (v) return v;

    if (fallbackId) {
      var el = document.getElementById(fallbackId);
      v = clean(el && el.textContent);
      if (v) return v;
    }
    return '';
  }

  function clientFirst() { return attr('data-client-first', 'vl-mt-first'); }
  function clientOrg()   { return attr('data-client-org',   'vl-mt-org'); }

  /* SuiteDash supplies friendlyTimeOfDay; if the tag is unavailable the
     browser clock is a better source anyway — it is the reader's own. */
  function timeOfDay() {
    var t = attr('data-tod', 'vl-mt-tod');
    if (t) return t.toLowerCase();
    var h = new Date().getHours();
    return h < 12 ? 'morning' : (h < 18 ? 'afternoon' : 'evening');
  }

  /* '2026-08-27' -> 'due Aug 27'. Parsed as UTC noon so a timezone
     offset can never shift the day backwards. */
  function shortDate(iso) {
    if (!iso || typeof iso !== 'string') return '';
    var m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return '';
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
    if (isNaN(d.getTime())) return '';
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return 'due ' + months[d.getUTCMonth()] + ' ' + d.getUTCDate();
  }

  function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* crmCompanyName may hold a person's name rather than a company —
     the client sets it. Avoid "Jamie · Jamie Williams". */
  function paintGreeting() {
    var el = document.getElementById('vl-greeting');
    if (!el) return;

    var first = clientFirst();
    var org = clientOrg();

    var orgEchoesName = first && org &&
      org.toLowerCase().indexOf(first.toLowerCase()) !== -1;

    var hi = 'Good ' + esc(timeOfDay());

    var html = '';
    if (first && org && !orgEchoesName) {
      html = hi + ', <b>' + esc(first) + '</b> \u00b7 ' + esc(org);
    } else if (org) {
      html = hi + ', <b>' + esc(org) + '</b>';
    } else if (first) {
      html = hi + ', <b>' + esc(first) + '</b>';
    } else {
      html = hi;
    }

    if (html) {
      el.innerHTML = html;
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', '');
    }
  }

  function list(items) {
    var out = '<div class="vl-list">';
    for (var i = 0; i < items.length; i++) {
      out += '<div class="vl-list-item"><span class="vl-dot"></span><span>' + items[i] + '</span></div>';
    }
    return out + '</div>';
  }

  function stepHtml(n) {
    var s = STEPS[n];
    var banner = '';
    var who = clientFirst();
    if (livePhase >= 8 && n === 7) {
      banner = '<p class="vl-body" style="margin-bottom:18px;"><b class="vl-hero-accent">' +
        (who ? esc(who) + ', this engagement is complete.' : 'This engagement is complete.') +
        '</b></p>';
    } else if (livePhase && livePhase < 8 && n === livePhase) {
      banner = '<p class="vl-body" style="margin-bottom:18px;"><b class="vl-hero-accent">' +
        (who ? esc(who) + ', this is where your engagement is right now.'
             : 'This is where your engagement is right now.') +
        '</b></p>';
    }
    return '<h1 class="vl-hero-title">' + s.title + '</h1>' +
      banner +
      '<h2 class="vl-subhead"><b>' + s.lead + '</b></h2>' +
      '<h2 class="vl-subhead" style="margin-top:20px;">' + s.sub + '</h2>' +
      '<hr class="vl-divider">' +
      '<h2 class="vl-section-title">What We Do</h2>' +
      list(s.we) +
      '<h2 class="vl-section-title" style="margin-top:28px !important;">What We Need From You</h2>' +
      list(s.you) +
      '<p class="vl-body">' + s.close + '</p>' +
      '<p class="vl-body"><span class="vl-cta-link" id="vl-back" role="button" tabindex="0">\u2190 Back to overview</span></p>';
  }

  function overviewHtml() {
    return '<h1 class="vl-hero-title">' + overviewTitle() + '</h1>' + overviewBody();
  }

  /* The bar reflects real project progress only, never the step being read. */
  function paintProgress() {
    var fill = document.getElementById('vl-progress-fill');
    if (!fill) return;
    if (!livePhase) { fill.style.width = '0%'; return; }
    /* 8 = completed. There is no eighth step; it means all seven are done. */
    fill.style.width = (livePhase >= 8 ? 100 : STEPS[livePhase].pct) + '%';
  }

  function paintHint() {
    var hint = document.getElementById('vl-hint');
    if (!hint) return;

    if (livePhase >= 8) {
      hint.innerHTML = '<b>This engagement is complete.</b> Click any step to revisit what happened there.';
    } else if (livePhase) {
      hint.innerHTML = 'Your engagement is at <b>Step ' + livePhase +
        ' \u2014 ' + STEPS[livePhase].short + '</b>. Click any step to see what happens there.';
    } else if (current) {
      hint.innerHTML = 'Step ' + current + ' of 7. Click another step, or go back to the overview.';
    } else {
      hint.innerHTML = 'Click any step above to see what happens and what I need from you.';
    }
  }

  function paintSteps() {
    var steps = document.querySelectorAll('#vl-progress .vl-step');
    for (var i = 0; i < steps.length; i++) {
      var sn = parseInt(steps[i].getAttribute('data-step'), 10);
      var reading = (sn === current);
      steps[i].classList.toggle('vl-step-active', reading);
      steps[i].setAttribute('aria-selected', reading ? 'true' : 'false');
      steps[i].classList.toggle('vl-step-current', livePhase > 0 && livePhase < 8 && sn === livePhase);
      steps[i].classList.toggle('vl-step-done', livePhase > 0 && sn < livePhase);
    }
  }

  function render(n) {
    current = n;

    var body = document.getElementById('vl-hero-body');
    if (body) body.innerHTML = n ? stepHtml(n) : overviewHtml();

    paintProgress();
    paintHint();
    paintSteps();

    var back = document.getElementById('vl-back');
    if (back) {
      back.addEventListener('click', function (e) {
        e.preventDefault();
        userInteracted = true;
        render(0);
      });
      back.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          userInteracted = true;
          render(0);
        }
      });
    }
  }

  function applyPhase(phase, forceRender) {
    /* A project with no mappable phase — SuiteDash built-in status — leaves
       the sidebar on the static view rather than asserting a step.

       The old range test admitted any non-integer in range: 4.5 passed, set
       livePhase = 4.5, and then paintProgress/paintHint/stepHtml all indexed
       STEPS[4.5] unguarded and threw. R140 moved applyPhase ahead of the
       guarded paintProjects, so that throw now takes the rail down before it
       paints at all - where before it would at least have rendered at 0%.

       Same test paintProjects uses: Number() coercion, integer, 1-7, and the
       STEPS key must exist. Number() rather than a typeof check for the R140
       reason - the endpoint's type for phase is pinned nowhere, a string "4"
       works today, and a strict type test would turn a working case into a
       silent 0%. Two notions of "valid phase" one hop apart is how the
       next defect gets written.

       The accepted range stays [1,8] exactly as before - 8 is the completion
       sentinel, and 9 falls to the static view here just as it did under the
       old `phase > 8` test. Widening it to >= 8 would have been a behaviour
       change, and the 8+ sentinel is being pinned on the API side instead. */
    var phn = Number(phase);
    var usable = !!phase && phn === Math.floor(phn) &&
      (phn === 8 || (phn >= 1 && phn <= 7 && !!STEPS[phn]));

    if (!usable) {
      /* An unusable phase now degrades to the static view instead of
         throwing, and says so rather than failing silently. The value is the
         endpoint's own phase field, not client data. */
      if (phase) console.warn('[green-service] unusable phase value; static view only:', phase);
      livePhase = 0;
      paintProgress();
      paintHint();
      paintSteps();
      if (forceRender) render(0);
      return;
    }
    livePhase = phn;

    /* 8 means complete — land on Step 7, which is where the close lives. */
    var landing = (phn >= 8) ? 7 : phn;

    if (!userInteracted || forceRender) {
      render(landing);
      return;
    }

    paintProgress();
    paintHint();
    paintSteps();
    if (current) render(current);
  }

  function paintProjects() {
    var el = document.getElementById('vl-projects');
    if (!el) return;

    if (!projects || !projects.length) {
      el.setAttribute('hidden', '');
      el.innerHTML = '';
      return;
    }

    /* Two engagements can share a service name — a second entity, a second
       year, a repeat of the same review. The due date tells them apart. */
    var seen = {};
    for (var c = 0; c < projects.length; c++) {
      var nm = (projects[c] && projects[c].service) || '';
      seen[nm] = (seen[nm] || 0) + 1;
    }

    var cards = '';
    for (var i = 0; i < projects.length; i++) {
      var p = projects[i];
      var svc = p.service || ('Engagement ' + (i + 1));
      var ph = p.phase;

      /* ph arrives straight from the endpoint and is not validated there.
         STEPS is keyed 1-7, so any truthy value below 8 that is not one of
         those keys made STEPS[ph] undefined and .pct throw, which took the
         whole rail down with no trace. An unrecognised phase now falls to
         the same branch as a missing one. 8 is still the completion
         sentinel and keeps meaning complete. */
      var phn = Number(ph);
      var known = (phn === Math.floor(phn) && phn >= 1 && phn <= 7 && !!STEPS[phn]);

      var meta = [];
      if (!ph) meta.push('Not started');
      else if (ph >= 8) meta.push('Complete');
      else meta.push(known ? 'Step ' + phn + ' of 7' : 'Not started');

      var due = shortDate(p.due);
      /* Always show the date when names collide; otherwise it is still
         useful, just less load-bearing. */
      if (due) meta.push(due);

      var pct = !ph ? 0 : (ph >= 8 ? 100 : (known ? STEPS[phn].pct : 0));

      cards += '<div class="vl-pcard' +
        (i === activeProject ? ' vl-pcard-active' : '') +
        '" data-project="' + i + '" role="button" tabindex="0">' +
        '<span class="vl-pcard-service">' + esc(svc) + '</span>' +
        '<span class="vl-pcard-meta">' + esc(meta.join(' \u00b7 ')) + '</span>' +
        '<span class="vl-pcard-bar"><span style="width:' + pct + '%"></span></span>';

      /* The link only appears when the endpoint supplies one. */
      if (p.url && /^https:\/\//i.test(p.url)) {
        cards += '<a class="vl-pcard-link" href="' + esc(p.url) +
          '" target="_blank" rel="noopener noreferrer">Open project \u2197</a>';
      }

      cards += '</div>';
    }

    el.innerHTML =
      '<span class="vl-rail-title">' +
      (projects.length > 1 ? 'Your Engagements' : 'Your Engagement') +
      '</span><div class="vl-rail-cards">' + cards + '</div>';
    el.removeAttribute('hidden');

    var nodes = el.querySelectorAll('.vl-pcard');
    for (var k = 0; k < nodes.length; k++) {
      (function (card) {
        var idx = parseInt(card.getAttribute('data-project'), 10);

        function pick() {
          if (idx === activeProject) return;
          activeProject = idx;
          userInteracted = false;   /* switching engagements resets the view */
          paintProjects();
          applyPhase(projects[idx].phase, true);
        }

        card.addEventListener('click', function (e) {
          /* Let the portal link do its own job. */
          if (e.target && e.target.closest && e.target.closest('.vl-pcard-link')) return;
          pick();
        });

        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            if (e.target && e.target.classList &&
                e.target.classList.contains('vl-pcard-link')) return;
            e.preventDefault();
            pick();
          }
        });
      })(nodes[k]);
    }
  }

  function loadPhase() {
    var c = attr('data-client-uid', 'vl-mt-uid');

    /* Unresolved merge tag or no client context: stay on the static view.
       Silent until R143: an empty rail here is a misconfigured portal, not
       a client with no engagements, and the two were indistinguishable in
       the console. The uid itself is never logged - only that none resolved. */
    if (!c) {
      console.warn('[green-service] no client uid; static view only');
      return;
    }

    /* No timeout meant a hung endpoint left the rail and the phase state
       unresolved forever: the catch never fires, so the page sat in its
       initial state with nothing to show that anything had failed. An
       abort takes the same degraded path as any other failure, and the
       R140 warn names it AbortError so a timeout is tellable apart.
       credentials: 'omit' is deliberate - the endpoint does not
       authenticate by session, so cookies must not go cross-origin. */
    var ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 8000) : 0;
    var opts = { credentials: 'omit' };
    if (ctl) opts.signal = ctl.signal;

    fetch(PHASE_ENDPOINT + '?c=' + encodeURIComponent(c), opts)
      .then(function (r) {
        clearTimeout(timer);
        /* A 500 or 404 resolves the promise, so the catch never fires and the
           rail went empty with nothing in the console. Status only: never the
           body, the URL, or the query string. */
        if (!r.ok) {
          console.warn('[green-service] phase endpoint returned', r.status, r.statusText);
          return null;
        }
        return r.json();
      })
      .then(function (d) {
        if (!d) return;

        /* The array is authoritative. The top-level phase is a convenience
           the endpoint only sets when there is exactly one engagement. */
        projects = (d.projects && d.projects.length) ? d.projects : [];
        activeProject = 0;

        if (projects.length) {
          /* The validated consumer runs first; paintProjects reads only
             projects/activeProject, never anything applyPhase sets. */
          applyPhase(projects[0].phase);
          paintProjects();
        } else if (d.phase) {
          applyPhase(d.phase);
        } else {
          /* Correct behaviour, not a fault: the endpoint answered and this
             client has nothing to show. Logged so a verifier can tell this
             branch apart from the failures above. */
          console.warn('[green-service] no engagements for this client; rail hidden (not an error)');
        }
      })
      .catch(function (err) {
        clearTimeout(timer);
        /* The page stays fully usable without the endpoint. Log the error
           only: never the client uid, the query string, or any payload
           field, because this console is on a client-facing page. */
        console.warn('[green-service] phase load failed:', err);
      });
  }

  function bind() {
    var steps = document.querySelectorAll('#vl-progress .vl-step');
    for (var i = 0; i < steps.length; i++) {
      (function (el) {
        var n = parseInt(el.getAttribute('data-step'), 10);
        el.addEventListener('click', function () {
          userInteracted = true;
          render(current === n ? 0 : n);
        });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            userInteracted = true;
            render(current === n ? 0 : n);
          }
        });
      })(steps[i]);
    }
    paintGreeting();
    render(0);
    loadPhase();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
