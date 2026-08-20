/* ---------------------------------------------------------------------
   client-dashboard.js
   Source:     portal/_source/dashboard-fragment.raw.html (R147)
   Ported:     2026-08-20
   Updated:    2026-08-20 (R148) - seed data replaced with a live fetch
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

   R148 - THE DATA PATH
     The fragment's hardcoded BUCKETS array is gone. BUCKET_DEFS below
     keeps only what the API does not send: bucket order, section title,
     lede, the default card label, and which bucket carries the CTA pair.
     Everything else - count, urgency_date and rows - comes from the
     endpoint. The renderer itself is unchanged.

     Two fields the fragment expects that the API does not send:
       row.status  - omitted entirely rather than defaulted. See rowHTML.
       card note   - omitted entirely rather than invented. See render.
     Both are written so that if the field starts arriving it renders on
     its own, with no further change here.

     One request, no polling, no retry, no interval, no storage. The uid
     is resolved exactly as green-service.js resolves it, through the
     same two-source attribute-then-text-node shape, because SuiteDash
     resolves merge tags in text nodes more reliably than in attributes.

     Diagnostics are [vld]-prefixed and deliberately thin: this console
     is on a client-facing page, so no line here ever carries the uid,
     the assembled URL, the query string, or any payload field.
   --------------------------------------------------------------------- */

