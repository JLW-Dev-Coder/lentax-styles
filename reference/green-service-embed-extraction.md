# Green Service Portal App — Extraction Record

**Rev:** R139 (supersedes R138)
**Task:** ClickUp `86e2wary1` — VLP — SuiteDash — Client Dashboard Architecture and Worker
**Date:** 2026-08-19
**Page:** `https://app.virtuallaunch.pro/portal/dashboard/view/171363`
**Status:** ✅ **COMPLETE AND VERIFIED — safe rollback source, safe to serve.**

---

## 1. Read this first

The source of record is `portal/_source/green-service-embed.raw.html`. It is a
**byte-exact capture of the live Embed Block**, verified against a character
count measured in the same browser session. It is the rollback point: pasting
its contents back into the Embed Block restores the page exactly.

R138's record — a transcription of a chat paste — is superseded. Its
`.partial.html` file was deleted in R139 commit 1 rather than kept alongside
this one; two sources of record is how the wrong one gets used six weeks later.
Git history preserves it.

### Why `<style>`/`<script>` `textContent` is authoritative, not a snapshot

This repo forbids committing serialized page DOM. That prohibition is
**unaffected** by this file, and the distinction is worth stating precisely
because it is the reason this method is safe:

- The prohibition exists because portal chrome carries `data-push-engine-token`
  — a 207-character credential — in **element attributes**.
- `<style>` and `<script>` contents are **text nodes**. They cannot carry
  attributes, so they cannot carry that token.
- Neither element's content is parsed as HTML, and Angular does not rewrite
  them. Their `textContent` is byte-identical to what the browser executes.

So this is authored source read back out, not a rendering of a page. The scrub
in §2 confirms it empirically: zero credential hits, zero UUIDs, zero PII.

### Capture method

`textContent` of each element dumped straight to disk — no clipboard, no chat
relay, no editor round-trip. The capture snippet printed its own character
counts in the same session, and those figures are the verification target.
Reassembly, split, and write were performed at the **byte level**
(`ReadAllBytes`/`WriteAllBytes`), never through a text decode, so no encoding
round-trip could alter a character.

---

## 2. Provenance and byte accounting

| File | Bytes | Chars | Role |
|---|---:|---:|---|
| `portal/_source/green-service-embed.raw.html` | 51,529 | 51,508 | **Source of record / rollback point** |
| `portal/green-service.css` | 26,650 | 26,644 | Complete |
| `portal/green-service.js` | 24,845 | 24,830 | Complete — 24/24 functions, parses |

### Gate 1 — length verification against live measurement

| Stream | At-capture | Measured | Delta |
|---|---:|---:|---:|
| `<style>` | 26,644 | 26,644 | **0** |
| `<script>` | 24,830 | 24,830 | **0** |

Exact equality — no trailing newline was added by the download. No BOM,
LF-only line endings (1,201 LF in CSS, 553 in JS), zero CR.

Both figures are also identical to the prior capture session's, so the
**Embed Block has not been edited in SuiteDash since that session** — dump
fidelity and source stability are independently confirmed.

### Reassembly shape and delta

Both dumps carry their own leading and trailing newlines — the whitespace
that sat inside the tags in the live block. So the wrapper is exactly the four
tags plus two separating newlines, and reassembly reproduces the block byte for
byte:

```
"<style>" + style + "</style>\n<script>" + script + "</script>\n"
```

```
raw   : 51508
css   : 26644
js    : 24830
c+j   : 51474
delta : 34
raw.Contains(css) = True
raw.Contains(js)  = True
```

Delta of 34 accounted character by character:
`<style>` (7) + `</style>` (8) + `\n` (1) + `<script>` (8) + `</script>` (9) +
`\n` (1) = **34**. Nothing else.

**This check is non-circular**, unlike R138's. There, `raw.Contains(css)` only
proved the split was faithful to the transcription — nothing tested the
transcription against the source. Here the raw file is itself verified against
an independent live measurement first, so containment inherits that guarantee.

### Character parity

| Char | CSS | JS | Raw | Sum matches |
|---|---:|---:|---:|:--:|
| U+2014 em-dash | 3 | 7 | 10 | ✅ |
| U+00B7 middle dot | 0 | 1 | 1 | ✅ |

Byte-vs-char deltas reconcile exactly: CSS 3×U+2014 at 3 bytes each = +6
(26,644 → 26,650); JS 7×U+2014 (+14) plus 1×U+00B7 (+1) = +15
(24,830 → 24,845).

### `\uXXXX` escapes — R138's "known deviation" resolved

R138 recorded that the authored source writes non-ASCII as `\uXXXX` escapes
while its capture held literal characters, and flagged it so a future byte-diff
would not read as damage. **That is now confirmed and corrected.** The real
source contains 52 escape sequences, preserved here verbatim:

```
35 x \u2014    6 x \u00a7    4 x \u2019    2 x \u00d7
 2 x \u00b7    1 x \u2197    1 x \u2190    1 x \u00a0
```

