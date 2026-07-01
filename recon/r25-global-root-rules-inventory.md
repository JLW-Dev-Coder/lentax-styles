# R25 Recon — Global-Root Rules Inventory

**Round:** R25 (recon only — no CSS edits)
**Author:** RC
**Date:** 2026-06-30
**Input file:** `lentax-base.css`
**Purpose:** Enumerate every rule keyed to the SD-global page roots
`#dashboard-view` and `#client-page-view`, grouped so PE + JLW can decide,
per cluster, which body-class prefix each rule should get in R25-execute.

> Method note: counts below are **rule blocks** (one comma-separated
> selector list terminating in `{` = one block; each `@media`-nested rule
> counted separately), derived from a brace-depth parser over the file
> (comments stripped). Property counts = declaration count (`;`).
> `!important` column: `all` / `none` / `partial (n/total)`.

---

## 1. Counts

| Metric | Verified (this recon) | Handoff expected | Delta |
|---|---|---|---|
| `#dashboard-view` rule blocks | **157** | 158 | −1 |
| `#client-page-view` rule blocks | **23** | 23 | 0 |
| Cross-root rule blocks (one selector list touching **both** roots) | **0** | — | — |
| Already body-scoped root rules | **1** | — | — |
| TMP / taxmonitor refs in CSS layer (`lentax-base.css` + `themes/tpp-*.css`) | **0** | — | — |

**Raw line-mention counts** (for cross-check; `Select-String` per the task):
`#dashboard-view` appears on **219** lines, `#client-page-view` on **35**
lines, **1** line mentions both (that line is prose — comment at 17684,
"Page root: #client-page-view (this page; #dashboard-view N/A)"). The
line-count is much higher than the block-count because:

- **Multi-line comma-separated selector lists** — e.g. the §2.15 CBE-neutralize
  rule (line 13778) is **12** selector lines but **1** rule block; the token/
  typography/`a`/`a *` lists add many more. This accounts for the bulk of the gap.
- **`@media`-nested repeats** — the §2.15 responsive + reduced-motion blocks
  (lines 14897–14978) re-list `#dashboard-view` selectors inside three `@media`
  wrappers (20 extra selector lines).
- **7 comment/prose lines** mention a root but declare no rule (6842, 6844,
  6889, 13651, 14302, 17613, 17684).

**Delta explanation (158 → 157):** the handoff's 158 is within one block of
the parser's 157. The most likely source is a single comma-separated selector
list counted as two blocks in the handoff (or a rule consolidated in a later
round). 157 is the authoritative brace-parsed figure. `#client-page-view`
reconciles exactly (23). No rule references both roots, so the handoff's
"cross-root" concern is empty (see §4).

---

## 2. Rules by line number

One row per rule block, sorted by line. `Round` = nearest round marker in the
preceding comment; `§2.15.x` = sub-section of the unmarked Dashboard Pages
block (see §3). `*` on a line flags it for PE attention (partial `!important`
or already body-scoped).

