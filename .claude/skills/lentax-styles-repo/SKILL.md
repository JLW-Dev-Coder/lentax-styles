---
name: lentax-styles-repo
description: Use when working in the lentax-styles repo — editing CSS or JS, moving files, adding rules, or committing. Covers what each file does, what is live vs frozen, how files reach the portals, and the traps that have broken this repo before.
---

# The `lentax-styles` repo

## What ships where

| File | Reaches | How |
|---|---|---|
| `lentax-vlp.js` | Every VLP portal | A one-line `<script src>` in SuiteDash **Custom JS** points at the Netlify copy. Auto-deploys on push — **no SD re-paste needed.** |
| `lentax-base.css` | All portals | Preload-swapped by the loader above. §1 = marketing site, §2 = SuiteDash. |
| `themes/vlp-default.css` | VLP portals | Preload-swapped by the loader. Palette + portal/checkout/login overrides. |
| `themes/tpp-*.css` | TPP install portals | Via `lentax-install-{default,coastal,sentinel}.js` |
| `themes/lentax-install-sentinel-login.css` | `/site/login` | **Not injected.** Documentation only — manually pasted into SD admin Custom CSS. |
| `tracking/posthog-init-vlp.js` | — | **Out of scope. Do not touch.** |
| `lentax-css-pre-migration.snapshot.css` | — | **Frozen historical snapshot. Do not edit.** It duplicates hundreds of grep hits — exclude it from every search. |

## Root files are live URLs

Every file at the repo root is fetched **by path** from Netlify. `lentax-vlp.js` is hardcoded in SD Custom JS on every portal; the loader then fetches `lentax-base.css` and `themes/vlp-default.css` by path.

**Moving a root file breaks every live portal** — app, trial, every TPP install, and every reseller portal that doesn't exist yet. Recovery is a manual SD Custom JS re-paste on each one.

**If files must move, a Netlify `_redirects` file with 200-rewrites must land in the SAME COMMIT as the moves.** Never a commit apart.

`index.html` stays at root — it's the Netlify site root.

## Portal CSS hides inside JavaScript

`lentax-vlp.js` doesn't just load stylesheets. It **injects `<style>` blocks at runtime** (R66 sign-block, R69 Book-Me surfaces, R82 chrome) and runs DOM-mutating IIFEs.

**Grepping `*.css` will miss them.** Always `git grep -n "<thing>" -- "*.css" "*.js"`.

Consequence worth knowing: **top-bar chrome is styled from two files** — the desktop toggle from `lentax-vlp.js`, the mobile toggle from `themes/vlp-default.css`.

## Conventions

- **Rev numbers.** Every rule is annotated `R<n>`, continuing a global sequence. Check `git log` for the current high-water mark.
- **Commit format.** Follow what's in `git log`. Reference the ClickUp task.
- **One commit per defect.** Don't bundle. A bad fix should be revertable without taking a good one with it.
- **There is no `style-spec/` directory in this repo.** Any prompt citing one is importing it in error from a sibling repo. Treat as a no-op.

## Traps

**Em-dash encoding.** Do **not** round-trip files through PowerShell `Get-Content -Raw` → `WriteAllText`. It corrupts em-dashes. Use the read/edit tools directly.

**`dom-class-map.md` can be stale.** It documented `applyCheckoutNavStripV2` as the live nav styler for weeks after that function was deleted. Verify against the code, not the doc.

**Before blaming SuiteDash — or any third party — check our own commits.** The test: *"Was it like this before we started?"* If it worked before, it's our regression until proven otherwise. `git log -S "<declaration>"` finds the introducing commit. A canvas bug was nearly filed as a SuiteDash defect; it was ours, from 2.5 weeks earlier.

## The SuiteDash page-builder editor rewrites what you paste

If you're producing an Embed Block or Text Block for a portal page:

- **HTML comments get mangled into `<p>` tags**, swallowing whatever follows. **Ship comment-free.**
- **`<style>` elements survive.** They work fine in Embed Blocks.
- **Merge codes (`{{...}}`) render in Text Blocks, NOT in Embed Blocks.** That's why the carrier-div pattern exists: a hidden Text Block holds the merge codes, and the Embed Block's script reads them off `data-` attributes. **Block 1 (Text) must come BEFORE Block 2 (Embed) in page order.**
- **Verify in the rendered DOM, not the source you pasted.** The editor is not a passthrough.
