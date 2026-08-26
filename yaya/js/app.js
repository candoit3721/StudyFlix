/**
 * Yaya's Math Studio - Main Application Controller
 * Handles configuration, preset selection, dynamic problem generation,
 * KaTeX rendering, multi-page pagination, separate answer sheet on last page,
 * interactive grading, timer, and print triggering.
 */

(function () {
  // Application State
  const state = {
    config: {
      category: 'all_mixed',
      difficulty: 'all',
      count: 12,
      gridCols: 1,
      questionsPerPage: 'auto',
      fontSize: 'normal',
      studentName: 'Yaya',
      worksheetTitle: '大学入学考试数学模拟试卷（微积分与概率统计）',
      includeWorkSpace: true,
      includeAnswerKey: true,
      includeHints: true
    },
    problems: [],
    mode: 'print-preview', // 'print-preview' or 'interactive'
    timerInterval: null,
    timerSeconds: 0
  };

  // Presets definition
  const presets = {
    calculus_derivatives: {
      category: 'calc_derivatives',
      count: 8,
      gridCols: 1,
      questionsPerPage: '4',
      worksheetTitle: '微积分专题冲刺：导数、切线与极值综合演练',
      includeWorkSpace: true
    },
    calculus_inequalities: {
      category: 'calc_zeros_ineq',
      count: 6,
      gridCols: 1,
      questionsPerPage: '3',
      worksheetTitle: '微积分拔高培优：函数零点、参变分离与切线放缩不等式',
      includeWorkSpace: true
    },
    calculus_integrals: {
      category: 'calc_integrals',
      count: 8,
      gridCols: 1,
      questionsPerPage: '4',
      worksheetTitle: '积分学专项：换元积分、分部积分与几何面积计算',
      includeWorkSpace: true
    },
    prob_discrete: {
      category: 'prob_distributions',
      count: 8,
      gridCols: 1,
      questionsPerPage: '4',
      worksheetTitle: '概率论专项：离散随机变量、分布列与期望决策模型',
      includeWorkSpace: true
    },
    stats_normal: {
      category: 'prob_normal',
      count: 8,
      gridCols: 1,
      questionsPerPage: '4',
      worksheetTitle: '数理统计专项：正态分布 3σ 准则与质量控制标准化',
      includeWorkSpace: true
    },
    stats_chisquare: {
      category: 'stats_chisquare',
      count: 6,
      gridCols: 1,
      questionsPerPage: '3',
      worksheetTitle: '统计推断专项：2x2 列联表构建与卡方独立性检验',
      includeWorkSpace: true
    },
    stats_regression: {
      category: 'stats_regression',
      count: 6,
      gridCols: 1,
      questionsPerPage: '3',
      worksheetTitle: '统计建模专项：一元线性回归方程与非线性对数化拟合',
      includeWorkSpace: true
    },
    preuni_mle: {
      category: 'stats_mle',
      count: 6,
      gridCols: 1,
      questionsPerPage: '3',
      worksheetTitle: '大学预科先修：泰勒展开极限与参数最大似然估计（MLE）',
      includeWorkSpace: true
    },
    entrance_exam_mock: {
      category: 'all_mixed',
      count: 12,
      gridCols: 1,
      questionsPerPage: '4',
      worksheetTitle: '大学入学考试全真模拟试卷（高等数学先修与概率统计）',
      includeWorkSpace: true
    }
  };

  // DOM Elements
  const els = {
    topicSelect: document.getElementById('topic-select'),
    difficultySelect: document.getElementById('difficulty-select'),
    questionCount: document.getElementById('question-count'),
    gridColsSelect: document.getElementById('grid-cols-select'),
    perPageSelect: document.getElementById('per-page-select'),
    fontSizeSelect: document.getElementById('font-size-select'),
    studentNameInput: document.getElementById('student-name-input'),
    worksheetTitleInput: document.getElementById('worksheet-title-input'),
    includeAnswerKeyCheck: document.getElementById('include-answer-key-check'),
    includeWorkSpaceCheck: document.getElementById('include-workspace-check'),
    includeHintsCheck: document.getElementById('include-hints-check'),
    btnGenerate: document.getElementById('btn-generate'),
    btnPrintSidebar: document.getElementById('btn-print-sidebar'),
    btnPrintTop: document.getElementById('btn-print-top'),
    modePrintBtn: document.getElementById('mode-print-btn'),
    modeInteractiveBtn: document.getElementById('mode-interactive-btn'),
    btnJumpToAnswers: document.getElementById('btn-jump-to-answers'),
    btnCheckAnswers: document.getElementById('btn-check-answers'),
    btnResetInteractive: document.getElementById('btn-reset-interactive'),

    // View Containers
    pagesContainer: document.getElementById('pages-container'),
    interactiveToolbar: document.getElementById('interactive-toolbar'),
    interactiveScore: document.getElementById('interactive-score'),
    interactiveTimer: document.getElementById('interactive-timer'),
    interactiveProgress: document.getElementById('interactive-progress'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // Build the problem set based on current configuration
  function generateProblems() {
    const cat = state.config.category;
    const count = parseInt(state.config.count, 10);
    const diff = state.config.difficulty;

    let pool = [];

    if (window.AdvancedProblemBank && window.AdvancedProblemBank.length > 0) {
      if (cat === 'all_mixed') {
        pool = [...window.AdvancedProblemBank];
      } else if (cat === 'calc_all') {
        pool = window.AdvancedProblemBank.filter(p => p.category.startsWith('calc_'));
      } else if (cat === 'stats_all') {
        pool = window.AdvancedProblemBank.filter(p => p.category.startsWith('stat_') || p.category.startsWith('prob_'));
      } else {
        pool = window.AdvancedProblemBank.filter(p => p.category === cat);
      }
    }

    // Difficulty filter if selected
    if (diff === 'standard') {
      pool = pool.filter(p => p.difficulty <= 3);
    } else if (diff === 'advanced') {
      pool = pool.filter(p => p.difficulty >= 4);
    }

    // If pool has fewer items than requested count, generate dynamic variations
    let selected = [];
    if (pool.length > 0) {
      // Shuffle pool
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, count);
    }

    // Top up with dynamic variations if needed
    while (selected.length < count) {
      if (cat.startsWith('calc') || cat === 'all_mixed') {
        selected.push(window.MathEngine.DynamicGenerators.derivativeExtremum());
      } else {
        selected.push(window.MathEngine.DynamicGenerators.normalDistributionQuality());
      }
    }

    state.problems = selected;
  }

  // Calculate items per page based on layout and configuration
  function calculatePerPage() {
    if (state.config.questionsPerPage && state.config.questionsPerPage !== 'auto') {
      return parseInt(state.config.questionsPerPage, 10);
    }
    // Auto-fit calculation
    if (state.config.gridCols === 2) {
      return state.config.includeWorkSpace ? 6 : 8;
    } else {
      return state.config.includeWorkSpace ? 3 : 4;
    }
  }

  // Create a single problem card element WITHOUT any answers under the question
  function createProblemCard(p, globalIndex) {
    const qNum = globalIndex + 1;
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.setAttribute('data-id', p.id);
    card.setAttribute('data-index', globalIndex);

    const stars = '★'.repeat(p.difficulty) + '☆'.repeat(Math.max(0, 5 - p.difficulty));

    let bodyHtml = `<div class="problem-body"><p>${p.content}</p></div>`;

    // Sub-questions if any
    if (p.subQuestions && p.subQuestions.length > 0) {
      bodyHtml += `<ol class="sub-questions-list">`;
      p.subQuestions.forEach(sq => {
        bodyHtml += `<li class="sub-question-item">${sq}</li>`;
      });
      bodyHtml += `</ol>`;
    }

    // Multiple choice options if type is choice or multi_choice (WITHOUT showing correct answer)
    if (p.options && p.options.length > 0) {
      bodyHtml += `<div class="options-grid">`;
      p.options.forEach(opt => {
        bodyHtml += `
          <label class="option-label">
            <input type="${p.type === 'multi_choice' ? 'checkbox' : 'radio'}" name="opt_${p.id}" value="${opt.key}">
            <span><strong>${opt.key}.</strong> ${opt.text}</span>
          </label>
        `;
      });
      bodyHtml += `</div>`;
    }

    // Workspace Box (for calculation and scratch work)
    let workspaceHtml = '';
    if (state.config.includeWorkSpace) {
      workspaceHtml = `
        <div class="workspace-box">
          <span class="workspace-watermark">【草稿与解答书写区】</span>
        </div>
      `;
    }

    // Interactive input (ONLY rendered and visible during Practice Online Mode)
    let interactiveInputHtml = '';
    if (p.type === 'input' || p.type === 'analytical') {
      interactiveInputHtml = `
        <div class="interactive-input-group" style="${state.mode === 'interactive' ? '' : 'display:none;'}">
          <div class="answer-input-row">
            <span><strong>答：</strong></span>
            <input type="text" class="math-answer-input" placeholder="输入最终计算结果或结论..." data-expected="${escapeHtml(p.expectedAnswer)}">
            <span class="feedback-badge"></span>
          </div>
        </div>
      `;
    }

    // Optional Hint (only visible in Interactive Practice mode if enabled)
    let hintsHtml = '';
    if (state.mode === 'interactive' && state.config.includeHints && p.hint) {
      hintsHtml = `
        <div class="hints-accordion">
          <div class="accordion-header">
            <span>💡 考点思路与提示 (Click to View Hint)</span>
            <span>▼</span>
          </div>
          <div class="accordion-body" style="display: none;">
            ${p.hint}
          </div>
        </div>
      `;
    }

    // Notice: NO answers or solutions are placed here.
    // ALL answers are strictly grouped on the very last page (Answer Sheet Page).
    card.innerHTML = `
      <div class="problem-card-header">
        <div class="problem-number">第 ${qNum} 题. ${escapeHtml(p.title || '')}</div>
        <div class="problem-tags">
          <span class="tag-badge topic">${escapeHtml(p.topicName || '微积分/统计')}</span>
          <span class="difficulty-stars" title="难度等级">${stars}</span>
        </div>
      </div>
      ${bodyHtml}
      ${workspaceHtml}
      ${interactiveInputHtml}
      ${hintsHtml}
    `;

    return card;
  }

  // Render the full multi-page exam sheet and separate answer sheet on the last page
  function renderWorksheet() {
    if (!els.pagesContainer) return;

    els.pagesContainer.className = `pages-container font-${state.config.fontSize}`;
    els.pagesContainer.innerHTML = '';

    const problems = state.problems;
    const isTwoCol = state.config.gridCols === 2;
    const perPage = calculatePerPage();

    // Split problems into page chunks
    const pageChunks = [];
    for (let i = 0; i < problems.length; i += perPage) {
      pageChunks.push(problems.slice(i, i + perPage));
    }

    const questionPagesCount = pageChunks.length;
    const totalPages = questionPagesCount + (state.config.includeAnswerKey ? 1 : 0);

    let globalIndex = 0;

    // Render each Question Page (NO answers on any of these pages)
    pageChunks.forEach((chunk, pageIdx) => {
      const pageNum = pageIdx + 1;
      const examPage = document.createElement('div');
      examPage.className = 'exam-page';

      // Page Header: Full header on Page 1, compact continuation header on subsequent pages
      let headerHtml = '';
      if (pageNum === 1) {
        headerHtml = `
          <div class="exam-header">
            <div class="exam-school">★ 全国高中数学名校联考 / 大学预科水平测试 ★</div>
            <h2>${escapeHtml(state.config.worksheetTitle)}</h2>
            <div class="exam-meta-grid">
              <div class="exam-meta-item">
                <span>考生姓名：</span>
                <span class="underline-field">${escapeHtml(state.config.studentName || 'Yaya')}</span>
              </div>
              <div class="exam-meta-item">
                <span>准考证号：</span>
                <span class="underline-field">2026-MATH-0826</span>
              </div>
              <div class="exam-meta-item">
                <span>试卷分值：</span>
                <span class="underline-field">150 分</span>
              </div>
              <div class="exam-meta-item">
                <span>考试时间：</span>
                <span class="underline-field">120 分钟</span>
              </div>
            </div>
          </div>

          <div class="exam-instructions">
            <strong>考生须知：</strong> 1. 本试卷满分 150 分，涵盖微积分与数理统计综合重点；2. 解答题应写出必要的文字说明、证明过程或演算步骤；3. 请规范书写，保持卷面整洁。
          </div>
        `;
      } else {
        headerHtml = `
          <div class="exam-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; color: var(--text-muted);">
              <span><strong>${escapeHtml(state.config.worksheetTitle)}</strong>（试题部分 · 续）</span>
              <span>考生姓名：<strong>${escapeHtml(state.config.studentName || 'Yaya')}</strong></span>
              <span>第 ${pageNum} 页 / 共 ${totalPages} 页</span>
            </div>
          </div>
        `;
      }

      // Problem List container for this page
      const listDiv = document.createElement('div');
      listDiv.className = `problems-list ${isTwoCol ? 'cols-2' : ''}`;

      chunk.forEach(p => {
        const card = createProblemCard(p, globalIndex);
        listDiv.appendChild(card);
        globalIndex++;
      });

      examPage.innerHTML = headerHtml;
      examPage.appendChild(listDiv);

      // Page Footer
      const footerDiv = document.createElement('div');
      footerDiv.className = 'exam-footer';
      footerDiv.innerHTML = `
        <span>第 ${pageNum} 页（共 ${totalPages} 页 · 试题部分）</span>
        <span>Yaya's 高等数学与统计练习工作室 · 祝考试顺利！</span>
      `;
      examPage.appendChild(footerDiv);

      els.pagesContainer.appendChild(examPage);
    });

    // Build the SEPARATE Answer Sheet strictly on the VERY LAST PAGE
    if (state.config.includeAnswerKey) {
      const answerPage = document.createElement('div');
      answerPage.className = 'exam-page answer-sheet-page';
      answerPage.id = 'answer-sheet-section';

      // 1. Quick Answer Grid
      let quickGridHtml = '<div class="quick-answer-grid">';
      problems.forEach((p, idx) => {
        quickGridHtml += `
          <div class="quick-answer-item">
            <span class="q-idx">第 ${idx + 1} 题</span>
            <span class="q-val">${escapeHtml(p.expectedAnswer)}</span>
          </div>
        `;
      });
      quickGridHtml += '</div>';

      // 2. Detailed Step-by-Step Solutions List
      let detailedSolutionsHtml = '<div class="solutions-list">';
      problems.forEach((p, idx) => {
        detailedSolutionsHtml += `
          <div class="solution-item">
            <h4>第 ${idx + 1} 题【${escapeHtml(p.title || '')}】详细解析与分步评分要点：</h4>
            <div class="solution-steps">
              ${p.solution || `<p>参考答案：${p.expectedAnswer}</p>`}
            </div>
          </div>
        `;
      });
      detailedSolutionsHtml += '</div>';

      answerPage.innerHTML = `
        <div class="answer-sheet-title">🔑 试卷参考答案与详细评分标准（独立最末页）</div>
        <div style="background: #eef2ff; border-left: 4px solid var(--primary); padding: 9px 14px; margin-bottom: 20px; font-size: 0.86rem; color: var(--primary); line-height: 1.5;">
          <strong>独立答案页说明：</strong> 本页为独立答案与分步评分解析页。所有试题答案全部汇总于此，打印时作为最后一页输出，前面的试题卷面无任何答案，确保真实模拟测试环境。
        </div>
        <div style="margin-bottom: 12px; font-weight: 700; color: var(--text-main); font-size: 0.95rem;">【第一部分：客观题与最终答案速查表】</div>
        ${quickGridHtml}
        <div style="margin-bottom: 16px; font-weight: 700; color: var(--text-main); font-size: 0.95rem;">【第二部分：主观解答大题完整分步评分解析】</div>
        ${detailedSolutionsHtml}
        <div class="exam-footer">
          <span>第 ${totalPages} 页（共 ${totalPages} 页 · 独立答案与评分解析页）</span>
          <span>Yaya's Math Studio · 严谨推导 · 步步求精</span>
        </div>
      `;

      els.pagesContainer.appendChild(answerPage);
    }

    // Attach click listeners to accordion headers (if any hints)
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function () {
        const body = this.nextElementSibling;
        if (body) {
          const isHidden = window.getComputedStyle(body).display === 'none';
          body.style.display = isHidden ? 'block' : 'none';
        }
      });
    });

    // Render KaTeX Math in all containers
    window.MathEngine.renderMath(els.pagesContainer);

    // Update Interactive stats
    updateInteractiveStats();
  }

  // Update Interactive mode stats
  function updateInteractiveStats() {
    if (els.interactiveScore) {
      els.interactiveScore.innerText = `0 / ${state.problems.length}`;
    }
    if (els.interactiveProgress) {
      els.interactiveProgress.innerText = `0%`;
    }
  }

  // Check answers in interactive mode
  function checkAnswers() {
    let correctCount = 0;
    const total = state.problems.length;

    state.problems.forEach((p, idx) => {
      const card = document.querySelector(`.problem-card[data-index="${idx}"]`);
      if (!card) return;

      let isCorrect = false;

      if (p.options && p.options.length > 0) {
        // Choice checking
        const checked = card.querySelectorAll(`input[name="opt_${p.id}"]:checked`);
        const userVals = Array.from(checked).map(c => c.value).sort().join(',');
        if (userVals === p.expectedAnswer) {
          isCorrect = true;
        }
      } else {
        // Text input checking
        const input = card.querySelector('.math-answer-input');
        if (input) {
          const uVal = input.value;
          if (window.MathEngine.checkAnswer(uVal, p.expectedAnswer)) {
            isCorrect = true;
            input.classList.remove('incorrect');
            input.classList.add('correct');
          } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
          }
        }
      }

      if (isCorrect) correctCount++;
    });

    if (els.interactiveScore) {
      els.interactiveScore.innerText = `${correctCount} / ${total}`;
    }
    if (els.interactiveProgress) {
      const pct = Math.round((correctCount / total) * 100);
      els.interactiveProgress.innerText = `${pct}%`;
    }

    // Celebrate if score is high!
    if (correctCount === total || (total > 0 && correctCount / total >= 0.8)) {
      triggerConfetti();
    }
  }

  // Confetti celebration animation
  function triggerConfetti() {
    const canvas = els.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#4338ca', '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }

    let animationFrame;
    let start = Date.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (Date.now() - start < 3500) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    draw();
  }

  // Timer functions
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
    if (!els.interactiveTimer) return;
    const mins = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (state.timerSeconds % 60).toString().padStart(2, '0');
    els.interactiveTimer.innerText = `${mins}:${secs}`;
  }

  // Helper: HTML escape
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Event Listeners
  function initEvents() {
    // Presets click
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const pKey = this.getAttribute('data-preset');
        if (presets[pKey]) {
          const cfg = presets[pKey];
          state.config.category = cfg.category;
          state.config.count = cfg.count;
          state.config.gridCols = cfg.gridCols;
          state.config.questionsPerPage = cfg.questionsPerPage || 'auto';
          state.config.worksheetTitle = cfg.worksheetTitle;

          // Sync controls
          if (els.topicSelect) els.topicSelect.value = cfg.category;
          if (els.questionCount) els.questionCount.value = cfg.count;
          if (els.gridColsSelect) els.gridColsSelect.value = cfg.gridCols;
          if (els.perPageSelect) els.perPageSelect.value = state.config.questionsPerPage;
          if (els.worksheetTitleInput) els.worksheetTitleInput.value = cfg.worksheetTitle;

          generateProblems();
          renderWorksheet();
        }
      });
    });

    // Form inputs change
    if (els.topicSelect) {
      els.topicSelect.addEventListener('change', e => {
        state.config.category = e.target.value;
        generateProblems();
        renderWorksheet();
      });
    }

    if (els.difficultySelect) {
      els.difficultySelect.addEventListener('change', e => {
        state.config.difficulty = e.target.value;
        generateProblems();
        renderWorksheet();
      });
    }

    if (els.questionCount) {
      els.questionCount.addEventListener('change', e => {
        state.config.count = parseInt(e.target.value, 10);
        generateProblems();
        renderWorksheet();
      });
    }

    if (els.gridColsSelect) {
      els.gridColsSelect.addEventListener('change', e => {
        state.config.gridCols = parseInt(e.target.value, 10);
        renderWorksheet();
      });
    }

    if (els.perPageSelect) {
      els.perPageSelect.addEventListener('change', e => {
        state.config.questionsPerPage = e.target.value;
        renderWorksheet();
      });
    }

    if (els.fontSizeSelect) {
      els.fontSizeSelect.addEventListener('change', e => {
        state.config.fontSize = e.target.value;
        renderWorksheet();
      });
    }

    if (els.studentNameInput) {
      els.studentNameInput.addEventListener('input', e => {
        state.config.studentName = e.target.value;
        renderWorksheet();
      });
    }

    if (els.worksheetTitleInput) {
      els.worksheetTitleInput.addEventListener('input', e => {
        state.config.worksheetTitle = e.target.value;
        renderWorksheet();
      });
    }

    if (els.includeWorkSpaceCheck) {
      els.includeWorkSpaceCheck.addEventListener('change', e => {
        state.config.includeWorkSpace = e.target.checked;
        renderWorksheet();
      });
    }

    if (els.includeAnswerKeyCheck) {
      els.includeAnswerKeyCheck.addEventListener('change', e => {
        state.config.includeAnswerKey = e.target.checked;
        renderWorksheet();
      });
    }

    if (els.includeHintsCheck) {
      els.includeHintsCheck.addEventListener('change', e => {
        state.config.includeHints = e.target.checked;
        renderWorksheet();
      });
    }

    // Buttons
    if (els.btnGenerate) {
      els.btnGenerate.addEventListener('click', () => {
        generateProblems();
        renderWorksheet();
      });
    }

    const triggerPrint = () => window.print();
    if (els.btnPrintSidebar) els.btnPrintSidebar.addEventListener('click', triggerPrint);
    if (els.btnPrintTop) els.btnPrintTop.addEventListener('click', triggerPrint);

    // Mode Toggle
    if (els.modePrintBtn && els.modeInteractiveBtn) {
      els.modePrintBtn.addEventListener('click', () => {
        state.mode = 'print-preview';
        els.modePrintBtn.classList.add('active');
        els.modeInteractiveBtn.classList.remove('active');
        if (els.interactiveToolbar) els.interactiveToolbar.style.display = 'none';
        stopTimer();
        renderWorksheet();
      });

      els.modeInteractiveBtn.addEventListener('click', () => {
        state.mode = 'interactive';
        els.modeInteractiveBtn.classList.add('active');
        els.modePrintBtn.classList.remove('active');
        if (els.interactiveToolbar) els.interactiveToolbar.style.display = 'flex';
        startTimer();
        renderWorksheet();
      });
    }

    // Jump to Answer Sheet on the very last page
    if (els.btnJumpToAnswers) {
      els.btnJumpToAnswers.addEventListener('click', () => {
        const answerSheet = document.getElementById('answer-sheet-section');
        if (answerSheet) {
          answerSheet.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If answer sheet is unchecked, temporarily enable it and re-render
          if (els.includeAnswerKeyCheck) {
            els.includeAnswerKeyCheck.checked = true;
            state.config.includeAnswerKey = true;
            renderWorksheet();
            setTimeout(() => {
              const el = document.getElementById('answer-sheet-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      });
    }

    // Check answers & Reset
    if (els.btnCheckAnswers) {
      els.btnCheckAnswers.addEventListener('click', checkAnswers);
    }
    if (els.btnResetInteractive) {
      els.btnResetInteractive.addEventListener('click', () => {
        document.querySelectorAll('.math-answer-input').forEach(input => {
          input.value = '';
          input.classList.remove('correct', 'incorrect');
        });
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r => r.checked = false);
        updateInteractiveStats();
        startTimer();
      });
    }
  }

  // Initialize Application
  function init() {
    initEvents();
    generateProblems();
    renderWorksheet();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
