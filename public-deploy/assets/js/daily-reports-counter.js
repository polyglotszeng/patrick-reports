/* ============================================================
 * daily-reports-counter.js (v1.0.0)
 * ------------------------------------------------------------
 * Cross-page single source of truth for "Daily Reports" metric
 * widget shown on /, /pitch, /investor, /openswarm-investor-briefing-2026-06-13.
 *
 * Source: live /daily-reports.html (parsed client-side from its
 *         `const D = [...]` inline JS array — the same array that
 *         powers /daily-reports's own stats + heatmap).
 *
 * Why not a separate JSON file?
 *   - reports.json drift from D[] (198 entries in D vs 211 in
 *     reports.json on 2026-06-25 commit abe6c90).
 *   - Patrick maintains D[] manually as part of daily-reports.html
 *     edits. Adding a second source would break that flow.
 *   - Same-origin fetch of daily-reports.html (~30 KB) parses in
 *     <50 ms with a regex; the saved HTTP roundtrip to a separate
 *     JSON would be similar cost.
 *
 * Usage (HTML):
 *   <div class="dashboard-metric">
 *     <div class="dashboard-metric__value">
 *       <b data-dr-cnt="total">--</b><span>+</span>
 *     </div>
 *     <div class="dashboard-metric__label">总产出篇数</div>
 *   </div>
 *
 *   <script src="/assets/js/daily-reports-counter.js" defer></script>
 *   <script>
 *     DailyReportsCounter.update({ source: '/daily-reports.html' });
 *   </script>
 *
 * Options:
 *   source    — HTML URL containing `const D=[...]`  (default: '/daily-reports.html')
 *   selectors — override DOM targets                (default: see SELECTORS below)
 *   animate   — set false to skip countUp           (default: true)
 *
 * Failure policy: if fetch or parse fails, widget keeps its
 * server-rendered fallback (whatever text is between the tags).
 * No console errors are thrown — only a single warn() for debug.
 * ============================================================ */

(function (global) {
  'use strict';

  var DEFAULT_SELECTORS = {
    total:   '[data-dr-cnt="total"]',
    reports: '[data-dr-cnt="reports"]',
    papers:  '[data-dr-cnt="papers"]',
    days:    '[data-dr-cnt="days"]'
  };

  /**
   * Parse `const D=[ ["date","type","title","desc","file"], ... ];`
   * from the given HTML string. Robust to extra whitespace, comments,
   * and Chinese punctuation inside string literals.
   */
  function parseDArray(html) {
    // Anchor on `const D=[` and end on first `];` at line start.
    var m = html.match(/const\s+D\s*=\s*\[([\s\S]*?)\n\s*\];/);
    if (!m) throw new Error('daily-reports-counter: could not locate `const D=[...];`');

    var body = m[1];
    // Tokenize: each row is a JS array literal — use eval in a Function
    // sandbox to let the browser's parser handle escapes (quotes inside
    // titles, \n, etc.). The body is a known-trusted local HTML file.
    // eslint-disable-next-line no-new-func
    var D = new Function('return [' + body + '];')();
    if (!Array.isArray(D)) throw new Error('daily-reports-counter: parsed D is not an array');
    return D;
  }

  function computeMetrics(D) {
    var linkable = 0, reports = 0;
    var daySet = Object.create(null);
    for (var i = 0; i < D.length; i++) {
      var row = D[i];
      if (!row || row.length < 2) continue;
      var date = row[0], type = row[1], file = row[4];
      if (file) linkable++;
      if (type === 'r') reports++;
      if (date) daySet[date] = true;
    }
    var days = Object.keys(daySet).length;
    var total = linkable;
    var papers = total - reports;
    // If many entries have no file (rare for Patrick's data),
    // fall back to total = D.length so "total" never looks smaller
    // than reports+papers in the UI.
    if (total === 0) total = D.length;
    return { total: total, reports: reports, papers: papers, days: days };
  }

  function countUp(el, to, duration) {
    duration = duration || 700;
    var start = performance.now();
    function frame(now) {
      var p = Math.min((now - start) / duration, 1);
      // easeOutCubic (matches /daily-reports inline animation)
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function apply(metrics, selectors, animate) {
    var targets = {
      total:   document.querySelector(selectors.total),
      reports: document.querySelector(selectors.reports),
      papers:  document.querySelector(selectors.papers),
      days:    document.querySelector(selectors.days)
    };
    function set(key, value) {
      var el = targets[key];
      if (!el) return;
      if (animate) countUp(el, value);
      else el.textContent = String(value);
    }
    set('total',   metrics.total);
    set('reports', metrics.reports);
    set('papers',  metrics.papers);
    set('days',    metrics.days);
  }

  /**
   * Queue-based entrypoint so callers can fire-and-forget BEFORE the
   * script is loaded (typical when the script tag uses `defer`).
   * Multiple calls before load are merged into a single update on DOM ready.
   */
  var queuedOptions = [];
  var booted = false;

  function update(options) {
    queuedOptions.push(options || {});
    if (booted) flush();
  }

  function flush() {
    // Merge options: later calls override earlier ones for top-level keys;
    // selectors are deep-merged so a caller can override only one selector.
    var merged = { selectors: {} };
    for (var i = 0; i < queuedOptions.length; i++) {
      var o = queuedOptions[i] || {};
      if (o.source)   merged.source   = o.source;
      if (o.animate !== undefined) merged.animate = o.animate;
      if (o.selectors) {
        for (var k in o.selectors) merged.selectors[k] = o.selectors[k];
      }
    }
    var source     = merged.source || '/daily-reports.html';
    var selectors  = Object.assign({}, DEFAULT_SELECTORS, merged.selectors);
    var animate    = merged.animate !== false;

    fetch(source, { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        var D = parseDArray(html);
        var metrics = computeMetrics(D);
        apply(metrics, selectors, animate);
        global.__DRMetrics = Object.assign({ source: source }, metrics);
      })
      .catch(function (err) {
        console.warn('[daily-reports-counter] keeping fallback values:', err && err.message);
      });
  }

  function boot() {
    booted = true;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', flush);
    } else {
      flush();
    }
  }

  global.DailyReportsCounter = {
    update: update,
    parseDArray: parseDArray,
    computeMetrics: computeMetrics
  };

  // When loaded via `defer`, this script runs after parse but before
  // DOMContentLoaded; we still need to wait for the body to be parsed
  // before querying DOM targets.
  boot();
})(typeof window !== 'undefined' ? window : this);