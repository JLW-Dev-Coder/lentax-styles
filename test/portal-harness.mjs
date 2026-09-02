/* Run:  node test/portal-harness.mjs            (add a file path to test a different build) */

/* ═══════════════════════════════════════════════════════════════════════
   PORTAL RENDER HARNESS — portal/green-service.js

   Source:      p31 (R168) render states; committed at p30-amendment/R171
   Scope:       Boots the real green-service.js IIFE against a hand-rolled
                DOM shim and asserts what it renders in each state.
   Namespace:   #vl-hero and everything the file builds inside it.
   Depends on:  node only. No npm install, no test runner, no package.json.

   WHY THIS FILE IS IN THE REPO
   ---------------------------
   It was rebuilt from scratch three times as ad-hoc guard scripts and
   twice more as a full harness, once per session that needed it. Every
   rebuild cost time and produced a subtly different instrument, which
   means results from different rounds were never quite comparable. A
   committed harness is one instrument; a rebuilt one is five.

   WHY A HAND-ROLLED DOM AND NOT jsdom
   -----------------------------------
   CLAUDE.md forbids npm packages and build tooling in this repo, and
   that guardrail is right: everything here is a static file served
   directly by Netlify. So the shim below implements exactly the DOM
   surface green-service.js actually calls and nothing else. It is not a
   browser and must never be treated as one - see THE LIMIT, below.

   THE LIMIT — READ BEFORE TRUSTING A RESULT
   -----------------------------------------
   This harness proves what the file RENDERS. It cannot prove what the
   browser DISPLAYS: no layout, no cascade, no CSS at all. A string can
   be correct here and invisible, clipped, or overlapped on the live
   portal. The repo's one rule stands unchanged - never write a selector
   against a SuiteDash surface you have not confirmed in a live browser -
   and this file is not that confirmation.
   ═══════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TARGET = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(HERE, '..', 'portal', 'green-service.js');

/* ───────────────────────────────────────────────────────────────────────
   SECTION 1 — THE DOM SHIM

   Every method here exists because green-service.js calls it. Adding a
   method it does not call is how a shim starts lying: the file would
   pass against behaviour the browser never provides. If a future change
   calls something new, the harness throws rather than silently no-ops.
   ─────────────────────────────────────────────────────────────────────── */

const VOID_TAGS = { br: 1, img: 1, input: 1, hr: 1, meta: 1, link: 1 };