| Line | Selector | Round | Props | !important |
|---|---|---|---|---|
| 6286 | `#dashboard-view .cbe-content` | R16 | 1 | none |
| 6289 | `#dashboard-view .cbe-content .cbe-row-wrapper, #dashboard-view .cbe-row-wrapper` | R17 | 6 | all |
| 6300 | `#dashboard-view .cbe-row-wrapper > .cbe-block.col-12.col-md-4` | R17 | 8 | **partial (7/8)** \* |
| 6312 | `#dashboard-view .cbe-row-wrapper > .cbe-block.col-md-3, …col-md-6` | R17 | 7 | all |
| 6322 | `#dashboard-view .cbe-row-wrapper > .cbe-block.col-md-3` | R17 | 2 | all |
| 6326 | `#dashboard-view .cbe-row-wrapper > .cbe-block.col-md-6` | R17 | 2 | all |
| 6332 | `#dashboard-view .cbe-row-wrapper:has(> .cbe-block.col-xl-3)` | R21 | 8 | all |
| 6344 | `#dashboard-view .cbe-block-content-text h1, h2, h3` | R16 | 3 | none |
| 6351 | `#dashboard-view .cbe-block-content-text h1` | R16 | 1 | none |
| 6352 | `#dashboard-view .cbe-block-content-text h2` | R16 | 3 | none |
| 6357 | `#dashboard-view .cbe-block-content-text h2::after` | R16 | 8 | none |
| 6369 | `#dashboard-view .cbe-block-button a.cbe-block-button-element.btn` | R16 | 8 | **partial (5/8)** \* |
| 6379 | `#dashboard-view .cbe-block-button a…btn:hover` | R16 | 2 | none |
| 6385 | `#dashboard-view .cbe-block-button.button_orange_light a…btn` | R16 | 4 | all |
| 6393 | `#dashboard-view .cbe-block-progress-donut-wrapper` | R16 | 2 | none |
| 6852 | `#client-page-view .checklist-actions .button[ng-click*="start()"], …-btns-wrap button.button[…]` | R58 | 9 | all |
| 6866 | `#client-page-view …button[…start()]:hover, …-btns-wrap button…:hover` | R58 | 4 | all |
| 6875 | `#client-page-view …button[…start()] span, …-btns-wrap button… span` | R58 | 1 | all |
| 6894 | `#client-page-view .checklist-header` | R58 | 3 | all |
| 6901 | `#client-page-view .checklist-header .checklist-title` | R58 | 4 | all |
| 6909 | `#client-page-view .checklist-header > svg` | R58 | 3 | all |
| 6926 | `#client-page-view .checklist-item-subtitle-wrap` | R58 | 1 | all |
| 6931 | `#client-page-view .see-more-btn` | R58 | 3 | all |
| 13665 | `#dashboard-view` (TOKENS — `--vlpd-*` island) | §2.15.1 | 40 | none |
| 13726 | `#dashboard-view` (page bg + root type) | §2.15.2 | 5 | all |
| 13737 | `#dashboard-view *` | §2.15.2 | 1 | none |
| 13741 | `#dashboard-view h1…h6, .widget-title, .dashboard-organize-box__header-title` | §2.15.2 | 4 | all |
| 13755 | `#dashboard-view a, a:link, a:visited, a:hover, a:focus, a:active` | §2.15.2 | 2 | all |
| 13765 | `#dashboard-view a *, a span, a em, a small, a div` | §2.15.2 | 2 | all |
| 13778 | `#dashboard-view .cbe-block-wrapper, sd-content-block-template, …(12 sels)` | §2.15.3 | 5 | all |
| 13798 | `#dashboard-view .cbe-block-content-text` | §2.15.3 | 2 | all |
| 13803 | `#dashboard-view .cbe-block-wrapper, sd-content-block-template` | §2.15.3 | 1 | all |
| 13808 | `#dashboard-view .cbe-block-wrapper:last-child, sd-content-block-template:last-child` | §2.15.3 | 1 | all |
| 13818 | `#dashboard-view .cbe-block-embed` | §2.15.3 | 1 | all |
| 13826 | `#dashboard-view .vlpd-welcome` | §2.15.3b | 11 | all |
| 13842 | `#dashboard-view .vlpd-welcome::before` | §2.15.3b | 7 | all |
| 13852 | `#dashboard-view .vlpd-welcome-icon` | §2.15.3b | 14 | all |
| 13869 | `#dashboard-view .vlpd-welcome-body` | §2.15.3b | 2 | all |
| 13874 | `#dashboard-view .vlpd-welcome-eyebrow` | §2.15.3b | 12 | all |
| 13889 | `#dashboard-view .vlpd-welcome-title` | §2.15.3b | 7 | all |
| 13899 | `#dashboard-view .vlpd-welcome-title em` | §2.15.3b | 6 | all |
| 13908 | `#dashboard-view .vlpd-welcome-lede` | §2.15.3b | 7 | all |
| 13922 | `#dashboard-view .reporting__container` | §2.15.4 | 10 | all |
| 13935 | `#dashboard-view .reporting__container:hover` | §2.15.4 | 1 | all |
| 13943 | `#dashboard-view .reporting__block` | §2.15.5 | 12 | all |
| 13962 | `#dashboard-view .reporting__block::before` | §2.15.5 | 12 | all |
| 13977 | `#dashboard-view .reporting__block:hover` | §2.15.5 | 3 | all |
| 13983 | `#dashboard-view .reporting__block:hover::before` | §2.15.5 | 1 | all |
| 13988 | `#dashboard-view .reporting__block__title` | §2.15.5 | 4 | all |
| 13995 | `#dashboard-view .reporting__block__title__text` | §2.15.5 | 14 | all |
| 14015 | `#dashboard-view .reporting__block__title__icon` | §2.15.5 | 11 | all |
| 14030 | `#dashboard-view .reporting__block:hover .reporting__block__title__icon` | §2.15.5 | 4 | all |
| 14037 | `#dashboard-view .reporting__block__title__icon-svg` | §2.15.5 | 4 | all |
| 14044 | `#dashboard-view .reporting__block:hover .reporting__block__title__icon-svg` | §2.15.5 | 1 | all |
| 14048 | `#dashboard-view .reporting__block__title__icon-svg use` | §2.15.5 | 1 | all |
| 14053 | `#dashboard-view .reporting__block__value` | §2.15.5 | 4 | all |
| 14060 | `#dashboard-view .reporting__block__value__current` | §2.15.5 | 10 | all |
| 14077 | `#dashboard-view .reporting__block__value__trend` | §2.15.5 | 16 | all |
| 14096 | `#dashboard-view .reporting__block__value__trend--positive` | §2.15.5 | 3 | all |
| 14102 | `#dashboard-view .reporting__block__value__trend--negative` | §2.15.5 | 3 | all |
| 14108 | `#dashboard-view .reporting__block__value__trend--none` | §2.15.5 | 3 | all |
| 14114 | `#dashboard-view .reporting__block__value__trend__icon` | §2.15.5 | 1 | all |
| 14118 | `#dashboard-view .reporting__block__value__trend i.fa` | §2.15.5 | 1 | all |
| 14123 | `#dashboard-view .reporting__block__graphics` | §2.15.5 | 6 | all |
| 14132 | `#dashboard-view .reporting__block__graphics__content` | §2.15.5 | 5 | all |
| 14140 | `#dashboard-view .reporting__block__graphics__button` | §2.15.5 | 1 | all |
| 14145 | `#dashboard-view .reporting__block__progress__bar` | §2.15.5 | 3 | all |
| 14154 | `#dashboard-view .reporting__block__progress__bar .apexcharts-canvas` | §2.15.5 | 4 | all |
| 14161 | `#dashboard-view .reporting__block__progress__value` | §2.15.5 | 9 | all |
| 14174 | `#dashboard-view .reporting__block__chart` | §2.15.5 | 3 | all |
| 14180 | `#dashboard-view .reporting__block__anchor` | §2.15.5 | 2 | all |
| 14186 | `#dashboard-view .reporting__block__view-button` | §2.15.5 | 15 | all |
| 14207 | `#dashboard-view .reporting__block__view-button:hover` | §2.15.5 | 5 | all |
| 14215 | `#dashboard-view .reporting__block__view-button span` | §2.15.5 | 2 | all |
| 14221 | `#dashboard-view .eye-icon` | §2.15.5 | 9 | all |
| 14234 | `#dashboard-view .eye-icon:hover` | §2.15.5 | 2 | all |
| 14239 | `#dashboard-view .eye-icon svg` | §2.15.5 | 3 | all |
| 14246 | `#dashboard-view .reporting__block .dropdown-menu` | §2.15.5 | 7 | all |
| 14256 | `#dashboard-view .reporting__block .dropdown-menu .dropdown-item` | §2.15.5 | 8 | all |
| 14267 | `#dashboard-view …dropdown-item:hover, …dropdown-item:focus` | §2.15.5 | 2 | all |
| 14273 | `#dashboard-view …dropdown-menu .dropdown-item svg` | §2.15.5 | 2 | all |
| 14279 | `#dashboard-view .reporting__block .skeleton-element` | §2.15.5 | 1 | all |
| 14310 | `#dashboard-view .reporting__container, …__graphics, …__graphics__button` | §2.15.5b | 1 | all |
| 14316 | `#dashboard-view .cbe-block:has(.reporting__block), .cbe-row-wrapper:has(…), .row.no-gutters:has(…)` | §2.15.5b | 1 | all |
| 14349 | `#dashboard-view .reporting__container .reporting__block:hover, …:focus-within` | §2.15.5c | 1 | all |
| 14358 | `#dashboard-view .dashboard-organize-box` | §2.15.6 | 9 | all |
| 14371 | `#dashboard-view .dashboard-organize-box.card` | §2.15.6 | 2 | all |
| 14386 | `#dashboard-view .row.no-gutters > .cbe-block` | §2.15.6 (R13) | 2 | all |
| 14391 | `#dashboard-view .row.no-gutters:has(.dashboard-organize-box)` | §2.15.6 (R13) | 2 | all |
| 14397 | `#dashboard-view .dashboard-organize-box__header` | §2.15.6 | 8 | all |
| 14408 | `#dashboard-view .dashboard-organize-box__header-title, …h4.widget-title` | §2.15.6 | 7 | all |
| 14419 | `#dashboard-view .dashboard-organize-box__header-filters` | §2.15.6 | 3 | all |
| 14426 | `#dashboard-view …header-filters .filter-button` | §2.15.6 | 12 | all |
| 14443 | `#dashboard-view …filter-button:hover` | §2.15.6 | 3 | all |
| 14449 | `#dashboard-view …filter-button svg` | §2.15.6 | 3 | all |
| 14455 | `#dashboard-view …filter-button::after` | §2.15.6 | 1 | all |
| 14461 | `#dashboard-view …header-filters .dropdown-menu` | §2.15.6 | 6 | all |
| 14470 | `#dashboard-view …header-filters .dropdown-menu .dropdown-item` | §2.15.6 | 10 | all |
| 14483 | `#dashboard-view …dropdown-item:hover, …dropdown-item.active` | §2.15.6 | 2 | all |
| 14489 | `#dashboard-view …dropdown-menu .dropdown-item svg` | §2.15.6 | 5 | all |
| 14498 | `#dashboard-view .dashboard-organize-box__content` | §2.15.6 | 4 | all |
| 14506 | `#dashboard-view .dashboard-organize-box__footer` | §2.15.6 | 8 | all |
| 14517 | `#dashboard-view .dashboard-organize-box__footer .tasks-number` | §2.15.6 | 7 | all |
| 14527 | `#dashboard-view …footer .tasks-number svg` | §2.15.6 | 3 | all |
| 14533 | `#dashboard-view .dashboard-organize-box__footer-btn, …footer .btn-secondary` | §2.15.6 | 15 | all |
| 14553 | `#dashboard-view …footer-btn:hover, …btn-secondary:hover` | §2.15.6 | 3 | all |
| 14564 | `#dashboard-view .dashboard-item` | §2.15.7 | 8 | all |
| 14575 | `#dashboard-view …content > projects-item:last-child .dashboard-item, …live-stream-item:last-child .dashboard-item` | §2.15.7 | 1 | all |
| 14580 | `#dashboard-view .dashboard-item:hover` | §2.15.7 | 1 | all |
| 14585 | `#dashboard-view .dashboard-item .completionData` | §2.15.7 | 8 | all |
| 14596 | `#dashboard-view .dashboard-item .completionData > div` | §2.15.7 | 3 | all |
| 14602 | `#dashboard-view .dashboard-item__content` | §2.15.7 | 5 | all |
| 14610 | `#dashboard-view .dashboard-item__info` | §2.15.7 | 5 | all |
| 14618 | `#dashboard-view .dashboard-item__info .first-row` | §2.15.7 | 8 | all |
| 14629 | `#dashboard-view …first-row .projectClient` | §2.15.7 | 5 | all |
| 14637 | `#dashboard-view …first-row .assignee` | §2.15.7 | 1 | all |
| 14641 | `#dashboard-view …first-row .dot-divider` | §2.15.7 | 6 | all |
| 14650 | `#dashboard-view .dashboard-item__title` | §2.15.7 | 10 | all |
| 14664 | `#dashboard-view .dashboard-item__statuses` | §2.15.7 | 5 | all |
| 14672 | `#dashboard-view .category-pill` | §2.15.7 | 10 | all |
| 14685 | `#dashboard-view .category-pill__background` | §2.15.7 | 5 | all |
| 14693 | `#dashboard-view .category-pill__text` | §2.15.7 | 5 | all |
| 14702 | `#dashboard-view .contact2-filter__actions` | §2.15.7 | 5 | all |
| 14710 | `#dashboard-view .contact2-filter__contact-link` | §2.15.7 | 8 | all |
| 14723 | `#dashboard-view .contact2-filter__contact-link:hover` | §2.15.7 | 3 | all |
| 14729 | `#dashboard-view .contact2-filter__contact-link svg` | §2.15.7 | 3 | all |
| 14739 | `#dashboard-view .dashboard-item--live-stream` | §2.15.8 | 3 | all |
| 14746 | `#dashboard-view .targets-avatar` | §2.15.8 | 1 | all |
| 14750 | `#dashboard-view .targets-avatar .sd-user-avatar, .targets-avatar figure.avatar` | §2.15.8 | 11 | all |
| 14766 | `#dashboard-view .targets-avatar img, .targets-avatar svg` | §2.15.8 | 4 | all |
| 14774 | `#dashboard-view .default-user-avatar-container, .default-user-avatar` | §2.15.8 | 12 | all |
| 14791 | `#dashboard-view .dashboard-item--live-stream .dashboard-item__content` | §2.15.8 | 6 | all |
| 14800 | `#dashboard-view .dashboard-item--live-stream .dashboard-item__info` | §2.15.8 | 2 | all |
| 14805 | `#dashboard-view .dashboard-item--live-stream .first-row` | §2.15.8 | 4 | all |
| 14812 | `#dashboard-view …live-stream .first-row > span:first-child` | §2.15.8 | 6 | all |
| 14821 | `#dashboard-view …live-stream .first-row .dot-divider` | §2.15.8 | 6 | all |
| 14830 | `#dashboard-view …live-stream .first-row > span:last-child` | §2.15.8 | 5 | all |
| 14839 | `#dashboard-view …live-stream .dashboard-item__title` | §2.15.8 | 10 | all |
| 14853 | `#dashboard-view …live-stream .text-muted.small` | §2.15.8 | 5 | all |
| 14862 | `#dashboard-view …live-stream .contact2-filter__contact-link` | §2.15.8 | 1 | all |
| 14870 | `#dashboard-view ::-webkit-scrollbar, …__content::-webkit-scrollbar` | §2.15.9 | 2 | none |
| 14876 | `#dashboard-view ::-webkit-scrollbar-track, …__content::…-track` | §2.15.9 | 2 | none |
| 14882 | `#dashboard-view ::-webkit-scrollbar-thumb, …__content::…-thumb` | §2.15.9 | 2 | none |
| 14888 | `#dashboard-view ::-webkit-scrollbar-thumb:hover, …__content::…-thumb:hover` | §2.15.9 | 1 | none |
| 14898 | `#dashboard-view` (@media ≤960) | §2.15.10 | 1 | all |
| 14901 | `#dashboard-view .reporting__container` (@media ≤960) | §2.15.10 | 3 | all |
| 14906 | `#dashboard-view .reporting__block` (@media ≤960) | §2.15.10 | 2 | all |
| 14910 | `#dashboard-view .reporting__block__value__current` (@media ≤960) | §2.15.10 | 1 | all |
| 14913 | `#dashboard-view .dashboard-organize-box__header` (@media ≤960) | §2.15.10 | 1 | all |
| 14916 | `#dashboard-view .dashboard-item` (@media ≤960) | §2.15.10 | 1 | all |
| 14919 | `#dashboard-view .dashboard-organize-box__footer` (@media ≤960) | §2.15.10 | 1 | all |
| 14922 | `#dashboard-view .vlpd-welcome` (@media ≤960) | §2.15.10 | 1 | all |
| 14928 | `#dashboard-view` (@media ≤560) | §2.15.10 | 1 | all |
| 14931 | `#dashboard-view .reporting__container` (@media ≤560) | §2.15.10 | 1 | all |
| 14934 | `#dashboard-view .dashboard-organize-box__header-title, …h4.widget-title` (@media ≤560) | §2.15.10 | 1 | all |
| 14938 | `#dashboard-view .reporting__block__value__current` (@media ≤560) | §2.15.10 | 1 | all |
| 14941 | `#dashboard-view .dashboard-item__title` (@media ≤560) | §2.15.10 | 1 | all |
| 14944 | `#dashboard-view .vlpd-welcome` (@media ≤560) | §2.15.10 | 3 | all |
| 14949 | `#dashboard-view .vlpd-welcome-title` (@media ≤560) | §2.15.10 | 1 | all |
| 14952 | `#dashboard-view .vlpd-welcome-lede` (@media ≤560) | §2.15.10 | 1 | all |
| 14955 | `#dashboard-view .contact2-filter__actions` (@media ≤560) | §2.15.10 | 1 | all |
| 14967 | `#dashboard-view *, *::before, *::after` (@media reduced-motion) | §2.15.11 | 2 | all |
| 14973 | `#dashboard-view .reporting__block::before` (@media reduced-motion) | §2.15.11 | 1 | all |
| 14976 | `#dashboard-view .reporting__block:hover .reporting__block__title__icon` (@media reduced-motion) | §2.15.11 | 1 | all |
| 17641 | `body.page-with-styling-options #dashboard-view, …app-form-embed, …extended-form-wrapper` | §2.22 | 3 | all — **already body-scoped** \* |
| 17690 | `#client-page-view a.cbe-block-button-element.btn, …btn-primary` | R22 | 10 | **partial (7/10)** \* |
| 17703 | `#client-page-view a.cbe-block-button-element.btn:hover` | R22 | 3 | none |
| 17710 | `#client-page-view .cbe-row-wrapper` | R22 | 3 | all |
| 17717 | `#client-page-view h1, h2, h3` | R22 | 1 | all |
| 17722 | `#client-page-view h1` | R22 | 2 | none |
| 17726 | `#client-page-view h1::after` | R22 | 9 | none |
| 17739 | `#client-page-view .cbe-row-wrapper.tm-matrix-top, …tm-matrix-bottom` | R22 | 7 | all |
| 17749 | `#client-page-view .cbe-row-wrapper.tm-matrix-top` | R22 | 1 | all |
| 17750 | `#client-page-view .cbe-row-wrapper.tm-matrix-bottom` | R22 | 1 | all |
| 17754 | `#client-page-view .cbe-block:has(> .cbe-block-sortable.tm-matrix-spacer)` | R23 | 1 | all |
| 17761 | `#client-page-view .cbe-block:has(> .cbe-block-sortable.tm-matrix-cell)` | R23 | 10 | **partial (6/10)** \* |
| 17773 | `#client-page-view .cbe-block:has(> …tm-matrix-cell.tm-cell-left)` | R22/R23 | 1 | all |
| 17776 | `#client-page-view .cbe-block:has(> …tm-matrix-cell.tm-cell-right)` | R22/R23 | 1 | all |
| 17779 | `#client-page-view .cbe-block:has(> …tm-matrix-cell):hover` | R22/R23 | 3 | **partial (1/3)** \* |
| 17786 | `#client-page-view .content-block-wrapper.content-block-view-wrapper, …cbe-content` | R22 | 1 | all |

