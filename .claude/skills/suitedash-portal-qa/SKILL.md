---
name: suitedash-portal-qa
description: Use when verifying a fix on a SuiteDash portal, planning what to test, or writing a diagnostic to run in the browser. Covers what to check, at what widths, in what states — and the ways verification has produced false results before.
---

# Verifying a SuiteDash portal fix

## A DevTools toggle is not proof

A colour change applied in the Styles panel **looked fixed** and was **still black on a real iPhone.** DevTools re-renders in ways the live page does not.

**Verify on the target device.** If that's not possible, say the finding is unverified rather than reporting it as confirmed.

## Verify in every state, not the one you're in

`.fix-top` is added by JS when the header goes sticky. It was present when the element was inspected, so it looked like part of the element's identity. The resulting fix worked **after scrolling** and failed **on first paint.**

Check, as applicable:

- **before and after scroll**
- **collapsed and expanded**
- **empty, focused, filled, and autofilled**
- **each step of a multi-step flow**

A selector confirmed in one state is confirmed for **one state.**

## Widths

| | |
|---|---|
| 320px | iPhone SE |
| 390px | iPhone 14/15 |
| 430px | iPhone Pro Max |
| Desktop | |

**Book-Me rules use `600px`. Form-embed rules use `768px`.** There is no single mobile breakpoint — confirm which one governs the surface you're on.

## The browser-agent viewport is a trap

**`resize_window` does not work in the Claude-in-Chrome environment.** It reports success while `window.innerWidth` stays at desktop.

**The owner must set DevTools device emulation manually** (F12 → Ctrl+Shift+M → 390×844) **before** handing over the tab. Emulation does **not** survive a fresh tab, and may reset on navigation.

**First instruction in any mobile diagnostic: print `window.innerWidth` and stop if it isn't the expected value.** Desktop numbers dressed up as mobile ones have cost multiple cycles.

## Leftover overrides contaminate the next reading

A previous session's DevTools style overrides survived into a later measurement and produced numbers that looked like a real finding. It cost a full cycle.

**Hard-reload (`Ctrl+Shift+R`) before any final reading**, and state in the report whether you did.

When injecting a test `<style>`, give it an ID so it can be removed cleanly:
```js
document.getElementById('vl-test')?.remove();
```

## DOM snapshots capture one step of a multi-step flow

`reference/dom-snapshots/form_outerHTML.txt` was captured at **booking-form step 1**. The Agree & Sign step simply isn't in it — the Angular flow hadn't rendered it yet.

**Not a missing file. A snapshot taken at the wrong moment.** If you need the DOM of a later step, capture it *at that step*, or use a `MutationObserver` rather than assuming the element exists at load.

## Autofill: what to actually check

Chrome's autofill paint only appears **after Chrome fills the field.** Typing manually does not reproduce it.

Check the field **while focused**, not just after blur. A competing `:focus` rule with an ID selector can beat an autofill rule that lacks one — producing a fix that works on blur and fails the instant the user looks at it.

## Signature pad

Two things must both be true:

1. **The drawn ink is visible** (it is black — `penColor` is correct and always has been).
2. **The "Sign Here" watermark is still there.**

The pad has **two stacked canvases**: canvas 0 (static) carries the signature, canvas 1 (absolute) carries the watermark. If the ink shows but the watermark vanished, the index mapping is flipped.

## Blast radius

Before shipping, name the surfaces a change reaches. "VLP portals only" is a claim — check it. Rules on generic SuiteDash classes reach **every content page on every portal**, including ones nobody has looked at today.
