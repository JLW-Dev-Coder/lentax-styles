# CLAUDE.md — lentax-styles Repo Conventions

**Audience:** RC (Repo Claude, running in Claude Code inside VS Code), and any future AI agent operating on this repo.
**Maintained by:** JLW
**Last updated:** 2026-06-18

This file is the operating manual for autonomous work in `lentax-styles`. Read it in full at the start of every session before making any changes. If a task prompt conflicts with this file, follow this file and flag the conflict in the report.

---

## Repository Purpose

`lentax-styles` is the single source of truth for ALL CSS and supporting JS loaded into:

- The Lentax marketing/site domain
- The SuiteDash platform at `app.virtuallaunch.pro` (VirtualLaunch Pro / VLP, formerly also TPP — Tax Prep Pro)

Files in this repo are deployed via Netlify to `precious-lily-bbe555.netlify.app/` and consumed by SuiteDash's Custom JS field via `<link>` and `<script>` injection.

### Repository layout

```
/
├── lentax-base.css                 # Master stylesheet — all products + themes inherit
├── lentax-tpp-default.js           # TPP per-theme loader (FOUC-preload IIFE)
├── lentax-vlp-default.js           # VLP per-theme loader (FOUC-preload IIFE)
├── themes/
│   ├── tpp-default.css             # TPP palette overrides
│   └── vlp-default.css             # VLP palette overrides
├── js/                             # Ported behavior JS, one file per source doc
│   └── .gitkeep
├── THEMES.md                       # Token mapping + loader contract
├── CLAUDE.md                       # This file — operating manual
├── index.html                      # Netlify root — usually unused or minimal
├── lentax-css-pre-migration.snapshot.css   # Historical snapshot (do not edit/delete)
├── apps/tmp/scratch/               # Scratch directory (disposable; do not assume persistence)
├── .gitattributes
└── .gitignore
```

### Key files

| File | Purpose |
|---|---|
| `lentax-base.css` | Master stylesheet. All products and themes inherit from it. Sectioned internally (Section 1 = Site, Section 2 = SuiteDash with sub-sections). |
| `lentax-tpp-default.js` | TPP per-theme loader. FOUC-preload IIFE (`loadLentaxStyles`) that injects `lentax-base.css` + `themes/tpp-default.css` via the preload-swap pattern. Pasted into SuiteDash Custom JS on TPP portals. |
| `lentax-vlp-default.js` | VLP per-theme loader. Same pattern as the TPP loader but injects `themes/vlp-default.css`. |
| `themes/*.css` | Per-theme palette overrides (token re-bindings). Loaded SECOND so theme tokens win the cascade over base fallbacks. See `THEMES.md`. |
| `index.html` | Netlify root — usually unused or minimal. |
| `lentax-css-pre-migration.snapshot.css` | Historical reference from the Path Y migration. Do NOT delete. |
| `apps/tmp/scratch/` | Disposable workspace. Anything here is temporary; do not assume persistence. |

### Required reading at session start

Before making any change, read these in full:

- `CLAUDE.md` (this file) — the operating manual.
- `THEMES.md` — token mapping + the per-theme loader contract.
- `lentax-base.css` (at minimum the sections you are touching) — the master stylesheet.

---

## JS Ports

Ported behavior JS lives in `js/{name}.js`, one file per source doc.
Per-theme loaders (`lentax-tpp-default.js`, `lentax-vlp-default.js`) stay
at repo root — they are entry points, the JS analog of `lentax-base.css`.

Convention:
- Filename matches the CU source doc (e.g., `js/doc2-8879.js` for
  `doc2_8879_custom_js.js` in CU).
- Each file has a header comment block matching the CSS sub-section
  pattern: `Source:` (CU page ID), `Ported:` (date), `Scope:` (one line),
  `Namespace:` (DOM selectors it touches), `Depends on:` (any other JS
  files).
- Defensive DOM guards required: a JS file should no-op on pages that
  don't contain the elements it targets.
- No build step. Netlify serves `js/*.js` directly at `/js/{name}.js`.

## JS injection (open question)

The injection model for ported JS is not yet decided:
- Option A: paste each file into the per-doc SuiteDash Custom JS field
  (current pattern for SuiteDash-hosted JS).
- Option B: have the per-theme loader inject `js/*` files at runtime,
  mirroring the CSS loader's `loadLentaxStyles` pattern.
This will be decided at first JS port.

---

## Deploy Contract — Direct to Main

