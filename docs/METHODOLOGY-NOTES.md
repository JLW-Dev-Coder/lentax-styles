# Lentax-styles PE / RC methodology notes

## Deploy-marker regex false positives — known classes

When verifying a Netlify deploy by grepping the live CSS for a "marker" (a
distinctive substring expected to appear post-deploy), bare-identifier
regexes have produced false positives in two classes:

1. **Comment-prose bare-identifier match.** A marker like `--vlpd-page-bg`
   greps positive against comment prose ("the `--vlpd-page-bg` token resolves
   to #1a1a1a") even when the actual rule declaration is absent. Mitigation:
   anchor the regex on a property declaration context, e.g.
   `\s+--vlpd-page-bg:\s*` rather than `--vlpd-page-bg` alone.

2. **Property-declaration-order assumption.** A forward regex assuming
   `selector \{ \s* property` matches only if no comment/newline intervenes.
   If a comment line sits between `{` and the first property, the regex
   silently misses. Mitigation: use property-anchored regexes
   (`property:\s*value`) or directionless rule-block extraction over forward
   selector-anchored matches.

## Three-tier sprint model

- **Tier 1** — direct execute, no CC diagnostic, no canonical RC prompt.
  Known-pattern color/token swaps, single-line rules, file adds/edits with
  zero structural change. Owner ratifies in chat, RC executes from a short
  instruction, reports commit SHA + diff line count only.

- **Tier 2** — canonical RC prompt with 6-part report, no CC diagnostic.
  New selector but DOM is already known from prior rounds, new file with
  established pattern. PE asserts the DOM from memory or from
  `dom-class-map.md`.

- **Tier 3** — full CC → PE → RC → validate. New surface, new DOM,
  unknown cascade behavior. Reserved for genuinely new territory.

Default to Tier 1. Escalate only when the actual problem requires it. After
round 30, lentax-styles structural work is closed; future work is UX/UI
polish at Tier 1 unless a fundamentally new surface appears.

## Reference

`dom-class-map.md` at repo root is the source of truth for per-class
effects. Read it before drafting any prompt. Update it when a sprint
adds, removes, or changes the visible effect of a class.
