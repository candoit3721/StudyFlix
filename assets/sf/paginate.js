/* =========================================================================
   SFPaginate -- measurement-based pagination for every StudyFlix printable
   =========================================================================

   THE PROBLEM THIS REPLACES

   Every studio used to decide how many questions fit on a page with a
   hard-coded constant derived from a one-off manual measurement:

       sophia:  cols * (workspace ? 3 : 4)
       olivia:  layoutFormat === 'horizontal' ? cols * 7 : cols * 4
       yaya:    workspace ? 3 : 4

   Those constants are wrong the moment anything changes -- a longer word
   problem, a taller geometry figure, a KaTeX formula, a new question type, a
   font tweak, a fourth column. And nothing could notice, because nothing
   measured anything. Olivia's horizontal cap of 7 rows overflowed a Letter
   page by 37px at four columns; the answer keys were never paginated at all
   and ran hundreds of pixels past the paper.

   THE APPROACH

   Render the candidate content into a real, laid-out sheet that carries the
   true print geometry, measure what the browser actually produced, and cut
   pages where the content says to cut them. No constant anywhere describes
   how much fits; the page decides.

   This is what makes the system future proof. A new question type is
   paginated correctly on the day it is written, with no cap to re-derive,
   because the paginator never knew what a question was in the first place --
   it only knows how tall the thing in front of it turned out to be.

   WHY MEASUREMENT IS TRUSTWORTHY HERE

   Measuring on screen is only valid if the screen box equals the print box.
   assets/sf/print.css guarantees that: `.sf-sheet` is a fixed-height box with
   identical geometry in both media, and the geometry itself is exposed
   through `:root` custom properties that survive `getComputedStyle` (which
   cannot see inside `@media print`).

   Requires: assets/sf/print.css.
   ========================================================================= */

