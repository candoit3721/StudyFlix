/**
 * Olivia's Math Studio - Main Application Logic
 */

(function () {
  // Application State
  const state = {
    currentConfig: {
      type: 'multiplication',
      digitRange: '2digit',
      regrouping: 'any',
      borrowing: 'any',
      tableRange: '0-10',
      customTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxDivisor: 10,
      missingOperand: false,
      count: 20,
      layoutFormat: 'vertical', // 'vertical' or 'horizontal'
      gridCols: 3,
      pageCount: 2,
      studentName: 'Olivia',
      worksheetTitle: 'Grade 3 Math Practice',
      includeAnswerKey: true
    },
    problems: [],
    mode: 'print-preview', // 'print-preview' or 'interactive'
    showAnswers: false,
    timerInterval: null,
    timerSeconds: 0
  };

  // DOM Elements
  const els = {
    opType: document.getElementById('operation-type'),
    fieldDigitRange: document.getElementById('field-digit-range'),
    fieldRegrouping: document.getElementById('field-regrouping'),
    fieldBorrowing: document.getElementById('field-borrowing'),
    fieldMultRange: document.getElementById('field-multiplication-range'),
    fieldCustomTables: document.getElementById('field-custom-tables'),
    fieldDivRange: document.getElementById('field-division-range'),
    fieldMissingOp: document.getElementById('field-missing-operand'),
    fieldLayoutFormat: document.getElementById('field-layout-format'),
    fieldColumns: document.getElementById('field-columns'),
    multRangeSelect: document.getElementById('mult-range-select'),
    divRangeSelect: document.getElementById('div-range-select'),
    missingOpCheckbox: document.getElementById('missing-operand-checkbox'),
    pageCountSelect: document.getElementById('page-count-select'),
    studentName: document.getElementById('student-name'),
    worksheetTitle: document.getElementById('worksheet-title'),
    includeAnswerKey: document.getElementById('include-answer-key'),

    // Buttons
    btnGenerate: document.getElementById('btn-generate'),
    btnPrintSidebar: document.getElementById('btn-print-sidebar'),
    btnPrintTop: document.getElementById('btn-print-top'),
    btnToggleAnswers: document.getElementById('btn-toggle-answers'),
    modePrintPreview: document.getElementById('mode-print-preview'),
    modeInteractive: document.getElementById('mode-interactive'),
    btnCheckAnswers: document.getElementById('btn-check-answers'),
    btnResetInteractive: document.getElementById('btn-reset-interactive'),

    // Render Targets
    pagesContainer: document.getElementById('pages-container'),

    // Interactive
    interactiveToolbar: document.getElementById('interactive-toolbar'),
    interactiveScoreDisplay: document.getElementById('interactive-score-display'),
    interactiveTimer: document.getElementById('interactive-timer'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // Presets Dictionary
  const presets = {
    mult_core: {
      type: 'multiplication',
      tableRange: '0-10',
      pageCount: 2,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: 'Multiplication Facts (0–10)'
    },
    add_3digit: {
      type: 'addition',
      digitRange: '3digit',
      regrouping: 'force',
      pageCount: 2,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: '3-Digit Addition with Regrouping'
    },
    sub_3digit: {
      type: 'subtraction',
      digitRange: '3digit',
      borrowing: 'force',
      pageCount: 2,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: '3-Digit Subtraction with Borrowing'
    },
    all_mixed: {
      type: 'all_mixed',
      pageCount: 1,
      layoutFormat: 'horizontal',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: 'Mixed 4 Operations Sprint'
    },
    missing_ops: {
      type: 'add_sub_mixed',
      digitRange: '2digit',
      missingOperand: true,
      pageCount: 1,
      layoutFormat: 'horizontal',
      gridCols: 2,
      worksheetTitle: 'Missing Numbers & Fact Families'
    },
    word_problems: {
      type: 'word_problems',
      pageCount: 1,
      gridCols: 2,
      missingOperand: false,
      worksheetTitle: 'Grade 3 Math Word Problems'
    }
  };

  /**
   * Update visibility of form fields based on selected operation
   */
  function syncFormFields() {
    const type = els.opType.value;

    // Reset default visibilities
    els.fieldDigitRange.style.display = 'none';
    els.fieldRegrouping.style.display = 'none';
    els.fieldBorrowing.style.display = 'none';
    els.fieldMultRange.style.display = 'none';
    els.fieldCustomTables.style.display = 'none';
    els.fieldDivRange.style.display = 'none';
    els.fieldMissingOp.style.display = 'block';
    els.fieldLayoutFormat.style.display = 'block';
    els.fieldColumns.style.display = 'block';

    if (type === 'addition') {
      els.fieldDigitRange.style.display = 'block';
      els.fieldRegrouping.style.display = 'block';
    } else if (type === 'subtraction') {
      els.fieldDigitRange.style.display = 'block';
      els.fieldBorrowing.style.display = 'block';
    } else if (type === 'add_sub_mixed') {
      els.fieldDigitRange.style.display = 'block';
    } else if (type === 'multiplication') {
      els.fieldMultRange.style.display = 'block';
      if (els.multRangeSelect.value === 'custom') {
        els.fieldCustomTables.style.display = 'block';
      }
    } else if (type === 'division') {
      els.fieldDivRange.style.display = 'block';
    } else if (type === 'mult_div_mixed') {
      els.fieldMultRange.style.display = 'block';
    } else if (type === 'comparison') {
      els.fieldLayoutFormat.style.display = 'none';
      els.fieldMissingOp.style.display = 'none';
    } else if (type === 'word_problems') {
      els.fieldDigitRange.style.display = 'none';
      els.fieldMissingOp.style.display = 'none';
      els.fieldLayoutFormat.style.display = 'none';
      els.fieldColumns.style.display = 'none';
    }
  }

  /**
   * Read full configuration from UI
   */
  function readConfigFromUI() {
    const type = els.opType.value;
    const digitRange = document.querySelector('input[name="digitRange"]:checked')?.value || '2digit';
    const regrouping = document.querySelector('input[name="regrouping"]:checked')?.value || 'any';
    const borrowing = document.querySelector('input[name="borrowing"]:checked')?.value || 'any';
    const tableRange = els.multRangeSelect.value;
    const maxDivisor = parseInt(els.divRangeSelect.value, 10) || 10;
    const missingOperand = els.missingOpCheckbox.checked;
    const pageCount = parseInt(els.pageCountSelect.value, 10) || 2;
    const layoutFormat = document.querySelector('input[name="layoutFormat"]:checked')?.value || 'vertical';
    const gridCols = parseInt(document.querySelector('input[name="gridCols"]:checked')?.value, 10) || 3;
    const studentName = els.studentName.value.trim() || 'Olivia';
    const worksheetTitle = els.worksheetTitle.value.trim() || 'Grade 3 Math Practice';
    const includeAnswerKey = els.includeAnswerKey.checked;

    // Custom tables
    const customTables = Array.from(document.querySelectorAll('input[name="customTable"]:checked')).map(cb => parseInt(cb.value, 10));

    state.currentConfig = {
      type,
      digitRange,
      regrouping,
      borrowing,
      tableRange,
      customTables,
      maxDivisor,
      missingOperand,
      count: state.currentConfig.count,
      pageCount,
      layoutFormat,
      gridCols,
      studentName,
      worksheetTitle,
      includeAnswerKey
    };
  }

  /**
   * Apply a preset configuration to UI controls
   */
  function applyPreset(presetKey) {
    const p = presets[presetKey];
    if (!p) return;

    if (p.type) els.opType.value = p.type;
    if (p.digitRange) {
      const radio = document.querySelector(`input[name="digitRange"][value="${p.digitRange}"]`);
      if (radio) radio.checked = true;
    }
    if (p.regrouping) {
      const radio = document.querySelector(`input[name="regrouping"][value="${p.regrouping}"]`);
      if (radio) radio.checked = true;
    }
    if (p.borrowing) {
      const radio = document.querySelector(`input[name="borrowing"][value="${p.borrowing}"]`);
      if (radio) radio.checked = true;
    }
    if (p.tableRange) els.multRangeSelect.value = p.tableRange;
    if (p.missingOperand !== undefined) els.missingOpCheckbox.checked = p.missingOperand;
    if (p.pageCount) els.pageCountSelect.value = p.pageCount;
    if (p.layoutFormat) {
      const radio = document.querySelector(`input[name="layoutFormat"][value="${p.layoutFormat}"]`);
      if (radio) radio.checked = true;
    }
    if (p.gridCols) {
      const radio = document.querySelector(`input[name="gridCols"][value="${p.gridCols}"]`);
      if (radio) radio.checked = true;
    }
    if (p.worksheetTitle) els.worksheetTitle.value = p.worksheetTitle;

    syncFormFields();
    return true;
  }

  /**
   * URL parameters.
   *
   * Olivia's studio parsed none at all before this. That made most of its
   * layouts unreachable from a test -- including horizontal at 4 columns, the
   * combination that overflowed the page by 37px on every print. Every knob
   * that can change how much fits on a page is addressable here.
   *
   * Each `apply` writes straight into the sidebar control rather than into
   * state, because readConfigFromUI() is the single source of truth for the
   * config; setting the control keeps the form and the worksheet agreeing.
   */
  const URL_SCHEMA = {
    type: {
      type: 'enum',
      values: ['addition', 'subtraction', 'add_sub_mixed', 'multiplication', 'division',
               'mult_div_mixed', 'all_mixed', 'comparison', 'word_problems'],
      apply: (c, v) => { els.opType.value = v; }
    },
    format: {
      type: 'enum', values: ['vertical', 'horizontal'],
      apply: (c, v) => SFUrl.syncControl('layoutFormat', v)
    },
    cols: {
      type: 'int', min: 2, max: 4,
      apply: (c, v) => SFUrl.syncControl('gridCols', v)
    },
    pages: {
      type: 'int', min: 1, max: 6,
      apply: (c, v) => { els.pageCountSelect.value = String(v); }
    },
    missing: {
      type: 'bool',
      apply: (c, v) => { els.missingOpCheckbox.checked = v; }
    },
    digits: {
      type: 'enum', values: ['2digit', '3digit'],
      apply: (c, v) => SFUrl.syncControl('digitRange', v)
    },
    regroup: {
      type: 'enum', values: ['any', 'force', 'none'],
      apply: (c, v) => SFUrl.syncControl('regrouping', v)
    },
    borrow: {
      type: 'enum', values: ['any', 'force', 'none'],
      apply: (c, v) => SFUrl.syncControl('borrowing', v)
    },
    table: {
      type: 'string',
      apply: (c, v) => { els.multRangeSelect.value = v; }
    },
    divisor: {
      type: 'string',
      apply: (c, v) => { els.divRangeSelect.value = v; }
    },
    answerkey: {
      type: 'bool',
      apply: (c, v) => { els.includeAnswerKey.checked = v; }
    },
    name: {
      type: 'string',
      apply: (c, v) => { els.studentName.value = v; }
    },
    title: {
      type: 'string',
      apply: (c, v) => { els.worksheetTitle.value = v; }
    }
  };

  function applyUrlConfig() {
    try {
      const params = new URLSearchParams(window.location.search);
      const preset = params.get('preset');
      if (preset) applyPreset(preset);

      // Explicit parameters always win over a preset's own defaults.
      SFUrl.read(URL_SCHEMA, state.currentConfig);
      syncFormFields();
    } catch (e) {
      console.warn('Could not parse URL params', e);
    }
  }

  function buildSubtitle(config) {
    if (config.type === 'addition') return `Addition Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    if (config.type === 'subtraction') return `Subtraction Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    if (config.type === 'add_sub_mixed') return 'Addition & Subtraction Mixed';
    if (config.type === 'multiplication') return `Multiplication Facts (${config.tableRange})`;
    if (config.type === 'division') return `Division Facts (÷ up to ${config.maxDivisor})`;
    if (config.type === 'mult_div_mixed') return 'Multiplication & Division Mixed';
    if (config.type === 'all_mixed') return 'Mixed 4 Operations Review';
    if (config.type === 'comparison') return 'Compare Expressions (<, >, =)';
    if (config.type === 'word_problems') return 'Grade 3 Story Problems';
    return '';
  }

  /*
   * How many problems fit on a page is no longer guessed.
   *
   * This used to be getMaxDensityCap(), a table of constants measured by hand:
   * word problems 4; comparison cols * (6|7|8); otherwise
   * `layoutFormat === 'horizontal' ? cols * 7 : cols * 4`. That last line is
   * the reported bug. Vertical at 2 columns came out 954px and fit; horizontal
   * at 4 columns came out 1016px against a 979px printable page and ran off
   * the paper -- so the same worksheet paginated correctly in one format and
   * overflowed in the other. See tests/print/BASELINE.md.
   *
   * The constants were not merely mistuned, they were unmaintainable: each one
   * silently expired the moment a card, a font or a padding changed, and
   * nothing in the system could notice. assets/sf/paginate.js lays the real
   * cards out in the real print box and cuts pages where the content says to,
   * so comparison cards that grow as columns narrow, full-width word problems
   * and missing-operand cards that ignore the format switch are all handled
   * without a single branch describing them.
   *
   * SEED_PER_PAGE is only a starting guess for how many problems to generate
   * before measuring; no page break depends on it.
   */
  const SEED_PER_PAGE = 30;

  /**
   * Generate Problem Set and Render to DOM
   */
  function buildSubtitle(config) {
    if (config.type === 'addition') return `Addition Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    if (config.type === 'subtraction') return `Subtraction Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    if (config.type === 'add_sub_mixed') return 'Addition & Subtraction Mixed';
    if (config.type === 'multiplication') return `Multiplication Facts (${config.tableRange})`;
    if (config.type === 'division') return `Division Facts (÷ up to ${config.maxDivisor})`;
    if (config.type === 'mult_div_mixed') return 'Multiplication & Division Mixed';
    if (config.type === 'all_mixed') return 'Mixed 4 Operations Review';
    if (config.type === 'comparison') return 'Compare Expressions (<, >, =)';
    if (config.type === 'word_problems') return 'Grade 3 Story Problems';
    return '';
  }

  /**
   * Generate Problem Set and Render to DOM
   */

  /** Build `count` fresh problems for the current configuration. */
  function makeProblems(count) {
    const config = state.currentConfig;
    const previous = config.count;
    config.count = count;
    const problems = config.type === 'word_problems'
      ? WordProblems.generateWordProblemsList(count)
      : MathEngine.generateWorksheet(config);
    config.count = previous;
    return problems;
  }

  /**
   * Re-lay-out the worksheet that is already on screen, keeping its questions.
   * Used by the controls that change presentation only: student name,
   * worksheet title, the answer toggle and the mode switch.
   */
  function rerender() {
    SFPaginate.beginRender();
    if (state.mode === 'interactive') {
      renderWorksheet({ reuse: true });
      return Promise.resolve();
    }
    return renderWorksheet({ reuse: true })
      .then(worksheet => renderAnswerKey(worksheet.sheets.length).then(keySheets => ({ worksheet, keySheets })))
      .then(({ worksheet, keySheets }) => publishPrintState(worksheet, keySheets));
  }

  function publishPrintState(worksheet, keySheets) {
    SFPaginate.publish({
      sheets: worksheet.sheets.length + keySheets.length,
      worksheetPages: worksheet.sheets.length,
      requestedPages: parseInt(state.currentConfig.pageCount, 10) || 2,
      overflowRows: worksheet.overflowRows,
      chunkSplits: 0,
      config: {
        type: state.currentConfig.type,
        layoutFormat: state.currentConfig.layoutFormat,
        gridCols: state.currentConfig.gridCols,
        missingOperand: state.currentConfig.missingOperand,
        includeAnswerKey: state.currentConfig.includeAnswerKey,
        count: state.currentConfig.count
      }
    });
  }

  function generateAndRender() {
    readConfigFromUI();
    SFPaginate.beginRender();

    if (state.mode === 'interactive') {
      const config = state.currentConfig;
      config.count = (config.pageCount || 2) * SEED_PER_PAGE;
      state.problems = makeProblems(config.count);
      renderWorksheet();
      resetInteractiveState();
      return Promise.resolve();
    }

    return renderWorksheet()
      .then(worksheet => renderAnswerKey(worksheet.sheets.length).then(keySheets => ({ worksheet, keySheets })))
      .then(({ worksheet, keySheets }) => publishPrintState(worksheet, keySheets));
  }

  function buildPageHeader(config, subtitle, pageNum, totalPages) {
    const header = document.createElement('div');
    if (pageNum === 1) {
      header.className = 'ws-header';
      header.innerHTML = `
        <div class="ws-title-row">
          <h2 class="ws-title">${config.worksheetTitle}</h2>
          <span class="ws-subtitle">${subtitle}${totalPages > 1 ? ` • Page ${pageNum} of ${totalPages}` : ''}</span>
        </div>
        <div class="ws-meta-row">
          <div class="meta-field"><span>Name:</span><span class="meta-line" style="padding-left: 6px;">${config.studentName}</span></div>
          <div class="meta-field"><span>Date:</span><span class="meta-line"></span></div>
          <div class="meta-field"><span>Score:</span><span class="meta-line" style="min-width: 80px;"></span></div>
          <div class="meta-field"><span>Time:</span><span class="meta-line" style="min-width: 80px;"></span></div>
        </div>
      `;
    } else {
      header.className = 'ws-header ws-header-compact';
      header.innerHTML = `
        <div class="ws-title-row">
          <h2 class="ws-title" style="font-size: 1.15rem;">${config.worksheetTitle} <span style="font-size:0.78rem; color:#4f46e5; font-weight:600;">(Page ${pageNum} of ${totalPages})</span></h2>
        </div>
        <div class="ws-meta-row" style="font-size: 0.82rem;">
          <span>Name: <strong>${config.studentName}</strong></span>
        </div>
      `;
    }
    return header;
  }

  function buildPageFooter() {
    const footer = document.createElement('div');
    footer.className = 'ws-footer';
    footer.innerHTML = `
      <span>Olivia's Math Studio • Grade 3 Curricula</span>
      <span class="ws-footer-quote">⭐ Great job! Keep up the fantastic effort! ⭐</span>
    `;
    return footer;
  }

  function buildProblemCard(p, idx, isAnswerKey) {
    const config = state.currentConfig;
    if (p.type === 'word_problem') return renderWordProblemCard(p, idx, isAnswerKey);
    if (p.type === 'comparison') return renderComparisonCard(p, idx, isAnswerKey);
    if (config.layoutFormat === 'vertical' && !p.missingPos) return renderVerticalCard(p, idx, isAnswerKey);
    return renderHorizontalCard(p, idx, isAnswerKey);
  }

  /**
   * Render the worksheet as one or more physical pages.
   *
   * "Pages of Questions = N" is honoured exactly: the paginator over-supplies
   * problems, measures the real cards in the real print box, then keeps
   * exactly N full pages. Nothing here needs to know that a comparison card is
   * taller than an arithmetic one, that a word problem spans the full grid
   * width, or that a missing-operand problem renders horizontally whatever the
   * format switch says. Those were all special cases in the old density table,
   * and every one of them is now simply measured.
   */
  function renderWorksheet(opts) {
    const reuse = !!(opts && opts.reuse);
    const config = state.currentConfig;
    const isWordProblem = config.type === 'word_problems';
    const subtitle = buildSubtitle(config);
    const gridClass = `problems-container grid-cols-${isWordProblem ? '1' : config.gridCols}`;
    const pages = Math.max(1, parseInt(config.pageCount, 10) || 2);

    els.pagesContainer.innerHTML = '';

    if (state.mode === 'interactive') {
      // Not a simulated paper page: a plain practice sheet that sizes to
      // its real content instead of a fixed 11in page box.
      const page = document.createElement('div');
      page.className = 'practice-container';
      page.appendChild(buildPageHeader(config, subtitle, 1, 1));
      const grid = document.createElement('div');
      grid.className = gridClass;
      state.problems.forEach((p, idx) => grid.appendChild(buildProblemCard(p, idx, false)));
      page.appendChild(grid);
      page.appendChild(buildPageFooter());
      els.pagesContainer.appendChild(page);
      return Promise.resolve({ sheets: [], overflowRows: 0 });
    }

    /*
     * `reuse` re-paginates the problems already on the page instead of
     * generating new ones. Retyping the student's name or toggling the answer
     * display must not silently swap every question out from under whoever is
     * halfway through the worksheet. Since those problems were chosen to fill
     * exactly `pages` pages, packing them again with 'fill' reproduces the
     * same pages -- same content, same measurement, same breaks.
     */
    const paginationMode = reuse
      ? { mode: 'fill', items: state.problems }
      : { mode: 'exactPages', pages: pages, seedPerPage: SEED_PER_PAGE, itemFactory: makeProblems };

    return SFPaginate.paginate(Object.assign({
      target: els.pagesContainer,
      sheetClass: 'sf-sheet worksheet-page',
      gridClass: gridClass,
      cacheKey: `olivia|type=${config.type}|fmt=${config.layoutFormat}|cols=${config.gridCols}`,
      // Problem numbers must stay contiguous after the surplus is trimmed.
      renumber: items => items.forEach((p, i) => { p.index = i + 1; }),
      renderItem: (p, idx) => buildProblemCard(p, idx, false),
      renderHeader: (pageIdx, totalPages) =>
        buildPageHeader(config, subtitle, pageIdx + 1, totalPages),
      renderFooter: () => buildPageFooter()
    }, paginationMode)).then(result => {
      if (result.items) {
        state.problems = result.items;
        config.count = result.items.length;
      }
      return result;
    });
  }

  /**
   * Paper-saving answer key, paginated.
   *
   * It never used to be. Every answer went onto one sheet regardless of how
   * many there were, so a six-page worksheet piled well over a hundred answers
   * onto a single page and ran off the paper. `mode: 'fill'` lets the key take
   * as many sheets as it needs, and no more.
   */
  function renderAnswerKey(worksheetPages) {
    const config = state.currentConfig;
    if (!config.includeAnswerKey || !state.problems.length) return Promise.resolve([]);

    const isWordProblem = config.type === 'word_problems';
    // Word problems carry longer answers, so they get wider cells; otherwise
    // pack tighter as the count grows.
    let cols = 5;
    if (isWordProblem) cols = 2;
    else if (config.count <= 10) cols = 2;
    else if (config.count <= 20) cols = 4;

    const keyTarget = document.createElement('div');
    els.pagesContainer.appendChild(keyTarget);

    const buildHeader = (pageIdx, totalPages) => {
      const header = document.createElement('div');
      header.className = 'ws-header';
      header.style.marginBottom = '12px';
      header.style.paddingBottom = '8px';
      const continued = totalPages > 1 ? ` (${pageIdx + 1} of ${totalPages})` : '';
      header.innerHTML = `
        <div class="ws-title-row" style="margin-bottom: 6px;">
          <h2 class="ws-title" style="font-size: 1.3rem;">Answer Key${continued}</h2>
          <span class="answer-key-badge">PARENT / TEACHER QUICK KEY (PAPER SAVER)</span>
        </div>
        <div class="ws-meta-row" style="font-size: 0.85rem;">
          <div class="meta-field"><span>Student:</span><span style="font-weight: 700; color: #1e293b;">${config.studentName}</span></div>
          <div class="meta-field"><span>Subject:</span><span style="font-weight: 700; color: #1e293b;">${config.worksheetTitle}</span></div>
          <div class="meta-field"><span>Total Questions:</span><span style="font-weight: 700; color: #1e293b;">${config.count}</span></div>
        </div>
      `;
      return header;
    };

    const buildAnswerItem = (p) => {
      const item = document.createElement('div');
      item.className = 'sf-key-item compact-answer-item';

      const idSpan = document.createElement('span');
      idSpan.className = 'compact-q-id';
      idSpan.textContent = `${p.index}.`;
      item.appendChild(idSpan);

      const ansSpan = document.createElement('span');
      ansSpan.className = 'compact-q-ans';
      if (p.type === 'word_problem') {
        ansSpan.innerHTML = `<span class="answer-highlight">${p.answer} ${p.unit || ''}</span>`;
      } else if (p.type === 'comparison') {
        ansSpan.innerHTML = `<span class="answer-highlight" style="font-size: 1.15rem; font-weight: 900;">${p.answer}</span>`;
      } else if (p.missingPos) {
        ansSpan.innerHTML = `<span class="answer-highlight">${p.expectedAnswer}</span>`;
      } else {
        ansSpan.innerHTML = `<span class="answer-highlight">${p.answer}</span>`;
      }
      item.appendChild(ansSpan);
      return item;
    };

    return SFPaginate.paginate({
      target: keyTarget,
      // keyTarget is a bare wrapper; the styles that matter come from the
      // pages container it sits inside.
      measureContext: els.pagesContainer,
      mode: 'fill',
      items: state.problems,
      sheetClass: 'sf-sheet worksheet-page answer-key-page',
      gridClass: `compact-answers-container grid-cols-${cols}`,
      cacheKey: `olivia-key|cols=${cols}`,
      renderItem: buildAnswerItem,
      renderHeader: buildHeader,
      renderFooter: (pageIdx, totalPages) => {
        const footer = document.createElement('div');
        footer.className = 'ws-footer';
        footer.style.marginTop = '14px';
        footer.style.paddingTop = '6px';
        footer.innerHTML = `
          <span>Olivia's Math Studio • Quick Answer Key</span>
          <span>Page ${worksheetPages + pageIdx + 1} of ${worksheetPages + totalPages}</span>
        `;
        return footer;
      }
    }).then(result => {
      // Only the FIRST key sheet starts a new page; a blanket break-before
      // would put a blank page between every key sheet.
      if (result.sheets.length) result.sheets[0].classList.add('sf-break-before');

      // Unwrap the paginator's target so the key sheets sit as direct children
      // of the pages container, which is what the layout CSS expects.
      const parent = keyTarget.parentNode;
      while (keyTarget.firstChild) parent.insertBefore(keyTarget.firstChild, keyTarget);
      parent.removeChild(keyTarget);

      return result.sheets;
    });
  }

  /**
   * Render Vertical Arithmetic Card (Stacked Column)
   */
  function renderVerticalCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'sf-card problem-card';

    const numSpan = document.createElement('span');
    numSpan.className = 'problem-number';
    numSpan.textContent = `${p.index}.`;
    card.appendChild(numSpan);

    const vBox = document.createElement('div');
    vBox.className = 'vertical-math-box';

    // Regrouping box on top (if addition/subtraction and not answer key)
    if (!isAnswerKey && (p.type === 'addition' || p.type === 'subtraction')) {
      const carryRow = document.createElement('div');
      carryRow.className = 'carry-box-row';
      carryRow.innerHTML = `<div class="carry-box"></div>`;
      vBox.appendChild(carryRow);
    }

    // Top number
    const row1 = document.createElement('div');
    row1.className = 'math-row';
    row1.innerHTML = `<span></span><span class="math-num">${p.num1}</span>`;
    vBox.appendChild(row1);

    // Operator + Bottom number
    const row2 = document.createElement('div');
    row2.className = 'math-row';
    row2.innerHTML = `<span class="math-op">${p.operator}</span><span class="math-num">${p.num2}</span>`;
    vBox.appendChild(row2);

    // Divider Line
    const line = document.createElement('div');
    line.className = 'math-line';
    vBox.appendChild(line);

    // Answer Line / Input
    const ansSpace = document.createElement('div');
    ansSpace.className = 'math-answer-space';

    if (isAnswerKey || state.showAnswers) {
      ansSpace.innerHTML = `<span class="answer-highlight">${p.answer}</span>`;
    } else if (state.mode === 'interactive') {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'interactive-input';
      input.dataset.index = idx;
      input.dataset.expected = p.expectedAnswer;
      input.addEventListener('keydown', handleInputKeydown);
      ansSpace.appendChild(input);
    }

    vBox.appendChild(ansSpace);
    card.appendChild(vBox);
    return card;
  }

  /**
   * Render Horizontal Equation Card
   */
  function renderHorizontalCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'sf-card problem-card';

    const numSpan = document.createElement('span');
    numSpan.className = 'problem-number';
    numSpan.textContent = `${p.index}.`;
    card.appendChild(numSpan);

    const hBox = document.createElement('div');
    hBox.className = 'horizontal-math-box';

    let content = '';
    if (p.missingPos === 'left') {
      if (isAnswerKey || state.showAnswers) {
        content = `<span class="answer-highlight">${p.expectedAnswer}</span> ${p.operator} ${p.num2} = ${p.answer}`;
      } else if (state.mode === 'interactive') {
        content = `<input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}"> ${p.operator} ${p.num2} = ${p.answer}`;
      } else {
        content = `<span class="blank-box"></span> ${p.operator} ${p.num2} = ${p.answer}`;
      }
    } else if (p.missingPos === 'right' || p.missingPos === 'divisor') {
      if (isAnswerKey || state.showAnswers) {
        content = `${p.num1} ${p.operator} <span class="answer-highlight">${p.expectedAnswer}</span> = ${p.answer || p.quotient}`;
      } else if (state.mode === 'interactive') {
        content = `${p.num1} ${p.operator} <input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}"> = ${p.answer || p.quotient}`;
      } else {
        content = `${p.num1} ${p.operator} <span class="blank-box"></span> = ${p.answer || p.quotient}`;
      }
    } else if (p.missingPos === 'dividend') {
      if (isAnswerKey || state.showAnswers) {
        content = `<span class="answer-highlight">${p.expectedAnswer}</span> ÷ ${p.num2} = ${p.expectedAnswer / p.num2}`;
      } else if (state.mode === 'interactive') {
        content = `<input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}"> ÷ ${p.num2} = ${p.expectedAnswer / p.num2}`;
      } else {
        content = `<span class="blank-box"></span> ÷ ${p.num2} = ${p.expectedAnswer / p.num2}`;
      }
    } else {
      // Standard equation A op B = ___
      if (isAnswerKey || state.showAnswers) {
        content = `${p.num1} ${p.operator} ${p.num2} = <span class="answer-highlight">${p.answer}</span>`;
      } else if (state.mode === 'interactive') {
        content = `${p.num1} ${p.operator} ${p.num2} = <input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}">`;
      } else {
        content = `${p.num1} ${p.operator} ${p.num2} = <span class="blank-box"></span>`;
      }
    }

    hBox.innerHTML = content;
    card.appendChild(hBox);

    // Attach listener if interactive
    if (state.mode === 'interactive' && !isAnswerKey) {
      const input = card.querySelector('.interactive-input');
      if (input) input.addEventListener('keydown', handleInputKeydown);
    }

    return card;
  }

  /**
   * Render Comparison Card (<, >, =)
   */
  function renderComparisonCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'sf-card problem-card';

    const numSpan = document.createElement('span');
    numSpan.className = 'problem-number';
    numSpan.textContent = `${p.index}.`;
    card.appendChild(numSpan);

    const cBox = document.createElement('div');
    cBox.className = 'comparison-box';

    if (isAnswerKey || state.showAnswers) {
      cBox.innerHTML = `<span>${p.leftText}</span> <div class="circle-target"><span class="answer-highlight">${p.answer}</span></div> <span>${p.rightText}</span>`;
    } else if (state.mode === 'interactive') {
      cBox.innerHTML = `<span>${p.leftText}</span> <input type="text" maxlength="1" class="interactive-input" style="width: 44px; border-radius: 50%;" data-index="${idx}" data-expected="${p.expectedAnswer}"> <span>${p.rightText}</span>`;
      const input = cBox.querySelector('.interactive-input');
      if (input) input.addEventListener('keydown', handleInputKeydown);
    } else {
      cBox.innerHTML = `<span>${p.leftText}</span> <div class="circle-target"></div> <span>${p.rightText}</span>`;
    }

    card.appendChild(cBox);
    return card;
  }

  /**
   * Render Word Problem Card
   */
  function renderWordProblemCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'sf-card word-problem-card';

    const text = document.createElement('div');
    text.className = 'wp-text';
    text.innerHTML = `<strong>${p.index}.</strong> ${p.question}`;
    card.appendChild(text);

    if (isAnswerKey || state.showAnswers) {
      const sol = document.createElement('div');
      sol.style.padding = '8px 12px';
      sol.style.background = '#fef3c7';
      sol.style.borderRadius = '4px';
      sol.style.fontSize = '0.95rem';
      sol.innerHTML = `<strong>Work / Equation:</strong> ${p.equation} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Answer:</strong> <span class="answer-highlight">${p.answer} ${p.unit || ''}</span>`;
      card.appendChild(sol);
    } else {
      const workSpace = document.createElement('div');
      workSpace.className = 'wp-work-space';
      workSpace.innerHTML = `<span style="font-size: 0.75rem; color: #94a3b8; margin-right: auto;">Show your work here:</span>`;
      card.appendChild(workSpace);

      const ansLine = document.createElement('div');
      ansLine.className = 'wp-answer-line';
      if (state.mode === 'interactive') {
        ansLine.innerHTML = `<span>Answer:</span> <input type="text" class="interactive-input" style="width: 100px;" data-index="${idx}" data-expected="${p.expectedAnswer}"> <span>${p.unit || ''}</span>`;
        const input = ansLine.querySelector('.interactive-input');
        if (input) input.addEventListener('keydown', handleInputKeydown);
      } else {
        ansLine.innerHTML = `<span>Answer:</span> <span class="meta-line" style="min-width: 120px;"></span> <span>${p.unit || ''}</span>`;
      }
      card.appendChild(ansLine);
    }

    return card;
  }

  /**
   * Handle Enter key to jump to next input in Interactive mode
   */
  function handleInputKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIdx = parseInt(e.target.dataset.index, 10);
      const nextInput = document.querySelector(`.interactive-input[data-index="${currentIdx + 1}"]`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        checkInteractiveAnswers();
      }
    }
  }

  /**
   * Interactive Mode Switching
   */
  function setMode(newMode) {
    state.mode = newMode;
    if (newMode === 'interactive') {
      els.modeInteractive.classList.add('active');
      els.modePrintPreview.classList.remove('active');
      els.interactiveToolbar.style.display = 'flex';
      els.interactiveTimer.style.display = 'block';
      startTimer();
    } else {
      els.modePrintPreview.classList.add('active');
      els.modeInteractive.classList.remove('active');
      els.interactiveToolbar.style.display = 'none';
      els.interactiveTimer.style.display = 'none';
      stopTimer();
    }
    rerender();
  }

  /**
   * Timer Functions
   */
  function startTimer() {
    stopTimer();
    state.timerSeconds = 0;
    updateTimerDisplay();
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (state.timerSeconds % 60).toString().padStart(2, '0');
    els.interactiveTimer.textContent = `⏱️ ${mins}:${secs}`;
  }

  /**
   * Reset interactive inputs
   */
  function resetInteractiveState() {
    document.querySelectorAll('.interactive-input').forEach(inp => {
      inp.value = '';
      inp.classList.remove('correct', 'incorrect');
    });
    els.interactiveScoreDisplay.textContent = 'Enter answers above and click Check!';
    startTimer();
  }

  /**
   * Check Interactive Answers
   */
  function checkInteractiveAnswers() {
    stopTimer();
    const inputs = document.querySelectorAll('#pages-container .interactive-input');
    let correctCount = 0;
    let totalCount = inputs.length;

    inputs.forEach(inp => {
      const val = inp.value.trim().toLowerCase().replace(/\s+/g, '');
      const expected = (inp.dataset.expected || '').trim().toLowerCase().replace(/\s+/g, '');

      // Normalize match (handles $ signs or spaces)
      const cleanVal = val.replace('$', '');
      const cleanExpected = expected.replace('$', '');

      if (cleanVal === cleanExpected && cleanVal !== '') {
        inp.classList.add('correct');
        inp.classList.remove('incorrect');
        correctCount++;
      } else {
        inp.classList.add('incorrect');
        inp.classList.remove('correct');
      }
    });

    const percent = Math.round((correctCount / totalCount) * 100);
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    const timeStr = `${mins > 0 ? mins + 'm ' : ''}${secs}s`;

    els.interactiveScoreDisplay.innerHTML = `Score: <strong>${correctCount} / ${totalCount}</strong> (${percent}%) in ${timeStr} ${percent === 100 ? '🎉 Perfect!' : '💪 Keep going!'}`;

    if (percent === 100) {
      triggerConfetti();
    }
  }

  /**
   * Confetti Celebration Animation
   */
  function triggerConfetti() {
    const canvas = els.confettiCanvas;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        gravity: 0.3,
        opacity: 1
      });
    }

    let animId;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.opacity -= 0.012;
        if (p.opacity > 0) {
          alive = true;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(renderConfetti);
      } else {
        canvas.style.display = 'none';
        cancelAnimationFrame(animId);
      }
    }
    renderConfetti();
  }

  /**
   * Initialize Event Listeners
   */
  function initEvents() {
    // Operation Select Change
    els.opType.addEventListener('change', () => {
      syncFormFields();
      generateAndRender();
    });

    els.multRangeSelect.addEventListener('change', () => {
      syncFormFields();
      generateAndRender();
    });

    // Option radios & checkboxes
    document.querySelectorAll('.sidebar input[type="radio"], .sidebar input[type="checkbox"]').forEach(el => {
      el.addEventListener('change', () => {
        syncFormFields();
        generateAndRender();
      });
    });

    els.divRangeSelect.addEventListener('change', generateAndRender);
    els.pageCountSelect.addEventListener('change', generateAndRender);
    els.studentName.addEventListener('input', () => {
      readConfigFromUI();
      rerender();
    });
    els.worksheetTitle.addEventListener('input', () => {
      readConfigFromUI();
      rerender();
    });

    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyPreset(btn.dataset.preset);
        generateAndRender();
      });
    });

    // Generate & Print Buttons
    els.btnGenerate.addEventListener('click', generateAndRender);
    els.btnPrintSidebar.addEventListener('click', () => window.print());
    els.btnPrintTop.addEventListener('click', () => window.print());

    // Answer toggle
    els.btnToggleAnswers.addEventListener('click', () => {
      state.showAnswers = !state.showAnswers;
      els.btnToggleAnswers.textContent = state.showAnswers ? '🙈 Hide Answers' : '👁️ Show Answers';
      rerender();
    });

    // Mode Buttons
    els.modePrintPreview.addEventListener('click', () => setMode('print-preview'));
    els.modeInteractive.addEventListener('click', () => setMode('interactive'));

    // Interactive Actions
    els.btnCheckAnswers.addEventListener('click', checkInteractiveAnswers);
    els.btnResetInteractive.addEventListener('click', resetInteractiveState);
  }

  // Initialization
  syncFormFields();
  initEvents();
  applyUrlConfig();
  generateAndRender();
})();
