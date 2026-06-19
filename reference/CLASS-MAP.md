# Surface Class Map

Ground-truth reference of the classes SuiteDash actually renders per surface,
captured from live DOM snapshots in `reference/dom-snapshots/`. RC consults this
on every port/fix to target real selectors instead of assumed ones.

**Captured:** 2026-06-19 | **Snapshots:** `reference/dom-snapshots/` (8 surfaces × `_outerHTML.txt` + `_styles.txt`)

> **Why this file exists:** the `.doc-8879`-vs-`.tpp-doc` wrapper divergence (Fix B,
> commit `bc02e90`) and the Coastal partial-reskin both stemmed from not having
> ground-truth DOM. This map is the antidote: it records what SuiteDash *emits*,
> not what a CSS source *assumes*.

---

## How to read this file

- **Root wrapper** = the outermost element whose class/ID our CSS should target for the surface.
- **SuiteDash-native** = chrome SuiteDash generates; we **cannot rename** it, only target it as-is.
- **Ours** = classes that come from our injected templates (doc/form/flow/onboard markup).
- **§** = the `lentax-base.css` sub-section that styles the surface.
- A **wrapper divergence** = live class ≠ class the CSS expects. HIGH severity when the
  surface's CSS is descendant-scoped under the expected wrapper (styling fully fails);
  LOW when the CSS uses top-level/own-namespace selectors that match regardless.

### SuiteDash-native markers seen across every surface (do NOT rename, do NOT scope away)

`ng-*` (Angular: `ng-scope`, `ng-binding`, `ng-isolate-scope`, `ng-if`, …), `cbe-block*`,
`sd-content-block-render-block`, `.cbe-block-wrapper`, `.cbe-block-content-text`,
`.wysiwyg-content`, `select2*`, `.ripple`, `.material-icons`, `.dropdown*`,
Bootstrap grid (`.row`, `.col-*`, `.d-flex`, `.no-gutters`), `.pace*`,
`.shadow-block`, `.skeleton-loader__*`, and `<body>` state classes
(`branding-theme-default2`, `sidebar-dark`, `header-light`, `site-sidebar--default-state`,
`role-super-admin`, `impersonated-body`).

---

## Quick reference (wrapper → sub-section → namespace)

| Surface | Live root wrapper | `lentax-base.css` § | Our namespace | Wrapper / selector divergence? |
|---------|-------------------|---------------------|---------------|-------------------------------|
| Dashboard | `#dashboard-view` (on `div.card-block.dashboard-page-content`) | 2.15 (+2.1 onboarding) | `.vlpd-onboard*`, `.tu-progress__*` | None for root. Body components are SD-native. |
| Document — 8879 (Doc 2) | `.doc-8879` | 2.16 + 2.18 | `.doc-*` (under `.doc-8879`) | ⚠ uses `.doc-8879`, no `.tpp-doc` parent — relies on Fix B twins (already fixed). |
| Document — Agreement (Doc 1) | `.tpp-doc` › `.doc-8879` | 2.16 + 2.18 (NOT 2.17) | `.doc-*` (under `.tpp-doc`/`.doc-8879`) | ⚠⚠ **Body is Form 8879 markup, not agreement markup.** Zero `.tpp-doc-*` classes → **2.17 matches nothing.** See cross-doc section. |
| Document — Filing Summary (Doc 3) | `.tu-doc` | 2.19 | `.tu-doc`, `.tu-doc-*` | ✅ None — live matches CSS exactly. |
| Flows | `.sd-flow` (`.flow-type-ondemand sd-flow`) | 2.20 (+2.2 TPP / 2.12 VLP modal) | `.flow-*`, `.vlpd-onboard`, `.tu-lede-*` | `.crm-actions-panel__*` present but unstyled (shared SD component). |
| Forms | `.app-form-embed` (`.app-form-type-intake`) | 2.4–2.9 | `.tu-form-header`, `.tu-form-page-*` | `.crm-actions-panel__*` present but unstyled (shared SD component). |
| Platform shell | `aside.site-sidebar` + `<body>` state classes | 2.14 | (none — re-skins SD chrome) | ✅ None — `site-sidebar`, `main-side-menu`, `mpa-compact-profile` all match. |
| Proposals | `.proposal_content` | 2.21 | (re-skins `.proposal-*` + content blocks) | `.contract-*` (in §2.21 tail rule) absent from snapshot — dead selector here (LOW). |