---

## 3. Rules grouped by round

### R16 — TM Dashboard ("Start Here") page (`#dashboard-view`)
Lines: 6286, 6344–6396 (headings, `h2::after` underline, gradient-pill + outline
buttons, donut-wrapper centering). 8 blocks. `.cbe-content` padding at 6286 is
the block's opening rule. Mixed `!important` (headings/gauge = none; buttons =
partial/all). *TM (TaxMonitor) surface.*

### R17 — TM Dashboard layout fix (`#dashboard-view`)
Lines: 6289–6329 (un-cap rows, `space-between`/`nowrap`, `col-md-4` grow-to-fill,
extend card styling to Row-2 `col-md-3`/`col-md-6`). 5 blocks. Replaced R16's
"uniform row symmetry" rule. All/partial `!important`. *TM surface.*

### R21 — TM Dashboard STEP row (`#dashboard-view`)
Line: 6332 (`.cbe-row-wrapper:has(> .cbe-block.col-xl-3)` — card the whole
Wet-Signature STEP row as one container). 1 block, 8 props, all `!important`.
*TM surface.*

### R22 — TM Support page (`#client-page-view`)
Lines: 17690–17789 (gradient-pill buttons, row-card baseline, navy headings +
`h1::after` underline, 2×2 matrix neutralize/margins, matrix cells + hover,
reveal SVG bg). 13 blocks (incl. the R23 re-scoped ones below). Marker classes
`.tm-matrix-*` / `.tm-cell-*` applied by JLW via SD admin. *TM surface.*

