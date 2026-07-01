# THEMES.md — LenTax Skin Token Mapping

**Status:** Draft pending Principal review
**Owner:** JLW (Principal review required before Commit 3 executes)
**Source audit:** `.palette-audit.tmp.txt` (462 unique palette values from lentax.css @ 60b177d)
**Governs:** Commit 3 tokenization sweep — every literal palette value in lentax.css is either mapped here or explicitly listed under "Literals — do not tokenize".

> **RC note (author):** This is a pre-fill against the rulings already in place. Every aggressive snap is logged. Classification judgment calls are surfaced in §6 and in the task report. Canonical token values are all hexes/triplets that appear literally in the source audit — none invented.

---

## 1. Architecture summary

- `lentax-base.css` — structure + `:root` token fallbacks (default = TPP rose/crimson)
- `themes/{product}-{variant}.css` — `:root` overrides only, one file per (product, variant)
- SuiteDash Custom JS per portal: `<script>` block loads `lentax-base.css` + one theme file via two `<link>` tags. Manually edit the theme filename per portal when a client's theme changes.
- Theme files contain only a `:root` block — no selectors, no rules, no media queries.

## 2. Naming conventions

- Prefix: `--lentax-*` (collision-safe against SuiteDash's own custom properties)
- Family: `--lentax-{family}-{role}` (e.g. `--lentax-tpp-crimson-primary`)
- RGB-channel tokens for multi-alpha families: `--lentax-{family}-{role}-rgb: R, G, B`. Call sites compose: `rgba(var(--lentax-tpp-crimson-primary-rgb), 0.12)`.
- Semantic role names, not value names. `--lentax-tpp-crimson-primary`, not `--lentax-pink-hot`.

## 3. Token families

### 3.1 TPP rose/crimson (Tax Prep Pro brand)

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-tpp-crimson-primary` | `#E91E63` | Brand primary; SuiteDash registry value |
| `--lentax-tpp-crimson-primary-rgb` | `233, 30, 99` | For alpha composition |
| `--lentax-tpp-crimson-deep` | `#8B1538` | Deep crimson surface |
| `--lentax-tpp-crimson-deep-rgb` | `139, 21, 56` | For alpha composition |
| `--lentax-tpp-crimson-maroon` | `#5C0D24` | Darkest maroon surface |
| `--lentax-tpp-crimson-magenta` | `#C2185B` | Material pink-700 deep accent |
| `--lentax-tpp-crimson-light` | `#FFE5EC` | Light pink surface |
| `--lentax-tpp-crimson-light-rgb` | `255, 229, 236` | For alpha composition (matches `#FFE5EC`) |
| `--lentax-tpp-crimson-tint` | `#FFF1F5` | Lightest pink tint |
| `--lentax-tpp-crimson-surface-deep` | `#2A1820` | Near-black rose surface |
| `--lentax-tpp-crimson-surface-darkest` | `#1A0B14` | Deepest rose-black surface |
| `--lentax-tpp-crimson-muted` | `#6B5260` | Muted mauve |
| `--lentax-tpp-crimson-muted-alt` | `#8B7280` | Muted mauve-gray |

**Snapped values (aggressive snap log):**

| Original | Snapped to | Justification |
|---|---|---|
| `#ff66cc` | `--lentax-tpp-crimson-primary` (`#E91E63`) | Near-magenta variant; collapses to brand primary |
| `#fb7185` | `--lentax-tpp-crimson-primary` | Rose-400 family, snaps to primary |
| `#ff1493` | `--lentax-tpp-crimson-primary` | Deeppink, snaps to primary |
| `#ff00aa` | `--lentax-tpp-crimson-primary` | Magenta neon, snaps to primary |
| `#ff00cc` | `--lentax-tpp-crimson-primary` | Magenta neon, snaps to primary |
| `#ff00ff` | `--lentax-tpp-crimson-primary` | Pure magenta neon, snaps to primary |
| `#ff33cc` | `--lentax-tpp-crimson-primary` | Magenta neon, snaps to primary |
| `#ff33ff` | `--lentax-tpp-crimson-primary` | Magenta neon, snaps to primary |
| `#ff66ff` | `--lentax-tpp-crimson-primary` | Magenta neon, snaps to primary |
| `#ff99ff` | `--lentax-tpp-crimson-primary` | Light magenta neon, snaps to primary |
| `#ff003f` | `--lentax-tpp-crimson-primary` | Pink-red neon, snaps to primary |

**Alpha-composition rewrites (Commit 3 → `rgba(var(--…-rgb), {alpha})`):**

- `--lentax-tpp-crimson-primary-rgb` (`233, 30, 99`): `rgba(233, 30, 99, 0.08)`, `rgba(233, 30, 99, 0.12)`, `rgba(233, 30, 99, 0.14)`, `rgba(233, 30, 99, 0.20)`, `rgba(233, 30, 99, 0.25)`, `rgba(233, 30, 99, 0.28)`, `rgba(233, 30, 99, 0.3)`, `rgba(233, 30, 99, 0.30)`, `rgba(233, 30, 99, 0.35)`, `rgba(233, 30, 99, 0.4)`, `rgba(233, 30, 99, 0.40)`, `rgba(233, 30, 99, 0.42)`, `rgba(233, 30, 99, 0.45)`
- `--lentax-tpp-crimson-deep-rgb` (`139, 21, 56`): `rgba(139, 21, 56, 0.04)`, `rgba(139, 21, 56, 0.05)`, `rgba(139, 21, 56, 0.06)`, `rgba(139, 21, 56, 0.08)`, `rgba(139, 21, 56, 0.10)`, `rgba(139, 21, 56, 0.12)`, `rgba(139, 21, 56, 0.14)`, `rgba(139, 21, 56, 0.16)`, `rgba(139, 21, 56, 0.18)`, `rgba(139, 21, 56, 0.20)`, `rgba(139, 21, 56, 0.22)`, `rgba(139, 21, 56, 0.25)`, `rgba(139, 21, 56, 0.30)`, `rgba(139, 21, 56, 0.40)`
- `--lentax-tpp-crimson-light-rgb` (`255, 229, 236`): `rgba(255, 229, 236, 0.6)`

### 3.2 VLP orange (Virtual Launch Pro brand — primary)

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-vlp-orange-primary` | `#f97316` | Tailwind orange-500; SuiteDash registry value |
| `--lentax-vlp-orange-primary-rgb` | `249, 115, 22` | For alpha composition |
| `--lentax-vlp-orange-hover` | `#fb923c` | Tailwind orange-400; used in `.vl-btn--primary:hover` |
| `--lentax-vlp-orange-hover-rgb` | `251, 146, 60` | For alpha composition (matches `#fb923c`) |
| `--lentax-vlp-orange-dark` | `#ea580c` | Tailwind orange-600; deep orange |
| `--lentax-vlp-orange-darkest` | `#8B3F08` | Orange-brown shadow tone |
| `--lentax-vlp-orange-burnt` | `#C25A0E` | Burnt-orange accent |
| `--lentax-vlp-orange-amber` | `#E67300` | Dark amber-orange (also `rgb(230, 115, 0)`) |
| `--lentax-vlp-orange-light` | `#FFF4E5` | Lightest orange tint surface |
| `--lentax-vlp-orange-pantone` | `#F47B20` | **DISTINCT** — kept separate (see §6 open Q #2); 9 alpha variants |
| `--lentax-vlp-orange-pantone-rgb` | `244, 123, 32` | For alpha composition (matches `#F47B20`) |

**Snapped values:**

| Original | Snapped to | Justification |
|---|---|---|
| `#97316` | `#f97316` (`--lentax-vlp-orange-primary`) | **TYPO FIX** — 5-digit hex, intended `#f97316` (ruling 4) |
| `#ff9902` | `--lentax-vlp-orange-primary` | Near-orange-500, snap |
| `#ff9933` | `--lentax-vlp-orange-primary` | Mid-orange, snap (also `rgb(255, 153, 51)`) |
| `#ffa733` | `--lentax-vlp-orange-primary` | Mid-orange, snap |
| `#ffb04d` | `--lentax-vlp-orange-primary` | Light orange, snap |
| `#ff8a3d` | `--lentax-vlp-orange-primary` | Orange, snap |
| `#ff9a1f` | `--lentax-vlp-orange-primary` | Orange, snap |
| `#FF8C00` | `--lentax-vlp-orange-primary` | Darkorange, snap |
| `#FFA500` | `--lentax-vlp-orange-primary` | CSS orange, snap (also `rgb(255, 165, 0)`) |
| `#FFA559` | `--lentax-vlp-orange-primary` | Light orange, snap |
| `#ff4500` | `--lentax-vlp-orange-dark` | Orangered, snap |
| `rgb(255, 159, 67)` | `--lentax-vlp-orange-primary` | Orange, snap |
| `rgb(255, 170, 0)` | `--lentax-vlp-orange-primary` | Orange-gold; see orphan resolution below |

**Orange glow alpha variants** (distinct decorative triplets; alpha-glow effects — snapped into the orange family but NOT matching the canonical `249,115,22` triplet, so rewritten as a glow token set, NOT to primary-rgb — Principal: confirm whether to collapse or keep as literal glows):

`rgba(255, 100, 0, 0.9)`, `rgba(255, 120, 0, 0.3)`, `rgba(255, 120, 0, 0.4)`, `rgba(255, 120, 0, 0.6)`, `rgba(255, 120, 0, 1)`, `rgba(255, 130, 0, 0.5)`, `rgba(255, 140, 0, 0.3)`, `rgba(255, 140, 0, 0.6)`, `rgba(255, 140, 0, 0.95)`, `rgba(255, 156, 36, 1)`, `rgba(255, 160, 0, 0.6)`, `rgba(255, 165, 0, 0.10)`, `rgba(255, 165, 0, 0.15)`, `rgba(255, 165, 0, 0.40)`, `rgba(255, 165, 0, 1)`, `rgba(255, 50, 0, 0.8)`, `rgba(255, 60, 0, 0.6)`, `rgba(255, 80, 0, 0.7)`, `rgba(255, 237, 213, 0.9)`

**Alpha-composition rewrites:**

- `--lentax-vlp-orange-primary-rgb` (`249, 115, 22`): `rgba(249, 115, 22, 0.04)`, `rgba(249, 115, 22, 0.06)`, `rgba(249, 115, 22, 0.10)`, `rgba(249, 115, 22, 0.12)`, `rgba(249, 115, 22, 0.14)`, `rgba(249, 115, 22, 0.16)`, `rgba(249, 115, 22, 0.22)`, `rgba(249, 115, 22, 0.25)`, `rgba(249, 115, 22, 0.30)`, `rgba(249, 115, 22, 0.35)`, `rgba(249, 115, 22, 0.45)`, `rgba(249, 115, 22, 0.55)`, `rgba(249, 115, 22, 0.75)`, `rgba(249, 115, 22, 0.95)`, `rgba(249,115,22,0.95)`
- `--lentax-vlp-orange-hover-rgb` (`251, 146, 60`): `rgba(251, 146, 60, 0.85)`, `rgba(251, 146, 60, 0.95)`
- `--lentax-vlp-orange-pantone-rgb` (`244, 123, 32`): `rgba(244, 123, 32, 0.10)`, `rgba(244, 123, 32, 0.12)`, `rgba(244, 123, 32, 0.14)`, `rgba(244, 123, 32, 0.18)`, `rgba(244, 123, 32, 0.20)`, `rgba(244, 123, 32, 0.25)`, `rgba(244, 123, 32, 0.30)`, `rgba(244, 123, 32, 0.40)`, `rgba(244, 123, 32, 0.45)`

**Orphan resolution:** `var(--orange-gold, rgb(255, 170, 0))` at line 1801 → replace fallback with `--lentax-vlp-orange-primary` per ruling 6 (folds into VLP orange family). Principal: confirm whether to mint a dedicated `--lentax-vlp-orange-amber` token instead.

### 3.3 VLP navy (Virtual Launch Pro brand — surfaces/accents)

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-vlp-navy-deep` | `#0A1228` | Deepest navy surface |
| `--lentax-vlp-navy-deep-rgb` | `10, 18, 40` | For alpha composition (matches `#0A1228`) |
| `--lentax-vlp-navy-mid` | `#162848` | Mid navy |
| `--lentax-vlp-navy-bright` | `#1e3a8a` | Brighter navy (Tailwind blue-800) |
| `--lentax-vlp-navy-slate` | `#111827` | Slate-navy (Tailwind gray-900) |
| `--lentax-vlp-navy-surface` | `#0F1A33` | Navy panel surface |
| `--lentax-vlp-navy-void` | `#070a10` | Near-black navy void |
| `--lentax-vlp-navy-nearblack` | `#050711` | Near-black navy (layered) |
| `--lentax-vlp-navy-royal` | `#062f6b` | Royal-navy accent |

**Navy/dark-blue alpha surfaces** (deep blue-black tints, used as glass/scrim backgrounds — candidate for a small `-rgb` set; Principal: confirm consolidation. Distinct triplets kept literal-composed for now):

`rgba(10, 10, 12, 0.97)`, `rgba(10, 12, 18, 0.92)`, `rgba(10, 18, 40, 0.30)`, `rgba(11, 18, 32, 0.60)`, `rgba(11, 18, 32, 0.75)`, `rgba(12, 12, 14, 0.96)`, `rgba(15, 23, 42, 0.45)`, `rgba(15, 23, 42, 0.98)`, `rgba(15, 26, 51, 0.08)`, `rgba(18, 22, 32, 0.95)`, `rgba(18,18,30,0.05)`, `rgba(18,18,30,0.06)`, `rgba(18,18,30,0.07)`, `rgba(18,18,30,0.08)`, `rgba(18,18,30,0.88)`, `rgba(22, 40, 72, 0.50)`, `rgba(5,6,12,0.35)`, `rgba(8,10,16,0.92)`, `rgba(8,10,16,0.96)`, `rgba(30, 30, 34, 0.99)`, `rgba(32, 32, 36, 0.98)`, `rgba(51, 65, 85, 0.95)`

### 3.4 VLP bronze/parchment (Virtual Launch Pro warm-neutral system)

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-vlp-bronze-primary` | `#cd7f32` | Classic bronze |
| `--lentax-vlp-bronze-copper` | `#b87333` | Copper-bronze (also `rgb(123, 108, 73)` approx) |
| `--lentax-vlp-bronze-sienna` | `#a0522d` | Sienna accent |
| `--lentax-vlp-bronze-light` | `#D4A574` | Light bronze |
| `--lentax-vlp-bronze-light-rgb` | `212, 165, 116` | For alpha composition (matches `#D4A574`) |
| `--lentax-vlp-bronze-tan` | `#C7BFB3` | Warm tan-gray |
| `--lentax-vlp-parchment-soft` | `#F5E6D3` | Parchment background |
| `--lentax-vlp-parchment-soft-rgb` | `245, 230, 211` | For alpha composition |
| `--lentax-vlp-parchment-warm` | `#F5EFE6` | Warm parchment |
| `--lentax-vlp-parchment-warm-rgb` | `245, 239, 230` | For alpha composition (matches `#F5EFE6`) |
| `--lentax-vlp-parchment-stone` | `#E8E0D2` | Stone parchment |
| `--lentax-vlp-parchment-cream` | `#FFFAF4` | Lightest cream surface |
| `--lentax-vlp-bronze-surface-1` | `#2b2419` | Dark bronze surface |
| `--lentax-vlp-bronze-surface-2` | `#1F1A15` | Darker bronze surface |
| `--lentax-vlp-bronze-surface-3` | `#1A1612` | Deep bronze surface |
| `--lentax-vlp-bronze-surface-4` | `#14110D` | Deepest bronze surface |
| `--lentax-vlp-bronze-shadow` | `#5a4b35` | Bronze shadow tone (also `rgb(90, 78, 52)`) |
| `--lentax-vlp-bronze-shadow-alt` | `#65573b` | Bronze shadow variant |

**Snapped values:**

| Original | Snapped to | Justification |
|---|---|---|
| `rgb(123, 108, 73)` | `--lentax-vlp-bronze-copper` | Bronze-gray, snap to copper |
| `rgb(90, 78, 52)` | `--lentax-vlp-bronze-shadow` (`#5a4b35`) | Exact match of `#5a4b35` in rgb form |

**Alpha-composition rewrites:**

- `--lentax-vlp-bronze-light-rgb` (`212, 165, 116`): `rgba(212, 165, 116, 0.14)`, `rgba(212, 165, 116, 0.16)`, `rgba(212, 165, 116, 0.20)`, `rgba(212, 165, 116, 0.45)`
- `--lentax-vlp-parchment-soft-rgb` (`245, 230, 211`): `rgba(245, 230, 211, 0.08)`, `rgba(245, 230, 211, 0.40)`, `rgba(245, 230, 211, 0.5)`, `rgba(245, 230, 211, 0.55)`, `rgba(245, 230, 211, 0.75)`, `rgba(245, 230, 211, 0.80)`, `rgba(245, 230, 211, 0.85)`
- `--lentax-vlp-parchment-warm-rgb` (`245, 239, 230`): `rgba(245, 239, 230, 0.08)`, `rgba(245, 239, 230, 0.40)`, `rgba(245, 239, 230, 0.75)`, `rgba(245, 239, 230, 0.80)`, `rgba(245, 239, 230, 0.85)`

### 3.5 VLP gold (separate from bronze — `--lm-gold` family)

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-vlp-gold-primary` | `#FFD700` | Pure gold (also `rgb(255, 215, 0)`) |
| `--lentax-vlp-gold-primary-rgb` | `255, 215, 0` | For alpha composition |
| `--lentax-vlp-gold-muted` | `#e0b54c` | The existing `--lentax-lm-gold` value |
| `--lentax-vlp-gold-antique` | `#c9a958` | Antique gold |
| `--lentax-vlp-gold-tan` | `#E8C088` | Light tan-gold |
| `--lentax-vlp-gold-amber` | `#ffb300` | Amber-600 |
| `--lentax-vlp-gold-amber-deep` | `#854d0e` | Deep amber-brown (amber-800) |
| `--lentax-vlp-gold-yellow` | `#facc15` | Yellow-400 |
| `--lentax-vlp-gold-yellow-bright` | `#fde047` | Yellow-300 |
| `--lentax-vlp-gold-yellow-light` | `#fef9c3` | Yellow-100 surface |
| `--lentax-vlp-gold-tint` | `#fff8e3` | Lightest gold tint |

**Snapped values:**

| Original | Snapped to | Justification |
|---|---|---|
| `#FFB733` | `--lentax-vlp-gold-amber` | Amber-orange, snap to amber (judgment call — see report) |
| `#FFFF33` | `--lentax-vlp-gold-yellow` | Bright yellow, snap |
| `rgb(255, 187, 51)` | `--lentax-vlp-gold-amber` | Amber, snap (= `#FFB733`) |
| `rgb(255, 235, 59)` | `--lentax-vlp-gold-yellow` | Yellow, snap |
| `rgb(255, 255, 0)` | `--lentax-vlp-gold-yellow` | Pure yellow, snap |

**Gold/amber glow alpha variants** (decorative glows; Principal: collapse to `--lentax-vlp-gold-primary-rgb` or keep literal):

`rgba(255, 215, 0, 0.1)`, `rgba(255, 215, 0, 0.15)`, `rgba(255, 215, 0, 0.25)`, `rgba(255, 215, 0, 0.3)`, `rgba(255, 215, 0, 0.95)`, `rgba(255, 215, 0, 1)`, `rgba(255, 179, 0, 0.6)`, `rgba(255, 180, 0, 0.7)`, `rgba(255, 187, 51, 0.6)`, `rgba(255, 200, 0, 0.4)`, `rgba(255, 200, 0, 0.8)`, `rgba(255, 200, 50, 0.3)`, `rgba(255, 220, 0, 0.4)`, `rgba(255, 220, 80, 0.5)`, `rgba(230, 184, 0, 0.9)`, `rgba(255, 239, 120, 1)`, `rgba(255, 240, 100, 0.5)`, `rgba(255, 255, 120, 0.6)`

### 3.6 Accent purple (cross-product)

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-accent-purple` | `#8c52ff` | Already declared in consolidated `:root` |
| `--lentax-accent-purple-hover` | `#a178ff` | Already declared |
| `--lentax-accent-purple-badge` | `linear-gradient(135deg, #9b5de5, #6a0dad)` | Already declared (gradient); stops `#9b5de5`, `#6a0dad` |

**Purple alpha/accent variants:**

`rgba(232, 121, 249, 0.12)` (fuchsia accent), `rgba(45, 35, 66, 0.3)`, `rgba(45, 35, 66, 0.4)` (dark purple-gray surface)

### 3.7 Semantic state

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-state-success` | `#00b894` | Primary success |
| `--lentax-state-success-rgb` | `0, 184, 148` | For alpha composition |
| `--lentax-state-success-dark` | `#166534` | Green-800 dark success |
| `--lentax-state-success-deep` | `#2c452d` | Deep green surface |
| `--lentax-state-success-olive` | `#1f2d14` | Dark olive surface |
| `--lentax-state-success-light` | `#dcfce7` | Green-100 success surface |
| `--lentax-state-success-mint` | `#6ee7b7` | Emerald-300 |
| `--lentax-state-success-mint-2` | `#86efac` | Green-300 |
| `--lentax-state-success-emerald` | `#3EB489` | Mountain-meadow emerald |
| `--lentax-state-error` | `#e53935` | Primary error |
| `--lentax-state-error-rgb` | `229, 57, 53` | For alpha composition |
| `--lentax-state-error-dark` | `#991b1b` | Red-800 dark error |
| `--lentax-state-error-strong` | `#cc0000` | Strong red |
| `--lentax-state-error-light` | `#fee2e2` | Red-100 error surface |
| `--lentax-state-error-light-2` | `#fca5a5` | Red-300 |
| `--lentax-state-warning` | `#fbbf24` | Primary warning (amber-400; overlaps gold family visually) |
| `--lentax-state-info` | `#1e88e5` | Info blue (Material blue-600) |
| `--lentax-state-info-bright` | `#0984e3` | Bright info blue |
| `--lentax-state-info-apple` | `#007AFF` | iOS system blue |
| `--lentax-state-info-light` | `#dbeafe` | Blue-100 info surface |
| `--lentax-state-info-light-2` | `#93c5fd` | Blue-300 |

**Snapped values:**

| Original | Snapped to | Justification |
|---|---|---|
| `#00b300` | `--lentax-state-success` | Green, snap |
| `#00cc00` | `--lentax-state-success` | Green, snap |
| `#00e65c` | `--lentax-state-success` | Green, snap |
| `#00e676` | `--lentax-state-success` | Green, snap |
| `#00ff00` | `--lentax-state-success` | Pure green neon, snap |
| `#00ff70` | `--lentax-state-success` | Green neon, snap |
| `#00ff99` | `--lentax-state-success` | Green neon, snap |
| `#00ffcc` | `--lentax-state-success` | Spring-green neon, snap |
| `#33ff33` | `--lentax-state-success` | Green neon, snap |
| `#33ffee` | `--lentax-state-success` | Spring-green/cyan neon, snap (judgment call — see report) |
| `rgb(0, 200, 120)` | `--lentax-state-success` | Green, snap |
| `rgb(0, 255, 0)` | `--lentax-state-success` | Pure green, snap |
| `rgb(76, 175, 80)` | `--lentax-state-success` | Material green, snap |
| `#ff0000` | `--lentax-state-error-strong` | Pure red, snap |
| `#ff0201` | `--lentax-state-error-strong` | Near-pure red, snap |
| `#ff1a1a` | `--lentax-state-error-strong` | Red, snap |
| `#ff3333` | `--lentax-state-error-strong` | Red, snap |
| `#ff6666` | `--lentax-state-error-light-2` | Light red/salmon, snap |
| `#ff8080` | `--lentax-state-error-light-2` | Salmon, snap |
| `#b22234` | `--lentax-state-error` | Flag-red; snap to error (judgment call — see report) |
| `rgb(255, 0, 0)` | `--lentax-state-error-strong` | Pure red, snap |
| `#0000ff` | `--lentax-state-info` | Pure blue, snap |
| `rgb(0, 0, 255)` | `--lentax-state-info` | Pure blue, snap |
| `rgb(30, 144, 255)` | `--lentax-state-info` | Dodgerblue, snap |
| `rgb(33, 150, 243)` | `--lentax-state-info` | Material blue, snap |

**Semantic-state alpha variants** (decorative/glow; Principal: confirm `-rgb` consolidation):

- success/green: `rgba(40, 167, 69, 0.92)`, `rgba(0, 255, 0, 0.2)`, `rgba(0, 255, 0, 0.3)`, `rgba(0, 255, 0, 0.4)`, `rgba(0, 255, 0, 0.5)`, `rgba(0, 255, 0, 0.6)`, `rgba(0, 255, 0, 0.8)`, `rgba(0, 255, 127, 0.15)`, `rgba(0, 255, 127, 0.3)`, `rgba(0, 255, 127, 0.5)`
- error/red: `rgba(220, 53, 69, 0.92)`, `rgba(255, 0, 0, 0.08)`, `rgba(255, 0, 0, 0.15)`, `rgba(255, 0, 0, 0.3)`, `rgba(255, 0, 0, 0.5)`, `rgba(255, 0, 0, 0.6)`
- info/blue: `rgba(0, 0, 255, 0.2)`, `rgba(0, 0, 255, 0.3)`, `rgba(0, 0, 255, 0.5)`, `rgba(0, 0, 255, 0.6)`

### 3.8 Canonical dark surfaces

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-surface-dark` | `#111` | Already declared (formerly `--dark-base`) |
| `--lentax-surface-dark-hover` | `#1a1a1a` | Already declared (formerly `--dark-hover`) |
| `--lentax-surface-near-black` | `#050505` | Near-black for layered surfaces |
| `--lentax-surface-charcoal` | `#101010` | Charcoal surface |
| `--lentax-surface-ink` | `#1d1d1f` | Ink surface (formerly `--lm-bg`) |
| `--lentax-surface-panel` | `#262626` | Panel surface |
| `--lentax-surface-elevated` | `#333333` | Elevated panel (also `#333`, `--border-panel`) |
| `--lentax-surface-cool-1` | `#34, 34, 38` (`rgb(34, 34, 38)`) | Cool-tinted dark surface |
| `--lentax-surface-cool-2` | `rgb(58, 58, 63)` | Cool-tinted dark surface |
| `--lentax-surface-cool-3` | `rgb(83, 83, 89)` | Cool-tinted dark surface |

**Snapped values (dark grayscale → nearest surface token):**

| Original | Snapped to | Justification |
|---|---|---|
| `#111111` | `--lentax-surface-dark` (`#111`) | 6-digit form of `#111` |
| `#222` | `--lentax-surface-panel` | Dark gray, snap |
| `#333` | `--lentax-surface-elevated` | Equals `--border-panel`; dark gray |
| `#262626` | `--lentax-surface-panel` | Panel gray |
| `#3a3a3a` | `--lentax-surface-elevated` | Dark gray, snap |
| `rgb(10, 10, 10)` | `--lentax-surface-near-black` | Near-black (also fallback at line 1804) |
| `rgb(18, 18, 18)` | `--lentax-surface-charcoal` | Charcoal, snap |
| `rgb(20, 20, 20)` | `--lentax-surface-charcoal` | Charcoal, snap |
| `rgb(26, 26, 26)` | `--lentax-surface-dark-hover` (`#1a1a1a`) | Equals `#1a1a1a` in rgb form |
| `rgb(34, 34, 34)` | `--lentax-surface-panel` | Dark gray, snap |
| `rgb(40, 40, 40)` | `--lentax-surface-panel` | Dark gray, snap |
| `rgb(60, 60, 60)` | `--lentax-surface-elevated` | Mid-dark gray, snap |

### 3.9 Canonical text-on-dark (white-with-alpha)

Tokenize a small canonical set; leave decorative alpha variants literal (see §5.7).

| Token | Canonical value | Notes |
|---|---|---|
| `--lentax-text-on-dark` | `rgba(255, 255, 255, 0.90)` | Primary text on dark surfaces |
| `--lentax-text-on-dark-muted` | `rgba(255, 255, 255, 0.62)` | Muted text |
| `--lentax-text-on-dark-faint` | `rgba(255, 255, 255, 0.4)` | Faint text (`0.40` normalizes to `0.4`) |
| `--lentax-border-on-dark` | `rgba(255, 255, 255, 0.10)` | Subtle border |
| `--lentax-overlay-glass-soft` | `rgba(255, 255, 255, 0.05)` | Soft glass overlay |
| `--lentax-overlay-glass-medium` | `rgba(255, 255, 255, 0.10)` | Medium glass overlay |
| `--lentax-overlay-glass-strong` | `rgba(255, 255, 255, 0.2)` | Strong glass overlay (`0.20` normalizes to `0.2`) |

> The remaining ~50 `rgba(255, 255, 255, *)` alpha steps are decorative tuning, not theme tokens — listed literal in §5.7.

### 3.10 Font tokens (Phase 7 — themeable typography)

Added 2026-06-19. Replaces hardcoded `font-family` stacks across the base stylesheet so themes can re-skin typography (Sentinel prerequisite — Source Sans 3). Declared in base `:root` and redeclared in every theme file (same TPP values, so the override surface is complete and explicit). This phase is typography-neutral: the same fonts render, now via tokens.

| Token | Canonical value (TPP default) | Role |
|---|---|---|
| `--lentax-font-serif` | `'Cormorant Garamond', Georgia, serif` | Display / doc / heading serif |
| `--lentax-font-sans` | `'Inter', 'Helvetica Neue', Arial, sans-serif` | Body / UI sans |
| `--lentax-font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | Code / passkey / number contexts |
| `--lentax-font-display` | `'Raleway', 'Inter', sans-serif` | Display / brand font (account cards, tooltip, `.vl-shell`, LenBot chat) — added Phase 8 |

All Inter-primary stacks (`'Inter', sans-serif`, `'Inter', Arial, sans-serif`, the `"Inter", "Poppins", …` 3D-letter stack) fold into `--lentax-font-sans` — same first family, so rendering is unchanged (Inter always loads via the `@import`); only dead fallback chains are normalized. The legacy `--vlpd-font-display` / `--vlpd-font-body` indirection tokens were re-pointed to `var(--lentax-font-serif)` / `var(--lentax-font-sans)` (Phase 2a pattern), so the DocGen v1 surface flows through the same themeable tokens. (`--vlpd-font-display` previously listed `"Playfair Display"` as a secondary fallback; Playfair is not loaded by the `@import`, so dropping it is render-neutral.)

**Display font tokenized (Phase 8, 2026-06-19):** the former Raleway/Segoe one-offs are now `--lentax-font-display`. Phase 7 left them literal because Raleway wasn't loaded by the `@import`; Phase 8 adds Raleway to the `@import` (weights 400/500/600/700, matching Inter) so the default actually renders, then re-points all five sites:

- `'Raleway', sans-serif` ×3 — account-card subtitle, account-card title, tooltip bubble → `var(--lentax-font-display)`.
- `Raleway, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif` — `.vl-shell` root → `var(--lentax-font-display)` (richer system fallback dropped; Raleway now loads, so primary render is unchanged).
- `'Segoe UI', sans-serif` — LenBot chat container; a **bare system default**, so folded into `--lentax-font-display`. Intended render change: LenBot chat Segoe UI → Raleway (Default/Coastal/VLP) / Source Sans 3 (Sentinel). On-brand upgrade + now themeable.

**Literals — still not tokenized (functional / one-off, like icon fonts):**

- `"Material Icons"` — icon font: functional glyph mapping, not typography.
- `inherit` — CSS keyword, not a family.

Fonts loaded by the top-of-file `@import`: Cormorant Garamond, Inter, Raleway (added Phase 8), Source Sans 3 (the last hoisted for DocGen doc3 and reused by Sentinel in Phase 8).

## 4. Per-theme palette overrides

Each theme file overrides ONLY the tokens that differ from the base. Non-overridden tokens fall through to the `lentax-base.css` `:root` fallback.

### 4.1 `themes/tpp-default.css` — TPP rose/crimson

Overrides: none (base IS TPP rose/crimson). File declares the brand tokens explicitly for self-documentation, identical values to base.

### 4.2 `themes/vlp-default.css` — VLP orange + navy + bronze + gold

Overrides brand tokens to VLP families. Non-brand tokens (semantic state, surfaces, text) fall through.

| Token in base | Override in vlp-default | Source |
|---|---|---|
| `--lentax-tpp-crimson-primary` | (not overridden — VLP doesn't redefine TPP tokens) | — |
| `--lentax-vlp-orange-primary` | `#f97316` | Declared in this file |
| `--lentax-vlp-orange-hover` | `#fb923c` | Declared in this file |
| `--lentax-vlp-navy-deep` | `#0A1228` | Declared in this file |
| `--lentax-vlp-navy-mid` | `#162848` | Declared in this file |
| `--lentax-vlp-bronze-primary` | `#cd7f32` | Declared in this file |
| `--lentax-vlp-gold-primary` | `#FFD700` | Declared in this file |

(NOTE: open question — does VLP need to NULL the TPP tokens, or does VLP-only CSS reference its own VLP tokens? Principal: rule on whether base CSS body uses TPP tokens vs. a generic `--lentax-brand-*` indirection layer. See §6 open questions.)

### 4.3 `themes/tpp-coastal.css` — TPP Coastal (teal/navy/seafoam)

Cool coastal re-skin of the TPP brand token surface — teal / ocean-navy / seafoam replacing rose/crimson. Same token surface as `tpp-default.css`; only values differ. Fonts unchanged (Cormorant Garamond + Inter — inherits the TPP default font tokens). Non-brand tokens (semantic state, surfaces, text) fall through to base.

| Token in base | Override in tpp-coastal | Source |
|---|---|---|
| `--lentax-tpp-crimson-primary` | `#0B8A95` (teal) | Declared in this file |
| `--lentax-tpp-crimson-deep` | `#143A52` (ocean-navy) | Declared in this file |
| `--lentax-tpp-crimson-light` | `#DCEEF5` (pale blue) | Declared in this file |
| `--lentax-tpp-crimson-tint` | `#EFF7FB` (lightest tint) | Declared in this file |
| `--lentax-tpp-champagne` | `#CDE5E8` (seafoam accent) | Declared in this file |
| `--lentax-tpp-gold-bright` | `#9FCDD6` (bright seafoam) | Declared in this file |
| `--lentax-page-bg-image` | `url('https://precious-lily-bbe555.netlify.app/assets/coastal-bg.svg')` (seafoam waves) | Declared in this file |
| `--lentax-font-serif` | `'Cormorant Garamond', Georgia, serif` (TPP default) | Declared in this file |
| `--lentax-font-sans` | `'Inter', 'Helvetica Neue', Arial, sans-serif` (TPP default) | Declared in this file |
| `--lentax-font-display` | `'Raleway', 'Inter', sans-serif` (TPP default) | Declared in this file |

**Loader:** `lentax-install-coastal.js` — preload-swap FOUC loader (injects `lentax-base.css` then `themes/tpp-coastal.css`); pasted into the portal's SuiteDash Custom JS. Activation tag:
`<script src="https://precious-lily-bbe555.netlify.app/lentax-install-coastal.js"></script>`

### 4.4 `themes/tpp-sentinel.css` — TPP Sentinel (navy/red/cream)

Patriotic re-skin of the TPP brand token surface — signal-red / navy / cream replacing rose/crimson. Same token surface as `tpp-coastal.css`; only values differ. Fonts overridden to Source Sans 3 (headings and display included — Sentinel has no serif display and no Raleway); Source Sans 3 already loads via the base `@import`, so no import change is needed. Non-brand tokens (semantic state, surfaces, text) fall through to base.

| Token in base | Override in tpp-sentinel | Source |
|---|---|---|
| `--lentax-tpp-crimson-primary` | `#dc2626` (signal-red) | Declared in this file |
| `--lentax-tpp-crimson-deep` | `#14213d` (navy) | Declared in this file |
| `--lentax-tpp-crimson-light` | `#E7ECF3` (pale) | Declared in this file |
| `--lentax-tpp-champagne` | `#F5EFE0` (cream surface) | Declared in this file |
| `--lentax-tpp-gold-leaf` | `#B08D57` (antique gold) | Declared in this file |
| `--lentax-tpp-gold-bright` | `#C9A227` (brighter gold) | Declared in this file |
| `--lentax-page-bg-image` | `url('https://precious-lily-bbe555.netlify.app/assets/sentinel-bg.svg')` (red/white/blue swoosh) | Declared in this file |
| `--lentax-font-serif` | `'Source Sans 3', 'Georgia', serif` (overrides TPP default) | Declared in this file |
| `--lentax-font-sans` | `'Source Sans 3', 'Helvetica Neue', Arial, sans-serif` (overrides TPP default) | Declared in this file |
| `--lentax-font-display` | `'Source Sans 3', 'Helvetica Neue', Arial, sans-serif` (overrides TPP default — Sentinel's display = its sans identity, no Raleway) | Declared in this file |

**Loader:** `lentax-install-sentinel.js` — preload-swap FOUC loader (injects `lentax-base.css` then `themes/tpp-sentinel.css`); pasted into the portal's SuiteDash Custom JS. Activation tag:
`<script src="https://precious-lily-bbe555.netlify.app/lentax-install-sentinel.js"></script>`

### 4.5 Shared theme variants (product-neutral theme files)

The three install variants — Default, Coastal, Sentinel — share the **same theme CSS files**. Each `lentax-install-{variant}.js` loader injects `lentax-base.css` + `themes/tpp-{variant}.css` — there is no separate per-variant product theme CSS.

This is safe because the theme files are **product-neutral**: each is a `:root` block of token overrides only (no selectors, no product-scoped rules — see §1 and the subsections above), so the same palette applies cleanly under any loader. The product split lives in the loaders (which portal pastes which `lentax-install-*` vs `lentax-vlp` activation tag), not in the theme CSS.

**Body-class plumbing (R24):** every loader stamps a distinguishing class on `<body>` on load so `lentax-base.css` rules can be scoped per variant — `lentax-install-{default,coastal,sentinel}` from the install loaders and `lentax-vlp` from `lentax-vlp.js`.

**TMP fold (R26):** R24 also plumbed a defensive set of TaxMonitor / TMP loaders + body classes while that product's fate was undecided. **R26 retired TMP entirely — folded into the install variants:** the three TMP loaders were deleted and the R25 body-class prefixes in `lentax-base.css` were rewritten from the TMP classes to `lentax-install-*`, so the TaxMonitor (TM) page styling now runs on all three install portals. There is no separate TMP loader, theme file, or body class any longer.

## 5. Literals — do not tokenize

The following values stay as literals in `lentax.css` after the Commit 3 sweep. No token is created for them.

### 5.1 Cyan/teal/blue-purple stragglers (one-offs)

Per ruling 3, leave literal: `#3c3b6e`, `#0088cc`, `#33ccff`, `#33d4ff`, `#00c8ff`, `#00cec9`, `#39a0a8`, `#66ffdd`. Related light-cyan tints kept literal with them: `#e0f7fa`. Plus cyan alpha variants: `rgba(110, 231, 255, 0.18)`, `rgba(110, 231, 255, 0.25)`, `rgba(51, 204, 255, 0.15)`, `rgba(51, 204, 255, 0.3)`.

### 5.2 Shadow values (`rgba(0, 0, 0, *)`)

All alpha variants of `rgba(0, 0, 0, *)`. Shadows are tuning per-rule, not theming. Leave literal (both spaced and compact source forms):

`rgba(0, 0, 0, 0)`, `rgba(0, 0, 0, 0.04)`, `rgba(0, 0, 0, 0.05)`, `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.1)`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.15)`, `rgba(0, 0, 0, 0.16)`, `rgba(0, 0, 0, 0.2)`, `rgba(0, 0, 0, 0.20)`, `rgba(0, 0, 0, 0.22)`, `rgba(0, 0, 0, 0.25)`, `rgba(0, 0, 0, 0.26)`, `rgba(0, 0, 0, 0.28)`, `rgba(0, 0, 0, 0.3)`, `rgba(0, 0, 0, 0.35)`, `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.55)`, `rgba(0, 0, 0, 0.6)`, `rgba(0, 0, 0, 0.7)`, `rgba(0, 0, 0, 0.75)`, `rgba(0, 0, 0, 0.8)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.9)`, `rgba(0, 0, 0, 1)`, `rgba(0,0,0,0.06)`, `rgba(0,0,0,0.1)`, `rgba(0,0,0,0.12)`, `rgba(0,0,0,0.18)`, `rgba(0,0,0,0.25)`, `rgba(0,0,0,0.3)`, `rgba(0,0,0,0.4)`, `rgba(0,0,0,0.55)`, `rgba(0,0,0,0.78)`

> Commit 3 cosmetic normalization (ruling 9): compact `rgba(0,0,0,0.1)` → spaced `rgba(0, 0, 0, 0.1)`; `0.10` → `0.1`. No token, no rendering change.

### 5.3 Decorative gradients

The audit regex captured only `#hex` and `rgba()`/`rgb()` tokens, so no multi-stop gradient appears as a standalone audit value. The one declared gradient (`--lentax-accent-purple-badge`, §3.6) is already tokenized. No additional literal gradients to list. Principal: confirm no inline gradients need a literal carve-out during the sweep.