---

## Dashboard

**Live root:** `<div class="card-block styling-options-content dashboard-page-content" id="dashboard-view">`
**Sub-section:** 2.15 — DASHBOARD PAGES (`#dashboard-view`); onboarding block via 2.1
**Namespace:** SD-native dashboard components, re-skinned in place; our additions are `.tu-*` / `.vlpd-*`.

**SuiteDash-native (do NOT rename — re-skin as-is):**
- `#dashboard-view` — the container SuiteDash provides (ID on a `.card-block.dashboard-page-content` div).
- `.dashboard-organize-box`, `.dashboard-organize-box--auto-height`, `.dashboard-organize-box__header`, `__header-title`, `__header-filters`, `__filters-item`, `__filters-inputs-wrap`, `__content`, `__footer`, `__footer-btn` — the Projects + Activity-stream shell (§6 of 2.15).
- `.dashboard-item`, `.dashboard-item__title`, `__statuses`, `__info`, `__content` — list rows.
- `.category-pill`, `.category-pill__text`, `.category-pill__background` — status pills.
- `.projectClient` — client label.
- `.shadow-block` (×90) — SD card primitive used throughout the dashboard.
- `.skeleton-loader__*` — SD loading placeholders.
- An embedded `<div class="app-form-embed app-form-type-update">` — an update-form widget rendered inside the dashboard.

**Ours (injected templates):**
- `.vlpd-onboard-banner`, `-banner-content`, `-banner-icon`, `-banner-text` — TPP onboarding banner.
- `.tu-progress__step` / `__dot` / `__label` (×8 steps), `.tu-step`, `.tu-title`, `.tu-lede-link` — onboarding progress stepper.

**Notes:** dashboard is a content-block surface (`cbe-block` ×125, `wysiwyg-content` present). Our onboarding markup is injected into WYSIWYG content blocks; the dashboard grid components are SD-native.

---

## Documents

All three document surfaces are **content-block** pages: the doc body is pasted into
SuiteDash's WYSIWYG editor, so the live DOM ancestry is always:

```
sd-content-block-render-block.cbe-block-wrapper
 └ div.cbe-block-content-text#cbe-block-NNNN
    └ div.wysiwyg-content.ng-binding
       └ <ROOT WRAPPER>   ← the only part our CSS can rely on
```

The three wrappers diverge — this is the headline finding of this map. See the
cross-document comparison below.

### Document — Form 8879 (Doc 2) — `doc_8879_*`

**Live root:** `<div class="doc-8879">` (sole class; **no `.tpp-doc` parent**)
**Sub-section:** 2.16 (shared foundation) + 2.18 (Form 8879)
**Namespace:** `.doc-*` content classes, descendant-scoped under `.doc-8879`.

**Key elements (ours):** `.doc-header`, `.doc-header-logo`, `.doc-header-org` (`.org-name`/`.org-address`/`.org-locale`/`.org-email`), `.doc-divider`, `.doc-title-block`/`.doc-title`/`.doc-subtitle`/`.doc-date`, `.doc-notice`/`.doc-notice-icon`/`.doc-notice-text`, `.doc-section`/`.doc-section-title`, `.doc-field-row`/`.doc-field`/`.doc-field-label`/`.doc-field-value`, `.doc-legal-text`, `.doc-consent-list`, `.doc-signature-block`/`.doc-sig-row`/`.doc-sig-field`/`.doc-sig-label`/`.doc-sig-line`, `.doc-retention`, `.doc-footer`/`.doc-footer-left`/`.doc-footer-right`.

**Divergence:** the live root is `.doc-8879`, **not** `.tpp-doc` (which 2.16/2.18 were originally scoped to). Fixed via **Fix B** (`bc02e90`) which added `.doc-8879` as an alternate root alongside `.tpp-doc` in 2.16 + 2.18. ✅ Resolved.

### Document — Service Agreement (Doc 1) — `doc_agreement_*`

