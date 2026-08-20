/* ---------------------------------------------------------------------
   client-dashboard.js
   Source:     portal/_source/dashboard-fragment.raw.html (R147)
   Ported:     2026-08-20
   Scope:      Renders the client dashboard into #vld-secs - five buckets,
               summary cards with the urgency ladder, ledger rows, the
               five-row density toggle, and the empty / stale states.
   Namespace:  #vld and its descendants. Binds one delegated click
               listener on document, but every closest() inside it is
               anchored to #vld so portal chrome is never intercepted.
   Depends on: portal/client-dashboard.css for presentation,
               portal/client-dashboard.markup.html for the #vld container.

   HIDDEN RULES - dashboard display logic (from the fragment header)
     BUCKETS (fixed by the API, 1:1, in order)
       secure_intake, deadlines, work_items, correspondence,
       client_requests. Each bucket: count, urgency_date, rows[].
       Each row: task_id, label, label_source, due, owner.
     URGENCY LADDER - SUMMARY CARDS ONLY, driven by urgency_date
       days <= 0  CRITICAL  red fill + fire glyph + halo   "Hot"
       days 1-2   HIGH      amber fill + up triangle       "High"
       days 3-5   NORMAL    amber outline + square         "Normal"
       days 6+ or no date   muted outline + down caret     "Low"
       Rows never carry an urgency pill - they already show a status and
       a relative date, and two chips per line compete.
     RELATIVE TIME
       Calendar-day arithmetic in the reader's own timezone (NOT elapsed
       ms - that ran the countdown a day off). Do not rewrite dayDiff.
     OWNER - two reachable values only
       coordinator = quiet hairline pill.
       client      = solid accent pill + 3px accent row rail.
       "3rd Party" is unreachable (no per-row owner field upstream).
     LABELS
       label_source "name" is the raw internal task name. Those rows
       clamp to 2 lines and carry a dotted rail + lighter weight so an
       untranslated row reads as a work queue item, not finished copy.
     DENSITY
       5 rows visible per section, then "Show all N".
     STATES
       full, empty (per-section empty block + all-clear banner), stale
       (quiet saved-copy pill). Unresolved renders nothing - #vld stays
       hidden and the portal's own content shows.

   PORT NOTES - what changed from the raw fragment, and why.
     1. The preview shell is gone: its html/body/.vl-main/#vl-hero-body
        rules, the preview button bar and its branch of the click
        handler. Those four selectors are portal-owned; restyling them
        from this bundle is exactly the leak the #vld scope prevents.
     2. Everything is inside one IIFE. At top level the fragment defined
        globals named render, rel, fill, r, AV and CTAS. A portal page
        with its own render() would have been silently clobbered - the
        same collision hazard as the unscoped CSS, in the JS dimension.
     3. The .more closest() is anchored to "#vld .more" rather than
        ".more", so a Show-all click cannot be swallowed from portal
        chrome that happens to use the same class name.
     4. Nothing here is referenced by any loader or markup yet. Mounting
        is a separate step after live verification.
   --------------------------------------------------------------------- */