### 5.4 Pure neutrals

Pure black/white and grayscale separators/text-on-light stay literal: `#000`, `#000000`, `#fff`, `#FFFFFF`, `rgb(0, 0, 0)`, `rgb(255, 255, 255)`. Mid/light grays (separators, borders, text-on-light): `#444`, `#444444`, `#555`, `#777`, `#999`, `#bbb`, `#ccc`, `#cccccc`, `#cfcfcf`, `#ddd`, `#dedede`, `#e2e2e2`, `#f0f0f0`, `#f2f2f2`, `#f5f5f5`, `#fafafa`, `#fbfbfb`, `#f9fafb`, `#fffdf5`, `rgb(200, 200, 200)`, `rgb(235, 235, 235)`, `rgb(240, 240, 240)`, `rgb(250, 247, 247)`. (`transparent`, `currentColor` also literal but not present in the audit.)

### 5.5 Intentional inline-style override patterns

`--list-index` (line ~3832) — set by markup/JS, never declared in CSS (ruling 5). Do not migrate. Do not declare in `:root`.

### 5.6 Cool light neutrals (blue-gray / slate) — literal

Light cool grays used as text-on-light, borders, and chip surfaces — kept literal (not part of any brand family): `#374151`, `#4b5563`, `#d1d5db`, `#e5e7eb`, `#f3f4f6`, `#cbd5f5`, `#D6D6E7`. Cool-gray alpha variants: `rgba(148, 163, 184, 0.6)`, `rgba(203, 213, 225, 0.6)`, `rgba(203, 213, 225, 0.8)`, `rgba(209, 213, 219, 0.90)`, `rgba(209, 213, 219, 0.95)`, `rgba(229, 231, 235, 0.92)`, `rgba(229, 231, 235, 0.98)`, `rgba(214,215,221,0.98)`, `rgba(228,229,234,0.98)`, `rgba(246,246,249,0.98)`, `rgba(240, 240, 240, 0.6)`.