(function (global) {
  'use strict';

  /* ---------------------------------------------------------------------
     Geometry
     --------------------------------------------------------------------- */

  /**
   * Resolve a CSS length custom property to pixels.
   *
   * Done by letting the browser lay out a probe element rather than parsing
   * "8.5in" or a calc() expression ourselves -- units, calc, and any future
   * override all come out right for free.
   */
  function cssLengthToPx(varName) {
    var probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;visibility:hidden;pointer-events:none;height:0;border:0;padding:0;width:var(' +
      varName +
      ');';
    document.body.appendChild(probe);
    var px = probe.getBoundingClientRect().width;
    probe.parentNode.removeChild(probe);
    return px;
  }

  var geomCache = null;

  /** True print geometry in CSS pixels, read live from the stylesheet. */
  function geometry() {
    if (geomCache) return geomCache;
    geomCache = {
      pageW: cssLengthToPx('--sf-page-w'),
      pageH: cssLengthToPx('--sf-page-h'),
      printW: cssLengthToPx('--sf-print-w'),
      printH: cssLengthToPx('--sf-print-h'),
      sheetH: cssLengthToPx('--sf-sheet-h'),
      padX: cssLengthToPx('--sf-sheet-pad-x'),
      padY: cssLengthToPx('--sf-sheet-pad-y')
    };
    return geomCache;
  }

  // Anything that can change the resolved geometry invalidates the cache.
  global.addEventListener('resize', function () {
    geomCache = null;
  });

  /* ---------------------------------------------------------------------
     Readiness
     --------------------------------------------------------------------- */

  /**
   * Wait until the content's height has stopped changing.
   *
   * Order matters. KaTeX must run first because it rewrites the DOM and pulls
   * in its own font faces; only then is it meaningful to wait on
   * document.fonts.ready. Measuring before webfonts land yields fallback-font
   * metrics, which can be 10% off and quietly shift a page break.
   */
  function ready(root, beforeMeasure) {
    var chain = Promise.resolve();

    if (typeof beforeMeasure === 'function') {
      chain = chain.then(function () {
        return beforeMeasure(root);
      });
    }

    chain = chain.then(function () {
      return document.fonts && document.fonts.ready ? document.fonts.ready : null;
    });

    chain = chain.then(function () {
      // Inline SVG needs no decode; this guards future studios that use <img>.
      var imgs = root ? Array.prototype.slice.call(root.querySelectorAll('img')) : [];
      return Promise.all(
        imgs
          .filter(function (i) {
            return !i.complete;
          })
          .map(function (i) {
            return i.decode ? i.decode().catch(function () {}) : null;
          })
      );
    });

    // Two frames: the first flushes pending style, the second guarantees
    // layout has settled before we start reading rects.
    return chain.then(function () {
      return new Promise(function (resolve) {
        requestAnimationFrame(function () {
          requestAnimationFrame(resolve);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Measurement host
     --------------------------------------------------------------------- */

  var host = null;
  var hostInner = null;

  /**
   * The off-screen container measurement happens inside.
   *
   * It carries a copy of the destination container's class list, because a
   * sheet does not necessarily style itself: yaya sets the paper's font size
   * on the pages container (`.pages-container.font-compact`), so a sheet
   * measured outside that container is measured at the wrong font, and every
   * page break is decided for text that is not the text being printed. That
   * was a real failure -- only the `compact` font size overflowed, and only
   * because measurement never saw it.
   *
   * Copying the class list rather than naming the specific dependency means a
   * studio that adds a new container-level modifier tomorrow gets it right
   * without touching this file.
   *
   * A caller that paginates into a plain wrapper nested inside the styled
   * container passes `measureContext` so the classes that actually apply are
   * the ones mirrored here.
   */
  function measureHost(targetEl) {
    if (!host || !host.isConnected) {
      host = document.createElement('div');
      host.className = 'sf-measure-host';
      host.setAttribute('aria-hidden', 'true');
      hostInner = document.createElement('div');
      host.appendChild(hostInner);
      document.body.appendChild(host);
    }
    if (targetEl) hostInner.className = targetEl.className;
    return hostInner;
  }

  /* ---------------------------------------------------------------------
     Row measurement
     --------------------------------------------------------------------- */

  /**
   * Group a grid's children into visual rows and measure each row.
   *
   * Rows are derived from geometry, not from `index % columns`. That matters:
   * cards in a CSS grid row are stretched to equal height, and some cards span
   * the full width (olivia's word problems use `grid-column: 1 / -1`). Any
   * arithmetic model of "which items share a row" would be wrong for those,
   * and wrong again for whatever auto-placement quirk arrives next. Asking the
   * browser where things actually landed is right by construction.
   *
   * Reads only. No element is written to between reads, so the browser
   * reflows once for the whole pass instead of once per item.
   */
  function measureRows(grid) {
    var gridRect = grid.getBoundingClientRect();
    var children = Array.prototype.slice.call(grid.children);
    if (!children.length) return [];

    var raw = children.map(function (el, i) {
      var r = el.getBoundingClientRect();
      return { index: i, top: r.top - gridRect.top, bottom: r.bottom - gridRect.top };
    });

    var rows = [];
    raw.forEach(function (item) {
      // 1px tolerance: subpixel layout can place row-mates a fraction apart.
      var row = null;
      for (var i = 0; i < rows.length; i++) {
        if (Math.abs(rows[i].top - item.top) <= 1) {
          row = rows[i];
          break;
        }
      }
      if (row) {
        row.bottom = Math.max(row.bottom, item.bottom);
        row.items.push(item.index);
      } else {
        rows.push({ top: item.top, bottom: item.bottom, items: [item.index] });
      }
    });

    rows.sort(function (a, b) {
      return a.top - b.top;
    });

    return rows.map(function (row, i) {
      return {
        height: row.bottom - row.top,
        // Row gap must be carried into the packing arithmetic, or every page
        // over-fills by (rows - 1) * gap.
        gapAfter: i + 1 < rows.length ? Math.max(0, rows[i + 1].top - row.bottom) : 0,
        items: row.items
      };
    });
  }

  /* ---------------------------------------------------------------------
     Packing
     --------------------------------------------------------------------- */

  /**
   * Walk measured rows and decide where the pages break.
   *
   * `availFirst` and `availCont` differ because the first sheet usually
   * carries a taller header (name / date / score) than the continuation
   * sheets. Using one number for both is how a worksheet ends up with its
   * first page over-full and the rest short.
   */
  function packRows(rows, availFirst, availCont) {
    var pages = [];
    var current = [];
    var used = 0;
    var avail = availFirst;
    var overflowRows = 0;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var gap = current.length ? rows[i - 1].gapAfter : 0;
      var need = gap + row.height;

      if (current.length && used + need > avail) {
        pages.push(current);
        current = [];
        used = 0;
        avail = availCont;
        gap = 0;
        need = row.height;
      }

      if (!current.length && row.height > avail) {
        /*
         * A single row taller than an entire page. Nothing can rescue this
         * layout, so it is counted and surfaced rather than swallowed: the
         * studio publishes it on window.__sfPrint.overflowRows and the print
         * test suite fails on it.
         *
         * This is the safety net that keeps the system future proof. A new
         * question type that cannot physically fit fails loudly on the day it
         * is added, instead of quietly overflowing every worksheet.
         */
        overflowRows++;
      }

      used += need;
      current.push(row);
    }

    if (current.length) pages.push(current);
    return { pages: pages, overflowRows: overflowRows };
  }

  /** Flatten packed rows into per-page arrays of item indices. */
  function pagesToItemIndices(packed) {
    return packed.map(function (rows) {
      var out = [];
      rows.forEach(function (row) {
        out.push.apply(out, row.items);
      });
      return out;
    });
  }

  /* ---------------------------------------------------------------------
     Header / footer metrics
     --------------------------------------------------------------------- */

  /**
   * Measure how much room a page actually leaves for content.
   *
   * Rather than measuring the header and footer boxes and subtracting, this
   * builds a probe page at the REAL fixed sheet height containing the header,
   * an empty flexed grid, and the footer -- then reads the grid's height. The
   * browser has already done the arithmetic, so the answer includes every
   * padding, border, and collapsed margin.
   *
   * Subtraction was not good enough. A header's own bounding box excludes a
   * child margin that escapes it through margin collapsing: yaya's exam header
   * measured 267px but consumed 296px of page, and the missing 29px came
   * straight off the bottom of every page as overflow. Asking the layout
   * engine where the content box ends cannot make that mistake.
   *
   * Cached per `cacheKey`: retyping a student's name changes no geometry, and
   * re-measuring on every keystroke would make the sidebar feel sluggish. Row
   * heights are never cached -- they depend entirely on content.
   */
  var chromeCache = Object.create(null);
  global.addEventListener('resize', function () {
    chromeCache = Object.create(null);
  });

  function measureChrome(opts, sheetProto) {
    if (opts.cacheKey && chromeCache[opts.cacheKey]) return chromeCache[opts.cacheKey];

    var h = measureHost(opts.measureContext || opts.target);

    function availableFor(pageIdx, totalPages) {
      var probe = sheetProto.cloneNode(false);
      probe.classList.add('sf-measuring', 'sf-measure-fixed');

      var header = opts.renderHeader ? opts.renderHeader(pageIdx, totalPages) : null;
      if (header) probe.appendChild(header);

      var grid = document.createElement('div');
      grid.className =
        typeof opts.gridClass === 'function' ? opts.gridClass(pageIdx) : opts.gridClass || '';
      // Force the probe grid to claim the leftover space even if the studio's
      // own grid does not flex; we are measuring the room available, not what
      // this particular grid chooses to occupy.
      grid.style.flex = '1 1 auto';
      grid.style.minHeight = '0';
      probe.appendChild(grid);

      var footer = opts.renderFooter ? opts.renderFooter(pageIdx, totalPages) : null;
      if (footer) probe.appendChild(footer);

      h.appendChild(probe);
      var avail = grid.getBoundingClientRect().height;
      h.removeChild(probe);
      return avail;
    }

    var metrics = {
      // Page 1 usually carries a taller header (name, date, score, rubric).
      // Using one budget for both is how a worksheet ends up with its first
      // page over-full and every later page short.
      availFirst: availableFor(0, 2),
      availCont: availableFor(1, 2)
    };

    if (opts.cacheKey) chromeCache[opts.cacheKey] = metrics;
    return metrics;
  }

  /* ---------------------------------------------------------------------
     The measurement pass
     --------------------------------------------------------------------- */

  /**
   * Lay every candidate item out once, in print geometry, and return the row
   * measurements plus the header/footer metrics.
   */
  function measure(opts, items) {
    var h = measureHost(opts.measureContext || opts.target);

    /*
     * The measurement sheet must carry the studio's real classes, or it would
     * not have the geometry and card styling we are trying to measure. That
     * makes it match the same selectors as a finished page, so it also carries
     * `sf-measuring`: anything querying sheets can exclude it and never see a
     * half-built page. Without the marker, a test that samples the DOM before
     * pagination settles measures a 3500px scratch sheet and reports a wild
     * overflow that does not exist.
     */
    var sheet = document.createElement('div');
    sheet.className = (opts.sheetClass || 'sf-sheet') + ' sf-measuring';

    var grid = document.createElement('div');
    grid.className = typeof opts.gridClass === 'function' ? opts.gridClass() : opts.gridClass || '';

    items.forEach(function (item, i) {
      grid.appendChild(opts.renderItem(item, i));
    });

    sheet.appendChild(grid);
    h.appendChild(sheet);

    return ready(sheet, opts.beforeMeasure).then(function () {
      var chrome = measureChrome(opts, sheet);
      var rows = measureRows(grid);

      var result = {
        rows: rows,
        chrome: chrome,
        availFirst: chrome.availFirst,
        availCont: chrome.availCont
      };

      h.removeChild(sheet);
      return result;
    });
  }

  /* ---------------------------------------------------------------------
     Emission
     --------------------------------------------------------------------- */

  /**
   * Pin an emitted grid to the space the paginator allotted it.
   *
   * Cards are elastic: yaya's problem card holds a `flex: 1` workspace box, so
   * it grows to fill its grid row. A grid is a flex item with `min-height:
   * auto` by default, which means it refuses to shrink below that grown
   * content -- and the stretch resolves ABOVE the available space rather than
   * inside it. Two rows measured at their natural 430px emitted at 471px each
   * and pushed 65px off the bottom of the page.
   *
   * `min-height: 0` lets the grid settle into exactly the room it was given,
   * so rows stretch to fill the page instead of past it. It cannot mask a real
   * overflow: the sheet keeps `overflow: visible`, so content that genuinely
   * does not fit still shows up as `scrollHeight > clientHeight` and still
   * fails the print tests.
   */
  function pinGridToAllotment(grid) {
    grid.style.minHeight = '0';
  }

  function emit(opts, items, pageIndices) {
    var total = pageIndices.length;
    var sheets = [];

    pageIndices.forEach(function (indices, pageIdx) {
      var sheet = document.createElement('div');
      sheet.className = opts.sheetClass || 'sf-sheet';

      var header = opts.renderHeader ? opts.renderHeader(pageIdx, total) : null;
      if (header) sheet.appendChild(header);

      var grid = document.createElement('div');
      grid.className =
        typeof opts.gridClass === 'function' ? opts.gridClass(pageIdx) : opts.gridClass || '';
      grid.setAttribute('data-sf-grid', '');
      pinGridToAllotment(grid);
      indices.forEach(function (i) {
        grid.appendChild(opts.renderItem(items[i], i));
      });
      sheet.appendChild(grid);

      var footer = opts.renderFooter ? opts.renderFooter(pageIdx, total) : null;
      if (footer) sheet.appendChild(footer);

      opts.target.appendChild(sheet);
      sheets.push(sheet);
    });

    return sheets;
  }

  /**
   * Bring freshly emitted sheets to their final rendered state before
   * inspecting them.
   *
   * `beforeMeasure` (yaya runs KaTeX in it) is applied to the throwaway copy
   * during measurement, but `emit` builds brand new elements. Without this the
   * verification pass inspects raw `$...$` source text, concludes everything
   * fits, and the page only grows to its true height afterwards -- so the one
   * mechanism meant to catch a bad estimate was itself measuring the wrong
   * document.
   */
  function settleEmitted(opts) {
    if (typeof opts.beforeMeasure === 'function') {
      try {
        opts.beforeMeasure(opts.target);
      } catch (e) {
        if (global.console && console.warn) console.warn('SFPaginate: beforeMeasure failed', e);
      }
    }
  }

  /* ---------------------------------------------------------------------
     Verification
     --------------------------------------------------------------------- */

  /**
   * Emit the pages, then check the result and repack if anything overflowed.
   *
   * Measuring off-screen and emitting into a live page is not quite the same
   * experiment. Cards are elastic -- a `flex: 1` workspace box grows to fill
   * its grid row -- so a row measured at its natural height can settle a few
   * pixels taller once it is on a real page, and a handful of pixels is enough
   * to push the last row off the paper.
   *
   * Rather than enumerate every way that can happen, measure the pages that
   * were actually produced and repack using those heights. Whatever caused the
   * discrepancy, this converges: each round moves the offending rows to the
   * next page, which gives the remaining rows more room, not less.
   *
   * This is the property worth having. A studio added next year with a card
   * shape nobody anticipated does not need the paginator to predict it -- the
   * paginator looks at what happened and corrects.
   */
  function emitVerified(opts, items, pageIndices, availFirst, availCont) {
    var MAX_ROUNDS = 4;
    var corrections = 0;

    /**
     * Has anything ended up outside the space it was given?
     *
     * Deliberately the SAME criterion the print test suite asserts on, rather
     * than an approximation of it. If the paginator's idea of "fits" is looser
     * than the test's, the difference is exactly the set of layouts that ship
     * broken; if it is tighter, pages get needlessly short. Measuring the
     * deepest content edge on the page covers every way content can escape --
     * pushing the footer down, spilling out of a grid pinned to its
     * allotment, or intruding into the sheet's own bottom padding.
     */
    /** How far the deepest content on a sheet sits past its content box. */
    function overshootOf(sheet) {
      var rect = sheet.getBoundingClientRect();
      var cs = getComputedStyle(sheet);
      var contentBottom = rect.height - (parseFloat(cs.paddingBottom) || 0);

      var deepest = 0;
      var all = sheet.querySelectorAll('*');
      for (var j = 0; j < all.length; j++) {
        var b = all[j].getBoundingClientRect().bottom - rect.top;
        if (b > deepest) deepest = b;
      }
      return deepest - contentBottom;
    }

    /** Worst overshoot on the first page, and on any later page. */
    function overshoots(sheets) {
      var first = 0;
      var cont = 0;
      for (var i = 0; i < sheets.length; i++) {
        var over = overshootOf(sheets[i]);
        if (i === 0) first = Math.max(first, over);
        else cont = Math.max(cont, over);
      }
      return { first: first, cont: cont, any: Math.max(first, cont) };
    }

    function overflowing(sheets) {
      return overshoots(sheets).any > 1;
    }

    /** Re-measure the emitted pages as one continuous row stream. */
    function remeasure(sheets) {
      var rows = [];

      /*
       * Release the `min-height: 0` pin first. Pinned, a grid is capped at the
       * space it was given, so its rows report the height they were squeezed
       * into rather than the height they actually want -- and repacking those
       * numbers reproduces the same packing, the correction loop sees no
       * progress, and it gives up with the overflow still there. Unpinned,
       * the rows report what they really need.
       */
      var pinned = [];
      sheets.forEach(function (sheet) {
        var gs = sheet.querySelectorAll('[data-sf-grid]');
        for (var i = 0; i < gs.length; i++) {
          pinned.push(gs[i]);
          gs[i].style.minHeight = '';
        }
      });

      sheets.forEach(function (sheet) {
        var grid = sheet.querySelector('[data-sf-grid]');
        if (!grid) return;
        var measured = measureRows(grid);
        var cursor = 0;
        var ids = itemIdsOf(sheet);
        measured.forEach(function (row) {
          rows.push({
            height: row.height,
            gapAfter: row.gapAfter,
            items: row.items.map(function () {
              return ids[cursor++];
            })
          });
        });
      });

      pinned.forEach(function (grid) {
        grid.style.minHeight = '0';
      });
      return rows;
    }

    /** Global item indices carried by a sheet, in order. */
    function itemIdsOf(sheet) {
      var attr = sheet.getAttribute('data-sf-items');
      return attr ? attr.split(',').map(Number) : [];
    }

    function stamp(sheets, indices) {
      sheets.forEach(function (sheet, i) {
        sheet.setAttribute('data-sf-items', indices[i].join(','));
      });
    }

    var sheets = emit(opts, items, pageIndices);
    stamp(sheets, pageIndices);
    settleEmitted(opts);

    while (corrections < MAX_ROUNDS) {
      var over = overshoots(sheets);
      if (over.any <= 1) break;
      corrections++;

      /*
       * Charge the observed overshoot back to the page budget before
       * repacking.
       *
       * Repacking row heights alone is not always enough: if the mis-estimate
       * is in the page's own chrome rather than its rows -- a header that
       * comes out taller once it is on a real page, say -- then repacking with
       * the same budget reproduces the same pages, the loop sees no progress,
       * and it gives up with the overflow intact. Shrinking the budget by what
       * actually overflowed guarantees the next round differs, and converges.
       */
      if (over.first > 1) availFirst -= over.first + 1;
      if (over.cont > 1) availCont -= over.cont + 1;

      var repacked = packRows(remeasure(sheets), availFirst, availCont);
      var next = repacked.pages.map(function (rows) {
        var out = [];
        rows.forEach(function (row) {
          out.push.apply(out, row.items);
        });
        return out;
      });

      // Nothing further to try: the budget shrank and the packing still did
      // not move, which means a single row simply cannot fit. packRows has
      // already counted that in overflowRows, so stop rather than spin.
      if (JSON.stringify(next) === JSON.stringify(pageIndices)) break;

      pageIndices = next;
      opts.target.innerHTML = '';
      sheets = emit(opts, items, pageIndices);
      stamp(sheets, pageIndices);
      settleEmitted(opts);
    }

    return { sheets: sheets, pageBreaks: pageIndices, corrections: corrections };
  }

  /* ---------------------------------------------------------------------
     Public entry point
     --------------------------------------------------------------------- */

  /**
   * Paginate a list of items into sheets.
   *
   * Modes:
   *   'fill'        pack every item; the page count falls out of the content.
   *                 Used by answer keys.
   *   'exactPages'  honour "N pages of questions" exactly. Over-supplies
   *                 items, measures, then truncates at exactly N full pages,
   *                 so the last page is as full as the first.
   *   'fixedChunk'  the caller demands a specific number of items per page
   *                 (yaya's explicit override). Still measured: if a chunk
   *                 does not fit it is split and `chunkSplits` records it, so
   *                 the request is honoured where possible and reported where
   *                 it is not -- never silently overflowed.
   */
  function paginate(opts) {
    var mode = opts.mode || 'fill';
    opts.target.innerHTML = '';

    if (mode === 'exactPages') return paginateExactPages(opts);

    var items = opts.items || [];
    if (!items.length) {
      return Promise.resolve({
        sheets: [],
        pageBreaks: [],
        usedItems: 0,
        overflowRows: 0,
        chunkSplits: 0,
        metrics: null
      });
    }

    return measure(opts, items).then(function (m) {
      var pageIndices;
      var chunkSplits = 0;
      var overflowRows = 0;

      if (mode === 'fixedChunk') {
        var out = packFixedChunk(m, opts.chunkSize);
        pageIndices = out.pages;
        chunkSplits = out.chunkSplits;
        overflowRows = out.overflowRows;
      } else {
        var packed = packRows(m.rows, m.availFirst, m.availCont);
        pageIndices = pagesToItemIndices(packed.pages);
        overflowRows = packed.overflowRows;
      }

      var out = emitVerified(opts, items, pageIndices, m.availFirst, m.availCont);
      return {
        sheets: out.sheets,
        pageBreaks: out.pageBreaks,
        corrections: out.corrections,
        usedItems: items.length,
        overflowRows: overflowRows,
        chunkSplits: chunkSplits,
        metrics: m
      };
    });
  }

  /**
   * Honour an explicit items-per-page request, but never at the cost of
   * overflowing the paper.
   */
  function packFixedChunk(m, chunkSize) {
    var pages = [];
    var chunkSplits = 0;
    var overflowRows = 0;
    var rowsPerChunk = [];
    var count = 0;
    var group = [];

    // Group rows into the caller's chunks by item count.
    m.rows.forEach(function (row) {
      group.push(row);
      count += row.items.length;
      if (count >= chunkSize) {
        rowsPerChunk.push(group);
        group = [];
        count = 0;
      }
    });
    if (group.length) rowsPerChunk.push(group);

    rowsPerChunk.forEach(function (rows, chunkIdx) {
      var avail = chunkIdx === 0 ? m.availFirst : m.availCont;
      var packed = packRows(rows, avail, m.availCont);
      overflowRows += packed.overflowRows;
      if (packed.pages.length > 1) chunkSplits++;
      pagesToItemIndices(packed.pages).forEach(function (p) {
        pages.push(p);
      });
    });

    return { pages: pages, chunkSplits: chunkSplits, overflowRows: overflowRows };
  }

  /**
   * "N pages of questions" -- exactly N, every one of them full.
   *
   * Over-supply, measure, truncate. Exact by construction, because the pages
   * kept are the very pages that were measured. The alternative the studios
   * used before -- multiply a guessed per-page cap by N -- is exactly the
   * arithmetic that produced both the overflowing pages and the ragged
   * two-thirds-empty trailing page.
   */
  function paginateExactPages(opts) {
    var wanted = Math.max(1, parseInt(opts.pages, 10) || 1);
    var seedPerPage = Math.max(4, opts.seedPerPage || 12);
    var n = wanted * seedPerPage;
    var attempt = 0;

    function tryOnce() {
      var items = opts.itemFactory(n);

      return measure(opts, items).then(function (m) {
        var packed = packRows(m.rows, m.availFirst, m.availCont);
        var pageIndices = pagesToItemIndices(packed.pages);

        if (pageIndices.length < wanted && attempt < 3) {
          // Not enough content to fill the requested pages. Scale the pool by
          // how far short we fell, with headroom, and measure again.
          attempt++;
          var ratio = wanted / Math.max(1, pageIndices.length);
          n = Math.max(n + wanted, Math.ceil(n * ratio * 1.25));
          return tryOnce();
        }

        var keep = pageIndices.slice(0, wanted);
        var used = keep.reduce(function (acc, p) {
          return acc + p.length;
        }, 0);

        // Renumber after truncation so question numbers stay contiguous.
        var flat = [];
        keep.forEach(function (p) {
          p.forEach(function (i) {
            flat.push(items[i]);
          });
        });
        if (typeof opts.renumber === 'function') opts.renumber(flat);

        var reindexed = [];
        var cursor = 0;
        keep.forEach(function (p) {
          reindexed.push(
            p.map(function () {
              return cursor++;
            })
          );
        });

        var out = emitVerified(opts, flat, reindexed, m.availFirst, m.availCont);

        /*
         * Verification can push rows onto an extra page, which would break the
         * "exactly N pages" contract. Drop back to N and let the surplus
         * questions go: the promise the studio makes is the page count, not
         * the question count.
         */
        var kept = out.sheets;
        if (kept.length > wanted) {
          kept.slice(wanted).forEach(function (sheet) {
            sheet.parentNode.removeChild(sheet);
          });
          kept = kept.slice(0, wanted);
        }

        return {
          sheets: kept,
          pageBreaks: out.pageBreaks.slice(0, kept.length),
          corrections: out.corrections,
          items: flat,
          usedItems: used,
          overflowRows: packed.overflowRows,
          chunkSplits: 0,
          metrics: m
        };
      });
    }

    return tryOnce();
  }

  /**
   * Paginate several differently-shaped sections through one shared page
   * budget, so they flow continuously instead of each starting a new page.
   *
   * Yaya's answer sheet needs this: a compact quick-answer grid followed by a
   * list of full worked solutions. Paginating them separately would waste a
   * page at the seam; not paginating them at all is what put 3300px of
   * solutions onto a single sheet.
   */
  function paginateSections(opts) {
    opts.target.innerHTML = '';
    var sections = opts.sections || [];
    if (!sections.length) {
      return Promise.resolve({ sheets: [], overflowRows: 0, chunkSplits: 0 });
    }

    // Measure each section's rows independently, then pack them as one stream.
    var measured = [];
    var chain = Promise.resolve();

    sections.forEach(function (section, si) {
      chain = chain.then(function () {
        return measure(
          {
            sheetClass: opts.sheetClass,
            gridClass: section.gridClass,
            renderItem: section.renderItem,
            renderHeader: opts.renderHeader,
            renderFooter: opts.renderFooter,
            beforeMeasure: opts.beforeMeasure,
            cacheKey: opts.cacheKey
          },
          section.items
        ).then(function (m) {
          measured.push({ section: section, sectionIndex: si, m: m });
        });
      });
    });

    return chain.then(function () {
      /*
       * Take the tightest budget across the sections, not the first one's.
       *
       * A page here can begin with any section's grid, and the grids are not
       * interchangeable: yaya's quick-answer table and its worked-solutions
       * list carry different margins, so sizing every page against the
       * quick-answer grid over-estimated the room on a page that actually
       * starts with solutions -- by about 8px, which is enough to push the
       * last solution past the bottom edge.
       */
      var availFirst = Infinity;
      var availCont = Infinity;
      measured.forEach(function (entry) {
        availFirst = Math.min(availFirst, entry.m.availFirst);
        availCont = Math.min(availCont, entry.m.availCont);
      });

      // One flat row stream, tagged with which section each row came from, so
      // a page can legitimately contain the tail of one section and the head
      // of the next.
      var stream = [];
      measured.forEach(function (entry) {
        entry.m.rows.forEach(function (row) {
          stream.push({
            height: row.height,
            gapAfter: row.gapAfter,
            items: row.items,
            sectionIndex: entry.sectionIndex
          });
        });
      });

      /*
       * Same verify-and-correct loop the single-section path uses. This was
       * the one emit path that skipped it, and it is the path yaya's answer
       * sheet takes -- so the sheet that historically ran 3307px past the
       * paper was also the one sheet nobody was double-checking.
       */
      var packed = packRows(stream, availFirst, availCont);
      var sheets = emitPages(packed.pages);

      for (var round = 0; round < 4; round++) {
        var worst = worstOvershoot(sheets);
        if (worst.any <= 1) break;
        if (worst.first > 1) availFirst -= worst.first + 1;
        if (worst.cont > 1) availCont -= worst.cont + 1;
        packed = packRows(stream, availFirst, availCont);
        opts.target.innerHTML = '';
        sheets = emitPages(packed.pages);
      }

      return { sheets: sheets, overflowRows: packed.overflowRows, chunkSplits: 0 };

      /** How far the deepest content on any sheet sits past its content box. */
      function worstOvershoot(list) {
        var first = 0;
        var cont = 0;
        list.forEach(function (sheet, i) {
          var rect = sheet.getBoundingClientRect();
          var cs = getComputedStyle(sheet);
          var contentBottom = rect.height - (parseFloat(cs.paddingBottom) || 0);
          var deepest = 0;
          var all = sheet.querySelectorAll('*');
          for (var j = 0; j < all.length; j++) {
            var b = all[j].getBoundingClientRect().bottom - rect.top;
            if (b > deepest) deepest = b;
          }
          var over = deepest - contentBottom;
          if (i === 0) first = Math.max(first, over);
          else cont = Math.max(cont, over);
        });
        return { first: first, cont: cont, any: Math.max(first, cont) };
      }

      function emitPages(pages) {
        var total = pages.length;
        var out = [];
        pages.forEach(function (rows, pageIdx) {
        var sheet = document.createElement('div');
        sheet.className = opts.sheetClass || 'sf-sheet';

        var header = opts.renderHeader ? opts.renderHeader(pageIdx, total) : null;
        if (header) sheet.appendChild(header);

        // Rebuild the section grids this page needs, in order.
        var currentSection = -1;
        var grid = null;
        rows.forEach(function (row) {
          if (row.sectionIndex !== currentSection) {
            currentSection = row.sectionIndex;
            var section = sections[currentSection];
            grid = document.createElement('div');
            grid.className = section.gridClass || '';
            pinGridToAllotment(grid);
            sheet.appendChild(grid);
          }
          var section = sections[row.sectionIndex];
          row.items.forEach(function (i) {
            grid.appendChild(section.renderItem(section.items[i], i));
          });
        });

        var footer = opts.renderFooter ? opts.renderFooter(pageIdx, total) : null;
        if (footer) sheet.appendChild(footer);

          opts.target.appendChild(sheet);
          out.push(sheet);
        });
        settleEmitted(opts);
        return out;
      }
    });
  }

  /**
   * Publish the readiness contract every studio shares.
   *
   * Print tests wait on `dataset.sfPrintReady` rather than a timeout, and
   * assert on `overflowRows` / `chunkSplits` so a pathological layout fails
   * the build instead of reaching a printer.
   */
  function publish(state) {
    global.__sfPrint = state;
    document.documentElement.dataset.sfPrintReady = '1';
  }

  function beginRender() {
    document.documentElement.dataset.sfPrintReady = '0';
  }

  global.SFPaginate = {
    geometry: geometry,
    ready: ready,
    paginate: paginate,
    paginateSections: paginateSections,
    measureRows: measureRows,
    publish: publish,
    beginRender: beginRender
  };
})(window);