### R23 — TM Support matrix `:has()` re-scope (`#client-page-view`)
Lines: 17754, 17761 (re-scope spacer-hide + matrix-cell onto the `.cbe-block`
column via `:has(> .cbe-block-sortable.tm-matrix-*)`). 2 blocks. The cell-left/
right/hover rules (17773/17776/17779) share the same re-scoped `:has()` anchor.
*TM surface.*

### R58 — Checklist start() CTA inactivation + header/chevron fixes (`#client-page-view`)
Lines: 6852–6935 (visual-disable `start()` CTAs + hover nullify + span dim;
`.checklist-header` centering; title margin kill; chevron overflow/z-index).
8 blocks, all `!important`. **VLP-track round** (checklist inactivation, applies
on client-view pages e.g. view/168983 Get Support) — *not* part of the TM R8–R23
series; the file uses the VLP dashboard track's round numbering here.

### R13 — dashboard-panel gutter scope fix (inside §2.15)
Lines: 14386, 14391 (`.row.no-gutters > .cbe-block` padding + `:has(.dashboard-
organize-box)` margin). 2 blocks. This is the canonical bleed-fix precedent:
`#dashboard-view` wraps **all** portal pages, so a bare `.row.no-gutters` rule
bled onto every TM `.cbe-row-wrapper`; R13 tightened it with `:has()`. Lives
inside the otherwise-unmarked §2.15 block.