### 5.7 Decorative white-on-dark alpha variants — literal

The `rgba(255, 255, 255, *)` steps NOT promoted to a §3.9 token are per-rule decorative tuning — leave literal (both spaced and compact source forms):

`rgba(255, 255, 255, 0)`, `rgba(255, 255, 255, 0.02)`, `rgba(255, 255, 255, 0.03)`, `rgba(255, 255, 255, 0.04)`, `rgba(255, 255, 255, 0.05)`, `rgba(255, 255, 255, 0.06)`, `rgba(255, 255, 255, 0.08)`, `rgba(255, 255, 255, 0.1)`, `rgba(255, 255, 255, 0.10)`, `rgba(255, 255, 255, 0.12)`, `rgba(255, 255, 255, 0.14)`, `rgba(255, 255, 255, 0.15)`, `rgba(255, 255, 255, 0.16)`, `rgba(255, 255, 255, 0.2)`, `rgba(255, 255, 255, 0.22)`, `rgba(255, 255, 255, 0.25)`, `rgba(255, 255, 255, 0.28)`, `rgba(255, 255, 255, 0.35)`, `rgba(255, 255, 255, 0.4)`, `rgba(255, 255, 255, 0.45)`, `rgba(255, 255, 255, 0.5)`, `rgba(255, 255, 255, 0.6)`, `rgba(255, 255, 255, 0.62)`, `rgba(255, 255, 255, 0.7)`, `rgba(255, 255, 255, 0.70)`, `rgba(255, 255, 255, 0.75)`, `rgba(255, 255, 255, 0.76)`, `rgba(255, 255, 255, 0.78)`, `rgba(255, 255, 255, 0.8)`, `rgba(255, 255, 255, 0.80)`, `rgba(255, 255, 255, 0.82)`, `rgba(255, 255, 255, 0.85)`, `rgba(255, 255, 255, 0.86)`, `rgba(255, 255, 255, 0.9)`, `rgba(255, 255, 255, 0.90)`, `rgba(255, 255, 255, 0.92)`, `rgba(255, 255, 255, 0.95)`, `rgba(255, 255, 255, 0.96)`, `rgba(255, 255, 255, 0.98)`, `rgba(255, 255, 255, 1)`, `rgba(255,255,255,0.06)`, `rgba(255,255,255,0.08)`, `rgba(255,255,255,0.1)`, `rgba(255,255,255,0.10)`, `rgba(255,255,255,0.12)`, `rgba(255,255,255,0.14)`, `rgba(255,255,255,0.15)`, `rgba(255,255,255,0.16)`, `rgba(255,255,255,0.18)`, `rgba(255,255,255,0.20)`, `rgba(255,255,255,0.22)`, `rgba(255,255,255,0.24)`, `rgba(255,255,255,0.26)`, `rgba(255,255,255,0.4)`, `rgba(255,255,255,0.7)`, `rgba(255,255,255,0.80)`, `rgba(255,255,255,0.9)`, `rgba(255,255,255,0.92)`, `rgba(255,255,255,0.95)`, `rgba(255,255,255,0.98)`

