/* ---------------------------------------------------------------------
   client-dashboard.js
   Source:     portal/_source/dashboard-fragment.raw.html (R147)
   Ported:     2026-08-20
   Updated:    2026-08-20 (R148) - seed data replaced with a live fetch
               2026-08-20 (R149) - every payload value that reaches HTML
               is escaped. See esc() and the R149 note below.
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

   R149 - ESCAPING
     R148 wired the renderer to live data, which turned an inert string
     concat into a stored-XSS sink: row labels are real ClickUp task
     names, and client_requests rows can carry text a client submitted.
     Every value that reaches innerHTML from the response now goes
     through esc(). The full list, and where each lands:
       row.label       -> title attribute and the .t span
       row.status      -> the st-* class token and the pill text
       row.owner       -> only via AV[] / OWN_LABEL[] lookups, whose
                          values are literals in this file; escaped
                          anyway so the rule needs no exception
       card.label      -> b.k, the summary card's .k
       card.count      -> b.count, the .v (type-guarded to a number)
       card.note       -> b.note, the .n
       row.due         -> NOT escaped. shortDate/rel parse it with
                          map(Number), so only numbers reach the string.
                          R151 additionally gates it on isCalendarDate,
                          so only a real date is ever formatted at all.
     Section copy (b.key / b.title / b.lede) is BUCKET_DEFS in this
     file, not payload, and stays unescaped.

   R150 - RENDERING DEFECTS
     a. ST_LABEL covers five of the eight statuses the API can emit.
        archive, inactive and template had no entry and no CSS class, so
        the first archived task would have rendered an unstyled pill
        labelled "undefined". stLabel now derives a label from the slug
        and anything ST_LABEL does not own also carries st-other, which
        the stylesheet gives a muted, settled treatment.
     b. A malformed urgency_date produced NaN, which failed every
        comparison in the ladder and landed on "Low" - the least alarming
        tier. It now renders an explicit, visibly off-ladder "Unknown"
        and warns once. Genuine absence (null) still reads "Low"; that is
        a real answer, not a parse failure.
     c. AV.coordinator was "JW". See the note on AV.
     d. The client_requests lede claimed "Four items". Live data would
        contradict it, so the count is gone from the sentence.

   R151 - THE DUE-DATE GUARD
     rowHTML formatted row.due with no validity check. A malformed value
     did not fail loudly; it failed plausibly. See isCalendarDate and the
     `when` branch in rowHTML - both carry the measured cases.
   --------------------------------------------------------------------- */