function createDom() {
  let ALL = [];

  class Elem {
    constructor(tag, attrs, ancestorIds) {
      this.tagName = (tag || 'div').toUpperCase();
      this.attributes = attrs || {};
      this._ancestorIds = ancestorIds || [];
      this._html = '';
      this._text = '';
      this._listeners = {};
      this._focused = 0;
      this.style = {};
      const self = this;
      this.classList = {
        contains: (c) => self._classes().includes(c),
        add(c) {
          if (this.contains(c)) return;
          const cur = self.attributes['class'] || '';
          self.attributes['class'] = cur ? cur + ' ' + c : c;
        },
        remove(c) {
          self.attributes['class'] = self._classes().filter((x) => x !== c).join(' ');
        },
        toggle(c, on) { if (on) this.add(c); else this.remove(c); }
      };
    }

    _classes() { return (this.attributes['class'] || '').split(/\s+/).filter(Boolean); }

    getAttribute(n) { return Object.prototype.hasOwnProperty.call(this.attributes, n) ? this.attributes[n] : null; }
    setAttribute(n, v) { this.attributes[n] = String(v); }
    removeAttribute(n) { delete this.attributes[n]; }
    hasAttribute(n) { return Object.prototype.hasOwnProperty.call(this.attributes, n); }

    addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); }

    /* The harness's own entry point for a click or a keypress. Listeners
       registered on a node that a later repaint replaced are gone with
       that node, exactly as they are in the browser - which is the whole
       reason paintProjectsSection() re-binds after every write. */
    dispatch(type, ev) {
      const list = this._listeners[type] || [];
      ev = ev || {};
      if (!ev.preventDefault) ev.preventDefault = () => {};
      for (const fn of list) fn.call(this, ev);
      return list.length;
    }

    focus() { this._focused++; }

    get textContent() { return this._text || this._html.replace(/<[^>]*>/g, ''); }
    set textContent(v) { this._text = v; this._html = ''; }

    get innerHTML() { return this._html; }
    set innerHTML(v) { this._html = String(v); reparse(this); }

    querySelectorAll(sel) { return ALL.filter((n) => n._root === this && matches(n, sel)); }
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  }

  /* Descendants are rebuilt from scratch on every innerHTML write, and
     the old nodes - with their listeners - are dropped. That is the
     browser's behaviour and it is load-bearing here: a harness that kept
     stale nodes alive would pass a re-bind bug that the portal shows. */
  function reparse(root) {
    ALL = ALL.filter((n) => n._root !== root);
    const html = root._html;
    const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;
    const stack = [];
    const anc = [];
    let m;
    while ((m = tagRe.exec(html))) {
      const [, closing, rawTag, rawAttrs, selfClose] = m;
      const tag = rawTag.toLowerCase();
      if (closing) {
        const popped = stack.pop();
        if (popped && popped.id) anc.pop();
        continue;
      }
      const attrs = {};
      const attrRe = /([\w:-]+)\s*=\s*"([^"]*)"/g;
      let a;
      while ((a = attrRe.exec(rawAttrs))) attrs[a[1]] = a[2];
      /* Bare boolean attribute, e.g. the scaffold's <section id="vl-projsec" hidden>. */
      if (/(^|\s)hidden(\s|$)/.test(rawAttrs.replace(/="[^"]*"/g, ''))) attrs.hidden = '';

      const el = new Elem(tag, attrs, anc.slice());
      el._root = root;
      ALL.push(el);

      if (!selfClose && !VOID_TAGS[tag]) {
        stack.push({ id: attrs.id });
        if (attrs.id) anc.push(attrs.id);
      }
    }
  }

  /* Supports only what the file uses: '.cls', '#id', 'tag', and a
     descendant pair like '#vl-progress .vl-step'. Anything else throws,
     because a selector this shim silently mismatched would produce an
     empty NodeList and a green test for a broken binding. */
  function matches(el, sel) {
    const parts = sel.trim().split(/\s+/);
    const last = parts[parts.length - 1];
    const selfOk = last.split(/(?=[.#])/).every((tok) => {
      if (tok[0] === '.') return el._classes().includes(tok.slice(1));
      if (tok[0] === '#') return el.attributes.id === tok.slice(1);
      return el.tagName === tok.toUpperCase();
    });
    if (!selfOk) return false;
    for (let i = 0; i < parts.length - 1; i++) {
      const a = parts[i];
      if (a[0] !== '#') throw new Error('harness shim: unsupported ancestor selector "' + a + '" in "' + sel + '"');
      const id = a.slice(1);
      if (!el._ancestorIds.includes(id) && !(el._root && el._root.attributes.id === id)) return false;
    }
    return true;
  }

  const root = new Elem('div', { id: 'vl-hero' });
  root._root = root;

  const document = {
    readyState: 'complete',
    _listeners: {},
    addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
    getElementById(id) {
      if (root.attributes.id === id) return root;
      return ALL.find((n) => n.attributes.id === id) || null;
    },
    querySelectorAll(sel) { return ALL.filter((n) => matches(n, sel)); },
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  };

  return { document, root, all: () => ALL };
}

/* ───────────────────────────────────────────────────────────────────────
   SECTION 2 — BOOTING THE REAL FILE

   The source is read and run unmodified in a vm context. Nothing is
   stubbed inside green-service.js itself: if a test passes, it passed
   against the bytes that ship.
   ─────────────────────────────────────────────────────────────────────── */