(function () {
  var FIRE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2s1.5 3.2-.8 5.6C8.6 10.3 7 12 7 14.6 7 18.1 9.7 21 13 21s5.5-2.6 5.5-6' +
    'c0-3.4-2.3-5.1-3.4-7.6-.4 1.2-1.2 2-2.2 2.6.6-2.4-.3-5.5-.9-8z"/></svg>';

  /* Calendar-day arithmetic in the reader's own timezone. Constructed
     local dates, never elapsed milliseconds - elapsed ms ran the
     countdown a day off across a DST boundary. Do not rewrite. */
  var dayDiff = function (iso) {
    var p = iso.split("-").map(Number), y = p[0], m = p[1], d = p[2], n = new Date();
    return Math.round((new Date(y, m - 1, d) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5);
  };
  var rel = function (iso) {
    var d = dayDiff(iso);
    return d < 0 ? (d === -1 ? "yesterday" : Math.abs(d) + " days ago")
      : d === 0 ? "today" : d === 1 ? "tomorrow" : "in " + d + " days";
  };
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var shortDate = function (iso) { var p = iso.split("-").map(Number); return MON[p[1] - 1] + " " + p[2]; };

  function urgPill(iso) {
    var d = (iso === null || iso === undefined) ? null : dayDiff(iso);
    var c, l;
    if (d === null) { c = "low"; l = "Low"; }
    else if (d <= 0) { c = "hot"; l = "Hot"; }
    else if (d <= 2) { c = "high"; l = "High"; }
    else if (d <= 5) { c = "normal"; l = "Normal"; }
    else { c = "low"; l = "Low"; }
    return '<span class="st st-' + c + '">' + (c === "hot" ? FIRE : "") + l + '</span>';
  }

  /* ---- seed data: internal-form labels, placeholder parties ---- */
  var CO = "coordinator", CL = "client";
  var r = function (label, due, owner, status) {
    return { task_id: "x", label: label, label_source: "name", due: due, owner: owner, status: status || "upcoming" };
  };
  var fill = function (n, mk) { return Array.from({ length: n }, function (_, i) { return mk(i); }); };

  var BUCKETS = [
    {
      key: "secure_intake", title: "Secure intake", lede: "Everything you've sent us, and what's still open.",
      card: { k: "Documents", n: "Across 2 accounts and 8 filings" }, urgency_date: null, count: 26,
      rows: [
        r("Record — 2026-08-13 — Your Bank — Signature Card, Corporate Resolutions & Beneficial Ownership Certification (Produced In Response To Form 6639 Summons, Pages 1–7)", "2026-08-13", CO, "active"),
        r("Record — 2026-08-12 — Your Bank — Monthly Statement Package, Account …2432, January 2024 Through December 2025 (24 Of 24 Received)", "2026-08-12", CO, "active"),
        r("Record — 2026-08-11 — {{Client Name}} — Federal Form 941 Employer's Quarterly Return, 2023 Q3 Through 2025 Q4", "2026-08-11", CO, "active"),
        r("Record — 2026-08-10 — {{Client Name}} — Depository Agreement And Account Opening Disclosures, Account …5925", "2026-08-10", CL, "active"),
        r("Record — 2026-08-09 — {{Client Name}} — Prior-Year Return Transcript Request Authorization", "2026-08-09", CO, "active")
      ].concat(fill(21, function (i) {
        var day = String(28 - Math.floor(i / 2)).padStart(2, "0");
        return r("Record — 2026-07-" + day + " — Your Bank — Deposit Detail Reconciliation Worksheet, Batch " + (i + 1) + " Of 24 (Statement Totals Tied To Ledger)", "2026-07-" + day, CO, "closed");
      }))
    },

    {
      key: "deadlines", title: "Deadlines", lede: "Hard dates. These do not move.",
      card: { k: "Deadlines", n: "Nearest date drives the flag" }, urgency_date: "2026-08-19", count: 7,
      rows: [
        r("Deadline — 2026-08-19 — IRS — Petition To Quash Window Closes (Twenty Days From Summons Notice)", "2026-08-19", CO, "inprogress"),
        r("Deadline — 2026-08-20 — {{Client Name}} — Representation Documents Must Be On File Before The Examination Window Opens", "2026-08-20", CL, "upcoming"),
        r("Deadline — 2026-08-22 — IRS — May Begin Examining Summoned Bank Records (§7609 23-Day Mark)", "2026-08-22", CO, "upcoming"),
        r("Deadline — 2026-09-01 — Your Bank — Summons Appearance And Production, 9:00a PT", "2026-09-01", CO, "upcoming"),
        r("Deadline — 2026-09-15 — IRS — Quarterly Estimated Payment Due For The Current Tax Year", "2026-09-15", CL, "upcoming"),
        r("Deadline — 2026-10-15 — IRS — Extended Return Filing Deadline For The 2025 Tax Year", "2026-10-15", CO, "upcoming"),
        r("Deadline — 2026-11-02 — {{Client Name}} — Annual Records Retention Review And Sign-Off", "2026-11-02", CL, "upcoming")
      ]
    },

    {
      key: "work_items", title: "Work items", lede: "What we're doing. Nothing here is waiting on you.",
      card: { k: "Work items", n: "31 in progress, 5 on hold" }, urgency_date: "2026-08-22", count: 36,
      rows: [
        r("Work Item — 2026-08-18 — {{Client Name}} — Draft Petition To Quash Third-Party Summons And Supporting Declaration For Filing", "2026-08-18", CO, "inprogress"),
        r("Work Item — 2026-08-18 — {{Client Name}} — Reconcile Gross Receipts Per Bank Deposits Against Reported Receipts, 2023 Through 2025", "2026-08-20", CO, "inprogress"),
        r("Work Item — 2026-08-17 — {{Client Name}} — Cost Of Goods Sold Allocation Review Under §280E Including Inventory Absorption Method", "2026-08-24", CO, "inprogress"),
        r("Work Item — 2026-08-17 — {{Client Name}} — Penalty Abatement Exposure Memo, Failure To Deposit And Failure To Pay", "2026-08-26", CO, "hold"),
        r("Work Item — 2026-08-16 — IRS — Request Complete Account Transcripts For All Open Periods", "2026-08-21", CO, "inprogress")
      ].concat(fill(31, function (i) {
        var day = String(15 - Math.floor(i / 4)).padStart(2, "0");
        var due = String(23 + (i % 6)).padStart(2, "0");
        return r("Work Item — 2026-08-" + day + " — {{Client Name}} — Categorize Statement Transactions To Chart Of Accounts, Month " + (i + 1) + " Of 24, And Flag Owner Draws For Review", "2026-08-" + due, CO, i % 7 === 0 ? "hold" : "inprogress");
      }))
    },

    {
      key: "correspondence", title: "Correspondence", lede: "Letters, notices and summonses on this matter.",
      card: { k: "Received", n: "2 summonses, 2 letters, 0 notices" }, urgency_date: "2026-08-25", count: 26,
      rows: [
        r("Summons — 2026-07-30 — IRS — Form 6639 Financial Records Summons Served On Your Bank For Accounts …2432 And …5925", "2026-07-30", CO, "active"),
        r("Letter — 2026-08-13 — Your Bank — Notice Of Records Produced To The Revenue Officer With Itemized Page Index", "2026-08-13", CO, "active"),
        r("Letter — 2026-08-06 — IRS — Third-Party Contact Notice Under §7602(c) Identifying The Financial Institution", "2026-08-06", CO, "active"),
        r("Summons — 2026-07-30 — IRS — Duplicate Service Copy Retained For The Petition Record", "2026-07-30", CO, "closed"),
        r("Letter — 2026-08-25 — {{Client Name}} — Draft Response Letter To The Revenue Officer, Awaiting Your Review Before It Is Sent", "2026-08-25", CL, "upcoming")
      ].concat(fill(21, function (i) {
        var day = String(27 - i).padStart(2, "0");
        return r("Correspondence — 2026-06-" + day + " — Your Bank — Routine Account Notice, Item " + (i + 1) + " (Filed To The Matter Record, No Action Required)", "2026-06-" + day, CO, "closed");
      }))
    },

    {
      key: "client_requests", title: "What we need from you", lede: "Four items. Message or book a call with any question.",
      card: { k: "Open requests", n: "3 done, 1 still open" }, urgency_date: null, count: 4,
      rows: [
        r("Client Request — 2026-08-10 — {{Client Name}} — Accounts And Portal Access (Next Steps Item 1, Completed 2026-08-17)", "2026-08-17", CL, "active"),
        r("Client Request — 2026-08-10 — {{Client Name}} — Diagnostic Payment (Next Steps Item 2, Completed 2026-08-17)", "2026-08-17", CL, "active"),
        r("Client Request — 2026-08-10 — {{Client Name}} — Power Of Attorney Form 2848 Signed Page Received, Being Finalized And Filed With The IRS (Next Steps Item 3)", "2026-08-18", CL, "active"),
        r("Client Request — 2026-08-10 — {{Client Name}} — Bank Contact And Document Tracking: Forward Anything Your Bank Sends The Revenue Officer (Next Steps Item 5)", null, CL, "upcoming")
      ],
      ctas: true
    }
  ];

  var ST_LABEL = { active: "Active", upcoming: "Upcoming", inprogress: "In progress", hold: "On hold", closed: "Closed" };
  var AV = { coordinator: "JW", client: "YOU" };
  var OWN_LABEL = { coordinator: "Coordinator", client: "You" };

  function rowHTML(x) {
    var when = x.due
      ? '<span class="when"><b>' + shortDate(x.due) + '</b>' + rel(x.due) + '</span>'
      : '<span class="when none">No due date</span>';
    /* The status pill is omitted entirely when the row carries no status.
       An empty pill would collapse the row grid, and a default would be an
       invention. When the field starts arriving this renders on its own. */
    var st = x.status
      ? '<span class="st st-' + x.status.replace(/\s/g, "") + '">' + (ST_LABEL[x.status] || x.status) + '</span>'
      : '';
    return '<a class="row' + (x.label_source === "name" ? " raw" : "") + '" href="#" '
      + 'title="' + x.label.replace(/"/g, "&quot;") + '">'
      + st
      + '<span class="m"><span class="t">' + x.label + '</span></span>'
      + '<span class="own ' + (x.owner === "client" ? "client" : "") + '"><span class="av">' + (AV[x.owner] || "") + '</span>'
      + (OWN_LABEL[x.owner] || "") + '</span>' + when + '</a>';
  }

  var CTAS = '<div class="ctas">'
    + '<a class="card cta" href="#"><div class="k">Book a call →</div>'
    + '<div class="n">Thirty minutes with your coordinator, video or phone. Pick any open slot.</div></a>'
    + '<a class="card cta" href="#"><div class="k">Message us →</div>'
    + '<div class="n">Secure messaging inside your portal. Quicker than email for a short question.</div></a></div>';

  function render(state) {
    var empty = state === "empty";
    var root = document.getElementById("vld");
    var secs = document.getElementById("vld-secs");
    /* No-op on any page that does not carry the fragment. */
    if (!root || !secs) return;

    root.dataset.state = state;
    secs.innerHTML = BUCKETS.map(function (b) {
      var rows = empty ? [] : b.rows, count = empty ? 0 : b.count;
      var body = rows.length
        ? '<div class="rows">' + rows.map(rowHTML).join("") + '</div>'
          + (rows.length > 5 ? '<button class="more" type="button">Show all ' + rows.length + '</button>' : '')
        : '<div class="mt"><b>Nothing outstanding</b>We\'ll add items here as they come up.</div>';
      /* The note line is omitted when there is no text for it. The empty
         state keeps its own note. */
      var note = empty ? "Nothing open right now" : (b.card && b.card.n);
      return '<section class="sec" data-bucket="' + b.key + '">'
        + '<div class="sechd"><div class="secmeta"><h3>' + b.title + '</h3><p class="lede">' + b.lede + '</p></div>'
        + '<div class="card sum"><div class="k">' + b.card.k + '</div><div class="v">' + count + '</div>'
        + (note ? '<div class="n">' + note + '</div>' : '')
        + '<div class="cs">' + urgPill(empty ? null : b.urgency_date) + '</div></div></div>'
        + body + (b.ctas && !empty ? CTAS : '') + '</section>';
    }).join("");

    /* The container ships hidden so an unresolved fragment renders nothing
       and the portal's own content stays in place. Reveal only once there
       is something to show. */
    root.hidden = false;
  }

  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) return;
    /* Anchored to #vld: portal chrome using the same class names must not
       be intercepted. Live measurement found .card, .row and .btn already
       present on the target page. */
    var more = e.target.closest("#vld .more");
    if (more) {
      var sec = more.closest(".sec");
      var open = sec.classList.toggle("open");
      var n = sec.querySelectorAll(".row").length;
      more.textContent = open ? "Show fewer" : "Show all " + n;
      return;
    }
    if (e.target.closest('#vld a[href="#"]')) e.preventDefault();
  });

  function bind() { render("full"); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
