
(function () {
  var ITEM_NAME = "Green Service";
  var PHASE_ENDPOINT = "https://api.virtuallaunch.pro/v1/green/portal-phase";

  function accent(s) {
    return '<span class="vl-hero-accent">' + s + '</span>';
  }

  /* The greeting in #vl-greeting already carries the client's first name and
     company, so the hero title must not restate either. R156. */
  function overviewTitle() {
    return ITEM_NAME + ' \u2014 ' + accent('Your Engagement');
  }

  /* Only phases 1-7 name a stage. 0 = not yet known and 8 = complete both
     return '' rather than assert a step that would be wrong; the same
     STEPS[livePhase] guard applyPhase uses, so a non-integer phase drops the
     line instead of indexing STEPS and throwing. */
  function overviewLead() {
    var s = (livePhase && livePhase < 8) ? STEPS[livePhase] : null;
    if (!s) return '';
    return '<h2 class="vl-subhead"><b>You\u2019re at Step ' + esc(livePhase) +
      ' \u2014 ' + accent(esc(s.short)) + '.</b></h2>';
  }

  /* R156 replaced ~900px of pre-checkout sales copy with a welcome. This
     renders to a client who has already bought: no pricing, no tier, no
     checkout. The separate-engagement line survives because it is the one
     thing in the old block a current client still needs to know. */
  function overviewBody() {
    var lead = overviewLead();
    return lead +
      '<h2 class="vl-subhead"' + (lead ? ' style="margin-top:20px;"' : '') + '>' +
        'Everything open on your matter is below: documents, deadlines, and anything that needs you.' +
      '</h2>' +
      '<p class="vl-body">Select any step to see what happens at that stage.</p>' +
      '<p class="vl-body">Need representation for your personal return or another entity? Each is a separate engagement with its own scope, its own deadlines, and its own progress bar.</p>';
  }

  /* Client action is required in two phases only: 1 (intake flows) and
     7 (exit survey). Everything between runs on what came in at Step 1.
     Quiet phases still carry a "What We Need From You" block, because a
     client needs to be told that silence means nothing is waiting on them. */
  var STEPS = {
    1: {
      pct: 14,
      short: 'General Info Capture',
      /* label/desc are the sidebar tab; short is the prose name the hint
         and the step banner use. R160 folded the sidebar strings in here
         rather than leaving a second copy in the scaffold builder -
         'short' is the longer form and never fitted the 210px column.
         The raw '&' in labels 2 and 3 is deliberate: esc() re-encodes it,
         which is what the Text Block's hand-written &amp; used to do. */
      label: 'General Info',
      desc: 'Capture the details',
      title: 'Step 1 \u2014 ' + accent('General Info Capture'),
      lead: 'We open the matter and capture exactly who and what we\u2019re representing.',
      sub: 'Taxpayer identity, entity structure, license type, tax years, and every notice received \u2014 enough to confirm this is a matter I can take. <b>This is the step that needs you.</b>',
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
      label: 'Fit & Scope',
      desc: 'Confirm the scope',
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
      label: 'Assets & Setup',
      desc: 'Collect and set up',
      title: 'Step 3 \u2014 ' + accent('Asset Collection &amp; Setup'),
      lead: 'We assemble the evidence base and put the authorization on file.',
      sub: 'Returns, books, transcripts, and the executed Form 2848 \u2014 reconciled and organized into the working file. This step is internal.',
      we: [
        'The signed <b>Form 2848</b> is filed and transcripts are pulled.',
        'Everything you sent in Step 1 is reconciled against the locked scope.',
        'Workpapers, schedules, and the COGS model are set up against your chart of accounts.'
      ],
      you: [
        '<b>Nothing.</b> This step runs entirely on what you already sent.',
        'If a record is missing, unreadable, or contradicts another, I assign a flow and notify you \u2014 the team checks in until it is resolved.',
        'No news here means the assembly is going fine.'
      ],
      close: 'If this step runs long, it is usually because one record is still outstanding. We will chase it down with you rather than let it sit.'
    },
    4: {
      pct: 57,
      short: 'Drafting & Client Review',
      label: 'Drafting',
      desc: 'Build the position',
      title: 'Step 4 \u2014 ' + accent('Drafting &amp; Client Review'),
      lead: 'We build the workpaper and the disclosure. <b>You only need to look at it if I ask you to.</b>',
      sub: 'COGS allocation, the \u00a7471 position, and the disclosure that protects it \u2014 reviewed before anything carries my signature. Most of this step runs without you.',
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
      label: 'Delivery',
      desc: 'Sign and submit',
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
      label: 'Quality Review',
      desc: 'Verify and report',
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
      label: 'Offboarding',
      desc: 'Close the engagement',
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

  /* ================================================================
     R160 - THE SCAFFOLD

     The SuiteDash layout Text Block used to carry this whole tree by
     hand. It now carries exactly one element:

       <div id="vl-hero" data-client-uid="{{clientUID}}"
            data-company-uid="{{crmCompanyUID}}"
            data-client-first="{{clientFirstName}}"
            data-client-org="{{crmCompanyName}}"></div>

     That element cannot move into JS. Merge codes resolve only inside a
     Text Block - in an Embed Block they render as the literal
     {{clientUID}} - so it stays as the identity carrier and the mount
     point, and it is the whole remaining SuiteDash surface. Everything
     under it is built here, so a layout change ships from this repo
     instead of from a paste into the portal.

     ORDERING. This runs synchronously at parse time, before any fetch.
     client-dashboard.js is a plain script in the same Embed Block that
     parses after this file and queries #vld; building the scaffold here
     means #vld exists before that file is even requested. Both files
     also defer to DOMContentLoaded when readyState is 'loading', and
     this one registers its listener first, so the ordering holds on
     that path too - bind() rebuilds before loadDashboard() runs. The
     guard below makes the second call free.
     ================================================================ */

  /* Committed at portal/client-dashboard.markup.html and kept identical
     to it. Hidden and empty on arrival - client-dashboard.js owns
     everything inside #vld-secs and flips the hidden attribute. */
  var VLD_MARKUP =
    '<section id="vld" data-state="full" hidden>' +
      '<div class="vld-hd">' +
        '<h2>What&rsquo;s open on your matter</h2>' +
        '<span class="stale" title="The live source did not answer; this is the last good copy.">Saved copy</span>' +
      '</div>' +
      '<div class="allclear">' +
        '<div class="t">Nothing needs you right now.</div>' +
        '<p class="d">Every request, deadline and document on your matter is closed. We are still ' +
          'working it on our side &mdash; you will see new items here the moment something needs your attention.</p>' +
      '</div>' +
      '<div id="vld-secs"></div>' +
    '</section>';

  /* Every interpolated value goes through esc(), including the file
     literals in STEPS. The rule is "nothing reaches innerHTML without
     esc()" so that it stays grep-checkable; labels 2 and 3 carry a raw
     '&' and are the case that proves it. */
  function stepTab(n) {
    var s = STEPS[n];
    return '<div class="vl-step" data-step="' + esc(n) + '" role="tab" aria-selected="false">' +
        '<span class="vl-step-num">' + esc(n) + '</span>' +
        '<span class="vl-step-content">' +
          '<span class="vl-step-label">' + esc(s.label) + '</span>' +
          '<span class="vl-step-description">' + esc(s.desc) + '</span>' +
        '</span>' +
      '</div>';
  }

  function buildScaffold() {
    var hero = document.getElementById('vl-hero');

    /* Not parsed yet. bind() calls this again on DOMContentLoaded. */
    if (!hero) return;

    /* Idempotent. A second build would duplicate every id in the tree,
       and getElementById would start answering with the wrong node -
       the exact failure the old duplicate #vl-hero used to cause. */
    if (document.getElementById('vl-progress')) return;

    var tabs = '';
    for (var n = 1; n <= 7; n++) tabs += stepTab(n);

    /* The eyebrow was {{myOrganizationOSDItemNameSOP29357}} in the Text
       Block. A merge code cannot resolve from here, and ITEM_NAME is
       the value it resolved to. */
    hero.innerHTML =
      '<div class="vl-page">' +
        '<div class="vl-layout">' +
          '<aside class="vl-sidebar">' +
            '<div class="vl-sidebar-header">' +
              '<span class="vl-sidebar-eyebrow">' + esc(ITEM_NAME) + '</span>' +
              '<h2 class="vl-sidebar-title">How It Works</h2>' +
            '</div>' +
            '<div class="vl-progress-steps vl-progress-steps-7" id="vl-progress" role="tablist" aria-label="Engagement steps">' +
              tabs +
            '</div>' +
            '<div class="vl-sidebar-progress">' +
              '<p class="vl-hint" id="vl-hint">Select a step to view the engagement process.</p>' +
              '<div class="vl-progress-bar" id="vl-bar" aria-hidden="true">' +
                '<div class="vl-progress-bar-fill" id="vl-progress-fill"></div>' +
              '</div>' +
            '</div>' +
          '</aside>' +
          /* #vld is a sibling AFTER #vl-hero-body, not a child of it:
             render() overwrites #vl-hero-body.innerHTML on every step
             click, which would destroy the dashboard on first click. */
          '<main class="vl-main">' +
            '<p class="vl-greeting" id="vl-greeting" hidden></p>' +
            '<div class="vl-main-inner" id="vl-hero-body"></div>' +
            /* Same reason as #vld below: a sibling AFTER #vl-hero-body,
               never a child. render() rewrites #vl-hero-body.innerHTML on
               every step click, and a Projects section built inside it
               would be destroyed - along with its listeners - the first
               time the reader touched the stepper. Ships hidden and
               empty; paintProjectsSection() fills it, and a client with
               no engagements never sees a heading. */
            '<section id="vl-projsec" hidden></section>' +
            VLD_MARKUP +
          '</main>' +
          '<aside class="vl-rail" id="vl-projects" hidden></aside>' +
        '</div>' +
      '</div>';
  }

  buildScaffold();

  /* Where the engagement actually is. 0 = not yet known, 8 = complete. */
  var livePhase = 0;

  /* Every engagement this contact holds, and which one is on screen. */
  var projects = [];
  var activeProject = 0;

  /* Projects section only: whether the reader has asked to see every
     engagement rather than the selected one. p31 made the section show
     one engagement at a time, so this now returns to false on any
     selection - picking a card is the reader saying "just this one".
     The rail never reads it; the rail always lists everything. */
  var projectsExpanded = false;

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
     second. Whichever the page supports, one of them lands.

     R160: the attribute path is now the live one. The old Text Block
     shipped a second #vl-hero, so getElementById could return the wrong
     node and the attribute read was effectively dead - the #vl-mt-*
     spans carried every value. The collapsed block has one #vl-hero
     with all four attributes on it, so the first branch answers.

     The span branch stays and is expected to miss: null from
     getElementById feeds clean() and returns '', so it costs one lookup
     and degrades cleanly. Synthesising replacement spans would rebuild
     the exact mechanism the collapse removed. */
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
     offset can never shift the day backwards.

     R145: a value this could not parse used to vanish with nothing in the
     console - the due date simply stopped appearing on the rail, and a
     dropped date was indistinguishable from a date the endpoint never
     sent. It now says which one happened. Ordinary absence (null,
     undefined, '') stays quiet, exactly as R144 keeps quiet for a falsy
     phase. The value itself is never logged: a due date belongs to a
     client. The accepted formats are unchanged - a leading YYYY-MM-DD,
     which an ISO datetime also satisfies.

     R146: observed. Every due value the endpoints emit is a bare
     YYYY-MM-DD - ten characters, no time part, no zone suffix - across
     all 3 projects on portal-phase and all 99 rows on portal-dashboard,
     on both live clients, with zero non-conforming values and zero
     nulls. The pattern above matches that exactly on its three groups,
     and the Date.UTC(y, m, d, 12) path lands the instant at noon UTC,
     far enough from either midnight that no reader's offset can move
     the calendar day. So the ISO-datetime tolerance is headroom rather
     than a path anything takes today, and the warn branch has never
     fired in production. Both stay: the shape is the endpoint's to
     change, and R145 exists so that a change shows up in the console
     instead of as a silently missing date. */
  function shortDate(iso) {
    if (!iso) return '';
    var m = (typeof iso === 'string') ? iso.match(/^(\d{4})-(\d{2})-(\d{2})/) : null;
    var d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)) : null;
    if (!d || isNaN(d.getTime())) {
      console.warn('[green-service] unparseable due value; date omitted');
      return '';
    }
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
      hint.innerHTML = 'Your engagement is at <b>Step ' + esc(livePhase) +
        ' \u2014 ' + esc(STEPS[livePhase].short) + '</b>. Click any step to see what happens there.';
    } else if (current) {
      hint.innerHTML = 'Step ' + current + ' of 7. Click another step, or go back to the overview.';
    } else {
      hint.innerHTML = 'Select any step to see what happens and what I need from you.';
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

  /* The phase guard, in one place. Returns the usable phase number, or 0
     - the same sentinel livePhase already uses for "not known".

     This was applyPhase()'s inline test verbatim; p28 needed the identical
     question answered for the Projects section and a second copy is how
     R151/R154 got written. Number() coercion rather than a typeof check
     for the R140 reason: the endpoint's type for phase is pinned nowhere,
     a string "4" works today, and a strict type test would turn a working
     case into a silent 0%. NaN fails the Math.floor test on its own.

     The accepted range is [1,8]; 8 is the completion sentinel and 9 falls
     to the static view, exactly as before. */
  function usablePhase(phase) {
    var phn = Number(phase);
    var ok = !!phase && phn === Math.floor(phn) &&
      (phn === 8 || (phn >= 1 && phn <= 7 && !!STEPS[phn]));
    return ok ? phn : 0;
  }

  function applyPhase(phase, forceRender) {
    /* A project with no mappable phase — SuiteDash built-in status — leaves
       the sidebar on the static view rather than asserting a step.

       The old range test admitted any non-integer in range: 4.5 passed, set
       livePhase = 4.5, and then paintProgress/paintHint/stepHtml all indexed
       STEPS[4.5] unguarded and threw. R140 moved applyPhase ahead of the
       guarded paintProjects, so that throw now takes the rail down before it
       paints at all - where before it would at least have rendered at 0%.

       The test itself now lives in usablePhase() above - p28 moved it there
       so the Projects section asks the identical question rather than
       carrying a second copy. Two notions of "valid phase" one hop apart is
       how the next defect gets written. Behaviour is unchanged: the same
       expression, the same [1,8] range, the same 0 sentinel. */
    var phn = usablePhase(phase);

    if (!phn) {
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

  /* THE SELECTION. The rail and the Projects section are two renderings of
     one value, activeProject, and the only way they stay agreed is that
     neither of them owns it. This was paintProjects()'s per-card pick()
     closure; p28 lifted it out unchanged so the section can call the same
     path instead of reimplementing it. Both views repaint here, so a click
     in either place updates both - plus the hero and the stepper, via
     applyPhase.

     The projects[idx] guard is new and cheap: idx comes from our own
     data-project attribute today, but a stale node after a repaint would
     otherwise throw on .phase and take the rail down with it. */
  function selectProject(idx) {
    if (!projects[idx]) return;

    /* p31: a selection always returns the section to one engagement, and
       it is the one just picked - so the expanded list can never collapse
       away from under the reader's own click. Re-picking the engagement
       already selected is a legitimate way to collapse the list, which is
       why the "already active" short-circuit no longer returns before
       clearing the flag; it only skips the work that would change
       nothing. */
    var wasExpanded = projectsExpanded;
    projectsExpanded = false;

    if (idx === activeProject) {
      if (wasExpanded) paintProjectsSection();
      return;
    }

    activeProject = idx;
    userInteracted = false;   /* switching engagements resets the view */
    paintProjects();
    paintProjectsSection();
    applyPhase(projects[idx].phase, true);
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

      /* R173: the company, FIRST, because it qualifies the service name
         directly above it and nothing else on the card does. A client
         holding engagements under two of his own entities read two cards
         that differed only by a due date - the rail said what each
         engagement was and never whose it was.

         Into the existing meta register rather than a line of its own:
         the card is not restructured, and the company reads as one more
         fact about the engagement alongside its step and its date. The
         whole joined string goes through esc() below, as it already did.

         Absent means ABSENT. The endpoint omits the key when it could not
         resolve a company - an order can link a contact rather than a
         company - so nothing is pushed, the separator does not appear,
         and the line is exactly what it was before. No placeholder, no
         em dash, no "Unknown": a card that says nothing about its company
         is correct here, and one that says "Unknown" is not. */
      if (p.company) meta.push(p.company);

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

        function pick() { selectProject(idx); }

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

  /* ================================================================
     p28 - THE PROJECTS SECTION  (p31: one engagement at a time)

     The selected engagement and its seven-phase strip. The rail answers
     "which ones do I have"; this answers "where does the one I am
     looking at actually stand". p28 stacked every engagement here, which
     put three names and twenty-one cards on screen for a reader who was
     asking about one of them; p31 made the rail the list and this the
     detail. The toggle still opens the full set. Same array, same
     activeProject, same pick path - see selectProject().

     Phase names come from STEPS, one copy. The mockup carried its own
     PHASES constant and a per-phase ClickUp task id; importing either
     would have created a second list to keep in step with the stepper.
     ref ("ORD-1041") and opened ("Aug 10, 2026") are in the mockup and
     not in the payload, so they are omitted rather than invented - all
     three are Worker additions for later. Phase cards render as plain
     elements, not dead links.
     ================================================================ */

  /* The seven card states for one project. phn 0 - a real engagement with
     no mapped phase - is not an error and not zero: nothing is asserted,
     so every card reads Upcoming. phn 8 puts every card below it, which
     is all seven, in the closed state. */
  function phaseStates(phase) {
    var phn = usablePhase(phase);
    var out = [];
    for (var n = 1; n <= 7; n++) {
      if (!phn || n > phn) out.push('upcoming');
      else if (n === phn) out.push('inprogress');
      else out.push('closed');
    }
    return out;
  }

  /* "Complete" is read off the rendered strip rather than tested against a
     number, which is what makes the collapse rule literally true for both
     of its forms: at phase 8, and at any phase whose strip closes all
     seven. If the mapping ever changes, the collapse follows it. */
  function allClosed(states) {
    for (var i = 0; i < states.length; i++) {
      if (states[i] !== 'closed') return false;
    }
    return true;
  }

  var PHASE_LABEL = { closed: 'Closed', inprogress: 'In Progress', upcoming: 'Upcoming' };

  function phaseStripHtml(states) {
    var out = '<div class="vl-phases">';
    for (var n = 1; n <= 7; n++) {
      var st = states[n - 1];
      /* .label, not .short. p31 dropped the strip's auto-fit floor to
         96px to buy seven columns at the live width, and .short is the
         prose form ("Project Fit & Scope Confirmation") that no column
         that narrow ever fitted. .label is the sidebar's own short form,
         already sized for a 210px column. The prose name stays reachable
         on title= rather than being truncated or restated as a third
         list of step names. */
      out += '<div class="vl-phase vl-phase-' + st + '"' +
          ' title="' + esc(STEPS[n].short) + '">' +
          '<div class="vl-phase-p">Step ' + esc(n) + '</div>' +
          '<div class="vl-phase-n">' + esc(STEPS[n].label) + '</div>' +
          '<div class="vl-phase-ps"><span class="vl-pst vl-pst-' + st + '">' +
            esc(PHASE_LABEL[st]) + '</span></div>' +
        '</div>';
    }
    return out + '</div>';
  }

  function paintProjectsSection() {
    var el = document.getElementById('vl-projsec');
    if (!el) return;

    /* No engagements: no section at all, not an empty heading. Same shape
       as the rail's own empty branch. */
    if (!projects || !projects.length) {
      el.setAttribute('hidden', '');
      el.innerHTML = '';
      return;
    }

    var blocks = '';

    for (var i = 0; i < projects.length; i++) {
      var isActive = (i === activeProject);

      /* p31: collapsed shows the selected engagement and nothing else;
         expanded shows all of them. The selected one is in both sets, so
         it can never be the one that disappears - including when it is
         complete. A reader who clicks into a finished engagement and
         watches it vanish will think the page broke. */
      if (!projectsExpanded && !isActive) continue;

      var p = projects[i] || {};
      var states = phaseStates(p.phase);
      var phn = usablePhase(p.phase);
      var done = allClosed(states);

      var svc = p.service || ('Engagement ' + (i + 1));

      var meta = [];

      /* R173: the same value in the same register as the rail card's, and
         deliberately built the same way - the rail and this section are two
         renderings of one array, and a company shown in one and not the
         other would be the disagreement p28 exists to avoid.

         metaText feeds the aria-label below as well as the visible line, so
         a screen-reader user is handed the same disambiguation a sighted one
         gets, from one string rather than two that could drift apart. Both
         are escaped through esc(). Absent renders nothing, exactly as in the
         rail. */
      if (p.company) meta.push(p.company);

      if (!phn) meta.push('Not started');
      else if (phn >= 8) meta.push('Complete');
      else meta.push('Step ' + phn + ' of 7');
      var due = shortDate(p.due);
      if (due) meta.push(due);
      var metaText = meta.join(' · ');

      /* The .proj block is the control, matching the rail's cards exactly:
         role=button, tabindex=0, Enter and Space. aria-pressed is the one
         addition - "selected among a set" is what this state is, and the
         class alone never reached a screen reader. aria-label keeps the
         announcement to the project rather than to all seven phase cards
         its contents would otherwise concatenate into. */
      blocks += '<div class="vl-proj' + (isActive ? ' vl-proj-active' : '') +
          (done ? ' vl-proj-done' : '') +
          '" data-project="' + i + '" role="button" tabindex="0"' +
          ' aria-pressed="' + (isActive ? 'true' : 'false') + '"' +
          ' aria-label="' + esc(svc + ' — ' + metaText) + '">' +
        '<div class="vl-proj-hd">' +
          '<span class="vl-proj-name">' + esc(svc) + '</span>' +
          '<span class="vl-proj-meta">' + esc(metaText) + '</span>' +
        '</div>' +
        (p.label ? '<p class="vl-proj-lede">' + esc(p.label) + '</p>' : '') +
        phaseStripHtml(states) +
        '</div>';
    }

    /* A toggle that does nothing is worse than none. With one engagement
       there is nothing to expand to, so no control renders. The test is
       the length of the array, never the length of the loop's output -
       otherwise the control would vanish the moment the reader used it. */
    var toggle = '';
    if (projects.length > 1) {
      toggle = '<button type="button" class="vl-projsec-toggle"' +
        ' aria-expanded="' + (projectsExpanded ? 'true' : 'false') + '">' +
        (projectsExpanded ? 'Show fewer' : 'Show all ' + esc(projects.length) + ' engagements') +
        '</button>';
    }

    el.innerHTML =
      /* R170: the section heading names a role, not the noun. Once p29
         unified on "engagement", this h2 and .vl-rail-title read the
         same words on the same screen. The rail IS the list of
         engagements and keeps that name; this section says where the
         selected one stands, so it says so. No singular/plural branch:
         "Your progress" is true for one engagement or several, and
         unlike a second "Your Engagements" it does not imply a second
         list. Do not rename the class - the selector is load-bearing. */
      '<h2 class="vl-projsec-title">Your progress</h2>' +
      /* Always visible, and deliberately not a title tooltip: this is the
         sentence that answers "where did my engagement go?", and a tooltip
         is invisible on touch and unreachable by keyboard.

         p29 rewrote it. The old wording - "Completed projects are archived
         and drop off this list" - was written for p28, where the section
         stacked every engagement and collapsed the completed ones. It read
         as an explanation of that collapse. Since p31 the section shows one
         engagement at a time and the collapse follows selection, not
         completion, so the sentence has to describe the only disappearance
         that is still real: the upstream archive. One line, no second
         sentence - a reader who has not lost anything should not have to
         read a paragraph about it. */
      '<p class="vl-projsec-note">Completed engagements are archived and stop appearing here.</p>' +
      '<div class="vl-projsec-list">' + blocks + '</div>' +
      toggle;
    el.removeAttribute('hidden');

    var nodes = el.querySelectorAll('.vl-proj');
    for (var k = 0; k < nodes.length; k++) {
      (function (block) {
        var idx = parseInt(block.getAttribute('data-project'), 10);

        function pick() { selectProject(idx); }

        block.addEventListener('click', pick);
        block.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            pick();
          }
        });
      })(nodes[k]);
    }

    var tog = el.querySelector('.vl-projsec-toggle');
    if (tog) {
      tog.addEventListener('click', function () {
        projectsExpanded = !projectsExpanded;
        paintProjectsSection();
        /* Focus dies with the node this repaint replaces. Put it back on
           the control the reader just pressed, or a keyboard reader is
           returned to the top of the document. */
        var next = document.querySelector('#vl-projsec .vl-projsec-toggle');
        if (next && next.focus) next.focus();
      });
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
          paintProjectsSection();
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
    /* Covers the case where #vl-hero had not parsed when this file did -
       scripts moved into <head>, or the Embed Block placed above the
       Text Block. A no-op on the normal path, where the parse-time call
       already built it. This runs before client-dashboard.js's own
       DOMContentLoaded handler, which registers second. */
    buildScaffold();

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