> Note: the seven values promoted in §3.9 (`0.90`, `0.62`, `0.4`/`0.40`, `0.10`, `0.05`, `0.2`/`0.20`) appear in this list too; the §3.9 rows take precedence for those specific steps. All others stay literal.

## 6. Open questions for Principal

1. **Generic brand indirection layer?** Should `lentax.css` body reference TPP-specific tokens (`--lentax-tpp-crimson-primary`) directly, OR a generic indirection (`--lentax-brand-primary`) that each theme file maps to its product's actual color? Direct = simpler base CSS, theme files redeclare every brand token. Indirection = base CSS uses generic names, theme files map to product palette. Direct is what §4 above assumes.
2. **VLP orange — `#F47B20` vs. `#f97316`:** snap or keep distinct? `#F47B20` appears in 9 alpha variants (`rgba(244, 123, 32, *)`) — significant usage suggesting it's intentional. RC kept distinct (`--lentax-vlp-orange-pantone`) pending ruling.
3. **VLP bronze vs. VLP gold:** are these one family or two? The audit shows both `#cd7f32`/`#b87333` (bronze) and `#FFD700`/`#e0b54c` (gold) — visually distinct, kept as separate token families (§3.4 and §3.5).
4. **Decorative gradient list:** §5.3 found no standalone gradient values in the audit (regex captured only hex/rgba). Confirm no inline gradients need a literal carve-out.
5. **Orange/gold glow alpha sets (NEW):** §3.2 and §3.5 list ~37 glow `rgba()` values whose triplets do NOT match the canonical brand RGB (e.g. `rgba(255, 120, 0, *)`, `rgba(255, 200, 0, *)`). Per §8 decision criteria these are NOT silently rounded. Principal: collapse each into a small named glow token, or leave literal?
6. **Navy alpha surfaces (NEW):** §3.3 lists ~22 deep blue-black `rgba()` surface tints with many distinct triplets. Consolidate into a small `--lentax-vlp-navy-*-rgb` set, or leave literal as per-surface tuning?
7. **Warning vs. gold overlap (NEW):** `#fbbf24` is mapped to `--lentax-state-warning` (§3.7) but is visually amber and could read as gold. Confirm it stays a semantic-state token, not a gold-family token.
8. **`#b22234`, `#33ffee` classification (NEW):** flag-red `#b22234` snapped to error; cyan-green `#33ffee` snapped to success. Both are borderline — confirm or reassign (could be stragglers).

## 7. Audit summary

Counts are RC's tally from classification (source values per family; "alpha-variant count" = `rgba()`/`rgb()` entries, "hex count" = `#hex` entries). Totals reconcile to 462.

| Family | Hex count | Alpha-variant count | Total source values | Canonical tokens proposed |
|---|---|---|---|---|
| TPP rose/crimson | 21 | 28 | 49 | 13 |
| VLP orange | 17 | 45 | 62 | 11 |
| VLP navy | 9 | 22 | 31 | 9 |
| VLP bronze/parchment | 18 | 18 | 36 | 18 |
| VLP gold | 13 | 21 | 34 | 11 |
| Accent purple | 4 | 3 | 7 | 3 |
| Semantic state | 23 | 20 | 43 | 21 |
| Surfaces (dark) | 8 | 9 | 17 | 10 |
| Text/overlays (white-alpha) | 0 | 60 | 60 | 7 |
| Cool light neutrals (literal) | 7 | 11 | 18 | 0 |
| Stragglers (literal) | 9 | 4 | 13 | 0 |
| Shadows (literal) | 0 | 34 | 34 | 0 |
| Pure neutrals (literal) | 20 | 4 | 24 | 0 |
| **Total** | **149** | **283** | **462** | **103** |