### Unmarked — §2.15 Dashboard Pages (`#dashboard-view`)
Lines: 13665–14978. **141 blocks** (the single largest cluster — 90% of all
`#dashboard-view` rules). Ported 2026-06-17 from ClickUp Stack_Dashboards_CSS_v1;
uses `§`-sub-section numbering, **no R-marker**. This is the TPP rose/champagne
dashboard skin: `--vlpd-*` token island (13665), page bg, CBE-frame neutralize,
welcome strip, KPI container/tiles, Projects + Activity organize-box, scrollbars,
responsive `@media`, reduced-motion. Sub-sections:

| Sub-section | Lines | Blocks |
|---|---|---|
| §2.15.1 TOKENS (`--vlpd-*` island) | 13665 | 1 |
| §2.15.2 Page bg + root typography | 13726–13772 | 5 |
| §2.15.3 Neutralize CBE frames | 13778–13820 | 5 |
| §2.15.3b Welcome strip | 13826–13916 | 8 |
| §2.15.4 KPI `.reporting__container` | 13922–13937 | 2 |
| §2.15.5 KPI tile `.reporting__block` (+ 5b clip, 5c stacking) | 13943–14352 | 40 |
| §2.15.6 Projects + Activity organize-box (incl. R13 pair) | 14358–14558 | 21 |
| §2.15.7 Project rows `.dashboard-item` | 14564–14733 | 20 |
| §2.15.8 Activity stream `--live-stream` | 14739–14864 | 14 |
| §2.15.9 Scrollbars | 14870–14891 | 4 |
| §2.15.10 Responsive (`@media` ≤960 / ≤560) | 14897–14959 | 17 |
| §2.15.11 Reduced motion (`@media`) | 14966–14978 | 3 |