**JLW has explicitly opted into direct-to-main pushes.** RC does NOT open Pull Requests. The full RC workflow for ANY change is:

1. Branch from `main` (always `git pull origin main` first)
2. Make the change
3. Run all task-specified verification checks
4. Commit with a descriptive message (multi-line OK)
5. Merge the branch back to main locally (`git checkout main && git merge --no-ff <branch>`) OR push the branch and merge via `gh pr create --fill && gh pr merge --merge --delete-branch` if you prefer the GitHub-side audit trail
6. Push `main` to origin
7. Wait for Netlify build (typically 30–60 seconds for this repo)
8. Verify deploy via HTTP fetch of the deployed file — confirm expected markers are present
9. Report back

**Default to local merge** (step 5 option A) unless the task prompt explicitly requests a PR.

**Why this policy:** JLW is the only reviewer. PR ceremony adds latency without adding a second pair of eyes. The verification checks in each task prompt are the safety net.

**The exception:** If RC is genuinely uncertain about a change (ambiguous spec, unexpected file state, possible regression risk that wasn't anticipated in the prompt) — STOP, do not merge to main, push the branch only, and flag in the report. JLW will decide whether to merge or course-correct.

---

## Required Verification Before Merging to Main

Every commit that touches `lentax-base.css` or a per-theme loader
(`lentax-tpp-default.js`, `lentax-vlp-default.js`) must pass these checks
before the merge step:

### For `lentax-base.css`

```powershell
# 1. No real HTML <style> tags should ever appear in a .css file (a genuine
#    porting hazard — the CU source files were <style>-wrapped). The check MUST
#    strip /* */ comments BEFORE scanning: the DocGen sub-sections legitimately
#    mention <style>/</style> in documentation prose (e.g. "renders raw <style>
#    source as visible text"), and those comment mentions are NOT defects.
$base = [System.IO.File]::ReadAllText("$PWD\lentax-base.css", [System.Text.Encoding]::UTF8)
$code = [regex]::Replace($base, '/\*[\s\S]*?\*/', '')   # strip comments first
$styleTags = ([regex]::Matches($code, '</?style>')).Count
if ($styleTags -gt 0) { Write-Host "FAIL: real <style> tags in CSS" -ForegroundColor Red; exit 1 }

# 2. Brace balance
$content = Get-Content .\lentax-base.css -Raw
$open = ([regex]::Matches($content, '\{')).Count
$close = ([regex]::Matches($content, '\}')).Count
if ($open -ne $close) { Write-Host "FAIL: Brace mismatch ($open / $close)" -ForegroundColor Red; exit 1 }

# 3. @import statements only at the very top of the file
$firstNonImportLine = (Get-Content .\lentax-base.css | Select-String -Pattern "^\s*[^@/\s]" | Select-Object -First 1).LineNumber
$lastImportLine = (Get-Content .\lentax-base.css | Select-String -Pattern "^@import" | Select-Object -Last 1).LineNumber
if ($lastImportLine -and $firstNonImportLine -and $lastImportLine -gt $firstNonImportLine) {
  Write-Host "FAIL: @import found after non-import rules" -ForegroundColor Red; exit 1
}

# 4. Section structure intact — required headers present
$requiredHeaders = @(
  "LENTAX.CSS — MASTER STYLESHEET",
  "SECTION 1 — SITE / LENTAX",
  "SECTION 2 — SUITEDASH"
)
foreach ($h in $requiredHeaders) {
  if (-not (Select-String -Path .\lentax-base.css -Pattern $h -SimpleMatch -Quiet)) {
    Write-Host "FAIL: Missing required header: $h" -ForegroundColor Red; exit 1
  }
}
```

### For the per-theme loaders (`lentax-*-default.js`)

```powershell
foreach ($loader in @(".\lentax-tpp-default.js", ".\lentax-vlp-default.js")) {
  # 1. Syntactic validity
  node --check $loader
  if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: JS syntax error in $loader" -ForegroundColor Red; exit 1 }

  # 2. FOUC loader must still be present (preload-swap IIFE is load-bearing)
  if (-not (Select-String -Path $loader -Pattern "loadLentaxStyles" -SimpleMatch -Quiet)) {
    Write-Host "FAIL: FOUC preload IIFE removed from $loader" -ForegroundColor Red; exit 1
  }
}
```

If ANY check fails, do not commit. Either fix the issue and re-run, or STOP and flag in the report.

---

## Post-Deploy Verification

After pushing to `main` and waiting for Netlify:

```powershell
Start-Sleep -Seconds 60
$deployed = Invoke-WebRequest -Uri "https://precious-lily-bbe555.netlify.app/lentax-base.css" -UseBasicParsing | Select-Object -ExpandProperty Content

# Confirm new content is live (use a marker specific to THIS change)
$marker = "<replace with marker from the change>"
if ($deployed -match [regex]::Escape($marker)) {
  Write-Host "DEPLOY VERIFIED" -ForegroundColor Green
} else {
  Write-Host "DEPLOY PENDING — re-check in 1–2 min" -ForegroundColor Yellow
}
```

Do NOT block indefinitely on Netlify. If the marker isn't live after 60–90 seconds, note "deploy pending" in the report and move on. Netlify build failures are rare but possible — if the URL returns the OLD file 5+ minutes after push, that's a real failure and JLW should be alerted.

---

## Conventions

### Sectioning

`lentax-base.css` uses a hierarchical comment system. Preserve it:

- `/* ═══... ═══ */` = top-level sections (SECTION 1, SECTION 2)
- `/* ───... ─── */` = sub-sections (2.1, 2.2, etc.)
- `/* comment */` = inline rule annotations

Never reorder sub-sections without explicit prompt approval — cascade order matters. New sub-sections go at the end of their parent section.

### CSS philosophy

- All custom rules use `!important` to defeat SuiteDash's ID-scoped theme injection
- Doubled attribute selectors (`[class*="x"][class*="x"]`) are deliberate for specificity boost
- `:has()` selectors are deliberate for state-driven styling — preserve them verbatim
- Class namespaces: `.tu-*` (TPP), `.vlp-*` (VLP), `.vlpd-*` (legacy TPP). Do not rename across products.

### File integrity rule

A truncated paste is the #1 historical failure mode in this stack. Always verify the file closes correctly (last line is meaningful, brace count balanced) before commit. Do not assume the editor saved cleanly — read the tail of the file with `Get-Content -Tail 5`.

### Git hygiene

- Branch names: `feat/<short-slug>`, `fix/<short-slug>`, `chore/<short-slug>`
- Commit messages: imperative mood, multi-line for non-trivial changes, include a "why" not just a "what"
- Never commit `test.css` or other working files in the repo root — they should be deleted before merge (the Path Y migration set the precedent: input files in root get cleaned up at end-of-task)
- Snapshot files (`*-pre-migration.snapshot.css`) ARE committed and preserved as historical reference

### Out-of-scope guardrails (always apply)

- Do NOT modify Netlify build config (`netlify.toml`, env vars, build settings)
- Do NOT add new external script/style references without explicit prompt approval
- Do NOT touch the SuiteDash Custom CSS textarea or Custom JS field directly — JLW manages those
- Do NOT delete snapshot files
- Do NOT install npm packages or add build tooling — this is a static-file repo

---

## Reporting Format

Every RC task ends with a report. Use this structure:

```
Report — <task name>

1. Summary — one-line description of what was done
2. Diff — files changed, lines added/removed
3. Verification — output of all required checks (pass/fail)
4. Git — branch, commit SHA(s), merge confirmation, push confirmation
5. Deploy — Netlify status, marker verification result
6. Open questions / risks — anything unexpected, flagged for JLW awareness
```

Reports are markdown. Tables for tabular data. Bullets for lists. No fluff.

---

## When to STOP and Ask

Default behavior is autonomous execution end-to-end. Stop and request guidance only when:

- A required input file is missing (e.g., `test.css` not at the expected path)
- A verification check fails and the fix isn't obvious from the task spec
- The current file state doesn't match the task prompt's assumptions
- A change would touch something in the "Out-of-scope guardrails" list
- The cascade behavior of a change is genuinely ambiguous and could regress production rendering

When stopping: push the branch (don't merge), include "STOPPED" prominently in the report, describe the exact state, and propose 2–3 options for JLW to choose from.

---

## Change Log

| Date | Change |
|---|---|
| 2026-06-16 | Initial creation. Locks direct-to-main policy. Codifies verification + deploy contract from FOUC and Path Y migrations. |
| 2026-06-18 | JLW — CLAUDE.md refreshed to match current repo layout (`lentax-base.css` + per-theme loaders + `themes/`; no more `lentax.css` / `lentax.js`). Verification blocks retargeted to current filenames and the real `loadLentaxStyles` FOUC marker. Added `js/` directory + JS Ports convention. |