const SRC = fs.readFileSync(TARGET, 'utf8');

/* payload:  the object the phase endpoint resolves to.
             null   -> fetch rejects (network failure path)
             {status: n} -> a non-ok HTTP response
   opts.uid: '' drops the client uid, the misconfigured-portal path. */
function boot(payload, opts = {}) {
  const dom = createDom();
  const { document, root } = dom;

  root.attributes['data-client-uid'] = opts.uid !== undefined ? opts.uid : 'uid-test';
  root.attributes['data-client-first'] = opts.first !== undefined ? opts.first : 'Sam';
  root.attributes['data-client-org'] = opts.org !== undefined ? opts.org : 'Acme LLC';

  const warns = [];
  const sandbox = {
    document,
    console: {
      warn: (...a) => warns.push(a.join(' ')),
      log: () => {},
      error: () => {}
    },
    setTimeout, clearTimeout,
    AbortController,
    Promise, Date, Number, Math, JSON, String,
    encodeURIComponent, parseInt, parseFloat,
    fetch() {
      if (payload === null) return Promise.reject(new Error('harness: network down'));
      if (payload && payload.status && !payload.projects) {
        return Promise.resolve({ ok: false, status: payload.status, statusText: payload.statusText || 'Error' });
      }
      return Promise.resolve({
        ok: true, status: 200, statusText: 'OK',
        json: () => Promise.resolve(payload)
      });
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox, { filename: path.basename(TARGET) });

  /* One macrotask is enough: the fetch stub resolves immediately and the
     file's own .then chain is microtasks from there. */
  return new Promise((res) => setTimeout(() => res({
    document, root, warns,
    sec: document.getElementById('vl-projsec'),
    rail: document.getElementById('vl-projects'),
    body: document.getElementById('vl-hero-body')
  }), 0));
}

/* ─── assertions ─────────────────────────────────────────────────────── */

const passed = [];
const failed = [];
function ok(name, cond, detail) {
  if (cond) passed.push(name);
  else failed.push({ name, detail: detail === undefined ? '' : String(detail) });
}
function proj(service, phase, due, label) { return { service, phase, due, label }; }

/* ───────────────────────────────────────────────────────────────────────
   SECTION 3 — THE EIGHT p31 RENDER STATES

   p31 made the rail the list of engagements and the Projects section the
   detail of the selected one. These eight are the states that rule
   produces, including the two that were bugs before it: a selected
   COMPLETE engagement vanishing under the reader, and an unmappable
   phase throwing and taking the rail down with no trace.
   ─────────────────────────────────────────────────────────────────────── */

async function p31States() {
  const THREE = [
    proj('Green Service', 3, '2026-10-01'),
    proj('Payroll Defense', 1),
    proj('Entity Review', 8)
  ];

  /* S1 — no engagements. No section at all, not an empty heading. */
  const s1 = await boot({ projects: [] });
  ok('S1 no engagements: section hidden', s1.sec.hasAttribute('hidden'), 'not hidden');
  ok('S1 no engagements: section empty', s1.sec.innerHTML === '', JSON.stringify(s1.sec.innerHTML.slice(0, 80)));
  ok('S1 no engagements: logged as the not-an-error branch',
    s1.warns.some((w) => /no engagements for this client/.test(w)), JSON.stringify(s1.warns));

  /* S2 — one engagement. Heading, one block, seven cards, NO toggle:
     a control that expands to nothing is worse than no control. */
  const s2 = await boot({ projects: [proj('Green Service', 3, '2026-10-01')] });
  ok('S2 one engagement: section visible', !s2.sec.hasAttribute('hidden'), 'hidden');
  ok('S2 one engagement: heading is "Your progress"',
    /<h2 class="vl-projsec-title">Your progress<\/h2>/.test(s2.sec.innerHTML), s2.sec.innerHTML.slice(0, 140));
  ok('S2 one engagement: exactly one .vl-proj',
    s2.sec.querySelectorAll('.vl-proj').length === 1, s2.sec.querySelectorAll('.vl-proj').length);
  ok('S2 one engagement: no toggle rendered',
    s2.sec.querySelectorAll('.vl-projsec-toggle').length === 0, 'toggle present');
  ok('S2 one engagement: strip has seven cards',
    s2.sec.querySelectorAll('.vl-phase').length === 7, s2.sec.querySelectorAll('.vl-phase').length);
  ok('S2 one engagement: archive note present',
    /vl-projsec-note">Completed engagements are archived and stop appearing here\./.test(s2.sec.innerHTML), 'note changed');

  /* S3 — three engagements, collapsed. The selected one and nothing else.
     The toggle counts the ARRAY, never the loop's output. */
  const s3 = await boot({ projects: THREE });
  ok('S3 collapsed: one block only',
    s3.sec.querySelectorAll('.vl-proj').length === 1, s3.sec.querySelectorAll('.vl-proj').length);
  ok('S3 collapsed: heading unchanged by count (no singular/plural branch)',
    /vl-projsec-title">Your progress</.test(s3.sec.innerHTML), 'heading differs from the single-engagement case');
  ok('S3 collapsed: toggle reads "Show all 3 engagements"', /Show all 3 engagements/.test(s3.sec.innerHTML), 'label wrong');
  ok('S3 collapsed: toggle aria-expanded=false',
    s3.sec.querySelector('.vl-projsec-toggle').getAttribute('aria-expanded') === 'false', 'aria wrong');
  ok('S3 collapsed: rail lists all three',
    s3.rail.querySelectorAll('.vl-pcard').length === 3, s3.rail.querySelectorAll('.vl-pcard').length);
  ok('S3 collapsed: rail heading is the engagement list ("Your Engagements")',
    /vl-rail-title">Your Engagements</.test(s3.rail.innerHTML), s3.rail.innerHTML.slice(0, 140));

  /* S4 — expanded. All three, toggle flips, one heading still. */
  const s4 = await boot({ projects: THREE });
  s4.sec.querySelector('.vl-projsec-toggle').dispatch('click');
  ok('S4 expanded: three blocks',
    s4.sec.querySelectorAll('.vl-proj').length === 3, s4.sec.querySelectorAll('.vl-proj').length);
  ok('S4 expanded: toggle reads "Show fewer"', /Show fewer/.test(s4.sec.innerHTML), 'label wrong');
  ok('S4 expanded: toggle aria-expanded=true',
    s4.sec.querySelector('.vl-projsec-toggle').getAttribute('aria-expanded') === 'true', 'aria wrong');
  ok('S4 expanded: still exactly one heading',
    (s4.sec.innerHTML.match(/vl-projsec-title"/g) || []).length === 1, 'heading count changed on expand');
  ok('S4 expanded: toggle keeps focus after the repaint',
    s4.sec.querySelector('.vl-projsec-toggle')._focused > 0, 'focus lost to the top of the document');

  /* S5 — pick a DIFFERENT engagement while expanded. The list collapses
     onto the pick, so it can never collapse away from the reader's own
     click, and the selection is the one just chosen. */
  const s5 = await boot({ projects: THREE });
  s5.sec.querySelector('.vl-projsec-toggle').dispatch('click');
  s5.sec.querySelectorAll('.vl-proj')
    .find((b) => b.getAttribute('data-project') === '1')
    .dispatch('click', { target: {} });
  ok('S5 select other: collapses to one',
    s5.sec.querySelectorAll('.vl-proj').length === 1, s5.sec.querySelectorAll('.vl-proj').length);
  ok('S5 select other: the one shown is the one picked',
    s5.sec.querySelector('.vl-proj').getAttribute('data-project') === '1',
    s5.sec.querySelector('.vl-proj').getAttribute('data-project'));
  ok('S5 select other: aria-pressed=true on it',
    s5.sec.querySelector('.vl-proj').getAttribute('aria-pressed') === 'true', 'not pressed');
  ok('S5 select other: rail agrees with the section',
    s5.rail.querySelectorAll('.vl-pcard-active').length === 1 &&
    s5.rail.querySelector('.vl-pcard-active').getAttribute('data-project') === '1',
    'rail and section disagree on the selection');

  /* S6 — re-pick the ALREADY-ACTIVE engagement while expanded. A
     legitimate way to collapse the list: the short-circuit must not
     return before clearing the expanded flag. */
  const s6 = await boot({ projects: THREE });
  s6.sec.querySelector('.vl-projsec-toggle').dispatch('click');
  s6.sec.querySelectorAll('.vl-proj')
    .find((b) => b.getAttribute('data-project') === '0')
    .dispatch('click', { target: {} });
  ok('S6 re-pick active: collapses to one',
    s6.sec.querySelectorAll('.vl-proj').length === 1, s6.sec.querySelectorAll('.vl-proj').length);
  ok('S6 re-pick active: selection did not move',
    s6.sec.querySelector('.vl-proj').getAttribute('data-project') === '0', 'selection moved');

  /* S7 — the selected engagement is COMPLETE. It stays on screen. A
     reader who clicks into a finished engagement and watches it vanish
     will think the page broke. */
  const s7 = await boot({ projects: [proj('Entity Review', 8, '2026-05-01')] });
  ok('S7 complete: block still rendered', s7.sec.querySelectorAll('.vl-proj').length === 1, 'vanished');
  ok('S7 complete: carries vl-proj-done',
    s7.sec.querySelector('.vl-proj')._classes().includes('vl-proj-done'), 'no done class');
  ok('S7 complete: all seven cards closed',
    s7.sec.querySelectorAll('.vl-phase-closed').length === 7, s7.sec.querySelectorAll('.vl-phase-closed').length);
  ok('S7 complete: meta reads Complete', /Complete/.test(s7.sec.innerHTML), 'meta wrong');

  /* S8 — an unmappable phase. Degrades to the static view; it must not
     index STEPS and throw, which used to take the whole rail down. */
  const s8 = await boot({ projects: [proj('Odd One', 'banana')] });
  ok('S8 bad phase: section still rendered', s8.sec.querySelectorAll('.vl-proj').length === 1, 'nothing rendered');
  ok('S8 bad phase: seven cards upcoming',
    s8.sec.querySelectorAll('.vl-phase-upcoming').length === 7, s8.sec.querySelectorAll('.vl-phase-upcoming').length);
  ok('S8 bad phase: meta reads Not started', /Not started/.test(s8.sec.innerHTML), 'meta wrong');
  ok('S8 bad phase: warned rather than threw',
    s8.warns.some((w) => /unusable phase value/.test(w)), JSON.stringify(s8.warns));
}

/* ───────────────────────────────────────────────────────────────────────
   SECTION 4 — VOCABULARY

   p29 unified the section on "engagement" and the stepper on "Step";
   R170 finished the job in the STEPS prose. These assert the outcome,
   not the individual strings, so a new string that says "phase" fails
   here without anyone having to remember to add a case.
   ─────────────────────────────────────────────────────────────────────── */

async function vocabulary() {
  const s = await boot({ projects: [proj('Green Service', 1, '2026-10-01'), proj('Payroll Defense', 4)] });
  s.sec.querySelector('.vl-projsec-toggle').dispatch('click');

  /* Class names legitimately contain "phase" - .vl-phase*, .vl-pst - and
     are not copy. Strip them, then nothing the reader sees may say it. */
  const strip = (h) => h.replace(/vl-phase[\w-]*/g, '').replace(/vl-pst[\w-]*/g, '');
  const surfaces = [
    ['projects section', s.sec.innerHTML],
    ['rail', s.rail.innerHTML],
    ['panel on screen at load', s.body.innerHTML]
  ];
  for (const [where, html] of surfaces) {
    const bare = strip(html);
    ok('VOCAB: no client-visible "phase" in the ' + where,
      !/\bphase\b/i.test(bare), (bare.match(/.{0,60}\bphase\b.{0,60}/i) || [''])[0]);
  }

  /* Every step panel, not only the one that happens to render first.

     The second click is not belt-and-braces. A step tab TOGGLES -
     render(current === n ? 0 : n) - so clicking the panel already open
     closes it to the overview, and an earlier cut of this harness then
     asserted against the overview and passed step 1 while step 1 still
     said "phase". Assert the panel is actually on screen before reading
     its prose; a harness that silently tests the wrong surface is worse
     than no harness, because it reports coverage it does not have. */
  const steps = s.document.querySelectorAll('#vl-progress .vl-step');
  ok('VOCAB: seven step tabs in the sidebar', steps.length === 7, steps.length);
  for (let n = 1; n <= steps.length; n++) {
    const onScreen = () => new RegExp('vl-hero-title">Step ' + n + '\\b').test(s.body.innerHTML);
    if (!onScreen()) steps[n - 1].dispatch('click');
    if (!onScreen()) steps[n - 1].dispatch('click');
    ok('VOCAB: step panel ' + n + ' is the surface under test',
      onScreen(), (s.body.innerHTML.match(/vl-hero-title">[^<]*/) || ['(no title)'])[0]);
    const bare = strip(s.body.innerHTML);
    ok('VOCAB: step panel ' + n + ' prose says "step", not "phase"',
      !/\bphase\b/i.test(bare), (bare.match(/.{0,60}\bphase\b.{0,60}/i) || [''])[0]);
  }
}

/* ───────────────────────────────────────────────────────────────────────
   SECTION 5 — PART A'S FIVE OUTCOMES

   NOT YET WRITTEN. The p30 amendment asked for these alongside Part A's
   own work, but Part A's spec has not reached this session, and five
   invented outcomes would be worse than none: they would read as
   coverage in every later round.

   Add them here as a fifth function, registered in SUITES below.
   ─────────────────────────────────────────────────────────────────────── */

const PART_A_OUTCOMES_PENDING = 5;

/* ─── runner ─────────────────────────────────────────────────────────── */

const SUITES = [
  ['p31 render states', p31States],
  ['vocabulary', vocabulary]
];

const RED = '\x1b[31m', GREEN = '\x1b[32m', DIM = '\x1b[2m', OFF = '\x1b[0m';

for (const [name, fn] of SUITES) {
  const before = passed.length + failed.length;
  try {
    await fn();
  } catch (err) {
    failed.push({ name: name + ': threw before finishing', detail: err && err.stack ? err.stack : String(err) });
  }
  const run = passed.length + failed.length - before;
  console.log(DIM + '· ' + name + ' — ' + run + ' assertions' + OFF);
}

console.log('');
for (const name of passed) console.log('  ' + GREEN + 'ok  ' + OFF + name);
for (const f of failed) console.log('  ' + RED + 'FAIL' + OFF + ' ' + f.name + (f.detail ? '\n       got: ' + f.detail : ''));

console.log('');
console.log('target: ' + path.relative(process.cwd(), TARGET));
if (PART_A_OUTCOMES_PENDING) {
  console.log(DIM + 'note:   ' + PART_A_OUTCOMES_PENDING + " Part A outcomes are NOT covered — see SECTION 5." + OFF);
}
if (failed.length) {
  console.log(RED + 'FAILED ' + failed.length + ' of ' + (passed.length + failed.length) + OFF);
  process.exit(1);
}
console.log(GREEN + 'PASS ' + passed.length + '/' + passed.length + OFF);