### §2.22 — Styling-options transparency override (already body-scoped)
Line: 17641. 1 block. See §5.

---

## 4. Cross-root rules (PE attention)

**None.** No single selector list references both `#dashboard-view` and
`#client-page-view`. The two roots are used in mutually exclusive rule blocks
(R16/R17/R21 + §2.15 on `#dashboard-view`; R22/R23 + R58 on `#client-page-view`).
The 1 line that mentions both roots (17684) is comment prose, not a selector.

> Consequence for R25-execute: each cluster gets a single body-class prefix
> decision; there is no rule that must be split across two variants.

---

## 5. Already body-scoped rules

**1 rule** already carries a body-class prefix and does **not** need R25 prefixing:

- **Line 17641** — `body.page-with-styling-options #dashboard-view,
  body.page-with-styling-options .app-form-embed,
  body.page-with-styling-options .extended-form-wrapper`
  (§2.22 styling-options transparency override; 3 props, all `!important`).
  Scoped by SuiteDash's own `.page-with-styling-options` body class (a
  page-state discriminator, **not** an R24 variant class). R25-execute should
  leave this rule as-is — it is intentionally cross-variant (fires on intake/
  flow pages of any product).

> Note: R24's variant body classes (`lentax-vlp`, `lentax-install-*`,
> `lentax-tmp-*`) do **not** yet appear on any rule in `lentax-base.css` — R25-execute
> will be the first consumer of that plumbing. The `body.branding-theme-{default,
> mrclean}` prefixes present elsewhere in the file (e.g. 12227–12380, 17172–17353)
> are SD-native theme classes on **non-root** selectors (form-embed/proposal), so
> they are out of scope for this root-rule inventory.

