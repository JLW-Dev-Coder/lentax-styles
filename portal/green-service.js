(function () {
  var ITEM_NAME = "Green Service";
  var PHASE_ENDPOINT = "https://api.virtuallaunch.pro/v1/green/portal-phase";

  function accent(s) {
    return '<span class="vl-hero-accent">' + s + '</span>';
  }

  function overviewTitle() {
    var org = clientOrg();
    return (org ? esc(org) : ITEM_NAME) + ' — ' + accent('Ready To Move');
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
      '<div class="vl-list-item"><span class="vl-dot"></span><span>A licensed EA of record — my PTIN, my signature, my judgment.</span></div>' +
      '<div class="vl-list-item"><span class="vl-dot"></span><span>A COGS workpaper and §8275-R disclosure that stands on its own.</span></div>' +
      '<div class="vl-list-item"><span class="vl-dot"></span><span>Every statutory deadline calendared before work begins.</span></div>' +
      '</div>' +
      '<p class="vl-body">Your bookkeeper and your CPA stay yours. I carry the license for the §280E position and the signature that goes with it.</p>' +
      '<hr class="vl-divider">' +
      '<h2 class="vl-section-title">What I Can and Cannot Promise</h2>' +
      '<p class="vl-body">The IRS has not issued guidance on retroactive §280E relief, so nobody can promise you a number — and I would be wary of anyone who does. What I can do is show you what I think is defensible, explain the reasoning, and put it in writing. Fixed scope, fixed price, honest odds.</p>' +
      '<hr class="vl-divider">' +
      '<h2 class="vl-section-title">Not Sure Which Tier?</h2>' +
      '<p class="vl-body">Start with a <a href="https://app.virtuallaunch.pro/portal/dashboard/view/171391" class="vl-cta-link"><strong>Risk Review</strong></a>. I scope your exposure and put it in writing — what’s defensible, what isn’t, and what I’d put my name on. It credits in full toward your first engagement.</p>' +
      '<p class="vl-body">If the matter escalates into a full exam, Appeals, or collections, that is scoped and priced separately — so a fixed fee never rides on open-ended risk.</p>';
  }

  /* Client action is required in two phases only: 1 (intake flows)
     and 7 (exit survey). Everything between runs on what came in at
     Step 1. Quiet phases still carry a "What We Need From You"
     block, because a client needs to be told that silence means
     nothing is waiting on them. */
  var STEPS = {
    1: {
      pct: 14,
      short: 'General Info Capture',
      title: 'Step 1 — ' + accent('General Info Capture'),
      lead: 'We open the matter and capture exactly who and what we’re representing.',
      sub: 'Taxpayer identity, entity structure, license type, tax years, and every notice received — enough to confirm this is a matter I can take. <b>This is the phase that needs you.</b>',
      we: [
        'Your engagement is logged and a matter is opened.',
        'Entity structure and plant-touching status are mapped.',
        'A conflict check is run before anything else moves.',
        '<b>Flows are assigned to your portal</b>, scoped to this engagement — you are notified as each one lands.'
      ],
      you: [
        '<b>Complete the flows assigned to you.</b> Depending on scope those may include the Form 2848 for signature, document upload, and read-only access to your books — Xero, QuickBooks Online, or Digits.',
        'Send every IRS notice — with the date printed on the letter.',
        'Confirm you have signing authority for every entity in scope.'
      ],
      close: 'One thing worth knowing: IRS deadlines run from the date printed on the notice, not the day it was opened. If a final notice of intent to levy is in that stack, send it first — that clock is already running. Everything downstream builds on what comes in here, and we will follow up on each flow until it is done.'
    },
    2: {
      pct: 28,
      short: 'Project Fit & Scope Confirmation',
      title: 'Step 2 — ' + accent('Project Fit & Scope'),
      lead: 'We lock exactly which years, which entities, and which positions are in play.',
      sub: 'Scope, disclosure posture, and every statutory deadline are fixed in writing before a single record is requested.',
      we: [
        'Scope locked: entities × tax years × matters. Nothing broader.',
        'Disclosure posture identified — whether a §471(c) or contrary position requires <b>Form 8275-R</b>.',
        'Every deadline calendared: CDP 30-day, deficiency 90-day, protest, IDR.'
      ],
      you: [
        '<b>Nothing right now.</b> Scope is built from what you sent in Step 1.',
        'If a gap turns up, I assign a flow and notify you — and the team follows up until it is complete.',
        'If the scope does not match what you had in mind, tell me — this is the easiest point to change it.'
      ],
      close: 'Adjustments are easiest here, before records are requested and work begins. Deadlines are the reason we lock this early — the 90-day deficiency clock cannot be extended by anyone, including the IRS, so every date gets calendared now.'
    },
    3: {
      pct: 43,
      short: 'Asset Collection & Setup',
      title: 'Step 3 — ' + accent('Asset Collection & Setup'),
      lead: 'We assemble the evidence base and put the authorization on file.',
      sub: 'Returns, books, transcripts, and the executed Form 2848 — reconciled and organized into the working file. This phase is internal.',
      we: [
        'The signed <b>Form 2848</b> is filed and transcripts are pulled.',
        'Everything you sent in Step 1 is reconciled against the locked scope.',
        'Workpapers, schedules, and the COGS model are set up against your chart of accounts.'
      ],
      you: [
        '<b>Nothing.</b> This phase runs entirely on what you already sent.',
        'If a record is missing, unreadable, or contradicts another, I assign a flow and notify you — the team checks in until it is resolved.',
        'No news here means the assembly is going fine.'
      ],
      close: 'If this phase runs long, it is usually because one record is still outstanding. We will chase it down with you rather than let it sit.'
    },
    4: {
      pct: 57,
      short: 'Drafting & Client Review',
      title: 'Step 4 — ' + accent('Drafting & Client Review'),
      lead: 'We build the workpaper and the disclosure. <b>You only need to look at it if I ask you to.</b>',
      sub: 'COGS allocation, the §471 position, and the disclosure that protects it — reviewed before anything carries my signature. Most of this phase runs without you.',
      we: [
        'COGS / §471 workpaper assembled against the records you provided.',
        '<b>Form 8275-R disclosure drafted</b> for any contrary position. This is not optional.',
        'If a judgment call needs your input, a draft is delivered to your portal and <b>you are notified</b>.'
      ],
      you: [
        '<b>Nothing, unless you are notified.</b> Silence here means the work is proceeding as scoped.',
        'If you are notified: review the workpaper and the disclosure together — they are one argument.',
        'Consolidate feedback into a single pass, and raise disagreements now rather than after filing.'
      ],
      close: 'A disclosure is what turns an aggressive position into a defensible one, so where the law calls for it we file it. If you would rather approach something differently, say so before we file — that conversation is much easier now than afterwards.'
    },
    5: {
      pct: 71,
      short: 'Delivery & Fulfillment',
      title: 'Step 5 — ' + accent('Delivery & Fulfillment'),
      lead: 'Approved work gets signed, filed, and put in front of the IRS.',
      sub: 'The return is signed and filed, or the case is submitted — protest, CDP request, notice response, or offer package.',
      we: [
        'Final return signed and filed under my PTIN, or the case submitted.',
        'Filing confirmation and copies uploaded to your portal.',
        'Delivery notice sent to you, and to any second signer on the return.'
      ],
      you: [
        '<b>Nothing.</b> The filing confirmation arrives in your portal on its own.',
        'If a signature or authorization is needed before submission, I assign a flow and notify you — and follow up until it is signed.'
      ],
      close: 'My PTIN and my signature go on the filing, so nothing leaves without my review. That is what having an Enrolled Agent of record actually means — and it is part of what you are paying for.'
    },
    6: {
      pct: 85,
      short: 'Quality Review & Reporting',
      title: 'Step 6 — ' + accent('Quality Review & Reporting'),
      lead: 'We verify the filing landed and the clocks are where we think they are.',
      sub: 'Acceptance confirmed, CAF posted, statutes recorded, and a written report of exactly what was filed and why.',
      we: [
        'Filing acceptance and CAF posting confirmed.',
        'Statute dates verified and recorded against the matter.',
        'Engagement report issued — positions taken, disclosures made, exposure remaining.'
      ],
      you: [
        '<b>Nothing is required.</b> The report arrives in your portal when it is issued.',
        'Worth reading when it does — it is the written record of the position taken on your behalf — but nothing is waiting on you.'
      ],
      close: 'The report is what you keep for your own file, and what your CPA or bookkeeper works from if this is ever questioned.'
    },
    7: {
      pct: 100,
      short: 'Exit/Offboarding Support',
      title: 'Step 7 — ' + accent('Exit/Offboarding Support'),
      lead: 'The work is done. <b>One short flow, and then we close things out together.</b>',
      sub: 'An exit survey is assigned to your portal, the exit call is opened for booking, and we decide together whether the authorization stays live.',
      we: [
        '<b>An exit survey flow is assigned</b> to your portal and you are notified.',
        'Your exit call is opened for booking.',
        'The 2848 is withdrawn — or deliberately left live if an appeal window is still open.',
        'Your files stay available in your portal.'
      ],
      you: [
        '<b>Complete the exit survey flow.</b> It takes a few minutes and it is the last thing I need.',
        'Book the exit call.',
        'Tell me which of your other entities is carrying the same exposure.'
      ],
      close: 'The 2848 is never withdrawn while an appeal window is open. Ready for the next one? <a href="https://app.virtuallaunch.pro/portal/dashboard/view/171081" class="vl-cta-link">Open the next engagement</a> — or move to <b>Standing Representation</b>, if you prefer not opening them one at a time.'
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

  /* Merge tags arrive as DOM attributes, never as JS string literals
     — an apostrophe in a name would break a literal, and an
     unresolved tag would render as {{...}}. */
  function clean(v) {
    if (!v) return '';
    v = String(v).replace(/ /g, ' ').trim();
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

  function clientFirst() {
    return attr('data-client-first', 'vl-mt-first');
  }

  function clientOrg() {
    return attr('data-client-org', 'vl-mt-org');
  }

  /* SuiteDash supplies friendlyTimeOfDay; if the tag is unavailable
     the browser clock is a better source anyway — it is the
     reader's own. */
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
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  /* crmCompanyName may hold a person's name rather than a company —
     the client sets it. Avoid "Jamie · Jamie Williams". */
  function paintGreeting() {
    var el = document.getElementById('vl-greeting');
    if (!el) return;
    var first = clientFirst();
    var org = clientOrg();
    var orgEchoesName = first && org && org.toLowerCase().indexOf(first.toLowerCase()) !== -1;
    var hi = 'Good ' + esc(timeOfDay());
    var html = '';
    if (first && org && !orgEchoesName) {
      html = hi + ', <b>' + esc(first) + '</b> · ' + esc(org);
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
      banner = '<p class="vl-body" style="margin-bottom:18px;"><b class="vl-hero-accent">' + (who ? esc(who)