(function () {
  var DASHBOARD_ENDPOINT = "https://api.virtuallaunch.pro/v1/green/portal-dashboard";

  var FIRE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2s1.5 3.2-.8 5.6C8.6 10.3 7 12 7 14.6 7 18.1 9.7 21 13 21s5.5-2.6 5.5-6' +
    'c0-3.4-2.3-5.1-3.4-7.6-.4 1.2-1.2 2-2.2 2.6.6-2.4-.3-5.5-.9-8z"/></svg>';

  /* Calendar-day arithmetic in the reader's own timezone. Constructed
     local dates, never elapsed milliseconds - elapsed ms ran the
     countdown a day off. Do not rewrite. */
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
    var d = iso ? dayDiff(iso) : null;
    var c, l;
    if (d === null) { c = "low"; l = "Low"; }
    else if (d <= 0) { c = "hot"; l = "Hot"; }
    else if (d <= 2) { c = "high"; l = "High"; }
    else if (d <= 5) { c = "normal"; l = "Normal"; }
    else { c = "low"; l = "Low"; }
    return '<span class="st st-' + c + '">' + (c === "hot" ? FIRE : "") + l + '</span>';
  }

  /* Bucket order, titles and ledes are the fragment's own, preserved
     verbatim. The API sends no section copy, only counts and rows. */
  var BUCKET_DEFS = [
    { key: "secure_intake", title: "Secure intake", k: "Documents",
      lede: "Everything you've sent us, and what's still open." },
    { key: "deadlines", title: "Deadlines", k: "Deadlines",
      lede: "Hard dates. These do not move." },
    { key: "work_items", title: "Work items", k: "Work items",
      lede: "What we're doing. Nothing here is waiting on you." },
    { key: "correspondence", title: "Correspondence", k: "Received",
      lede: "Letters, notices and summonses on this matter." },
    { key: "client_requests", title: "What we need from you", k: "Open requests",
      lede: "Four items. Message or book a call with any question.", ctas: true }
  ];

  var ST_LABEL = { active: "Active", upcoming: "Upcoming", inprogress: "In progress", hold: "On hold", closed: "Closed" };
  var AV = { coordinator: "JW", client: "YOU" };
  var OWN_LABEL = { coordinator: "Coordinator", client: "You" };

  function rowHTML(x) {
    var when = x.due
      ? '<span class="when"><b>' + shortDate(x.due) + '</b>' + rel(x.due) + '</span>'
      : '<span class="when none">No due date</span>';
    /* The API sends no status field. The pill is omitted entirely rather
       than defaulted: an invented status would be a claim we cannot
       support, and an empty pill would collapse the row grid. If the
       field starts arriving this renders on its own. */
    var st = x.status
      ? '<span class="st st-' + String(x.status).replace(/\s/g, "") + '">' + (ST_LABEL[x.status] || x.status) + '</span>'
      : '';
    return '<a class="row' + (x.label_source === "name" ? " raw" : "") + '" href="#" '
      + 'title="' + String(x.label).replace(/"/g, "&quot;") + '">'
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

  /* buckets: one entry per BUCKET_DEFS entry, already merged with the
     response. state: "full" | "empty" | "stale". */
  function render(state, buckets) {
    var empty = state === "empty";
    var root = document.getElementById("vld");
    var secs = document.getElementById("vld-secs");
    /* No-op on any page that does not carry the fragment. */
    if (!root || !secs) return;

    root.dataset.state = state;
    secs.innerHTML = buckets.map(function (b) {
      var rows = b.rows || [];
      var body = rows.length
        ? '<div class="rows">' + rows.map(rowHTML).join("") + '</div>'
          + (rows.length > 5 ? '<button class="more" type="button">Show all ' + rows.length + '</button>' : '')
        : '<div class="mt"><b>Nothing outstanding</b>We\'ll add items here as they come up.</div>';
      /* The API sends no note text for the summary card, and the
         fragment's notes were hand-written strings that are not derivable
         from count and urgency_date. The line is omitted rather than
         invented; the CSS keeps the card looking deliberate without it.
         The empty state keeps its own note. */
      var note = empty ? "Nothing open right now" : b.note;
      return '<section class="sec" data-bucket="' + b.key + '">'
        + '<div class="sechd"><div class="secmeta"><h3>' + b.title + '</h3><p class="lede">' + b.lede + '</p></div>'
        + '<div class="card sum"><div class="k">' + b.k + '</div><div class="v">' + b.count + '</div>'
        + (note ? '<div class="n">' + note + '</div>' : '')
        + '<div class="cs">' + urgPill(empty ? null : b.urgency_date) + '</div></div></div>'
        + body + (b.ctas && !empty ? CTAS : '') + '</section>';
    }).join("");

    /* The container ships hidden so an unresolved fragment renders nothing
       and the portal's own content stays in place. Reveal only once there
       is something to show. */
    root.hidden = false;
  }

  /* Merge tags arrive as DOM attributes, never as JS string literals -
     an apostrophe in a name would break a literal, and an unresolved tag
     would render as {{...}}. Same shape as green-service.js. */
  function clean(v) {
    if (!v) return '';
    v = String(v).replace(/ /g, ' ').trim();
    if (!v || v.indexOf('{{') === 0) return '';
    return v;
  }

  /* Two sources, because SuiteDash resolves merge tags in text nodes more
     reliably than in attributes. Attribute first, hidden span second.
     Whichever the page supports, one of them lands. Identical to
     green-service.js: the uid must resolve the same way in both bundles
     or the two views would disagree about who the reader is. */
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

  function buildBuckets(d) {
    var byId = {};
    var cards = (d && d.cards) || [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i] && cards[i].id) byId[cards[i].id] = cards[i];
    }
    var rowsByBucket = (d && d.rows) || {};

    return BUCKET_DEFS.map(function (def) {
      var card = byId[def.key] || {};
      var rows = rowsByBucket[def.key] || [];
      return {
        key: def.key,
        title: def.title,
        lede: def.lede,
        ctas: def.ctas,
        /* The card label is data when the endpoint sends it; the static
           label is the fallback, not an override. */
        k: card.label || def.k,
        count: (typeof card.count === "number") ? card.count : rows.length,
        urgency_date: card.urgency_date || null,
        /* No note data exists upstream. Present so the omission in
           render() is one named field rather than a silent gap. */
        note: card.note || "",
        rows: rows
      };
    });
  }

  function loadDashboard() {
    if (!document.getElementById("vld")) return;

    var c = attr('data-client-uid', 'vl-mt-uid');

    /* Unresolved merge tag or no client context: render nothing and leave
       the portal's own content in place. The uid itself is never logged -
       only that none resolved. */
    if (!c) {
      console.warn('[vld] no client uid; dashboard not rendered');
      return;
    }

    /* No timeout would leave a hung endpoint unresolved forever: the catch
       never fires, so the fragment sits hidden with nothing to show that
       anything failed. An abort takes the same degraded path as any other
       failure, and the error name makes a timeout tellable apart.
       credentials: 'omit' is deliberate - the endpoint does not
       authenticate by session, so cookies must not go cross-origin. */
    var ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 8000) : 0;
    var opts = { credentials: 'omit' };
    if (ctl) opts.signal = ctl.signal;

    fetch(DASHBOARD_ENDPOINT + '?c=' + encodeURIComponent(c), opts)
      .then(function (r) {
        clearTimeout(timer);
        /* A 500 or 404 resolves the promise, so the catch never fires and
           the fragment would stay hidden with nothing in the console.
           Status only: never the body, the URL, or the query string. */
        if (!r.ok) {
          console.warn('[vld] dashboard endpoint returned', r.status, r.statusText);
          return null;
        }
        return r.json();
      })
      .then(function (d) {
        if (!d) return;

        /* An error envelope arrives with a 200. Only the error code is
           logged - never the message, which can quote payload values. */
        if (d.error) {
          console.warn('[vld] dashboard endpoint reported error code:', d.error);
          return;
        }

        var buckets = buildBuckets(d);

        var total = 0;
        for (var i = 0; i < buckets.length; i++) {
          total += buckets[i].count + buckets[i].rows.length;
        }

        var state = total === 0 ? "empty" : (d.stale ? "stale" : "full");
        render(state, buckets);
      })
      .catch(function (err) {
        clearTimeout(timer);
        /* The portal stays fully usable without the endpoint. Log the
           error only: never the client uid, the query string, or any
           payload field, because this console is on a client-facing
           page. */
        console.warn('[vld] dashboard load failed:', err);
      });
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDashboard);
  } else {
    loadDashboard();
  }
})();
