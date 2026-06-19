/* js/doc2-8879.js
 * Form 8879 (Doc 2) — SuiteDash Document Generator Custom JS.
 *
 * Source:     ClickUp doc2 page / SuiteDash Contract Template #26454
 * Ported:     2026-06-19
 * Scope:      Tax-year injection + empty-merge-field cleanup on the 8879 doc render.
 * Namespace:  .doc-8879 (root guard), [data-tax-year], .doc-field-value, .doc-field-empty
 * Depends on: none — vanilla DOM, no external libraries; runs standalone.
 *
 * Verbatim port: the body below is the source JS unchanged (no HTML
 * script-tag wrapper was present to strip; no logic, naming, or formatting changes). Not yet wired
 * into any loader or deployed — this file is under version control only.
 */
/* ============================================================
   Doc 2 — 8879 — IRS e-file Signature Authorization
   SuiteDash Document Generator Custom JS
   SD Contract Template #26454
   ============================================================ */
(function () {
  'use strict';
  /**
   * Initialize when the document body is ready.
   * SD Document Generator injects custom JS after the body renders,
   * so DOMContentLoaded may have already fired. Handle both cases.
   */
  function init() {
    var doc = document.querySelector('.doc-8879');
    if (!doc) return;
    injectCurrentYear(doc);
    cleanEmptyFields(doc);
  }
  /**
   * Replace any static "2025" tax year references with the current
   * filing year if the document is generated outside the original
   * tax year. SD does not have a built-in tax-year merge field,
   * so this is a safety net.
   *
   * Logic: If current month is Jan-Apr, tax year = previous year.
   * Otherwise tax year = current year.
   */
  function injectCurrentYear(doc) {
    var now = new Date();
    var month = now.getMonth(); // 0-indexed
    var year = now.getFullYear();
    var taxYear = month <= 3 ? year - 1 : year;
    var yearFields = doc.querySelectorAll('[data-tax-year]');
    for (var i = 0; i < yearFields.length; i++) {
      yearFields[i].textContent = taxYear.toString();
    }
  }
  /**
   * If any merge-field placeholder was not populated by SD
   * (renders as the raw {{placeholder}} text), replace it
   * with an em-dash to keep the document looking clean
   * rather than showing broken template syntax to the client.
   */
  function cleanEmptyFields(doc) {
    var fieldValues = doc.querySelectorAll('.doc-field-value');
    var pattern = /^\{\{.*\}\}$/;
    for (var i = 0; i < fieldValues.length; i++) {
      var text = fieldValues[i].textContent.trim();
      if (pattern.test(text) || text === '') {
        fieldValues[i].textContent = '\u2014'; // em-dash
        fieldValues[i].classList.add('doc-field-empty');
      }
    }
  }
  // Run init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