R138 counted 37 literal em-dashes in a *truncated* file where this one has 7
literals plus 35 escapes — the transcription had resolved them. Escapes are
ground truth and are neither resolved nor re-escaped here.

### Scrub — clean

```
grep -nE 'push-engine|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'  -> no output
grep -nE '@[A-Za-z0-9.-]+\.(com|net|org|pro)'                                         -> no output
```

No credentials, no resolved UUIDs, no `data-push-engine-token`, no PII. Merge-code
attribute *names* only. Safe to serve publicly — which matters, because Netlify
does serve it.

---

## 3. Inventory

Generated from the files, not transcribed.

### `@media` conditions — 4

```
@media (max-width: 1180px)
@media (max-width: 900px)
@media (max-width: 700px)
@media (max-width: 420px)
```

### id selectors — 4

Raw naive `#`-token scan returns 15 tokens; 11 are hex colour literals
(`#111111 #252525 #e07a00 #eeeeee #f4f4f4 #f5f5f5 #ff5a2c #ff6a1a #ff7a50
#ff9a1f #ffffff`). Filtering those leaves exactly:

```
#vl-hero  #vl-hero-body  #ea-cart-root  #ea-order-root
```

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

CSS brace balance: **96 open / 96 close.**

### function names — 24 of 24 ✅

```
accent  overviewTitle  overviewLead  overviewBody  clean  attr
clientFirst  clientOrg  timeOfDay  shortDate  esc  paintGreeting
list  stepHtml  overviewHtml  paintProgress  paintHint  paintSteps
render  applyPhase  paintProjects  pick  loadPhase  bind
```

`node --check portal/green-service.js` — **passes clean.**

JS brace balance by naive regex is 85/83. The imbalance is **not** a defect:
line 196 contains `v.indexOf('{{')` — two literal braces inside a string
literal, the unresolved-merge-tag guard. Real balance is 83/83, which is what
`node --check` confirms. Naive brace counting is reliable for CSS and is not
for JS; the parser is the authority.

---

## 4. Why R138's shortfall went unnoticed — the control that catches it

R138 shipped a CSS file **1,771 characters short of the live source and
reported it complete.** Every structural inventory in §3 matched at the time:
42 class selectors, 4 id selectors, 4 `@media`, 96/96 braces.

That is precisely the failure mode: **those counts all survive whitespace loss.**
An inventory tells you which *things* are present. It cannot tell you that
formatting between them was dropped, and a CSS file missing 1,771 characters of
whitespace still declares every selector it ever did. Structural completeness
and byte completeness are different claims, and R138 proved the first while
reporting the second.

The JS half failed loudly instead — `node --check` caught a 37% truncation
immediately — which is why CSS was the half that slipped through. A silent
check on one half and a loud check on the other is not coverage.

**The control is length verification against a measurement taken at the live
source.** It is the only check in this document that would have caught R138 on
the day. Any future re-capture must carry its at-capture character counts, and
those counts must be compared before anything else is trusted.

---

## 5. Delivery chain (confirmed live)

`precious-lily-bbe555.netlify.app` serves onto this page:

- `lentax-vlp.js` — VLP per-theme loader (FOUC preload-swap IIFE), stamps `body.lentax-vlp`
- `lentax-base.css` — master stylesheet
- `themes/vlp-default.css` — VLP palette overrides, loaded second so theme tokens win

The Green Service app currently reaches the page as **inline `<style>` +
`<script>` in a single SuiteDash Embed Block** — 51,508 chars (26,644 style /
24,830 script), matching this capture exactly.

`portal/green-service.embed-stub.html` is committed to swap that inline block
for two external references. **It is unverified against the SuiteDash
sanitizer** — whether an Embed Block permits `<script src>` and
`<link rel=stylesheet>` has never been tested on this surface. If the sanitizer
strips them, the stub approach is dead and delivery moves into `lentax-vlp.js`
behind a page check. **Rollback in every case is this record's `.raw.html`
contents pasted back verbatim** — which is why it was committed before the stub
existed.

**Live mount box:** `#vl-hero-body.vl-main-inner` measures **831.17px**, zero
padding, no max-width, at a 2174px viewport.

---

## 6. Known defects — recorded, NOT fixed

Each is a separate prompt with its own revert boundary.

### 6.1 Duplicate `id="vl-hero"` — confirmed, high impact

Two elements share `id="vl-hero"`: one in the markup Text Block, one in the
layout Text Block. `document.getElementById('vl-hero')` returns the first,
which carries only `data-client-uid`. So `attr()` misses its attribute branch
on **every** load and the page runs entirely on the hidden-span `#vl-mt-*`
fallback. The attribute path is dead code in production.

```js
var hero = document.getElementById('vl-hero');
var v = clean(hero && hero.getAttribute(name));   // always empty in production
```

### 6.2 `esc()` — R138's no-op was a transit artifact ✅ RESOLVED

R138 found `esc()` performing character-to-itself replacements — zero actual
escaping — and flagged it as the highest-priority item to verify. **The live
source escapes correctly.** Verbatim:

```js
function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
```

