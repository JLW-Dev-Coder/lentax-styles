---
name: suitedash-portal-styling
description: Use when fixing a CSS, JS, or HTML bug on a SuiteDash portal surface (app.virtuallaunch.pro, trial.virtuallaunch.pro, or any reseller portal) — visual defects, invisible text, wrong colours, broken layout, active states, or anything that renders wrong in the browser but looks correct in the repo. Read this BEFORE writing any selector.
---

# SuiteDash Portal Styling

## The one rule

**Never write a selector against a SuiteDash surface you have not confirmed in a live browser.**

On 2026-07-11, seven defects shipped from this single failure. Every one was defensible from the repo. Every one was wrong in the browser. If you take nothing else from this file, take this: **the repo cannot tell you what the DOM looks like.** SuiteDash ships different markup per surface, per step, per viewport, per scroll state. A grep of our CSS is structurally blind to an element that isn't in our CSS.

Before you write a rule, get a live DOM fact: the **exact tag and class**, on **that surface**, at **that viewport**, in **that state**.

## The four ways selectors go wrong

| Axis | What happened | Cost |
|---|---|---|
| **Zero-match** | R83/R84 styled `#forms-form-wrapper .sd-signature-pad input` — `.sd-signature-pad` count is **0** on the checkout surface. The fix landed on nothing. | Signature invisible for weeks; two commits wasted |
| **Wrong element** | R81/R82 lit the sidebar chevron via `.sidebar-toggle svg`. The **mobile** toggle is `<i class="fa-bars">` inside `.mobileMenuToggle` — different tag, different class, no `<svg>`. | Hamburger black on dark bar |
| **Over-match** | R49.2 set `background:#ffffff` on `… .pad-wrapper canvas` — a **bare type selector**. It hit *both* stacked canvases, painting the watermark overlay opaque and hiding the client's drawn signature underneath. | 2.5 weeks of unsignable contracts |
| **Wrong state** | R86 scoped to `.wrapper.fix-top`. **`.fix-top` is a scroll state** SuiteDash adds when the header goes sticky — absent on first paint. | Icon black on load, white after scroll |

## Three heuristics that catch these from the repo

### 1. A section header is a scope contract

`/* TM Proposal page — section cards … */` means every selector inside is expected to be page-scoped.

**The tell is the scoped/bare twin.** When a block contains both `.proposal_content .proposal-content-wrapper .cbe-content h2` (scoped) and a bare `.cbe-content h2` a few lines apart — the bare one is a leak the author forgot to scope.

**Generic SuiteDash class denylist.** These appear on essentially every content page:

```
.cbe-content   .cbe-row-wrapper   .cbe-block-*   .content-block-wrapper
.content-block-view-wrapper   .wysiwyg-content   .card-block   .choose-items-block
```

Inside a product- or page-scoped block, **any selector whose leftmost compound is on this list and does not carry the block's scope hook is a leak.** Catchable statically. No browser needed.

Real damage found: 14 bare selectors in the `lentax-base.css` R8 block, repainting every heading navy, stripping every wysiwyg list bullet, and turning centred bold into pills — **portal-wide, on every product.**

### 2. State vs. identity

**A single DOM snapshot cannot distinguish a structural class from a state class.** Both are just strings on the element. The class was only there because of the state you happened to inspect.

| STATE (JS toggles it) | IDENTITY (structural) |
|---|---|
| `fix-top`, `sticky`, `scrolled`, `is-active`, `open`, `expanded`, `focused`, `loading`, `selected` | `wrapper`, `mobileMenuToggle`, `sidebar`, `content-block`, `pad-wrapper` |

**Name-tell:** position/condition names are state. Thing names are structure. `.fix-top` announced itself — *"fix" = fixed-on-scroll.*

For an always-on fix, scope only to **structurally invariant** classes. Verify across states — before and after scroll, closed and open, empty and focused — or read the JS that toggles the class.

### 3. Band-aids point back to the wound

**A rule whose job is to *undo* a base value is a signpost that the base rule is unscoped.** Follow it upstream.

- `R28.2-B` releases a leaked `max-width:1180px` and tightens a leaked `34px` padding on two containers at ≤768px. Its own comment admits the base has "no media guard."
- `R32.2` narrowed a centred-bold pill rule with `:not(h1)` — reactively, after it bit.
- `R29.3` strips the card frame (border, shadow, radius, max-width) on VLP but **forgot the padding**, leaving 66px of dead space on every portal page.

Three separate people patched symptoms of the same unscoped block without noticing the base rule.

## Where the CSS actually ships from

**This is the fact that breaks grep.**