(function () {
  var DASHBOARD_ENDPOINT = "https://api.virtuallaunch.pro/v1/green/portal-dashboard";

  var FIRE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2s1.5 3.2-.8 5.6C8.6 10.3 7 12 7 14.6 7 18.1 9.7 21 13 21s5.5-2.6 5.5-6' +
    'c0-3.4-2.3-5.1-3.4-7.6-.4 1.2-1.2 2-2.2 2.6.6-2.4-.3-5.5-.9-8z"/></svg>';

  /* R149 - HTML escaping.
     Copied verbatim from esc() in portal/green-service.js. The two MUST
     stay byte-identical: there is no module system on these portal pages
     (each bundle is a standalone IIFE pasted into a Custom JS field), so
     the only way to share it is to duplicate it. If you change one, change
     the other in the same commit. Order matters - & is replaced first so
     the entities the later passes emit are never double-escaped.
     Every value that reaches HTML from the endpoint response goes through
     this. Live ClickUp task names and client-submitted request text both
     land in rowHTML, so an unescaped interpolation here is stored XSS on a
     client-facing page. */
  function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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

  /* R151 - a due date must be readable BEFORE it is formatted. shortDate
     and rel both do split("-").map(Number) with no validity check, so
     garbage used to reach the row as garbage. Measured:
       "not-a-date"  ->  <b>undefined NaN</b> in NaN days
       "2026-08"     ->  <b>Aug undefined</b> in NaN days
       "2026-13-01"  ->  <b>undefined 1</b> in 134 days
     The third is the dangerous one. Month 13 rolls forward into the next
     year and yields a confident, plausible, WRONG relative date - not
     visible garbage a reader would discount, but a deadline they would
     act on. A regex alone passes it, so the shape test is paired with a
     round-trip: construct the local date and confirm every part survives
     unchanged. That is what rejects month 13, day 32 and 30 February. */
  function isCalendarDate(iso) {
    if (typeof iso !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(iso)) return false;
    var p = iso.split("-").map(Number), dt = new Date(p[0], p[1] - 1, p[2]);
    return dt.getFullYear() === p[0] && dt.getMonth() === p[1] - 1 && dt.getDate() === p[2];
  }

  /* One warning per page load, not one per row - a malformed feed would
     otherwise print a line for every row it touched. Same idiom as
     urgWarned below. */
  var dueWarned = false;

  /* One warning per page load, not one per card - five buckets sharing a
     malformed feed would otherwise print five identical lines. */
  var urgWarned = false;

  function urgPill(iso) {
    var c, l;
    if (!iso) {
      /* Genuine absence is a real answer, not a parse failure: nothing is
         scheduled, so Low is honest. Unchanged from R148. */
      c = "low"; l = "Low";
    } else {
      /* A non-string would throw inside dayDiff's split() and take the
         whole render down, so it is treated as unparseable here rather
         than reaching it. dayDiff itself is untouched. */
      var d = (typeof iso === "string") ? dayDiff(iso) : NaN;
      if (isNaN(d)) {
        /* R150 - failing quiet in the reassuring direction is the wrong
           way to fail. NaN fails every comparison in the ladder below and
           used to fall through to "Low", telling a client their deadlines
           were relaxed because we could not read a date. Render an
           explicitly unknown state instead. The date value is never
           logged - only that one could not be parsed. */
        if (!urgWarned) {
          urgWarned = true;
          console.warn('[vld] unparseable urgency date; urgency shown as unknown');
        }
        c = "unknown"; l = "Unknown";
      }
      else if (d <= 0) { c = "hot"; l = "Hot"; }
      else if (d <= 2) { c = "high"; l = "High"; }
      else if (d <= 5) { c = "normal"; l = "Normal"; }
      else { c = "low"; l = "Low"; }
    }
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
      lede: "Message or book a call with any question.", ctas: true }
  ];

  /* Five of the eight statuses the API can emit. archive, inactive and
     template have no entry here on purpose - they are settled states with
     no copy of their own, and stLabel derives a label for them. */
  var ST_LABEL = { active: "Active", upcoming: "Upcoming", inprogress: "In progress", hold: "On hold", closed: "Closed" };

  /* R150 - the coordinator avatar is not a person. It used to read "JW",
     which stamped one operator's initials on every client of every
     reseller install. No name for the assigned coordinator exists in the
     payload or in the page, so there is nothing to derive from; the honest
     answer is a person-agnostic mark. "US" pairs with the client's "YOU"
     and stays true wherever this bundle is installed. The row already
     names the side in full via OWN_LABEL. */
  var AV = { coordinator: "US", client: "YOU" };
  var OWN_LABEL = { coordinator: "Coordinator", client: "You" };

  /* Own-property lookups only. A payload status of "constructor" or
     "toString" would otherwise hit Object.prototype and render a function
     body as the pill text. */
  function owns(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* Status -> CSS class token. Reduced to [a-z0-9-] so an unrecognised
     value can never smuggle anything into the class attribute, and so the
     token stays a token however the upstream slug is punctuated. */
  function stSlug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  /* R150 - a status with no ST_LABEL entry used to render the literal
     string "undefined". Derive a display label from the slug instead:
     "archive" -> "Archive", "in_review" -> "In review". */
  function stLabel(s) {
    if (owns(ST_LABEL, s)) return ST_LABEL[s];
    var w = stSlug(s).replace(/-/g, " ");
    return w ? w.charAt(0).toUpperCase() + w.slice(1) : "Unknown";
  }

  function rowHTML(x) {
    /* x.due is payload but cannot carry markup: shortDate and rel both
       run it through split("-").map(Number), so only numbers (or NaN /
       undefined) ever reach the string. Escaping it would suggest the
       string is attacker-shaped when it is arithmetic.
       R151 - this is the only site where due is formatted. Three ways in:
         genuine absence (null / undefined / "") keeps "No due date". That
           is a real answer - nothing is scheduled - not a parse failure.
         unreadable renders the SAME visible unknown state, never a
           guessed month name and never a day count, because a date we
           cannot read must never render as one we can.
         a real calendar date formats exactly as before.
       The value itself is never logged: it is payload data tied to a
       client, and this console is on a client-facing page. */
    var when;
    if (!x.due) {
      when = '<span class="when none">No due date</span>';
    } else if (!isCalendarDate(x.due)) {
      if (!dueWarned) {
        dueWarned = true;
        console.warn('[vld] unreadable due date; row shown with no due date');
      }
      when = '<span class="when none">No due date</span>';
    } else {
      when = '<span class="when"><b>' + shortDate(x.due) + '</b>' + rel(x.due) + '</span>';
    }
    /* The API sends no status field. The pill is omitted entirely rather
       than defaulted: an invented status would be a claim we cannot
       support, and an empty pill would collapse the row grid. If the
       field starts arriving this renders on its own. */
    /* An unrecognised status carries st-other as well as its own token, so
       it renders as a deliberate muted pill rather than an unstyled
       fragment on the day a task is first archived. */
    var st = '';
    if (x.status) {
      var slug = stSlug(x.status);
      var cls = owns(ST_LABEL, x.status) ? "st-" + slug
        : (slug ? "st-" + slug + " st-other" : "st-other");
      st = '<span class="st ' + esc(cls) + '">' + esc(stLabel(x.status)) + '</span>';
    }
    return '<a class="row' + (x.label_source === "name" ? " raw" : "") + '" href="#" '
      + 'title="' + esc(x.label) + '">'
      + st
      + '<span class="m"><span class="t">' + esc(x.label) + '</span></span>'
      + '<span class="own ' + (x.owner === "client" ? "client" : "") + '"><span class="av">' + esc(owns(AV, x.owner) ? AV[x.owner] : "") + '</span>'
      + esc(owns(OWN_LABEL, x.owner) ? OWN_LABEL[x.owner] : "") + '</span>' + when + '</a>';
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
      /* b.key, b.title and b.lede are BUCKET_DEFS literals in this file,
         never payload - the API sends no section copy. b.k, b.count and
         b.note ARE payload-backed (card.label / card.count / card.note),
         so they are escaped even where a type guard already makes them
         safe: the invariant worth having is "nothing from the response
         reaches innerHTML without esc()", checkable by grep. */
      return '<section class="sec" data-bucket="' + b.key + '">'
        + '<div class="sechd"><div class="secmeta"><h3>' + b.title + '</h3><p class="lede">' + b.lede + '</p></div>'
        + '<div class="card sum"><div class="k">' + esc(b.k) + '</div><div class="v">' + esc(b.count) + '</div>'
        + (note ? '<div class="n">' + esc(note) + '</div>' : '')
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