**Live root:** `<div class="tpp-doc">` › `<div class="doc-8879">` (both wrappers, nested)
**Sub-section it is *actually* styled by:** 2.16 + 2.18 (the 8879 rules)
**Sub-section that was *built* for it:** 2.17 — and it matches **nothing live** (see below)

**⚠⚠ Surprise — the document named "Tax Prep Service Agreement" renders Form 8879 body markup.**
- SuiteDash chrome confirms the document identity: `<span class="title" id="contract-title">Tax Prep Service Agreement</span>` and the signature ribbon `"Tax Prep Service Agreement" requires your signature`.
- But the WYSIWYG body is 8879 content: wrapper chain `.tpp-doc > .doc-8879`, and `.doc-subtitle` reads **"Form 8879 — Authorization for Electronic Filing"**.
- The body uses the same `.doc-*` classes as Doc 2 (`.doc-header`, `.doc-section`, `.doc-field*`, `.doc-sig-*`, `.doc-signature-block`, `.doc-retention`, …).
- It contains **zero `.tpp-doc-*` (hyphenated) classes** — i.e. none of `.tpp-doc-header`, `.tpp-doc-body`, `.tpp-doc-logo`, `.tpp-doc-title` that section **2.17** targets.

**Consequences:**
1. **Doc 1 renders styled** — because it carries both `.tpp-doc` (so 2.16's `--tpp-*` custom properties resolve) and `.doc-8879` (so 2.18's `.doc-8879 .doc-*` rules match). It is doubly covered by the 8879 styling.
2. **Section 2.17 is effectively dead** against current production content — its `.tpp-doc-*` selectors match none of the live agreement DOM.
3. This is a **content** divergence (the agreement doc's body markup is 8879), not a CSS cascade failure. **Flag for JLW:** is the agreement doc intentionally repurposed as a second 8879, or did 8879 markup get pasted into the agreement doc in SuiteDash? Either way, 2.17 only becomes live again if/when the agreement doc is given true agreement markup (`.tpp-doc-*`).

### Document — Filing Summary (Doc 3) — `doc_summary_*`

**Live root:** `<div class="tu-doc">`
**Sub-section:** 2.19 — DOCGEN: TAX PREP FILING SUMMARY (standalone; does NOT depend on 2.16)
**Namespace:** `.tu-doc` + `.tu-doc-*` (the canonical TPP namespace going forward)

**Key elements (ours):** `.tu-doc-header`, `.tu-doc-logo`, `.tu-doc-image`, `.tu-doc-tagline`, `.tu-doc-title`, `.tu-doc-doctype`, `.tu-doc-body`, `.tu-doc-block`, `.tu-doc-h2` (×4), `.tu-doc-table` (×4), `.tu-doc-footer`.

**Divergence:** ✅ **None.** The live wrapper (`.tu-doc`) and child namespace (`.tu-doc-*`) match 2.19 exactly. This is the model the other two docs are slated to migrate to (per the 2.19 header note).

---

## Flows — `flow_*`

**Live root:** `<… class="flow-type-ondemand sd-flow">`
**Sub-section:** 2.20 — STACK: FLOWS (+ 2.2 TPP modal overrides, 2.12 VLP modal overrides)
**Namespace:** `.sd-flow` (root) + `.flow-*` descendants.

**SuiteDash-native (target as-is):**
- `.sd-flow` (root; modifier `.flow-type-ondemand`), `.flow-nav-list`, `.flow-buttons`, `.flow-advance-wrapper`, `.flow-modal-header`, `.flow-header`, `.flow-wrapper`, `.step-header`, `.appointment-intake-form-*`.
- `.crm-actions-panel__*` family (`__card`/`__card-icon`/`__card-label`, `__tab`/`__tab-count`/`__tab-icon`, `__header*`, `__search*`, `__section*`, `__footer*`, `__tooltip`, `__grid`) + `.crm-actions-trigger`.

**Notes / divergences:**
- This is an app-view surface, **not** a content-block page (`cbe-block` ×1, no `render-block`, no `wysiwyg`).
- ⚠ `.crm-actions-panel__*` is a **shared SD quick-actions component** (identical element set also appears in the Forms dump). **No lentax-base.css rule targets it** — uncovered surface area. Not a divergence per se, but flagged: if it ever needs theming, it lives outside the flow namespace.
- Our injected flow content (`.vlpd-onboard`, `.tu-lede-oneline`, `#appointmentTimeZoneSelect`) named in 2.20's header was not exercised in this on-demand-flow snapshot.

---

## Forms — `form_*`

**Live root:** `<… class="app-form-embed app-form-type-intake">`
**Sub-section:** 2.4 (form chrome) through 2.9 (page header/footer); related: 2.5 cards, 2.6 totals/summary, 2.7 accordion, 2.8 tu-form-header + progress
**Namespace:** root `.app-form-embed` (modifier `.app-form-type-*`); our header/footer `.tu-form-*`.

**SuiteDash-native (target as-is):**
- `.app-form-embed` (root), `.extended-form-wrapper` (alternate root used in CSS), `.field-wrapper`, `.base-input-field`, `.form-control`, `.form-group`, `.form-error`, `.sdAccordion__*` (payment steps), `.choose-items-*` / `.choose-items-summary-*` (cards + totals), `.cbe-block-shopping-wrapper`.
- `.crm-actions-panel__*` (same shared component as Flows).

**Ours (injected):** `.tu-form-header`, `.tu-form-page-header` (`__inner`/`__cta`), `.tu-form-page-footer` (`__inner`/`__col`/`__heading`/`__line`/`__copy`/`__socials`).

**Notes:** app-view surface (`cbe-block` ×1, no render-block/wysiwyg). Root modifier observed here is `.app-form-type-intake`; the dashboard also embeds `.app-form-type-update`. CSS 2.4–2.9 scope under both `.app-form-embed` and `.extended-form-wrapper`, so either root matches.

---

## Platform shell — `platform_*`

**Live root:** `<body class="header-light sidebar-dark oscar internal-user … branding-theme-default2 … role-super-admin impersonated-body site-sidebar--default-state … sidebar-expand">`, with `aside.site-sidebar` as the chrome anchor.
**Sub-section:** 2.14 — PORTAL CHROME (SIDEBAR, NAVBAR, TAB STRIP)
**Namespace:** none of ours — 2.14 re-skins SD-native shell chrome via tokens.

**SuiteDash-native (target as-is — this is the whole surface):**
- Sidebar: `aside.site-sidebar` (×8), `.sidebar-nav`, `ul.main-side-menu`, `.sub-menu` (×11), `.sidebar-header`, `.sidebar-content`, `.sidebar-toggle`/`__icon`, `.sidebar-expand`, `.sidebar-block-wrapper`, `.main-side-menu`.
- Org pill: `div.mpa-compact-profile` (×6) + `.mpa-compact-profile__link` / `__name`.
- Navbar / tabs: `.navbar`, `.navbar-header`, `.navbar-brand`, `.navbar-nav`, `.nav-tabs`, `.nav-item`, `.nav-link`, `.main-nav-dropdown`, `.header-light`, `.header-avatar-block`, `.header-tooltip`, `.main-wrapper`.
- Most `id="…"` here are Angular template placeholders (`id="TYPE"`, `id="SUBMISSIONS"`, `id="EmbedPlaceholder"`, `id="{{Entity.uuid}}"`) — dynamic SD chrome, not stable hooks.

**Notes / divergences:** ✅ 2.14's verified selectors (`aside.site-sidebar`, `.sidebar-nav ul.main-side-menu`, `div.mpa-compact-profile`, `.sub-menu`) all present and match. The tab strip 2.14 references (`.flow-nav-bar` / `.flow-nav-btn`) is **not** on the platform shell snapshot (`flow-nav-bar` ×0) — it is a flow-context element, consistent with 2.14's note that the tab strip is tokenized at its own location (~line 1474).

---

## Proposals — `proposal_*`

**Live root:** `<div class="proposal_content">`
**Sub-section:** 2.21 — STACK: PROPOSALS
**Namespace:** `.proposal_content` (root) + `.proposal-*`; re-skins SD content blocks within.

**SuiteDash-native (target as-is):**
- `.proposal_content` (root), `.proposal-navbar` / `.proposal-navbar-header`, `.proposal-topbar`, `.proposal-side-menu`, `.proposal-content-wrapper`, `.proposal-back`, `.proposal-label-wrap`, `.proposal-assigment` (sic — SD's own spelling), `.proposal-notice`, `.proposal-btn`.
- Heavy content-block scaffolding: `cbe-block*` (×393), `sd-content-block-render-block` (×56), `.wysiwyg-content` (×62), `.cbe-block-custom-clr`, `.cbe-block-shopping-wrapper`, `ui-sortable`.
- Body state wrappers 2.21 also scopes through: `body.branding-theme-default` / `-mrclean`, `.sidebar-dark`.

**Notes / divergences:**
- This is the most content-block-dense surface (proposals are built entirely from CBE blocks).
- ⚠ LOW: 2.21's tail rule targets `.proposal_content .contract-header` / `.contract-body`, but **no `.contract-*` class exists in this snapshot**. Those selectors are dead for this proposal type — they presumably match a "contract"-style proposal variant not captured here. Degraded-to-nothing only on contract proposals; the standard proposal renders fine via `.proposal-*` + block rules.

---

## Wrapper-divergence summary (highest-value output)

| # | Surface | Live wrapper | CSS expects | Severity | Impact |
|---|---------|-------------|-------------|----------|--------|
| 1 | Doc 1 (Agreement) | `.tpp-doc > .doc-8879`, `.doc-*` body | 2.17's `.tpp-doc-*` | **HIGH (content)** | Doc renders styled via 2.16+2.18, but **2.17 matches nothing** — the agreement doc's live body is 8879 markup. Content issue, not cascade failure. Flag to JLW. |
| 2 | Doc 2 (8879) | `.doc-8879` (no `.tpp-doc`) | `.tpp-doc` (orig.) | RESOLVED | Fixed via Fix B (`bc02e90`) — `.doc-8879` twinned into 2.16/2.18. |
| 3 | Doc 3 (Summary) | `.tu-doc` | `.tu-doc` | NONE ✅ | Live matches CSS exactly. Migration target for Docs 1 & 2. |
| 4 | Proposal | (no `.contract-*`) | `.contract-header/.body` in 2.21 tail | LOW | Dead selector for this proposal type; standard proposal unaffected. |
| 5 | Flow + Form | `.crm-actions-panel__*` present | (no rule) | INFO | Shared SD quick-actions component, uncovered by lentax-base.css. |
| 6 | Dashboard / Flow / Form / Platform / Proposal roots | match expected | — | NONE ✅ | `#dashboard-view`, `.sd-flow`, `.app-form-embed`, `aside.site-sidebar`, `.proposal_content` all confirmed. |

### Cross-document-type takeaway (the Fix B siblings question)

The 8879 diagnosis flagged a backlog risk: would Fix B need `.doc-agreement` / `.doc-summary` twins?
Ground truth answers it:
- **Doc 3 (Summary)** uses `.tu-doc` cleanly — **no twin needed**.
- **Doc 1 (Agreement)** uses `.tpp-doc > .doc-8879` and is already covered by the existing 2.16/2.18 `.tpp-doc` **and** `.doc-8879` selectors — **no new twin needed for styling**. The real issue is content-level (its body is 8879 markup), not a missing selector.

So **no `.doc-agreement` / `.doc-summary` twin pass is required.** The open item is instead:
decide whether the Agreement document should carry genuine agreement markup (which would
make 2.17 live again) or stay as-is.

---

## Methodology & caveats

- Extracted from `*_outerHTML.txt` (full rendered DOM, incl. SuiteDash chrome and embedded `<head>` stylesheets) via class-attribute frequency analysis and wrapper-chain reads. Companion `*_styles.txt` files are computed-style dumps (not parsed for this map).
- Class **counts** in this map are DOM `class="…"` occurrences. Raw `grep` of bare tokens (e.g. `wysiwyg-content`) over the whole file is inflated by CSS rule text inside embedded `<style>` blocks — those were not used for the counts here.
- Only classes **actually present** in the snapshots are listed. Where a CSS section targets a class not in its snapshot, it is flagged as a dead/uncovered selector rather than inferred to exist.
- Snapshots are a point-in-time capture (2026-06-19). SuiteDash template edits or app upgrades can change emitted classes — re-capture before relying on this for a high-stakes change.