| Source | Reaches | How |
|---|---|---|
| `lentax-vlp.js` | Every VLP portal | A `<script src>` in SD Custom JS → Netlify. Preload-swaps `lentax-base.css` + `themes/vlp-default.css`, **and injects several `<style>` blocks at runtime** (R66, R69, R82) plus DOM-mutating IIFEs. |
| `lentax-base.css` | All portals | Injected by the loader above. §1 = marketing site, §2 = SuiteDash. |
| `themes/vlp-default.css` | VLP portals | Injected by the loader. Palette + portal/checkout/login overrides. |
| `themes/tpp-*.css` | TPP install portals | Via `lentax-install-*.js` loaders. |

**Some portal CSS lives inside a JS string.** The signature-field rules (R69/R83/R84) and the desktop chevron rules (R81/R82) are in `lentax-vlp.js`, not a stylesheet. **A grep of `*.css` will not find them.** Always grep `*.js` too.

**Top-bar chrome is split across two files** — desktop toggle in `lentax-vlp.js`, mobile toggle in `themes/vlp-default.css`. If you're fixing chrome, check both.

## Winning the specificity fight

SuiteDash's own bundle (`mpa-style.css`, cloudfront) is the opponent. Established idioms in this repo:

- **Quadrupled classes** — `input.form-control.form-control.form-control.form-control`
- **`:not()` chains against auto-generated IDs** — the 20× `:not(#____z0)` stack in `lentax-vlp.js`
- **`#client-page-view` re-anchor** — an ID to win the ID column regardless of class count

### The `!important` tie-breaker that will bite you

**Two `!important` rules do not tie on declaration order. Specificity is compared first, and the ID column wins first.**

Real example: an autofill rule at `(0,5,1)` with `!important` **lost** to a focus rule at `(1,2,1)` with `!important` — because the focus rule had an ID. The fix looked correct on blur and broke the instant the user focused the field.

**If your rule has `!important` and still loses, count the ID column before you touch anything else.**

## Chrome autofill

`background-color` **cannot** override Chrome's autofill paint at any specificity. Use the inset box-shadow:

```css
selector:-webkit-autofill,
selector:-webkit-autofill:hover,
selector:-webkit-autofill:focus,
selector:-webkit-autofill:active {
  -webkit-text-fill-color: <text> !important;
  caret-color: <text> !important;
  -webkit-box-shadow: inset 0 0 0 1000px <bg> !important;
  box-shadow: inset 0 0 0 1000px <bg> !important;
}
```

**All four states, including `:active`.** R84's original bug was omitting it.

**Two idioms coexist in this repo.** The login rules use `transition: background-color 5000s` to defer Chrome's paint swap. The form surfaces use the inset box-shadow alone. **Match the idiom of the surface you're on** — don't import login's into a form.

## Content elements and overlays are transparent for a reason

A `<canvas>` / `<img>` / `<video>` shows **painted pixels, not DOM**. Its transparent background is *functional*. An absolutely-positioned sibling sits **over** another layer.

**Painting either one opaque hides what's beneath it.**

Before shipping any `background` declaration, ask: **how many boxes does the terminal selector match?** A long ancestor chain ending in a bare type selector (`canvas`, `div`, `input`) is still promiscuous. Run `document.querySelectorAll('<your selector>')` on the live surface and count.

**Fix an over-match by narrowing, never by blanket-reverting.** R87 kept canvas 0 white (black ink needs a light backing — R69 paints the container `#131316`) and made only `canvas:nth-of-type(2)` transparent. A blanket transparent would have re-broken it through a different door.

## Breakpoints

**There is no single mobile breakpoint.** Pick deliberately.

| Surface | Breakpoint |
|---|---|
| Book-Me | `600px` |
| Form embed / content pages | `768px` / `767px` |
| Login | `1024px` |
| Progress steps | `540px` / `480px` |

Target device widths: **320** (SE), **390** (14/15), **430** (Pro Max). All under 600.

## Before you attribute a bug to SuiteDash

**Check our own commits first.**

The owner's test: ***"Was it like this before we started?"*** If the surface worked before recent changes, **it is our regression until proven otherwise.**

Use `git log -S "<declaration>"` / `git log -L` on the relevant selector to find the introducing commit. The signature-canvas bug was filed as a SuiteDash defect and was in fact `R49.2`, ours, from 2.5 weeks earlier. The most recently-touched code is not automatically the culprit — **the archaeology is not optional.**

## Small traps, each earned

- **`btn.href` on `<a href="#">` resolves to the current page URL.** Read `getAttribute('href')` raw before resolving, or a `#` link will match `location.pathname` and light up as active.
- **A DevTools colour toggle is not proof.** It looked fixed in the panel and was black on a real iPhone. Verify on the device.
- **Never add a second rule for an element that already has one.** Two competing mechanisms on one element is how the nav strip stayed broken for months (a live IIFE, a dead IIFE, and a CSS fallback, all painting index 0). Grep first; edit in place.