---

## 6. TMP references in CSS layer

**Grep `tmp` / `taxmonitor` (case-insensitive) in `lentax-base.css`,
`themes/tpp-coastal.css`, `themes/tpp-sentinel.css`, `themes/tpp-default.css`,
`themes/vlp-default.css`: ZERO matches.**

The CSS layer contains **no** literal `tmp`/`taxmonitor` hook of any kind. This
means product divergence for the TMP loaders (`lentax-tmp-{default,coastal,
sentinel}.js`) lives **entirely in the JS layer** — the CSS has no
TMP-specific selector, token, or body-class target.

**Context PE will want when comparing CSS vs. JS layers (naming mismatch):**
the TaxMonitor product surface *does* exist in the CSS, but it is labeled
**`TM` / `--tm-*`**, never `tmp`:

- `--tm-*` token block defined at **`lentax-base.css:5615–5624`**
  (`--tm-accent-gradient`, `--tm-red #dc2626`, `--tm-navy #14213d`, `--tm-card`,
  `--tm-border`, `--tm-radius 16px`, etc.).
- Consumed by the TM Proposal (~5970+), TM Intake, TM Dashboard (R16/17/21,
  lines 6286–6396), and TM Support (R22/23, lines 17690–17789) blocks — i.e.
  Clusters that sit on the shared `#dashboard-view` / `#client-page-view` roots
  inventoried above.

