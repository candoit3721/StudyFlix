/**
 * Sophia's Geometry & Area Masterclass Lab Engine
 * Interactive SVG Shape Visualizer, Proof Animations, and 3-Tier Quiz Arena
 * Ontario Mathematics Curriculum Grade 5 & 6 (Strand E: Spatial Sense)
 */

(function () {
  'use strict';

  // --- State Management ---
  const state = {
    currentStation: 'triangle',
    proofActive: false,
    showGrid: true,
    userXP: 0,
    streak: 0,
    arenaTier: 1,
    arenaIndex: 0,
    params: {
      // Triangle
      triangleType: 'acute', // 'right', 'acute', 'obtuse'
      triBase: 12,
      triHeight: 8,
      // Parallelogram
      paraBase: 14,
      paraHeight: 9,
      paraSkew: 25,
      // Trapezoid
      trapBaseA: 8,
      trapBaseB: 16,
      trapHeight: 7,
      // Rhombus / Kite
      diag1: 16,
      diag2: 10,
      kiteOffset: 0.35,
      // Circle & Ring
      circleMode: 'circle', // 'circle' | 'ring'
      circleRadius: 6,
      ringOuter: 8,
      ringInner: 5,
      // Composite
      compositeType: 'lshape', // 'lshape' | 'house' | 'pool' | 'cross'
      compOuterW: 12,
      compOuterH: 10,
      compCutW: 5,
      compCutH: 4
    }
  };

  // --- Station Configurations ---
  const STATIONS = {
    triangle: {
      name: 'Triangles',
      formula: 'A = ½ × b × h',
      trap: '⚠️ Watch out: Never multiply the slanted sides! Always use the perpendicular 90° height.',
      render: renderTriangleStation
    },
    parallelogram: {
      name: 'Parallelograms',
      formula: 'A = b × h',
      trap: '⚠️ Trap alert: Slanted side length is NOT the height. Cut and slide the triangular corner to see the rectangle.',
      render: renderParallelogramStation
    },
    trapezoid: {
      name: 'Trapezoids',
      formula: 'A = ((a + b) / 2) × h',
      trap: '⚠️ Strategy: Average the two parallel bases (a + b)/2, then multiply by the vertical height h.',
      render: renderTrapezoidStation
    },
    rhombus: {
      name: 'Rhombus & Kite',
      formula: 'A = (d₁ × d₂) / 2',
      trap: '⚠️ Diagonal rule: The shape fills exactly 50% of the surrounding bounding box formed by d₁ × d₂.',
      render: renderRhombusStation
    },
    circle: {
      name: 'Circles & Rings',
      formula: 'A = π × r² &nbsp;|&nbsp; Ring: π(R² - r²)',
      trap: '⚠️ Radius vs Diameter: If diameter d is given, divide by 2 first! (r = d / 2, then r²).',
      render: renderCircleStation
    },
    composite: {
      name: 'Composite Figures',
      formula: 'A = A₁ + A₂ &nbsp;or&nbsp; A_box − A_cutouts',
      trap: '⚠️ Decomposition: Choose either the Additive Split or Subtractive Bounding Box method.',
      render: renderCompositeStation
    }
  };

  // --- 18+ Quiz Arena Questions (3 Tiers with Live Diagrams) ---
  const ARENA_QUESTIONS = [
    // TIER 1: Ontario Core Benchmarks
    {
      tier: 1,
      shape: 'triangle',
      badge: 'TIER 1 • ONTARIO BENCHMARK',
      prompt: 'A right-angled sail on a Canadian sailboat has a base of 14 m and a perpendicular height of 9 m. Calculate the sail area.',
      diagramType: 'triangle',
      diagramParams: { b: 14, h: 9, type: 'right' },
      options: ['126 m²', '46 m²', '63 m²', '72 m²'],
      correctIndex: 2, // C
      solution: 'Area of triangle = ½ × base × height = ½ × 14 × 9 = 7 × 9 = 63 m².'
    },
    {
      tier: 1,
      shape: 'parallelogram',
      badge: 'TIER 1 • ONTARIO BENCHMARK',
      prompt: 'A solar roof panel is shaped as a parallelogram with base = 16 m and perpendicular height = 8 m. What is its area?',
      diagramType: 'parallelogram',
      diagramParams: { b: 16, h: 8, skew: 20 },
      options: ['64 m²', '128 m²', '256 m²', '48 m²'],
      correctIndex: 1, // B
      solution: 'Area of parallelogram = base × perpendicular height = 16 × 8 = 128 m².'
    },
    {
      tier: 1,
      shape: 'trapezoid',
      badge: 'TIER 1 • ONTARIO BENCHMARK',
      prompt: 'A community garden plot is a trapezoid with parallel bases 10 m and 18 m, and perpendicular height 6 m. Find the area.',
      diagramType: 'trapezoid',
      diagramParams: { a: 10, b: 18, h: 6 },
      options: ['168 m²', '56 m²', '108 m²', '84 m²'],
      correctIndex: 3, // D
      solution: 'Area = ((a + b) / 2) × h = ((10 + 18) / 2) × 6 = 14 × 6 = 84 m².'
    },
    {
      tier: 1,
      shape: 'rhombus',
      badge: 'TIER 1 • ONTARIO BENCHMARK',
      prompt: 'A festival kite has perpendicular cross-diagonals measuring 30 cm and 22 cm. What is the area of the kite?',
      diagramType: 'rhombus',
      diagramParams: { d1: 30, d2: 22 },
      options: ['330 cm²', '660 cm²', '165 cm²', '520 cm²'],
      correctIndex: 0, // A
      solution: 'Area of kite = (d₁ × d₂) / 2 = (30 × 22) / 2 = 660 / 2 = 330 cm².'
    },
    {
      tier: 1,
      shape: 'circle',
      badge: 'TIER 1 • ONTARIO BENCHMARK',
      prompt: 'A circular pizza in Toronto has a radius of 10 cm. Using π ≈ 3.14, find the surface area of the pizza.',
      diagramType: 'circle',
      diagramParams: { r: 10 },
      options: ['62.8 cm²', '157 cm²', '314 cm²', '628 cm²'],
      correctIndex: 2, // C
      solution: 'Area of circle = π × r² = 3.14 × 10² = 3.14 × 100 = 314 cm².'
    },
    {
      tier: 1,
      shape: 'composite',
      badge: 'TIER 1 • ONTARIO BENCHMARK',
      prompt: 'A rectangular lawn is 15 m long by 8 m wide. A square patio of side 4 m is built in one corner. What is the remaining grass area?',
      diagramType: 'lshape',
      diagramParams: { W: 15, H: 8, cutW: 4, cutH: 4 },
      options: ['120 m²', '104 m²', '96 m²', '116 m²'],
      correctIndex: 1, // B
      solution: 'Total lawn area = 15 × 8 = 120 m². Patio area = 4 × 4 = 16 m². Remaining grass = 120 − 16 = 104 m².'
    },

    // TIER 2: Enriched Applications & Reverse Dimensions
    {
      tier: 2,
      shape: 'triangle',
      badge: 'TIER 2 • ENRICHED REVERSE DIMENSIONS',
      prompt: 'A triangle has an area of 72 cm² and a base of 12 cm. What is its perpendicular height?',
      diagramType: 'triangle',
      diagramParams: { b: 12, h: 12, type: 'acute' },
      options: ['6 cm', '18 cm', '24 cm', '12 cm'],
      correctIndex: 3, // D
      solution: 'Area = ½ × b × h ➔ 72 = ½ × 12 × h ➔ 72 = 6h ➔ h = 72 / 6 = 12 cm.'
    },
    {
      tier: 2,
      shape: 'trapezoid',
      badge: 'TIER 2 • ENRICHED REVERSE DIMENSIONS',
      prompt: 'A trapezoid with parallel bases 8 cm and 14 cm has an area of 88 cm². Find its perpendicular height.',
      diagramType: 'trapezoid',
      diagramParams: { a: 8, b: 14, h: 8 },
      options: ['4 cm', '8 cm', '11 cm', '16 cm'],
      correctIndex: 1, // B
      solution: 'Area = ((a + b) / 2) × h ➔ 88 = ((8 + 14) / 2) × h ➔ 88 = 11h ➔ h = 8 cm.'
    },
    {
      tier: 2,
      shape: 'circle',
      badge: 'TIER 2 • ENRICHED ANNULUS RING',
      prompt: 'A circular flowerbed of radius 4 m is surrounded by a paved walking ring 1 m wide all around (outer radius = 5 m). Using π ≈ 3.14, find the ring path area.',
      diagramType: 'ring',
      diagramParams: { R: 5, r: 4 },
      options: ['28.26 m²', '78.5 m²', '50.24 m²', '15.7 m²'],
      correctIndex: 0, // A
      solution: 'Ring Area = π(R² − r²) = 3.14 × (5² − 4²) = 3.14 × (25 − 16) = 3.14 × 9 = 28.26 m².'
    },
    {
      tier: 2,
      shape: 'composite',
      badge: 'TIER 2 • HOUSE PROFILE COMPOSITE',
      prompt: 'A birdhouse front has a square base of 10 cm × 10 cm and a triangular roof of base 10 cm and height 6 cm. Find the total facade area.',
      diagramType: 'house',
      diagramParams: { W: 10, H: 10, roofH: 6 },
      options: ['160 cm²', '100 cm²', '130 cm²', '145 cm²'],
      correctIndex: 2, // C
      solution: 'Square base = 10 × 10 = 100 cm². Roof triangle = ½ × 10 × 6 = 30 cm². Total area = 100 + 30 = 130 cm².'
    },
    {
      tier: 2,
      shape: 'parallelogram',
      badge: 'TIER 2 • MULTI-STEP SHADED BORDER',
      prompt: 'A rectangular courtyard is 25 m × 16 m. A diagonal walkway shaped as a parallelogram with horizontal width 2 m and height 16 m passes through. What is the remaining courtyard area?',
      diagramType: 'parallelogram',
      diagramParams: { b: 25, h: 16, skew: 15 },
      options: ['400 m²', '32 m²', '384 m²', '368 m²'],
      correctIndex: 3, // D
      solution: 'Total courtyard = 25 × 16 = 400 m². Walkway = 2 × 16 = 32 m². Remaining area = 400 − 32 = 368 m².'
    },
    {
      tier: 2,
      shape: 'rhombus',
      badge: 'TIER 2 • SQUARE MIDPOINT RHOMBUS',
      prompt: 'A square has side length 12 cm. A rhombus is formed by connecting the midpoints of the four sides of the square. What is the rhombus area?',
      diagramType: 'rhombus',
      diagramParams: { d1: 12, d2: 12 },
      options: ['144 cm²', '72 cm²', '36 cm²', '96 cm²'],
      correctIndex: 1, // B
      solution: 'The diagonals of the midpoint rhombus equal the square side length (d₁ = 12, d₂ = 12). Area = (12 × 12) / 2 = 144 / 2 = 72 cm² (exactly half the square).'
    },

    // TIER 3: Waterloo CEMC Gauss Contest Challenges
    {
      tier: 3,
      shape: 'composite',
      badge: 'TIER 3 • WATERLOO GAUSS SHADED TRIANGLE',
      prompt: 'In a 10 cm × 10 cm square ABCD, point M is the midpoint of BC (5 cm from B) and N is the midpoint of CD. Segments AM and AN are drawn. What fraction of the square is Triangle AMN?',
      diagramType: 'gauss_triangle',
      diagramParams: {},
      options: ['3/8 (37.5%)', '1/2 (50%)', '1/4 (25%)', '5/16 (31.25%)'],
      correctIndex: 0, // A
      solution: 'Square Area = 100 cm². Unshaded right triangles: ΔABM = ½×10×5 = 25, ΔADN = ½×10×5 = 25, ΔMCN = ½×5×5 = 12.5. Total unshaded = 62.5 cm². Shaded ΔAMN = 100 − 62.5 = 37.5 cm² = 3/8 of the square.'
    },
    {
      tier: 3,
      shape: 'circle',
      badge: 'TIER 3 • INSCRIBED SQUARE RATIO',
      prompt: 'A large square S₁ has an inscribed circle C. Inside circle C, a smaller square S₂ is inscribed with all 4 vertices on the circle. What is the ratio Area(S₁) : Area(S₂)?',
      diagramType: 'inscribed_squares',
      diagramParams: {},
      options: ['4 : 1', '√2 : 1', '2 : 1', '3 : 2'],
      correctIndex: 2, // C
      solution: 'Let radius be r. Side of S₁ = 2r ➔ Area(S₁) = 4r². Diagonal of S₂ = 2r ➔ Area(S₂) = (2r)² / 2 = 2r². Ratio Area(S₁) : Area(S₂) = 4r² : 2r² = 2 : 1.'
    },
    {
      tier: 3,
      shape: 'composite',
      badge: 'TIER 3 • WATERLOO 4-PETAL FLOWER',
      prompt: 'Inside a 20 cm × 20 cm square, four semicircles are drawn on the four sides as diameters. The 4 semicircles overlap to form a 4-petal flower. Using π ≈ 3.14, find the flower area.',
      diagramType: 'four_petals',
      diagramParams: {},
      options: ['314 cm²', '228 cm²', '172 cm²', '200 cm²'],
      correctIndex: 1, // B
      solution: 'Radius of each semicircle = 10 cm. Combined area of 4 semicircles = 4 × (½ × π × 10²) = 200π ≈ 628 cm². Flower Area = Total Semicircles − Square = 628 − 400 = 228 cm².'
    },
    {
      tier: 3,
      shape: 'trapezoid',
      badge: 'TIER 3 • DIAGONAL AREA RATIO',
      prompt: 'A trapezoid with parallel sides AB = 6 cm and CD = 14 cm has total area 100 cm². Diagonal AC divides it into two triangles. What is the area of Triangle ACD?',
      diagramType: 'trapezoid',
      diagramParams: { a: 6, b: 14, h: 10 },
      options: ['30 cm²', '50 cm²', '60 cm²', '70 cm²'],
      correctIndex: 3, // D
      solution: 'Both triangles share the same height h. Since Area = 100 = ((6+14)/2)×h = 10h ➔ h = 10 cm. Area(ΔACD) = ½ × 14 × 10 = 70 cm² (areas are in ratio of bases 6:14 = 30:70).'
    },
    {
      tier: 3,
      shape: 'composite',
      badge: 'TIER 3 • HEXAGRAM STAR OVERLAP',
      prompt: 'Two identical equilateral triangles each of area 36 cm² overlap symmetrically to form a 6-pointed star. What is the area of the central regular hexagon?',
      diagramType: 'hexagram',
      diagramParams: {},
      options: ['24 cm²', '18 cm²', '27 cm²', '30 cm²'],
      correctIndex: 0, // A
      solution: 'A 6-pointed star splits each large triangle into 9 small congruent triangles (36 / 9 = 4 cm² each). The central regular hexagon consists of 6 small triangles = 6 × 4 = 24 cm².'
    },
    {
      tier: 3,
      shape: 'composite',
      badge: 'TIER 3 • GRID PICK SUBTRACTION',
      prompt: 'In a coordinate grid, a triangle has vertices at (0,0), (6,2), and (2,5). Using the bounding box method (box is 6×5 = 30), find the triangle area.',
      diagramType: 'grid_triangle',
      diagramParams: {},
      options: ['15 units²', '11 units²', '13 units²', '17 units²'],
      correctIndex: 2, // C
      solution: 'Bounding box = 6 × 5 = 30. Subtracted right triangles: Bottom = ½×6×2 = 6, Left = ½×2×5 = 5, Top-right = ½×4×3 = 6. Total subtracted = 6+5+6 = 17. Triangle Area = 30 − 17 = 13 units².'
    }
  ];

  // --- Initializer ---
  function init() {
    bindStationNav();
    bindControls();
    bindArena();
    renderCurrentStation();
    renderArenaQuestion();
  }

  // --- Navigation & Station Binding ---
  function bindStationNav() {
    const btns = document.querySelectorAll('.station-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', function () {
        btns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.currentStation = this.dataset.station;
        state.proofActive = false;
        renderCurrentStation();
      });
    });

    // Grid toggle
    const gridBtn = document.getElementById('toggle-grid-btn');
    if (gridBtn) {
      gridBtn.addEventListener('click', function () {
        state.showGrid = !state.showGrid;
        this.classList.toggle('active', state.showGrid);
        renderCurrentStation();
      });
    }

    // Proof Animation toggle button
    const proofBtn = document.getElementById('proof-action-btn');
    if (proofBtn) {
      proofBtn.addEventListener('click', function () {
        state.proofActive = !state.proofActive;
        this.classList.toggle('active', state.proofActive);
        this.innerHTML = state.proofActive
          ? `<span data-sf-icon="undo"></span> Reset to Standard View`
          : `<span data-sf-icon="magic"></span> Animate Visual Proof &amp; Decomposition`;
        renderCurrentStation();
      });
    }
  }

  // --- Dynamic Slider Controls ---
  function bindControls() {
    // Dynamic event delegation for controls inside #station-controls-container
    const container = document.getElementById('station-controls-container');
    if (!container) return;

    container.addEventListener('input', function (e) {
      const target = e.target;
      if (target.classList.contains('range-slider')) {
        const key = target.dataset.param;
        state.params[key] = parseFloat(target.value);
        const valSpan = document.getElementById(`val-${key}`);
        if (valSpan) {
          valSpan.textContent = target.value + (target.dataset.unit || '');
        }
        renderCurrentStation();
      }
    });

    container.addEventListener('change', function (e) {
      const target = e.target;
      if (target.classList.contains('form-radio-custom') || target.tagName === 'SELECT') {
        const key = target.dataset.param;
        state.params[key] = target.value;
        renderCurrentStation();
      }
    });
  }

  // --- Render Master Dispatcher ---
  function renderCurrentStation() {
    const stationConfig = STATIONS[state.currentStation];
    if (!stationConfig) return;

    // Update Formula Card
    const formulaEl = document.getElementById('station-formula-display');
    if (formulaEl) formulaEl.innerHTML = stationConfig.formula;

    const trapEl = document.getElementById('station-trap-text');
    if (trapEl) trapEl.innerHTML = stationConfig.trap;

    // Execute station renderer
    stationConfig.render();
  }

  // =========================================================================
  // Station 1: Triangles (Right, Acute, Obtuse & Doubling Proof)
  // =========================================================================
  function renderTriangleStation() {
    const controlsContainer = document.getElementById('station-controls-container');
    const b = state.params.triBase;
    const h = state.params.triHeight;
    const type = state.params.triangleType;
    const area = (b * h) / 2;

    // Render Controls if not already rendered
    if (controlsContainer && controlsContainer.dataset.current !== 'triangle') {
      controlsContainer.dataset.current = 'triangle';
      controlsContainer.innerHTML = `
        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📐 Triangle Type</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="triType" data-param="triangleType" value="acute" ${type === 'acute' ? 'checked' : ''} class="form-radio-custom"> Acute
            </label>
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="triType" data-param="triangleType" value="right" ${type === 'right' ? 'checked' : ''} class="form-radio-custom"> Right
            </label>
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="triType" data-param="triangleType" value="obtuse" ${type === 'obtuse' ? 'checked' : ''} class="form-radio-custom"> Obtuse
            </label>
          </div>
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📏 Base (b)</span>
            <span class="slider-value" id="val-triBase">${b} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="triBase" data-unit=" cm" min="4" max="24" step="1" value="${b}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📐 Perpendicular Height (h)</span>
            <span class="slider-value" id="val-triHeight">${h} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="triHeight" data-unit=" cm" min="3" max="16" step="1" value="${h}">
        </div>
      `;
    }

    // SVG Drawing Calculation
    const scale = 14;
    const originX = 70;
    const originY = 280;
    const svgBase = b * scale;
    const svgHeight = h * scale;

    let p1 = { x: originX, y: originY };
    let p2 = { x: originX + svgBase, y: originY };
    let p3 = { x: originX + (type === 'right' ? 0 : type === 'acute' ? svgBase * 0.45 : svgBase * 1.3), y: originY - svgHeight };

    let svgContent = '';

    if (state.showGrid) {
      svgContent += renderSVGGrid();
    }

    // If Proof Mode Active: Draw the twin duplicate triangle rotated 180° into a parallelogram
    if (state.proofActive) {
      const pTwin = { x: p1.x + (p2.x - p1.x) + (p3.x - p1.x), y: p3.y };
      svgContent += `
        <!-- Twin Ghost Triangle Forming Parallelogram -->
        <polygon points="${p2.x},${p2.y} ${p3.x},${p3.y} ${p2.x + (p3.x - p1.x)},${p3.y}" 
                 fill="rgba(59, 130, 246, 0.25)" stroke="#60a5fa" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${p2.x + 20}" y="${originY - svgHeight / 2}" fill="#93c5fd" font-size="13" font-family="Space Mono">Duplicate Triangle (½)</text>
      `;
    }

    // Main Triangle
    svgContent += `
      <polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" 
               fill="rgba(6, 182, 212, 0.28)" stroke="#06b6d4" stroke-width="3" />
      
      <!-- Base Dimension Line -->
      <line x1="${p1.x}" y1="${p1.y + 18}" x2="${p2.x}" y2="${p2.y + 18}" stroke="#38bdf8" stroke-width="2" />
      <text x="${p1.x + svgBase / 2}" y="${p1.y + 36}" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle" font-family="Space Mono">b = ${b} cm</text>
      
      <!-- Height Dimension Line (Perpendicular) -->
      <line x1="${p3.x}" y1="${p3.y}" x2="${p3.x}" y2="${originY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
      <rect x="${p3.x - (p3.x > p2.x ? 12 : 0)}" y="${originY - 12}" width="12" height="12" fill="none" stroke="#f59e0b" stroke-width="1.5" />
      <text x="${p3.x + (p3.x > p2.x ? 10 : -10)}" y="${originY - svgHeight / 2}" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="${p3.x > p2.x ? 'start' : 'end'}" font-family="Space Mono">h = ${h} cm</text>
    `;

    if (type === 'obtuse') {
      svgContent += `
        <!-- Extended baseline for obtuse -->
        <line x1="${p2.x}" y1="${p2.y}" x2="${p3.x}" y2="${originY}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
      `;
    }

    renderSVGCanvas(svgContent);

    // Calculation Breakdown
    renderCalculationSteps([
      `Identify base and perpendicular height: <strong>b = ${b} cm</strong>, <strong>h = ${h} cm</strong>`,
      `Apply formula: <strong>A = ½ × base × height</strong>`,
      `Multiply dimensions: <strong>½ × ${b} × ${h} = ½ × ${b * h}</strong>`,
      `Final Area: <strong>${area} cm²</strong>`
    ], `${area} cm²`);
  }

  // =========================================================================
  // Station 2: Parallelograms (Shearing / Cut-and-Slide into Rectangle)
  // =========================================================================
  function renderParallelogramStation() {
    const controlsContainer = document.getElementById('station-controls-container');
    const b = state.params.paraBase;
    const h = state.params.paraHeight;
    const skew = state.params.paraSkew;
    const area = b * h;

    if (controlsContainer && controlsContainer.dataset.current !== 'parallelogram') {
      controlsContainer.dataset.current = 'parallelogram';
      controlsContainer.innerHTML = `
        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📏 Base (b)</span>
            <span class="slider-value" id="val-paraBase">${b} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="paraBase" data-unit=" cm" min="6" max="22" step="1" value="${b}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📐 Perpendicular Height (h)</span>
            <span class="slider-value" id="val-paraHeight">${h} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="paraHeight" data-unit=" cm" min="4" max="15" step="1" value="${h}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📐 Skew Angle Shift</span>
            <span class="slider-value" id="val-paraSkew">${skew}°</span>
          </div>
          <input type="range" class="range-slider" data-param="paraSkew" data-unit="°" min="10" max="45" step="5" value="${skew}">
        </div>
      `;
    }

    const scale = 14;
    const originX = 80;
    const originY = 270;
    const svgBase = b * scale;
    const svgHeight = h * scale;
    const skewShift = Math.tan((skew * Math.PI) / 180) * svgHeight;

    let p1 = { x: originX, y: originY };
    let p2 = { x: originX + svgBase, y: originY };
    let p3 = { x: originX + svgBase + skewShift, y: originY - svgHeight };
    let p4 = { x: originX + skewShift, y: originY - svgHeight };

    let svgContent = '';
    if (state.showGrid) svgContent += renderSVGGrid();

    if (state.proofActive) {
      // Cut-and-slide animation: triangle cut from left and slid to right to form rectangle
      svgContent += `
        <!-- Original Cut Left Triangle -->
        <polygon points="${p1.x},${p1.y} ${p4.x},${p4.y} ${p4.x},${p1.y}" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
        <!-- Translated Right Triangle forming complete rectangle -->
        <polygon points="${p2.x},${p2.y} ${p3.x},${p3.y} ${p2.x + (p4.x - p1.x)},${p1.y}" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" stroke-width="2" />
        
        <!-- Equivalent Rectangle Overlay -->
        <rect x="${p4.x}" y="${p4.y}" width="${svgBase}" height="${svgHeight}" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${p4.x + svgBase / 2}" y="${originY - svgHeight / 2}" fill="#6ee7b7" font-size="14" font-weight="bold" font-family="Space Mono" text-anchor="middle">Equivalent Rectangle: b × h</text>
      `;
    }

    svgContent += `
      <polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}" 
               fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="3" />
      
      <!-- Base Line -->
      <line x1="${p1.x}" y1="${p1.y + 16}" x2="${p2.x}" y2="${p2.y + 16}" stroke="#38bdf8" stroke-width="2" />
      <text x="${p1.x + svgBase / 2}" y="${p1.y + 34}" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle" font-family="Space Mono">b = ${b} cm</text>
      
      <!-- Height Line -->
      <line x1="${p4.x}" y1="${p4.y}" x2="${p4.x}" y2="${originY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
      <rect x="${p4.x}" y="${originY - 12}" width="12" height="12" fill="none" stroke="#f59e0b" stroke-width="1.5" />
      <text x="${p4.x - 10}" y="${originY - svgHeight / 2}" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="end" font-family="Space Mono">h = ${h} cm</text>
    `;

    renderSVGCanvas(svgContent);

    renderCalculationSteps([
      `Base dimension: <strong>b = ${b} cm</strong>`,
      `Perpendicular height: <strong>h = ${h} cm</strong>`,
      `Apply formula: <strong>A = b × h</strong> (sheared rectangle principle)`,
      `Calculate: <strong>${b} × ${h} = ${area} cm²</strong>`
    ], `${area} cm²`);
  }

  // =========================================================================
  // Station 3: Trapezoids (Average Bases & Dual Inversion)
  // =========================================================================
  function renderTrapezoidStation() {
    const controlsContainer = document.getElementById('station-controls-container');
    const a = state.params.trapBaseA;
    const b = state.params.trapBaseB;
    const h = state.params.trapHeight;
    const avgBase = (a + b) / 2;
    const area = avgBase * h;

    if (controlsContainer && controlsContainer.dataset.current !== 'trapezoid') {
      controlsContainer.dataset.current = 'trapezoid';
      controlsContainer.innerHTML = `
        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📏 Top Parallel Base (a)</span>
            <span class="slider-value" id="val-trapBaseA">${a} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="trapBaseA" data-unit=" cm" min="4" max="16" step="1" value="${a}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📏 Bottom Parallel Base (b)</span>
            <span class="slider-value" id="val-trapBaseB">${b} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="trapBaseB" data-unit=" cm" min="8" max="24" step="1" value="${b}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">📐 Perpendicular Height (h)</span>
            <span class="slider-value" id="val-trapHeight">${h} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="trapHeight" data-unit=" cm" min="3" max="14" step="1" value="${h}">
        </div>
      `;
    }

    const scale = 13;
    const originX = 70;
    const originY = 270;
    const svgA = a * scale;
    const svgB = b * scale;
    const svgH = h * scale;
    const offsetLeft = (svgB - svgA) * 0.4;

    let p1 = { x: originX, y: originY };
    let p2 = { x: originX + svgB, y: originY };
    let p3 = { x: originX + offsetLeft + svgA, y: originY - svgH };
    let p4 = { x: originX + offsetLeft, y: originY - svgH };

    let svgContent = '';
    if (state.showGrid) svgContent += renderSVGGrid();

    if (state.proofActive) {
      // Inverted duplicate trapezoid attached to form giant parallelogram of base (a + b)
      svgContent += `
        <polygon points="${p2.x},${p2.y} ${p2.x + svgA},${p2.y} ${p3.x + svgB},${p3.y} ${p3.x},${p3.y}" 
                 fill="rgba(168, 85, 247, 0.25)" stroke="#a855f7" stroke-width="2" stroke-dasharray="5,4" />
        <text x="${p2.x + 20}" y="${originY - svgH / 2}" fill="#d8b4fe" font-size="13" font-family="Space Mono">Duplicate Inverted Trapezoid</text>
        <line x1="${p1.x}" y1="${originY + 28}" x2="${p2.x + svgA}" y2="${originY + 28}" stroke="#c084fc" stroke-width="2" />
        <text x="${(p1.x + p2.x + svgA) / 2}" y="${originY + 46}" fill="#c084fc" font-size="13" font-weight="bold" font-family="Space Mono" text-anchor="middle">Total Parallelogram Base = a + b = ${a + b} cm</text>
      `;
    }

    svgContent += `
      <polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}" 
               fill="rgba(6, 182, 212, 0.28)" stroke="#06b6d4" stroke-width="3" />
      
      <!-- Top Base a -->
      <line x1="${p4.x}" y1="${p4.y - 12}" x2="${p3.x}" y2="${p3.y - 12}" stroke="#38bdf8" stroke-width="2" />
      <text x="${p4.x + svgA / 2}" y="${p4.y - 20}" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle" font-family="Space Mono">a = ${a} cm</text>
      
      <!-- Bottom Base b -->
      <line x1="${p1.x}" y1="${p1.y + 14}" x2="${p2.x}" y2="${p2.y + 14}" stroke="#38bdf8" stroke-width="2" />
      <text x="${p1.x + svgB / 2}" y="${p1.y + 30}" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle" font-family="Space Mono">b = ${b} cm</text>
      
      <!-- Height -->
      <line x1="${p4.x}" y1="${p4.y}" x2="${p4.x}" y2="${originY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
      <rect x="${p4.x}" y="${originY - 12}" width="12" height="12" fill="none" stroke="#f59e0b" stroke-width="1.5" />
      <text x="${p4.x - 10}" y="${originY - svgH / 2}" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="end" font-family="Space Mono">h = ${h} cm</text>
    `;

    renderSVGCanvas(svgContent);

    renderCalculationSteps([
      `Parallel bases: <strong>a = ${a} cm</strong>, <strong>b = ${b} cm</strong>`,
      `Average parallel width: <strong>(${a} + ${b}) / 2 = ${a + b} / 2 = ${avgBase} cm</strong>`,
      `Multiply by height: <strong>${avgBase} × ${h} = ${area} cm²</strong>`,
      `Formula summary: <strong>A = ((a + b) / 2) × h = ${area} cm²</strong>`
    ], `${area} cm²`);
  }

  // =========================================================================
  // Station 4: Rhombuses & Kites (Perpendicular Diagonals)
  // =========================================================================
  function renderRhombusStation() {
    const controlsContainer = document.getElementById('station-controls-container');
    const d1 = state.params.diag1;
    const d2 = state.params.diag2;
    const area = (d1 * d2) / 2;

    if (controlsContainer && controlsContainer.dataset.current !== 'rhombus') {
      controlsContainer.dataset.current = 'rhombus';
      controlsContainer.innerHTML = `
        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">↔ Horizontal Diagonal (d₁)</span>
            <span class="slider-value" id="val-diag1">${d1} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="diag1" data-unit=" cm" min="6" max="24" step="2" value="${d1}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">↕ Vertical Diagonal (d₂)</span>
            <span class="slider-value" id="val-diag2">${d2} cm</span>
          </div>
          <input type="range" class="range-slider" data-param="diag2" data-unit=" cm" min="4" max="18" step="2" value="${d2}">
        </div>
      `;
    }

    const scale = 12;
    const cx = 250;
    const cy = 170;
    const rx = (d1 * scale) / 2;
    const ry = (d2 * scale) / 2;

    let pTop = { x: cx, y: cy - ry };
    let pBottom = { x: cx, y: cy + ry };
    let pLeft = { x: cx - rx, y: cy };
    let pRight = { x: cx + rx, y: cy };

    let svgContent = '';
    if (state.showGrid) svgContent += renderSVGGrid();

    if (state.proofActive) {
      // Outer bounding box showing total rectangle area = d1 * d2
      svgContent += `
        <rect x="${cx - rx}" y="${cy - ry}" width="${d1 * scale}" height="${d2 * scale}" 
              fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,4" />
        <text x="${cx}" y="${cy - ry - 10}" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Space Mono" text-anchor="middle">Bounding Box: d₁ × d₂ = ${d1 * d2} cm² (Rhombus = Exactly 50%)</text>
      `;
    }

    svgContent += `
      <polygon points="${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}" 
               fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" stroke-width="3" />
      
      <!-- Horizontal Diagonal d1 -->
      <line x1="${pLeft.x}" y1="${pLeft.y}" x2="${pRight.x}" y2="${pRight.y}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4" />
      <text x="${pRight.x + 12}" y="${cy + 5}" fill="#38bdf8" font-size="13" font-weight="bold" font-family="Space Mono">d₁ = ${d1} cm</text>
      
      <!-- Vertical Diagonal d2 -->
      <line x1="${pTop.x}" y1="${pTop.y}" x2="${pBottom.x}" y2="${pBottom.y}" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4,4" />
      <text x="${cx + 8}" y="${pBottom.y + 18}" fill="#f43f5e" font-size="13" font-weight="bold" font-family="Space Mono">d₂ = ${d2} cm</text>
      
      <!-- Center right-angle indicator -->
      <rect x="${cx}" y="${cy - 10}" width="10" height="10" fill="none" stroke="#94a3b8" stroke-width="1.5" />
    `;

    renderSVGCanvas(svgContent);

    renderCalculationSteps([
      `Diagonals: <strong>d₁ = ${d1} cm</strong>, <strong>d₂ = ${d2} cm</strong>`,
      `Bounding rectangle area: <strong>${d1} × ${d2} = ${d1 * d2} cm²</strong>`,
      `Apply 50% diagonal formula: <strong>A = (d₁ × d₂) / 2</strong>`,
      `Calculate: <strong>${d1 * d2} / 2 = ${area} cm²</strong>`
    ], `${area} cm²`);
  }

  // =========================================================================
  // Station 5: Circles & Annulus Rings
  // =========================================================================
  function renderCircleStation() {
    const controlsContainer = document.getElementById('station-controls-container');
    const mode = state.params.circleMode;
    const r = state.params.circleRadius;
    const R = state.params.ringOuter;
    const rIn = state.params.ringInner;

    const areaCircle = Math.round(3.14 * r * r * 100) / 100;
    const areaRing = Math.round(3.14 * (R * R - rIn * rIn) * 100) / 100;
    const activeArea = mode === 'circle' ? areaCircle : areaRing;

    if (controlsContainer && controlsContainer.dataset.current !== 'circle') {
      controlsContainer.dataset.current = 'circle';
      controlsContainer.innerHTML = `
        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">⭕ Circle Mode</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="cMode" data-param="circleMode" value="circle" ${mode === 'circle' ? 'checked' : ''} class="form-radio-custom"> Single Circle
            </label>
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="cMode" data-param="circleMode" value="ring" ${mode === 'ring' ? 'checked' : ''} class="form-radio-custom"> Annulus (Ring)
            </label>
          </div>
        </div>

        <div id="circle-sliders-sub"></div>
      `;
    }

    // Sub-sliders
    const subContainer = document.getElementById('circle-sliders-sub');
    if (subContainer) {
      if (mode === 'circle') {
        subContainer.innerHTML = `
          <div class="control-slider-box">
            <div class="slider-header">
              <span class="slider-label">📍 Radius (r)</span>
              <span class="slider-value" id="val-circleRadius">${r} m</span>
            </div>
            <input type="range" class="range-slider" data-param="circleRadius" data-unit=" m" min="2" max="10" step="1" value="${r}">
          </div>
        `;
      } else {
        subContainer.innerHTML = `
          <div class="control-slider-box">
            <div class="slider-header">
              <span class="slider-label">📍 Outer Radius (R)</span>
              <span class="slider-value" id="val-ringOuter">${R} m</span>
            </div>
            <input type="range" class="range-slider" data-param="ringOuter" data-unit=" m" min="${rIn + 1}" max="12" step="1" value="${R}">
          </div>

          <div class="control-slider-box">
            <div class="slider-header">
              <span class="slider-label">📍 Inner Radius (r)</span>
              <span class="slider-value" id="val-ringInner">${rIn} m</span>
            </div>
            <input type="range" class="range-slider" data-param="ringInner" data-unit=" m" min="1" max="${R - 1}" step="1" value="${rIn}">
          </div>
        `;
      }
    }

    const scale = 14;
    const cx = 250;
    const cy = 170;

    let svgContent = '';
    if (state.showGrid) svgContent += renderSVGGrid();

    if (mode === 'circle') {
      const svgR = r * scale;
      svgContent += `
        <circle cx="${cx}" cy="${cy}" r="${svgR}" fill="rgba(6, 182, 212, 0.28)" stroke="#06b6d4" stroke-width="3" />
        <line x1="${cx}" y1="${cy}" x2="${cx + svgR}" y2="${cy}" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="${cx}" cy="${cy}" r="4" fill="#38bdf8" />
        <text x="${cx + svgR / 2}" y="${cy - 8}" fill="#38bdf8" font-size="14" font-weight="bold" font-family="Space Mono" text-anchor="middle">r = ${r} m</text>
      `;

      if (state.proofActive) {
        // Sector wedge unrolling visualizer
        svgContent += `
          <text x="${cx}" y="${cy + svgR + 32}" fill="#6ee7b7" font-size="13" font-family="Space Mono" text-anchor="middle">Unrolled Sectors ➔ Rectangle of length πr (${(3.14 * r).toFixed(1)}) and height r</text>
        `;
      }

      renderCalculationSteps([
        `Radius: <strong>r = ${r} m</strong> (Diameter d = ${r * 2} m)`,
        `Formula: <strong>A = π × r²</strong> (using π ≈ 3.14)`,
        `Square the radius: <strong>${r}² = ${r * r}</strong>`,
        `Calculate: <strong>3.14 × ${r * r} = ${areaCircle} m²</strong>`
      ], `${areaCircle} m²`);
    } else {
      const svgR = R * scale;
      const svgRin = rIn * scale;
      svgContent += `
        <!-- Outer Circle Filled -->
        <circle cx="${cx}" cy="${cy}" r="${svgR}" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" stroke-width="2" />
        <!-- Inner Hole Cutout -->
        <circle cx="${cx}" cy="${cy}" r="${svgRin}" fill="#090d16" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
        
        <!-- Outer Radius Line -->
        <line x1="${cx}" y1="${cy}" x2="${cx + svgR}" y2="${cy}" stroke="#06b6d4" stroke-width="2" />
        <text x="${cx + svgR - 10}" y="${cy - 8}" fill="#06b6d4" font-size="13" font-weight="bold" font-family="Space Mono">R = ${R} m</text>
        
        <!-- Inner Radius Line -->
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - svgRin}" stroke="#ef4444" stroke-width="2" />
        <text x="${cx + 8}" y="${cy - svgRin / 2}" fill="#f87171" font-size="13" font-weight="bold" font-family="Space Mono">r = ${rIn} m</text>
      `;

      renderCalculationSteps([
        `Outer circle: <strong>A_outer = π × ${R}² = 3.14 × ${R * R} = ${(3.14 * R * R).toFixed(2)} m²</strong>`,
        `Inner hole: <strong>A_inner = π × ${rIn}² = 3.14 × ${rIn * rIn} = ${(3.14 * rIn * rIn).toFixed(2)} m²</strong>`,
        `Ring formula: <strong>A = π(R² − r²)</strong>`,
        `Calculate: <strong>3.14 × (${R * R} − ${rIn * rIn}) = 3.14 × ${R * R - rIn * rIn} = ${areaRing} m²</strong>`
      ], `${areaRing} m²`);
    }

    renderSVGCanvas(svgContent);
  }

  // =========================================================================
  // Station 6: Composite Shapes & Decompositions
  // =========================================================================
  function renderCompositeStation() {
    const controlsContainer = document.getElementById('station-controls-container');
    const type = state.params.compositeType;
    const outerW = state.params.compOuterW;
    const outerH = state.params.compOuterH;
    const cutW = state.params.compCutW;
    const cutH = state.params.compCutH;

    let area = 0;
    let steps = [];

    if (controlsContainer && controlsContainer.dataset.current !== 'composite') {
      controlsContainer.dataset.current = 'composite';
      controlsContainer.innerHTML = `
        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">🧩 Composite Template</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="compType" data-param="compositeType" value="lshape" ${type === 'lshape' ? 'checked' : ''} class="form-radio-custom"> L-Shape
            </label>
            <label style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #cbd5e1; cursor: pointer;">
              <input type="radio" name="compType" data-param="compositeType" value="house" ${type === 'house' ? 'checked' : ''} class="form-radio-custom"> House
            </label>
          </div>
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">↔ Outer Width (W)</span>
            <span class="slider-value" id="val-compOuterW">${outerW} m</span>
          </div>
          <input type="range" class="range-slider" data-param="compOuterW" data-unit=" m" min="8" max="16" step="1" value="${outerW}">
        </div>

        <div class="control-slider-box">
          <div class="slider-header">
            <span class="slider-label">↕ Outer Height (H)</span>
            <span class="slider-value" id="val-compOuterH">${outerH} m</span>
          </div>
          <input type="range" class="range-slider" data-param="compOuterH" data-unit=" m" min="6" max="14" step="1" value="${outerH}">
        </div>
      `;
    }

    const scale = 14;
    const originX = 90;
    const originY = 270;
    const svgW = outerW * scale;
    const svgH = outerH * scale;

    let svgContent = '';
    if (state.showGrid) svgContent += renderSVGGrid();

    if (type === 'lshape') {
      const svgCutW = cutW * scale;
      const svgCutH = cutH * scale;
      area = outerW * outerH - cutW * cutH;

      // L-Polygon points
      const pts = [
        `${originX},${originY}`,
        `${originX + svgW},${originY}`,
        `${originX + svgW},${originY - (svgH - svgCutH)}`,
        `${originX + (svgW - svgCutW)},${originY - (svgH - svgCutH)}`,
        `${originX + (svgW - svgCutW)},${originY - svgH}`,
        `${originX},${originY - svgH}`
      ].join(' ');

      svgContent += `
        <polygon points="${pts}" fill="rgba(6, 182, 212, 0.28)" stroke="#06b6d4" stroke-width="3" />
        
        <!-- Missing Corner Box -->
        <rect x="${originX + (svgW - svgCutW)}" y="${originY - svgH}" width="${svgCutW}" height="${svgCutH}" 
              fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
        <text x="${originX + svgW - svgCutW / 2}" y="${originY - svgH + svgCutH / 2 + 5}" fill="#f87171" font-size="12" font-family="Space Mono" text-anchor="middle">Cutout (${cutW}×${cutH})</text>
        
        <!-- Dimensions -->
        <text x="${originX + svgW / 2}" y="${originY + 22}" fill="#38bdf8" font-size="13" font-weight="bold" font-family="Space Mono" text-anchor="middle">Total Width = ${outerW} m</text>
        <text x="${originX - 12}" y="${originY - svgH / 2}" fill="#38bdf8" font-size="13" font-weight="bold" font-family="Space Mono" text-anchor="end">Total Height = ${outerH} m</text>
      `;

      steps = [
        `Outer bounding rectangle: <strong>${outerW} × ${outerH} = ${outerW * outerH} m²</strong>`,
        `Missing corner cutout: <strong>${cutW} × ${cutH} = ${cutW * cutH} m²</strong>`,
        `Subtractive method: <strong>${outerW * outerH} − ${cutW * cutH} = ${area} m²</strong>`
      ];
    } else {
      // House shape: Rectangle + Triangle roof
      const roofH = 6;
      const rectArea = outerW * outerH;
      const triArea = (outerW * roofH) / 2;
      area = rectArea + triArea;
      const svgRoofH = roofH * scale;

      svgContent += `
        <!-- Base Wall Rectangle -->
        <rect x="${originX}" y="${originY - svgH}" width="${svgW}" height="${svgH}" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="3" />
        <text x="${originX + svgW / 2}" y="${originY - svgH / 2}" fill="#93c5fd" font-size="13" font-family="Space Mono" text-anchor="middle">Wall = ${rectArea} m²</text>
        
        <!-- Triangular Roof -->
        <polygon points="${originX},${originY - svgH} ${originX + svgW},${originY - svgH} ${originX + svgW / 2},${originY - svgH - svgRoofH}" 
                 fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="3" />
        <text x="${originX + svgW / 2}" y="${originY - svgH - svgRoofH / 3}" fill="#6ee7b7" font-size="13" font-family="Space Mono" text-anchor="middle">Roof = ${triArea} m²</text>
      `;

      steps = [
        `Wall rectangle area: <strong>${outerW} × ${outerH} = ${rectArea} m²</strong>`,
        `Roof triangle area: <strong>½ × ${outerW} × ${roofH} = ${triArea} m²</strong>`,
        `Additive method: <strong>${rectArea} + ${triArea} = ${area} m²</strong>`
      ];
    }

    renderSVGCanvas(svgContent);
    renderCalculationSteps(steps, `${area} m²`);
  }

  // --- SVG Helper Methods ---
  function renderSVGGrid() {
    return `
      <defs>
        <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(51, 65, 85, 0.4)" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    `;
  }

  function renderSVGCanvas(innerSVG) {
    const svgEl = document.getElementById('geometry-svg-canvas');
    if (svgEl) {
      svgEl.innerHTML = innerSVG;
    }
  }

  function renderCalculationSteps(steps, finalResult) {
    const container = document.getElementById('calculation-steps-container');
    if (container) {
      container.innerHTML = steps.map((step, idx) => `
        <div class="calc-step">
          <div class="calc-step-num">${idx + 1}</div>
          <div class="calc-step-content">${step}</div>
        </div>
      `).join('');
    }

    const resultEl = document.getElementById('live-area-result-value');
    if (resultEl) {
      resultEl.textContent = finalResult;
    }
  }

  // =========================================================================
  // Gamified Quiz Arena (3-Tier Engine)
  // =========================================================================
  function bindArena() {
    const tierBtns = document.querySelectorAll('.tier-tab-btn');
    tierBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        tierBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.arenaTier = parseInt(this.dataset.tier, 10);
        state.arenaIndex = 0;
        renderArenaQuestion();
      });
    });

    const nextBtn = document.getElementById('btn-next-arena-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        state.arenaIndex++;
        renderArenaQuestion();
      });
    }
  }

  function getTierQuestions() {
    return ARENA_QUESTIONS.filter(q => q.tier === state.arenaTier);
  }

  function renderArenaQuestion() {
    const questions = getTierQuestions();
    if (state.arenaIndex >= questions.length) {
      state.arenaIndex = 0; // Loop or celebrate
    }
    const q = questions[state.arenaIndex];

    // Update Top Tracker
    const trackerEl = document.getElementById('arena-q-tracker');
    if (trackerEl) {
      trackerEl.textContent = `QUESTION ${state.arenaIndex + 1} OF ${questions.length}`;
    }

    const streakEl = document.getElementById('arena-streak-count');
    if (streakEl) streakEl.textContent = state.streak;

    const badgeEl = document.getElementById('arena-q-badge');
    if (badgeEl) {
      badgeEl.className = `question-badge badge-tier${q.tier}`;
      badgeEl.textContent = q.badge;
    }

    const promptEl = document.getElementById('arena-q-prompt');
    if (promptEl) {
      promptEl.textContent = q.prompt;
    }

    // Render Quiz Diagram
    renderQuizDiagram(q);

    // Render Options with Dynamic Randomization across A, B, C, D
    const optionIndices = [0, 1, 2, 3];
    for (let i = optionIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }

    const shuffledOptions = optionIndices.map(i => q.options[i]);
    const baseCorrect = q.correctIndex !== undefined ? q.correctIndex : 0;
    const dynamicCorrectIndex = optionIndices.indexOf(baseCorrect);
    q._activeCorrectIndex = dynamicCorrectIndex;
    q._activeOptions = shuffledOptions;

    const optionsGrid = document.getElementById('arena-options-grid');
    if (optionsGrid) {
      optionsGrid.innerHTML = shuffledOptions.map((opt, idx) => `
        <button class="option-btn" data-opt-idx="${idx}">
          <span style="color: #06b6d4; font-weight: 800;">${String.fromCharCode(65 + idx)}.</span>
          <span>${opt}</span>
        </button>
      `).join('');

      optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          handleOptionClick(parseInt(this.dataset.optIdx, 10), q);
        });
      });
    }

    // Hide previous feedback
    const feedbackBox = document.getElementById('arena-feedback-container');
    if (feedbackBox) {
      feedbackBox.className = 'arena-feedback-box';
      feedbackBox.style.display = 'none';
    }
  }

  function renderQuizDiagram(q) {
    const container = document.getElementById('arena-diagram-container');
    if (!container) return;

    let svg = `<svg viewBox="0 0 300 200" style="width: 100%; height: 180px; overflow: visible;">`;

    if (q.diagramType === 'triangle') {
      const p = q.diagramParams;
      svg += `
        <polygon points="40,160 260,160 80,40" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="2.5" />
        <line x1="80" y1="40" x2="80" y2="160" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />
        <rect x="80" y="148" width="12" height="12" fill="none" stroke="#f59e0b" stroke-width="1.5" />
        <text x="150" y="180" fill="#38bdf8" font-size="12" font-family="Space Mono" text-anchor="middle">b = ${p.b}</text>
        <text x="70" y="100" fill="#f59e0b" font-size="12" font-family="Space Mono" text-anchor="end">h = ${p.h}</text>
      `;
    } else if (q.diagramType === 'parallelogram') {
      svg += `
        <polygon points="50,150 230,150 260,60 80,60" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="2.5" />
        <line x1="80" y1="60" x2="80" y2="150" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />
        <rect x="80" y="138" width="12" height="12" fill="none" stroke="#f59e0b" stroke-width="1.5" />
        <text x="140" y="170" fill="#38bdf8" font-size="12" font-family="Space Mono" text-anchor="middle">b = 16 m</text>
        <text x="70" y="110" fill="#f59e0b" font-size="12" font-family="Space Mono" text-anchor="end">h = 8 m</text>
      `;
    } else if (q.diagramType === 'trapezoid') {
      svg += `
        <polygon points="40,150 260,150 200,60 100,60" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="2.5" />
        <line x1="100" y1="60" x2="100" y2="150" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />
        <text x="150" y="50" fill="#38bdf8" font-size="12" font-family="Space Mono" text-anchor="middle">a = 10 m</text>
        <text x="150" y="170" fill="#38bdf8" font-size="12" font-family="Space Mono" text-anchor="middle">b = 18 m</text>
        <text x="90" y="110" fill="#f59e0b" font-size="12" font-family="Space Mono" text-anchor="end">h = 6 m</text>
      `;
    } else if (q.diagramType === 'circle' || q.diagramType === 'ring') {
      svg += `
        <circle cx="150" cy="100" r="70" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="2" />
        ${q.diagramType === 'ring' ? '<circle cx="150" cy="100" r="45" fill="#090d16" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3" />' : ''}
        <line x1="150" y1="100" x2="220" y2="100" stroke="#38bdf8" stroke-width="2" />
        <text x="185" y="90" fill="#38bdf8" font-size="12" font-family="Space Mono" text-anchor="middle">r = 10</text>
      `;
    } else {
      // General diagram
      svg += `
        <rect x="60" y="40" width="180" height="120" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" stroke-width="2" />
        <polygon points="60,40 240,40 150,100" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" stroke-width="2" />
      `;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  function handleOptionClick(selectedIdx, q) {
    const optionsGrid = document.getElementById('arena-options-grid');
    const allBtns = optionsGrid.querySelectorAll('.option-btn');
    const targetCorrectIndex = q._activeCorrectIndex !== undefined ? q._activeCorrectIndex : (q.correctIndex || 0);
    const isCorrect = selectedIdx === targetCorrectIndex;

    allBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === targetCorrectIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('wrong');
      }
    });

    const feedbackBox = document.getElementById('arena-feedback-container');
    const headline = document.getElementById('feedback-headline-text');
    const solution = document.getElementById('feedback-solution-text');

    if (isCorrect) {
      state.streak++;
      state.userXP += q.tier === 1 ? 10 : q.tier === 2 ? 20 : 35;
      updateXPDisplay();
      triggerConfetti();

      feedbackBox.className = 'arena-feedback-box show correct';
      headline.innerHTML = `✨ Brilliant Job! That is Correct! (+${q.tier === 1 ? 10 : q.tier === 2 ? 20 : 35} XP)`;
    } else {
      state.streak = 0;
      feedbackBox.className = 'arena-feedback-box show wrong';
      headline.innerHTML = `❌ Not Quite, Let's Review the Steps:`;
    }

    solution.innerHTML = q.solution;
    feedbackBox.style.display = 'block';

    const streakEl = document.getElementById('arena-streak-count');
    if (streakEl) streakEl.textContent = state.streak;
  }

  function updateXPDisplay() {
    const xpEl = document.getElementById('global-user-xp');
    if (xpEl) xpEl.textContent = `${state.userXP} XP`;
  }

  // --- Confetti Celebrations ---
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#ffffff'];

    for (let i = 0; i < 70; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 60) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animate);
  }

  // Self initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global export
  window.SophiaGeometryLab = {
    state,
    renderCurrentStation
  };
})();
