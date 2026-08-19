# Green Service Portal App — Extraction Record

**Rev:** R138
**Task:** ClickUp `86e2wary1` — VLP — SuiteDash — Client Dashboard Architecture and Worker
**Date:** 2026-08-19
**Page:** `https://app.virtuallaunch.pro/portal/dashboard/view/171363`
**Status:** ⚠️ **PARTIAL CAPTURE — NOT A ROLLBACK SOURCE. NOT SAFE TO SERVE.**

---

## 1. Read this first

This extraction did **not** get the authored Embed Block source. The operator
confirmed that the SuiteDash admin editor does not expose it. What we have is a
**transcription of a chat paste**, and it is deficient in three known ways:

| Deficiency | Evidence | Consequence |
|---|---|---|
| **Truncated** | Paste cut at a 50,000-char message ceiling, mid-expression inside `stepHtml()` | ~40% of the script is missing |
| **Function deficit** | 14 of 24 functions present | The live phase fetch, the render/paint path, event wiring, and init are all absent |
| **Entity decoding in transit** | `esc()` reads `.replace(/&/g, '&')` — a no-op | The authored source almost certainly has `'&amp;'`; the paste decoded it |

`node --check portal/green-service.js` **fails** with `SyntaxError: Unexpected
end of input` at line 294. That is the truncation, stated by the parser.

**Therefore:**

- ❌ **Do not paste `_source/green-service-embed.partial.html` back into SuiteDash.** It would replace a working page with a broken one.
- ❌ **Do not apply a `<script src>` stub pointing at `portal/green-service.js`.** The file cannot parse; the entire app would die on load.
- ❌ **This is not the revert point the task was after.** It does not yet exist.
- ✅ It *is* a faithful, reviewable record of the complete design system and the first 14 functions, and a correct starting point once the remainder arrives.

The paste-back stub (task step B4) was **deliberately not created.** Its only
function is to activate a file that provably does not parse. It belongs in the
completion prompt, alongside a JS file that passes `node --check`.

### What would complete this

The remainder of the `<script>`, picked up from where the paste cut:

```js
banner = '<p class="vl-body" style="margin-bottom:18px;"><b class="vl-hero-accent">' + (who ? esc(who)
```

through the closing `})();`. Roughly 9–10 KB. Delivered in two chat messages it
clears the ceiling comfortably. Once merged, re-run the inventories here; the
function count must reach 24 and `node --check` must pass before any stub ships.

---

## 2. Provenance and byte accounting

| File | Bytes | Chars | Role |
|---|---:|---:|---|
| `portal/_source/green-service-embed.partial.html` | 40,559 | 40,460 | Capture baseline (partial) |
| `portal/green-service.css` | 24,879 | 24,873 | Complete — see §3 |
| `portal/green-service.js` | 15,654 | 15,561 | **Partial** — 14/24 functions |

**Split point:** line 876 (`</style>`) / line 877 (`<script>`).
CSS is lines 2–875. JS is line 878 to EOF. There is **no closing `</script>`** —
the capture ends before it.

**Losslessness of the split** (the one contract that does hold):

```
raw   : 40460
css   : 24873
js    : 15561
c+j   : 40434
delta : 26
raw.Contains(css) = true
raw.Contains(js)  = true
```

Delta of 26 chars is fully accounted: `<style>\n` (8) + `</style>\n` (9) +
`<script>\n` (9) = 26. Nothing else was dropped by the split.

**Character parity** (no encoding corruption across the split):

| Char | CSS | JS | Raw | Sum matches |
|---|---:|---:|---:|:--:|
| U+2014 em-dash | 3 | 37 | 40 | ✅ |
| U+00A0 nbsp | 0 | 1 | 1 | ✅ |
| U+00A7 section | 0 | 6 | 6 | ✅ |

### Known deviation: escape sequences resolved

The authored source writes non-ASCII characters as `\uXXXX` escapes inside JS
string literals (`—`, `§`, `’`, `·`, `×`, ` `).
In this capture they are stored as the **literal characters**. This is a
byte-level difference and a **runtime no-op** — `'—'` and `'—'` are the
same string to a JS engine, and `/ /g` and `/<NBSP>/g` are the same regex.
Recorded so a future byte-diff against a real source does not read as damage.

### Scrub — clean

```
grep -nE 'push-engine|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'  → no output
grep -nE '@[A-Za-z0-9.-]+\.(com|net|org|pro)|phone patterns'                          → no output
```

No credentials, no resolved UUIDs, no `data-push-engine-token`, no PII. The
capture references merge-code attribute *names* only. Safe to serve publicly —
which matters, because Netlify does serve it.

---

## 3. Inventory

Generated from the files, not transcribed.

### `@media` conditions — 4, complete

```
@media (max-width: 1180px)
@media (max-width: 900px)
@media (max-width: 700px)
@media (max-width: 420px)
```

### id selectors — 4, complete

Raw naive `#`-token scan returns 15 tokens; 11 are hex colour literals
(`#111111 #252525 #e07a00 #eeeeee #f4f4f4 #f5f5f5 #ff5a2c #ff6a1a #ff7a50
#ff9a1f #ffffff`). Filtering those leaves exactly:

```
#vl-hero  #vl-hero-body  #ea-cart-root  #ea-order-root
```

Matches the four ids confirmed by live capture — a strong signal the CSS half
is complete and faithful.

### class selectors — 42 unique