R138's version was damaged in the chat relay, which HTML-decoded `'&amp;'` to
`'&'` and turned a real escaper into a no-op. There is **no XSS exposure** and
never was. Recorded because the false positive was expensive: a transcription
can invent a critical security finding as easily as it can hide one.

Residual, minor: `esc()` does not escape `'` (U+0027). Every attribute
interpolation in the file is double-quoted, so nothing is exploitable today.
It is a latent gap if a single-quoted attribute is ever introduced.

### 6.3 Unhardened phase fetch — confirmed at the call site

Now visible in the recovered `loadPhase()`:

```js
fetch(PHASE_ENDPOINT + '?c=' + encodeURIComponent(c), { credentials: 'omit' })
```

No timeout, no `AbortController`, no `signal`. A hung request leaves
`livePhase = 0` indefinitely. The `userInteracted` guard suggests the author
already knew the fetch can be slow. R138 inferred this from live capture; it is
now confirmed in source.

### 6.4 Phase endpoint auth posture — sharpened by the recovered call site

`credentials: 'omit'` means **no cookie, no session, no Authorization header**
is sent. The endpoint therefore cannot be authenticating the caller by session
at all. Authorization rests entirely on knowledge of the client uid, passed in
the query string:

```
GET https://api.virtuallaunch.pro/v1/green/portal-phase?c=<client-uid>
```

If that uid is guessable, enumerable, or leaks, the response discloses another
client's engagement data — service names, phase, due dates, project URLs. R138
could only record this as "unreviewed" because the call site was past the
truncation. It is now a concrete question with a concrete shape, and it wants
a server-side answer, not a client-side patch.

### 6.5 `§8275-R` — wrong symbol

`overviewBody()` renders "A COGS workpaper and §8275-R disclosure". 8275-R is a
**Form**, not a code section. Reads as an error to a tax-literate client, and
this is client-facing sales copy. Contrast the same file's correct usage of
`§280E`, `§471`, `§471(c)` and its correct "Form 8275-R" elsewhere.

### 6.6 Hardcoded cross-portal dashboard ids

`171391` (Risk Review) and `171081` (next engagement) are baked into `STEPS`
copy and `overviewBody()`. Not a defect today; a silent-breakage hazard when
those pages are renumbered.

### 6.7 `livePhase >= 8` magic sentinel

`8` means "complete" against a 7-step model, with no named constant. Works;
undocumented at the call site.

### 6.8 `stepHtml()` builds HTML by string concatenation

With 6.2 resolved this is far less urgent, but the render path still assembles
markup by concatenation throughout. Worth one deliberate review rather than
per-site patching.

---

### New in R139 — revealed by the recovered half

These were not visible in R138's truncated capture.

### 6.9 `paintProjects()` reads `STEPS[ph]` unguarded — endpoint data can throw

`STEPS` is keyed `1`–`7`. `applyPhase()` validates carefully before indexing:

```js
if (!phase || phase < 1 || phase > 8) { livePhase = 0; /* ... */ return; }
```

`paintProjects()` does not:

```js
var pct = !ph ? 0 : (ph >= 8 ? 100 : STEPS[ph].pct);
```

`ph` comes straight from the endpoint. Any value that is truthy, below 8, and
not an integer 1–7 — `7.5`, `-1`, `0.5` — makes `STEPS[ph]` `undefined` and
`.pct` throw a `TypeError`.

The failure is silent and total. `paintProjects()` is called from inside
`loadPhase()`'s `.then()`, and the chain ends in
`.catch(function () { /* fail silent */ })`. So one malformed phase value from
the endpoint kills the entire engagement rail with nothing logged and nothing
shown. The asymmetry with `applyPhase()` — which is called moments later on the
same data, and guards — looks unintentional.

### 6.10 `paintProjects()` is the first consumer of endpoint data

Ordering consequence of 6.9, worth stating separately: in `loadPhase()`,
`paintProjects()` runs **before** `applyPhase()`. The unguarded consumer sees
the data first, so a bad payload throws before the guarded path ever runs.

**Ruled out during R139 review, recorded so it is not re-investigated:**
`render()` binds click/keydown listeners on `#vl-back` every call, which looks
like unbounded listener accumulation. It is not — `#vl-back` is emitted inside
`stepHtml()`, which `render()` writes into `body.innerHTML` at the top of the
same call. The node is fresh on every render, so each is bound exactly once.

---

## 7. Change log

| Date | Rev | Change |
|---|---|---|
| 2026-08-19 | R138 | Initial partial capture via chat transcription. CSS believed complete; JS 14/24 functions, did not parse. Stub deliberately withheld. |
| 2026-08-19 | R139 | **Superseded by byte-exact DOM dump.** CSS was in fact 1,771 chars short (§4). Now 26,644/24,830 chars, verified against at-capture measurement, zero delta. JS 24/24 functions, `node --check` passes. `esc()` no-op confirmed a transit artifact, not a real defect (6.2). `\uXXXX` escapes confirmed and preserved. `.partial.html` deleted. Two new defects recorded (6.9, 6.10); one candidate ruled out. Stub shipped. |