So the open TMP-fate question has two distinct spellings in play:
- **JS layer:** `lentax-tmp-*.js` loaders + R24 `body.lentax-tmp-*` body class
  (plumbed defensively, no CSS consumer yet).
- **CSS layer:** `TM` / `--tm-*` TaxMonitor styling on global roots (real, live).

Whether "TM" (the TaxMonitor page styling) is the same product as the R24
"tmp" body-class target is itself a question for PE — the CSS gives no explicit
link between them.

---

## 7. Surprises / flags for PE

1. **The recon regex's "R8–R23" framing undercounts.** Root-keyed rules span
   **four** provenance buckets, not one series: R16/R17/R21 (TM Dashboard),
   R22/R23 (TM Support), **R58** (VLP-track checklist), and the **entire
   unmarked §2.15 block** (141 rules). §2.15 alone is 90% of the
   `#dashboard-view` rules and carries **no** round marker.

2. **§2.15 is the primary bleed source and the load-bearing R25 decision.**
   It is the TPP rose/champagne dashboard skin, un-scoped on bare
   `#dashboard-view`, so it currently paints on **every** variant's dashboard
   (VLP, Coastal, Sentinel, and any TMP). Its `--vlpd-*` **token island**
   (line 13665) is scoped to `#dashboard-view {}` — prefixing *that* rule per
   variant is the highest-leverage / highest-risk single edit, since ~130
   downstream rules resolve their colors through those tokens.

3. **Round-numbering collision.** Two independent round series coexist in this
   file: the TM series (R8–R23) and the VLP-dashboard series (rounds 1–65).
   R58 here is VLP-track, not a typo for an R-series gap. PE should confirm the
   body-class target per *track*, not per number.

4. **5 partial-`!important` rules** (cascade-collision flags for prefixing):
   lines 6300 (7/8), 6369 (5/8), 17690 (7/10), 17761 (6/10), 17779 (1/3). The
   non-`!important` declarations in these blocks (box-shadow, transitions,
   letter-spacing, cursor) will keep their current cascade weight after
   prefixing — prefixing raises specificity by one class, so no regression is
   expected, but these are the rules to eyeball in R25-execute.

5. **R22/R23 attribution is slightly blurred** on the matrix-cell family
   (17761–17779): the `.cbe-block:has(> …tm-matrix-cell)` base rule and
   spacer-hide carry explicit "R23 re-scope" comments, while the
   cell-left/right/hover rules that share the same `:has()` anchor sit under
   the R22 "True 2×2 matrix" heading with no per-rule marker. Attributed
   `R22/R23` above. All are one visual feature and should get the same prefix.

6. **`#dashboard-view` wraps ALL portal pages** (documented at 14383 / R13).
   Any bare `#dashboard-view .cbe-*` or `.row.no-gutters` rule is page-global,
   which is exactly why the TM Dashboard (R16/17/21) rules and §2.15 rules
   collide today. R25-execute's prefixes are the structural fix for this.

---

## 8. Style-spec check

Per canonicals rule 12: this round produced only this recon markdown file and
touched **no** CSS rules, selectors, or properties. `lentax-base.css` and all
theme CSS are byte-unchanged. No style-spec consultation required.