```
.ea-hero-copy .vl-body .vl-cta-link .vl-divider .vl-dot .vl-greeting
.vl-hero-accent .vl-hero-title .vl-hint .vl-layout .vl-list .vl-list-item
.vl-main .vl-main-inner .vl-page .vl-pcard .vl-pcard-active .vl-pcard-bar
.vl-pcard-link .vl-pcard-meta .vl-pcard-service .vl-progress-bar
.vl-progress-bar-fill .vl-progress-steps-7 .vl-rail .vl-rail-cards
.vl-rail-title .vl-section-title .vl-sidebar .vl-sidebar-eyebrow
.vl-sidebar-header .vl-sidebar-progress .vl-sidebar-title .vl-step
.vl-step-active .vl-step-content .vl-step-current .vl-step-description
.vl-step-done .vl-step-label .vl-step-num .vl-subhead
```

CSS brace balance: **96 open / 96 close** — structurally complete.

### function names — 14 of 24 ❌

Present:

```
accent  attr  clean  clientFirst  clientOrg  esc  list
overviewBody  overviewLead  overviewTitle  paintGreeting
shortDate  stepHtml (truncated mid-body)  timeOfDay
```

Missing: **10 functions.** Not enumerable — they lie past the cut. From the
names referenced by surviving code and the live-capture description, the
absent set includes at minimum the phase fetch against `PHASE_ENDPOINT`, the
step render/paint path, the engagement-rail card builder, the click/keyboard
event wiring, and the init/bootstrap call.

---

## 4. Delivery chain (confirmed live)

`precious-lily-bbe555.netlify.app` serves onto this page:

- `lentax-vlp.js` — VLP per-theme loader (FOUC preload-swap IIFE), stamps `body.lentax-vlp`
- `lentax-base.css` — master stylesheet
- `themes/vlp-default.css` — VLP palette overrides, loaded second so theme tokens win

The Green Service app currently reaches the page as **inline `<style>` +
`<script>` in a single SuiteDash Embed Block** — 51,627 chars per live DOM
capture (26,644 style / 24,830 script). Nothing in this repo serves it yet.

**Live mount box:** `#vl-hero-body.vl-main-inner` measures **831.17px**, zero
padding, no max-width, at a 2174px viewport.

---

## 5. Known defects — recorded, NOT fixed

Each is a separate prompt with its own revert boundary.

### 5.1 Duplicate `id="vl-hero"` — confirmed, high impact

Two elements share `id="vl-hero"`: one in the markup Text Block, one in the
layout Text Block. `document.getElementById('vl-hero')` returns the first,
which carries only `data-client-uid`. So `attr()` misses its attribute branch
on **every** load and the page runs entirely on the hidden-span `#vl-mt-*`
fallback. The attribute path is dead code in production.

Visible in the surviving source at `attr()`:

```js
var hero = document.getElementById('vl-hero');
var v = clean(hero && hero.getAttribute(name));   // always empty in production
```

### 5.2 `esc()` is a no-op as captured — **verify before anything else**

```js
function esc(v) {
  return String(v)
    .replace(/&/g, '&')      // ← replaces & with &
    .replace(/</g, '<')      // ← replaces < with <
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}
```

Every replacement is character-to-itself. If the authored source reads this
way, `esc()` provides **zero** escaping and every call site is an HTML
injection path — `clientFirst()`, `clientOrg()`, and `timeOfDay()` all flow
into `innerHTML` via `paintGreeting()`, and those values originate in
client-controlled CRM fields.

**Most likely a transit artifact** (`&amp;` → `&` decoded by the chat relay),
since the author used `\uXXXX` escapes elsewhere specifically to survive
encoding. But it cannot be confirmed from what we have. **This is the single
highest-priority item to check against the real source.**

### 5.3 Unhardened phase fetch

`PHASE_ENDPOINT = "https://api.virtuallaunch.pro/v1/green/portal-phase"` — the
call site is past the truncation, but live capture confirms no timeout and no
`AbortController`. A hung request leaves `livePhase = 0` indefinitely; the
`userInteracted` guard suggests the author already knew the fetch can be slow.

### 5.4 Phase endpoint auth posture

`/v1/green/portal-phase` is called from a client-facing page. Whether it
authenticates the caller, and what it discloses to an unauthenticated one, is
unreviewed.

### 5.5 `§8275-R` — wrong symbol

`overviewBody()` renders "A COGS workpaper and §8275-R disclosure". 8275-R is
a **Form**, not a code section. Reads as an error to a tax-literate client, and
this is client-facing sales copy. Contrast the same file's correct usage of
`§280E`, `§471`, `§471(c)` and its correct "Form 8275-R" elsewhere.

### 5.6 Hardcoded cross-portal dashboard ids

`171391` (Risk Review) and `171081` (next engagement) are baked into `STEPS`
copy and `overviewBody()`. Not a defect today; a silent-breakage hazard when
those pages are renumbered.

### 5.7 `livePhase >= 8` magic sentinel

`8` means "complete" against a 7-step model, with no named constant. Works;
undocumented at the call site.

### 5.8 `stepHtml()` builds HTML by string concatenation

Combined with 5.2, the sanitisation posture of the whole render path needs one
deliberate review rather than per-site patching.

---

## 6. Change log

| Date | Rev | Change |
|---|---|---|
| 2026-08-19 | R138 | Initial partial capture. CSS complete (96/96 braces, 4/4 ids, 4/4 media queries, 42 classes). JS 14/24 functions, does not parse. Stub deliberately withheld. |
