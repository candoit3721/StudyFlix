/**
 * StudyFlix - Grade 6 Ontario Strand C: Matter and Energy,
 *             Electrical Phenomena, Energy, and Devices
 * ---------------------------------------------------------------------------
 * C1. evaluate the impact of the use and generation of electrical energy on
 *     society and the environment, and suggest ways to use electrical energy
 *     responsibly
 * C2. demonstrate an understanding of the principles of electrical energy and
 *     its transformation into and from other forms of energy
 *
 * Stations:
 *   1. Circuit Builder      - series against parallel, with a switch and a
 *                             removable bulb, so the difference is discovered
 *                             rather than told
 *   2. Conductor Bench      - ten everyday materials tested in a live gap
 *   3. Ontario Energy Audit - real appliance wattages, kWh per day, cost in CAD
 */
(function (global) {
  'use strict';

  var ui = SFG6.ui;
  var slider = ui.slider, bind = ui.bind, stat = ui.stat, setStat = ui.setStat;
  var esc = ui.svgText;

  var CELL_VOLTS = 1.5;

  /* =======================================================================
     STATION 1 - Circuit Builder
     ======================================================================= */

  var circuit = { mode: 'series', cells: 2, bulbs: 2, switchClosed: true, removed: -1 };

  function renderCircuit(host) {
    host.innerHTML =
      '<p class="g6-note"><strong>Current electricity</strong> is a continuous flow of charge ' +
        'around a <strong>complete</strong> circuit. Break the loop anywhere and the flow stops. ' +
        'Build the circuit below, then try opening the switch or unscrewing a bulb and watch what ' +
        'series and parallel wiring do differently.</p>' +
      '<div class="g6-lab-grid">' +
        '<div>' +
          '<div class="g6-canvas"><svg id="el-circuit-svg" viewBox="0 0 620 340" role="img" ' +
            'aria-label="A circuit with cells, bulbs and a switch"></svg></div>' +
          '<div class="g6-legend">' +
            '<span><i class="g6-swatch" style="background:#f59e0b"></i>Lit bulb</span>' +
            '<span><i class="g6-swatch" style="background:#94a3b8"></i>Unlit bulb</span>' +
            '<span><i class="g6-swatch" style="background:#06b6d4"></i>Current flowing</span>' +
          '</div>' +
        '</div>' +
        '<div class="g6-controls">' +
          '<div class="g6-chips">' +
            '<button type="button" class="g6-chip active" data-mode="series">Series circuit</button>' +
            '<button type="button" class="g6-chip" data-mode="parallel">Parallel circuit</button>' +
          '</div>' +
          slider('el-cells', 'Cells in the battery', circuit.cells, 1, 4, 1, 'cells') +
          slider('el-bulbs', 'Bulbs in the circuit', circuit.bulbs, 1, 4, 1, 'bulbs') +
          '<div class="g6-chips">' +
            '<button type="button" class="g6-chip active" id="el-switch">Switch: CLOSED</button>' +
            '<button type="button" class="g6-chip" id="el-remove">Unscrew bulb 2</button>' +
          '</div>' +
          '<div class="g6-readout">' +
            stat('el-voltage', 'Battery voltage') + stat('el-perbulb', 'Volts per bulb') +
            stat('el-lit', 'Bulbs lit') + stat('el-bright', 'Brightness') +
          '</div>' +
          '<p class="g6-note" id="el-circuit-note"></p>' +
        '</div>' +
      '</div>';

    host.querySelectorAll('[data-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        circuit.mode = btn.getAttribute('data-mode');
        host.querySelectorAll('[data-mode]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        updateCircuit();
      });
    });
    bind('el-cells', function (v) { circuit.cells = v; updateCircuit(); });
    bind('el-bulbs', function (v) {
      circuit.bulbs = v;
      if (circuit.removed >= v) circuit.removed = -1;
      updateCircuit();
    });
    document.getElementById('el-switch').addEventListener('click', function () {
      circuit.switchClosed = !circuit.switchClosed;
      this.textContent = 'Switch: ' + (circuit.switchClosed ? 'CLOSED' : 'OPEN');
      this.classList.toggle('active', circuit.switchClosed);
      updateCircuit();
    });
    document.getElementById('el-remove').addEventListener('click', function () {
      circuit.removed = circuit.removed === 1 ? -1 : 1;
      this.textContent = circuit.removed === 1 ? 'Screw bulb 2 back in' : 'Unscrew bulb 2';
      this.classList.toggle('active', circuit.removed === 1);
      updateCircuit();
    });

    updateCircuit();
  }

  /** Which bulbs light, given the mode, the switch and any removed bulb. */
  function solveCircuit() {
    var lit = [];
    var broken = !circuit.switchClosed;
    var removedInPlay = circuit.removed >= 0 && circuit.removed < circuit.bulbs;

    for (var i = 0; i < circuit.bulbs; i++) {
      if (broken) { lit.push(false); continue; }
      if (removedInPlay && i === circuit.removed) { lit.push(false); continue; }
      // One loop in series: any gap stops every bulb.
      if (circuit.mode === 'series' && removedInPlay) { lit.push(false); continue; }
      lit.push(true);
    }

    var volts = circuit.cells * CELL_VOLTS;
    var working = 0;
    for (var j = 0; j < lit.length; j++) if (lit[j]) working++;
    var perBulb = circuit.mode === 'series'
      ? (working ? volts / circuit.bulbs : 0)
      : (working ? volts : 0);

    return { lit: lit, volts: volts, perBulb: perBulb, working: working };
  }

  function updateCircuit() {
    var r = solveCircuit();

    setStat('el-voltage', r.volts.toFixed(1) + ' V', '');
    setStat('el-perbulb', r.perBulb.toFixed(2) + ' V', r.perBulb >= 1.4 ? 'good' : r.perBulb > 0 ? 'warn' : 'bad');
    setStat('el-lit', r.working + ' of ' + circuit.bulbs, r.working === circuit.bulbs ? 'good' : r.working ? 'warn' : 'bad');

    var brightness = r.perBulb >= 2.4 ? 'Very bright' : r.perBulb >= 1.4 ? 'Bright'
      : r.perBulb >= 0.7 ? 'Dim' : r.perBulb > 0 ? 'Very dim' : 'Off';
    setStat('el-bright', brightness, r.perBulb >= 1.4 ? 'good' : r.perBulb > 0 ? 'warn' : 'bad');

    var note = document.getElementById('el-circuit-note');
    var text;
    if (!circuit.switchClosed) {
      text = 'The switch is <strong>OPEN</strong>, so there is a gap in the loop. Charge cannot ' +
        'flow and <strong>no bulb lights</strong>, in either kind of circuit. A switch works by ' +
        'deliberately breaking the circuit.';
    } else if (circuit.removed === 1 && circuit.bulbs > 1 && circuit.mode === 'series') {
      text = 'Bulb 2 is out of its socket. In a <strong>series</strong> circuit there is only ' +
        '<strong>one path</strong>, so removing any bulb breaks the single loop and ' +
        '<strong>every</strong> bulb goes dark. This is why old Christmas light strings all died at once.';
    } else if (circuit.removed === 1 && circuit.bulbs > 1) {
      text = 'Bulb 2 is out of its socket, but in a <strong>parallel</strong> circuit every bulb ' +
        'has its <strong>own path</strong> back to the battery. The others stay lit at full ' +
        'brightness. This is why house wiring is parallel: one blown bulb must not darken the house.';
    } else if (circuit.mode === 'series') {
      text = 'A <strong>series</strong> circuit is one single loop. The battery\'s <strong>' +
        r.volts.toFixed(1) + ' V</strong> is shared out between the ' + circuit.bulbs +
        ' bulb' + (circuit.bulbs > 1 ? 's' : '') + ', giving <strong>' + r.perBulb.toFixed(2) +
        ' V</strong> each. Add more bulbs in series and every one of them gets dimmer.';
    } else {
      text = 'A <strong>parallel</strong> circuit gives each bulb its own branch, so each one gets ' +
        'the <strong>full ' + r.volts.toFixed(1) + ' V</strong> and stays equally bright no matter ' +
        'how many you add. The trade-off is that the battery drains faster.';
    }
    note.className = 'g6-note' + (r.working === 0 ? ' g6-note--warn' : '');
    note.innerHTML = text;

    drawCircuit(r);
  }

  function drawCircuit(r) {
    var svg = document.getElementById('el-circuit-svg');
    if (!svg) return;
    var live = r.working > 0;
    var wire = live ? '#06b6d4' : '#94a3b8';
    var s = '<rect width="620" height="340" fill="#f8fafc"/>';

    var topY = 78, botY = 276, leftX = 60, rightX = 560;
    var count = circuit.bulbs;

    // The battery sits IN a gap on the left rail rather than floating beside
    // it, so the cell stack reads as part of the loop it is driving.
    var stackH = circuit.cells * 24;
    var gapTop = (topY + botY) / 2 - stackH / 2;
    var gapBot = gapTop + stackH;

    // Rails. The left rail is drawn in two pieces with the battery between.
    s += '<path d="M' + leftX + ' ' + gapTop + ' V' + topY + ' H' + rightX + ' V' + botY +
      ' H' + leftX + ' V' + gapBot + '" fill="none" stroke="' + wire +
      '" stroke-width="4" stroke-linejoin="round"/>';

    // Cell symbols, stacked in that gap: long plate positive, short negative.
    for (var c = 0; c < circuit.cells; c++) {
      var yy = gapTop + c * 24 + 6;
      s += '<line x1="' + (leftX - 13) + '" y1="' + yy + '" x2="' + (leftX + 13) + '" y2="' + yy +
        '" stroke="#334155" stroke-width="4"/>';
      s += '<line x1="' + (leftX - 7) + '" y1="' + (yy + 9) + '" x2="' + (leftX + 7) + '" y2="' + (yy + 9) +
        '" stroke="#334155" stroke-width="4"/>';
      if (c < circuit.cells - 1) {
        s += '<line x1="' + leftX + '" y1="' + (yy + 9) + '" x2="' + leftX + '" y2="' + (yy + 24) +
          '" stroke="' + wire + '" stroke-width="3"/>';
      }
    }
    s += '<text x="' + (leftX - 22) + '" y="' + (gapBot + 4) + '" text-anchor="end" ' +
      'font-family="Nunito,sans-serif" font-size="11" font-weight="800" fill="#334155">' +
      r.volts.toFixed(1) + ' V</text>';
    s += '<text x="' + (leftX - 22) + '" y="' + (gapBot + 19) + '" text-anchor="end" ' +
      'font-family="Nunito,sans-serif" font-size="9.5" fill="#94a3b8">battery</text>';

    // Bulbs spread evenly along the rail instead of bunching to one side.
    function slotX(i) { return leftX + (i + 1) * (rightX - leftX) / (count + 1); }

    if (circuit.mode === 'series') {
      for (var i = 0; i < count; i++) s += bulb(slotX(i), topY, r.lit[i], i + 1, r.perBulb);
      s += switchSymbol((leftX + rightX) / 2, botY, circuit.switchClosed, wire);
    } else {
      for (var j = 0; j < count; j++) {
        var jx = slotX(j);
        s += '<line x1="' + jx + '" y1="' + topY + '" x2="' + jx + '" y2="' + botY +
          '" stroke="' + (r.lit[j] ? '#06b6d4' : '#cbd5e1') + '" stroke-width="4"/>';
        s += bulb(jx, (topY + botY) / 2, r.lit[j], j + 1, r.perBulb);
      }
      s += switchSymbol(rightX - 70, botY, circuit.switchClosed, wire);
    }

    // Mode caption pinned top-right, clear of the first bulb and its label.
    s += '<text x="600" y="30" text-anchor="end" font-family="Nunito,sans-serif" ' +
      'font-size="11.5" font-weight="800" fill="#0e7490">' +
      (circuit.mode === 'series'
        ? 'SERIES: one single path for the current'
        : 'PARALLEL: a separate branch for every bulb') + '</text>';

    if (!live) {
      s += '<text x="310" y="326" text-anchor="middle" font-family="Montserrat,sans-serif" ' +
        'font-size="14" font-weight="800" fill="#b91c1c">CIRCUIT INCOMPLETE - no current can flow</text>';
    }
    svg.innerHTML = s;
  }

  function bulb(x, y, lit, number, volts) {
    var removed = (circuit.removed === number - 1);
    var glow = lit ? Math.min(1, volts / 3) : 0;
    var s = '';
    if (lit) s += '<circle cx="' + x + '" cy="' + y + '" r="' + (20 + glow * 12) +
      '" fill="#f59e0b" opacity="' + (0.16 + glow * 0.22) + '"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="15" fill="' + (lit ? '#fbbf24' : '#e2e8f0') +
      '" stroke="' + (lit ? '#d97706' : '#94a3b8') + '" stroke-width="2.5"' +
      (removed ? ' stroke-dasharray="4 4"' : '') + '/>';
    s += '<path d="M' + (x - 6) + ' ' + (y + 2) + ' l4 -7 l4 7 l4 -7" fill="none" stroke="' +
      (lit ? '#92400e' : '#94a3b8') + '" stroke-width="2" stroke-linejoin="round"/>';
    s += '<rect x="' + (x - 7) + '" y="' + (y + 14) + '" width="14" height="7" rx="2" fill="#64748b"/>';
    s += '<text x="' + x + '" y="' + (y + 38) + '" text-anchor="middle" ' +
      'font-family="Nunito,sans-serif" font-size="10.5" font-weight="800" fill="#475569">' +
      (removed ? 'bulb ' + number + ' out' : 'bulb ' + number) + '</text>';
    return s;
  }

  function switchSymbol(x, y, closed, wire) {
    var s = '<circle cx="' + (x - 20) + '" cy="' + y + '" r="4.5" fill="#334155"/>';
    s += '<circle cx="' + (x + 20) + '" cy="' + y + '" r="4.5" fill="#334155"/>';
    s += '<line x1="' + (x - 20) + '" y1="' + y + '" x2="' + (x + 20) + '" y2="' +
      (closed ? y : y - 22) + '" stroke="' + (closed ? wire : '#ef4444') + '" stroke-width="4" ' +
      'stroke-linecap="round"/>';
    s += '<text x="' + x + '" y="' + (y + 24) + '" text-anchor="middle" ' +
      'font-family="Nunito,sans-serif" font-size="10.5" font-weight="800" fill="' +
      (closed ? '#475569' : '#b91c1c') + '">switch ' + (closed ? 'closed' : 'OPEN') + '</text>';
    return s;
  }

  /* =======================================================================
     STATION 2 - Conductor and Insulator Bench
     ======================================================================= */

  var MATERIALS = [
    { id: 'copper', name: 'Copper wire', conducts: true, why: 'Metals have loosely held electrons that drift freely, so copper is the standard wiring conductor.' },
    { id: 'aluminium', name: 'Aluminium foil', conducts: true, why: 'Another metal, so another good conductor. It is lighter than copper, which is why power lines use it.' },
    { id: 'graphite', name: 'Pencil graphite', conducts: true, why: 'A surprise: graphite is a form of carbon whose loose electrons let it conduct, even though it is not a metal.' },
    { id: 'saltwater', name: 'Salt water', conducts: true, why: 'Dissolved salt splits into charged particles that carry current. This is exactly why electricity and water are dangerous together.' },
    { id: 'coin', name: 'Canadian toonie', conducts: true, why: 'Nickel and brass, both metals, so the current passes straight through.' },
    { id: 'rubber', name: 'Rubber eraser', conducts: false, why: 'Rubber holds its electrons tightly. That is why wire is wrapped in it and why electricians wear rubber gloves.' },
    { id: 'glass', name: 'Glass marble', conducts: false, why: 'Glass is such a good insulator that it was used for the insulators on old telegraph poles.' },
    { id: 'wood', name: 'Dry maple stick', conducts: false, why: 'Dry wood is an insulator. Note the word DRY: wet wood contains water with dissolved minerals and can conduct.' },
    { id: 'plastic', name: 'Plastic ruler', conducts: false, why: 'Plastic is the everyday insulator, which is why every plug and switch casing is made of it.' },
    { id: 'paper', name: 'Paper', conducts: false, why: 'Dry paper does not conduct. It is cellulose, with no free charges to carry a current.' }
  ];

  var bench = { tested: {}, current: null };

  function renderBench(host) {
    var chips = '';
    for (var i = 0; i < MATERIALS.length; i++) {
      chips += '<button type="button" class="g6-chip" data-material="' + MATERIALS[i].id + '">' +
        MATERIALS[i].name + '</button>';
    }

    host.innerHTML =
      '<p class="g6-note">A <strong>conductor</strong> lets electric current pass through it. ' +
        'An <strong>insulator</strong> blocks it. Drop each material into the gap in the test ' +
        'circuit and see whether the bulb lights. Predict first, then test.</p>' +
      '<div class="g6-chips" style="margin-bottom:18px">' + chips + '</div>' +
      '<div class="g6-lab-grid">' +
        '<div class="g6-canvas"><svg id="el-bench-svg" viewBox="0 0 500 260" role="img" ' +
          'aria-label="Test circuit with a gap for a sample material"></svg></div>' +
        '<div class="g6-controls">' +
          '<p class="g6-note" id="el-bench-note">Choose a material above to place it in the gap.</p>' +
          '<div class="g6-readout">' +
            stat('el-bench-tested', 'Materials tested') +
            stat('el-bench-cond', 'Conductors found') +
            stat('el-bench-ins', 'Insulators found') +
          '</div>' +
          '<div id="el-bench-list"></div>' +
        '</div>' +
      '</div>';

    host.querySelectorAll('[data-material]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        testMaterial(btn.getAttribute('data-material'));
        host.querySelectorAll('[data-material]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    updateBench();
    drawBench();
  }

  function materialById(id) {
    for (var i = 0; i < MATERIALS.length; i++) if (MATERIALS[i].id === id) return MATERIALS[i];
    return null;
  }

  function testMaterial(id) {
    var m = materialById(id);
    if (!m) return;
    bench.current = m;
    var isNew = !bench.tested[id];
    bench.tested[id] = true;

    if (typeof global.playSound === 'function') global.playSound(m.conducts ? 'correct' : 'wrong');
    if (isNew && typeof global.addXP === 'function') global.addXP(3);

    var note = document.getElementById('el-bench-note');
    note.className = 'g6-note' + (m.conducts ? '' : ' g6-note--warn');
    note.innerHTML = '<strong>' + m.name + ' is ' +
      (m.conducts ? 'a CONDUCTOR - the bulb lights.' : 'an INSULATOR - the bulb stays dark.') +
      '</strong> ' + m.why;

    updateBench();
    drawBench();
  }

  function updateBench() {
    var tested = 0, cond = 0, ins = 0;
    for (var i = 0; i < MATERIALS.length; i++) {
      if (bench.tested[MATERIALS[i].id]) {
        tested++;
        if (MATERIALS[i].conducts) cond++; else ins++;
      }
    }
    setStat('el-bench-tested', tested + ' of ' + MATERIALS.length, tested === MATERIALS.length ? 'good' : '');
    setStat('el-bench-cond', String(cond), 'good');
    setStat('el-bench-ins', String(ins), 'warn');

    var rows = '';
    for (var j = 0; j < MATERIALS.length; j++) {
      var m = MATERIALS[j];
      if (!bench.tested[m.id]) continue;
      rows += '<tr><td>' + m.name + '</td><td><strong style="color:' +
        (m.conducts ? '#047857' : '#b45309') + '">' +
        (m.conducts ? 'Conductor' : 'Insulator') + '</strong></td></tr>';
    }
    document.getElementById('el-bench-list').innerHTML = rows
      ? '<table class="g6-table"><thead><tr><th>Material</th><th>Result</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>'
      : '';

    if (tested === MATERIALS.length) {
      if (typeof global.launchConfetti === 'function') global.launchConfetti();
    }
  }

  function drawBench() {
    var svg = document.getElementById('el-bench-svg');
    if (!svg) return;
    var m = bench.current;
    var lit = !!(m && m.conducts);
    var wire = lit ? '#06b6d4' : '#94a3b8';
    var s = '<rect width="500" height="260" fill="#f8fafc"/>';

    s += '<path d="M70 190 V70 H200 M300 70 H430 V190 H70" fill="none" stroke="' + wire +
      '" stroke-width="4" stroke-linejoin="round"/>';

    // The sample gap.
    s += '<circle cx="200" cy="70" r="5" fill="#334155"/>';
    s += '<circle cx="300" cy="70" r="5" fill="#334155"/>';
    if (m) {
      s += '<rect x="206" y="52" width="88" height="36" rx="8" fill="' +
        (lit ? '#a7f3d0' : '#fed7aa') + '" stroke="' + (lit ? '#10b981' : '#f59e0b') +
        '" stroke-width="2.5"/>';
      s += '<text x="250" y="75" text-anchor="middle" font-family="Nunito,sans-serif" ' +
        'font-size="11" font-weight="800" fill="' + (lit ? '#065f46' : '#92400e') + '">' +
        esc(shortName(m.name)) + '</text>';
      if (lit) {
        s += '<line x1="205" y1="70" x2="295" y2="70" stroke="#06b6d4" stroke-width="4" ' +
          'stroke-dasharray="7 5"/>';
      } else {
        s += '<text x="250" y="106" text-anchor="middle" font-family="Nunito,sans-serif" ' +
          'font-size="10.5" font-weight="800" fill="#b45309">current blocked</text>';
      }
    } else {
      s += '<line x1="205" y1="70" x2="295" y2="70" stroke="#cbd5e1" stroke-width="3" ' +
        'stroke-dasharray="6 6"/>';
      s += '<text x="250" y="50" text-anchor="middle" font-family="Nunito,sans-serif" ' +
        'font-size="10.5" font-weight="800" fill="#94a3b8">TEST GAP</text>';
    }

    // Bulb and battery.
    s += bulb2(430, 130, lit);
    s += '<g><line x1="60" y1="122" x2="60" y2="140" stroke="#334155" stroke-width="4"/>' +
      '<line x1="80" y1="127" x2="80" y2="135" stroke="#334155" stroke-width="4"/>' +
      '<line x1="60" y1="131" x2="80" y2="131" stroke="' + wire + '" stroke-width="2"/>' +
      '<text x="52" y="135" text-anchor="end" font-family="Nunito,sans-serif" font-size="10.5" ' +
      'font-weight="800" fill="#475569">3.0 V</text></g>';
    s += '<line x1="70" y1="70" x2="70" y2="122" stroke="' + wire + '" stroke-width="4"/>';
    s += '<line x1="70" y1="140" x2="70" y2="190" stroke="' + wire + '" stroke-width="4"/>';

    s += '<text x="24" y="232" font-family="Nunito,sans-serif" font-size="10.5" fill="#94a3b8">' +
      'The circuit is complete only if the sample in the gap can carry the current.</text>';
    svg.innerHTML = s;
  }

  function bulb2(x, y, lit) {
    var s = '';
    if (lit) s += '<circle cx="' + x + '" cy="' + y + '" r="30" fill="#f59e0b" opacity="0.24"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="17" fill="' + (lit ? '#fbbf24' : '#e2e8f0') +
      '" stroke="' + (lit ? '#d97706' : '#94a3b8') + '" stroke-width="2.5"/>';
    s += '<path d="M' + (x - 7) + ' ' + (y + 3) + ' l5 -8 l4 8 l5 -8" fill="none" stroke="' +
      (lit ? '#92400e' : '#94a3b8') + '" stroke-width="2" stroke-linejoin="round"/>';
    return s;
  }

  function shortName(n) { return n.length > 14 ? n.split(' ')[0] : n; }

  /* =======================================================================
     STATION 3 - Ontario Energy Audit
     ======================================================================= */

  var APPLIANCES = [
    { id: 'fridge', name: 'Refrigerator', short: 'Fridge', watts: 150, hours: 24, on: true, transform: 'electrical to kinetic and thermal' },
    { id: 'furnace', name: 'Furnace fan', short: 'Furnace fan', watts: 400, hours: 8, on: true, transform: 'electrical to kinetic' },
    { id: 'led', name: 'LED lights (whole house)', short: 'LED lights', watts: 60, hours: 6, on: true, transform: 'electrical to light' },
    { id: 'incandescent', name: 'Old incandescent bulbs', short: 'Old bulbs', watts: 400, hours: 6, on: false, transform: 'electrical to light AND a lot of waste heat' },
    { id: 'tv', name: 'Television', short: 'TV', watts: 120, hours: 4, on: true, transform: 'electrical to light and sound' },
    { id: 'kettle', name: 'Electric kettle', short: 'Kettle', watts: 1500, hours: 0.25, on: true, transform: 'electrical to thermal' },
    { id: 'dryer', name: 'Clothes dryer', short: 'Dryer', watts: 3000, hours: 1, on: true, transform: 'electrical to thermal and kinetic' },
    { id: 'ev', name: 'Electric car charger', short: 'EV charger', watts: 7200, hours: 3, on: false, transform: 'electrical to chemical (stored in the battery)' },
    { id: 'ac', name: 'Air conditioner', short: 'A/C', watts: 1800, hours: 5, on: false, transform: 'electrical to kinetic and thermal' }
  ];

  var RATE = 0.122;   // Ontario mid-peak, dollars per kWh

  function renderAudit(host) {
    var rows = '';
    for (var i = 0; i < APPLIANCES.length; i++) {
      var a = APPLIANCES[i];
      rows += '<tr><td><label class="el-check"><input type="checkbox" data-appliance="' + a.id +
        '"' + (a.on ? ' checked' : '') + '><span>' + a.name + '</span></label></td>' +
        '<td>' + a.watts.toLocaleString('en-CA') + ' W</td>' +
        '<td>' + a.hours + ' h</td>' +
        '<td class="el-kwh" id="el-kwh-' + a.id + '"></td>' +
        '<td class="el-transform">' + a.transform + '</td></tr>';
    }

    host.innerHTML =
      '<p class="g6-note">Every device <strong>transforms</strong> electrical energy into another ' +
        'form: light, sound, heat or motion. Ontario households pay for that energy in ' +
        '<strong>kilowatt hours</strong>: <code>kWh = watts / 1000 x hours</code>. Switch things ' +
        'on and off below and watch the daily bill respond.</p>' +
      '<table class="g6-table"><thead><tr><th>Device</th><th>Power</th><th>Hours/day</th>' +
        '<th>kWh/day</th><th>Energy transformation</th></tr></thead><tbody>' + rows +
      '</tbody></table>' +
      '<div class="g6-readout" style="margin-top:18px">' +
        stat('el-total-kwh', 'Total energy per day') + stat('el-cost-day', 'Cost per day') +
        stat('el-cost-month', 'Cost per 30 days') + stat('el-cost-year', 'Cost per year') +
      '</div>' +
      '<div class="g6-canvas" style="margin-top:18px"><svg id="el-audit-svg" viewBox="0 0 620 240" ' +
        'role="img" aria-label="Daily energy use by device"></svg></div>' +
      '<p class="g6-note" id="el-audit-note" style="margin-top:16px"></p>' +
      '<p class="g6-note" style="margin-top:12px"><strong>Where Ontario\'s electricity comes ' +
        'from:</strong> about half is <strong>nuclear</strong>, roughly a quarter is ' +
        '<strong>hydroelectricity</strong> (including the Sir Adam Beck stations at Niagara ' +
        'Falls), and the rest is wind, solar, biofuel and natural gas. Hydro, wind and solar are ' +
        '<strong>renewable</strong>. Natural gas is <strong>non-renewable</strong> and releases ' +
        'carbon dioxide, so using less electricity at peak times genuinely lowers emissions.</p>';

    host.querySelectorAll('[data-appliance]').forEach(function (box) {
      box.addEventListener('change', function () {
        var id = box.getAttribute('data-appliance');
        for (var i = 0; i < APPLIANCES.length; i++) {
          if (APPLIANCES[i].id === id) APPLIANCES[i].on = box.checked;
        }
        updateAudit();
      });
    });

    updateAudit();
  }

  function updateAudit() {
    var total = 0;
    for (var i = 0; i < APPLIANCES.length; i++) {
      var a = APPLIANCES[i];
      var kwh = a.watts / 1000 * a.hours;
      var cell = document.getElementById('el-kwh-' + a.id);
      if (cell) {
        cell.innerHTML = a.on
          ? '<strong>' + kwh.toFixed(2) + '</strong>'
          : '<span style="color:#94a3b8">0.00</span>';
      }
      if (a.on) total += kwh;
    }

    var day = total * RATE;
    setStat('el-total-kwh', total.toFixed(2) + ' kWh', total > 30 ? 'bad' : total > 15 ? 'warn' : 'good');
    setStat('el-cost-day', '$' + day.toFixed(2), '');
    setStat('el-cost-month', '$' + (day * 30).toFixed(2), '');
    setStat('el-cost-year', '$' + (day * 365).toFixed(2), day * 365 > 900 ? 'bad' : '');

    // Name the single biggest draw, because that is where saving actually happens.
    var top = null;
    for (var j = 0; j < APPLIANCES.length; j++) {
      var b = APPLIANCES[j];
      if (!b.on) continue;
      var k = b.watts / 1000 * b.hours;
      if (!top || k > top.k) top = { name: b.name, k: k };
    }

    var note = document.getElementById('el-audit-note');
    note.className = 'g6-note' + (total > 30 ? ' g6-note--warn' : '');
    note.innerHTML = top
      ? 'Your biggest single draw is the <strong>' + top.name + '</strong> at <strong>' +
        top.k.toFixed(2) + ' kWh</strong> a day, which is <strong>' +
        Math.round(top.k / total * 100) + '%</strong> of the total. Using electricity responsibly ' +
        'means starting with the biggest number, not the smallest. Try switching the old ' +
        'incandescent bulbs on and off and compare them with the LEDs doing the same job.'
      : 'Everything is switched off, so the meter reads zero. Turn a device on to begin the audit.';

    drawAudit();
  }

  function drawAudit() {
    var svg = document.getElementById('el-audit-svg');
    if (!svg) return;
    var on = APPLIANCES.filter(function (a) { return a.on; });
    var s = '<rect width="620" height="240" fill="#f8fafc"/>';

    if (!on.length) {
      s += '<text x="310" y="120" text-anchor="middle" font-family="Nunito,sans-serif" ' +
        'font-size="13" fill="#94a3b8">No devices switched on.</text>';
      svg.innerHTML = s;
      return;
    }

    var max = 0;
    for (var i = 0; i < on.length; i++) {
      max = Math.max(max, on[i].watts / 1000 * on[i].hours);
    }

    var baseY = 176, maxH = 132;
    var slot = Math.min(76, 580 / on.length);
    var left = 30;

    s += '<text x="20" y="22" font-family="Nunito,sans-serif" font-size="11" font-weight="800" ' +
      'fill="#94a3b8">ENERGY USED PER DAY, IN kWh</text>';

    for (var j = 0; j < on.length; j++) {
      var a = on[j];
      var kwh = a.watts / 1000 * a.hours;
      var h = Math.max(6, kwh / max * maxH);
      var x = left + j * slot;
      var w = Math.max(28, slot - 14);
      var hot = kwh / max > 0.6;

      s += '<rect x="' + x + '" y="' + (baseY - h) + '" width="' + w + '" height="' + h +
        '" rx="7" fill="' + (hot ? '#ef4444' : '#06b6d4') + '" opacity="0.9"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (baseY - h - 7) + '" text-anchor="middle" ' +
        'font-family="Space Mono,monospace" font-size="10.5" font-weight="700" fill="#334155">' +
        kwh.toFixed(1) + '</text>';
      s += '<text x="' + (x + w / 2) + '" y="' + (baseY + 16) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="9" font-weight="700" fill="#475569">' +
        esc(a.short || a.name) + '</text>';
    }

    s += '<line x1="20" y1="' + baseY + '" x2="600" y2="' + baseY + '" stroke="#334155" stroke-width="2"/>';
    s += '<text x="20" y="' + (baseY + 46) + '" font-family="Nunito,sans-serif" font-size="10.5" ' +
      'fill="#94a3b8">Red marks the devices using more than 60% of your single largest draw.</text>';
    svg.innerHTML = s;
  }

  /* =======================================================================
     Registration
     ======================================================================= */

  SFG6.register({
    id: 'electricity',
    tabLabel: 'Electricity',
    icon: 'bolt',
    strandTag: 'STRAND C - MATTER AND ENERGY',
    title: 'Electricity & Electrical Devices',
    intro: 'Static electricity is charge that has <strong>built up and stayed put</strong>; ' +
      'current electricity is charge that <strong>keeps flowing</strong> around a complete ' +
      'circuit. Wire up series and parallel circuits, discover which everyday materials conduct, ' +
      'then audit a real Ontario home in kilowatt hours and Canadian dollars.',
    expectations: [
      'C1. evaluate the impact of the use and generation of electrical energy on society and the environment, and suggest ways to use electrical energy responsibly',
      'C2. demonstrate an understanding of the principles of electrical energy and its transformation into and from other forms of energy'
    ],
    badgeId: 'circuit_master',
    badgeName: 'Circuit Master',
    stations: [
      {
        id: 'builder', label: 'Circuit Builder', icon: 'circuit',
        tag: 'CIRCUIT LAB',
        title: 'Station 1: Series or Parallel?',
        blurb: 'Add cells and bulbs, open the switch, unscrew a bulb. The difference between the two wiring styles shows itself the moment something breaks.',
        render: renderCircuit
      },
      {
        id: 'bench', label: 'Conductor Bench', icon: 'flask',
        tag: 'MATERIALS TEST',
        title: 'Station 2: Conductor or Insulator?',
        blurb: 'Ten everyday materials, one test gap. Predict what will happen before you drop each one in, then find out.',
        render: renderBench
      },
      {
        id: 'audit', label: 'Energy Audit', icon: 'chartLine',
        tag: 'RESPONSIBLE USE',
        title: 'Station 3: Audit an Ontario Home',
        blurb: 'Real appliance wattages, real Ontario electricity prices. Find the biggest draw in the house and work out what switching it off is worth in a year.',
        render: renderAudit
      }
    ],
    tiers: [
      {
        name: 'Ontario Core',
        desc: 'The Grade 6 benchmark: static and current, circuits, conductors and insulators.',
        xp: 10,
        questions: [
          {
            q: 'Sophia rubs her boots on a dry carpet in January and gets a small shock from a doorknob. What is this?',
            options: [
              'Current electricity flowing in a circuit',
              'Static electricity building up and then discharging',
              'Hydroelectricity',
              'A short circuit'
            ],
            ans: 1,
            hint: 'The charge sat still on her body until it suddenly jumped. Which word means "not moving"?',
            solution: [
              'Rubbing transfers electrons onto her body, so a charge <strong>builds up and stays put</strong>. "Static" means stationary.',
              'When she touches metal, that stored charge jumps across in an instant. That jump is called a <strong>discharge</strong>.',
              'Current electricity is a <strong>continuous</strong> flow around a circuit, which is not what happened here.',
              'The answer is <strong>static electricity building up and then discharging</strong>.'
            ]
          },
          {
            q: 'Which set of parts makes a <strong>complete</strong> circuit that will light a bulb?',
            options: [
              'A bulb and a wire only',
              'A source of energy, conductors, a load, and an unbroken path',
              'A battery and an insulator',
              'A switch on its own'
            ],
            ans: 1,
            hint: 'Think about what supplies the energy, what carries it, what uses it, and what shape the whole thing must be.',
            solution: [
              'A circuit needs a <strong>source</strong> (the battery) to push the charge.',
              'It needs <strong>conductors</strong> (the wires) to carry the charge.',
              'It needs a <strong>load</strong> (the bulb) that transforms the energy into light.',
              'And the path must be <strong>unbroken</strong>, or nothing flows. So the answer is <strong>a source of energy, conductors, a load, and an unbroken path</strong>.'
            ]
          },
          {
            q: 'Which of these is an <strong>insulator</strong>?',
            options: ['Copper wire', 'Salt water', 'Rubber glove', 'Aluminium foil'],
            ans: 2,
            hint: 'Three of these let current through easily. Which one is worn precisely to stop it?',
            solution: [
              'Copper and aluminium are metals with loosely held electrons, so both are good conductors.',
              'Salt water contains dissolved charged particles, so it conducts too. That is why water near electricity is dangerous.',
              'Rubber holds its electrons tightly and does not let current pass.',
              'Electricians wear rubber gloves for exactly this reason, so the answer is <strong>rubber glove</strong>.'
            ]
          },
          {
            q: 'An electric kettle transforms electrical energy mainly into which form?',
            options: ['Light energy', 'Sound energy', 'Thermal (heat) energy', 'Chemical energy'],
            ans: 2,
            hint: 'What does a kettle actually do to the water inside it?',
            solution: [
              'Every electrical device <strong>transforms</strong> electrical energy into some other form.',
              'A kettle\'s job is to raise water from about 10 degrees C to 100 degrees C.',
              'That requires <strong>thermal energy</strong>, produced by current flowing through a resistance wire.',
              'The answer is <strong>thermal (heat) energy</strong>. A lamp makes light, a speaker makes sound, and a charging battery stores chemical energy.'
            ]
          },
          {
            q: 'In your house, if one light bulb burns out the other lights stay on. How is house wiring arranged?',
            options: [
              'In series, one single loop',
              'In parallel, each light on its own branch',
              'With no circuit at all',
              'With static electricity'
            ],
            ans: 1,
            hint: 'Test it in Station 1: unscrew bulb 2 in each mode and see which one keeps the rest alight.',
            solution: [
              'In a <strong>series</strong> circuit there is only one path, so a single break stops <strong>every</strong> device.',
              'In a <strong>parallel</strong> circuit each device sits on its own branch back to the source.',
              'Breaking one branch leaves all the other branches complete, so those lights stay on.',
              'That is exactly what happens at home, so the answer is <strong>in parallel, each light on its own branch</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Enriched Deep Thinker',
        desc: 'Predict what happens when a circuit breaks, and follow the energy and the cost.',
        xp: 15,
        questions: [
          {
            q: 'Four identical bulbs are wired <strong>in series</strong> to a 6 V battery. Bulb 3 is unscrewed. What happens?',
            options: [
              'Only bulb 3 goes out',
              'All four bulbs go out',
              'The remaining three get brighter',
              'Nothing changes'
            ],
            ans: 1,
            hint: 'How many separate paths does the current have in a series circuit?',
            solution: [
              'A series circuit is a <strong>single loop</strong>: the current must pass through every component in turn.',
              'Unscrewing bulb 3 leaves a <strong>gap</strong> in that one and only loop.',
              'With the loop broken, no current can flow anywhere in the circuit.',
              'So <strong>all four bulbs go out</strong>. This is exactly why old Christmas light strings all failed at once.'
            ]
          },
          {
            q: 'A 6 V battery lights <strong>three identical bulbs in series</strong>. How much voltage does each bulb receive, and what happens if you add a fourth?',
            options: [
              '6 V each, and nothing changes',
              '2 V each, and adding a fourth makes them all dimmer',
              '2 V each, and adding a fourth makes them all brighter',
              '18 V each, and adding a fourth makes no difference'
            ],
            ans: 1,
            hint: 'In series the battery voltage is shared out among the bulbs. Try it on the Station 1 sliders.',
            solution: [
              'In a series circuit the source voltage is <strong>shared</strong> between the loads.',
              'Three identical bulbs on 6 V: <code>6 / 3 = 2 V</code> each.',
              'Add a fourth bulb and the same 6 V now splits four ways: <code>6 / 4 = 1.5 V</code> each.',
              'Less voltage per bulb means less light, so the answer is <strong>2 V each, and adding a fourth makes them all dimmer</strong>.'
            ]
          },
          {
            q: 'A hair dryer rated at <code>1 500 W</code> runs for <code>20 minutes</code>. How much energy does it use, in kWh?',
            options: ['<code>0.5 kWh</code>', '<code>30 kWh</code>', '<code>0.05 kWh</code>', '<code>5 kWh</code>'],
            ans: 0,
            hint: 'Convert watts to kilowatts, and minutes to hours, before multiplying.',
            solution: [
              'Convert power: <code>1 500 W = 1.5 kW</code>.',
              'Convert time: <code>20 minutes = 20 / 60 = 1/3 hour</code>.',
              'Energy: <code>1.5 kW x 1/3 h = 0.5 kWh</code>.',
              'The answer is <strong>0.5 kWh</strong>, which costs about 6 cents in Ontario.'
            ]
          },
          {
            q: 'Why is <strong>salt water</strong> a conductor while <strong>pure distilled water</strong> is a very poor one?',
            options: [
              'Salt water is heavier',
              'Dissolved salt splits into charged particles that carry the current',
              'Salt water is warmer',
              'Pure water contains no water molecules'
            ],
            ans: 1,
            hint: 'Something has to physically carry the charge from one side to the other. What did the salt add?',
            solution: [
              'A current is charge <strong>moving</strong>, so a conductor needs charged particles that are free to move.',
              'Pure water molecules are neutral overall and very few of them come apart, so almost nothing is free to carry charge.',
              'Dissolving salt splits it into positive and negative <strong>charged particles</strong> that drift through the water.',
              'The answer is <strong>dissolved salt splits into charged particles that carry the current</strong>. Lake and tap water contain dissolved minerals, which is why they conduct.'
            ]
          },
          {
            q: 'Evaluating Ontario\'s electricity, which change would most reduce <strong>greenhouse gas emissions</strong> from the grid?',
            options: [
              'Running the clothes dryer at 6 pm instead of 11 pm',
              'Shifting heavy appliance use off peak, when gas plants would otherwise be switched on',
              'Using a longer extension cord',
              'Unplugging a phone charger overnight'
            ],
            ans: 1,
            hint: 'Ontario turns on natural gas plants to cover the peaks. What happens if the peak gets smaller?',
            solution: [
              'Most Ontario electricity comes from nuclear and hydro, which emit almost no carbon dioxide while running.',
              'At <strong>peak</strong> demand the grid fires up <strong>natural gas</strong> plants, and those do emit carbon dioxide.',
              'Shifting a dryer or an EV charger to off-peak hours means the gas plants are needed less.',
              'A phone charger draws under a watt and cord length is irrelevant, so the answer is <strong>shifting heavy appliance use off peak, when gas plants would otherwise be switched on</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Waterloo CEMC Challenge',
        desc: 'Contest-style: cost optimisation, circuit logic and multi-step energy arithmetic.',
        xp: 25,
        questions: [
          {
            q: 'Ten <code>60 W</code> incandescent bulbs burn <code>5 h</code> a day. They are replaced with <code>9 W</code> LEDs. At <code>$0.12</code> per kWh, how much is saved in <strong>365 days</strong>?',
            options: ['<code>$55.85</code>', '<code>$111.69</code>', '<code>$22.34</code>', '<code>$11.17</code>'],
            ans: 1,
            hint: 'Find the power saved for all ten bulbs first, then convert to kWh per day, then to a year.',
            solution: [
              'Power saved per bulb: <code>60 - 9 = 51 W</code>. For all ten: <code>510 W = 0.51 kW</code>.',
              'Energy saved per day: <code>0.51 kW x 5 h = 2.55 kWh</code>.',
              'Energy saved per year: <code>2.55 kWh x 365 = 930.75 kWh</code>.',
              'Money saved: <code>930.75 x $0.12 = $111.69</code>. The answer is <strong>$111.69</strong>. The trap is stopping at one bulb, which gives only <code>$11.17</code>.'
            ]
          },
          {
            q: 'Three bulbs are wired in <strong>parallel</strong> across a 9 V battery. Bulb 1 is unscrewed and bulb 2 has a broken filament. How many bulbs are lit?',
            options: ['0', '1', '2', '3'],
            ans: 1,
            hint: 'Each parallel branch is independent. Count how many branches are still unbroken.',
            solution: [
              'In parallel, each bulb has its <strong>own separate branch</strong> back to the battery.',
              'Bulb 1 is unscrewed: its branch is broken, so bulb 1 is out.',
              'Bulb 2 has a broken filament: its branch is broken too, so bulb 2 is out.',
              'Bulb 3\'s branch is untouched and still complete, so exactly <strong>1</strong> bulb is lit.'
            ]
          },
          {
            q: 'A family uses <code>750 kWh</code> a month. Off-peak costs <code>$0.087</code>/kWh and on-peak <code>$0.182</code>/kWh. They currently use <code>40%</code> off-peak. If they shift to <code>70%</code> off-peak, how much do they save per month?',
            options: ['<code>$21.38</code>', '<code>$42.75</code>', '<code>$10.69</code>', '<code>$64.13</code>'],
            ans: 0,
            hint: 'You only need the kWh that MOVED, and the price difference per kWh.',
            solution: [
              'The share moving from on-peak to off-peak is <code>70% - 40% = 30%</code>.',
              'That is <code>750 x 0.30 = 225 kWh</code> shifted.',
              'Price difference: <code>$0.182 - $0.087 = $0.095</code> saved per kWh.',
              'Saving: <code>225 x $0.095 = $21.38</code>. The answer is <strong>$21.38</strong>.'
            ]
          },
          {
            q: 'Four bulbs W, X, Y, Z sit in a circuit. Removing W darkens all four. Removing X darkens only X. Removing Y darkens only Y. How is the circuit wired?',
            options: [
              'All four in series',
              'All four in parallel',
              'W in series with a parallel group of X, Y and Z',
              'W and X in series, Y and Z in parallel with each other only'
            ],
            ans: 2,
            hint: 'A bulb whose removal kills everything must be on the one path they all share.',
            solution: [
              'X and Y each go out <strong>alone</strong>, so they must sit on their own separate branches: they are in <strong>parallel</strong> with each other.',
              'If all four were in series, removing X would darken everything, which contradicts the evidence.',
              'If all four were in parallel, removing W would darken only W, which also contradicts the evidence.',
              'W must sit on the <strong>shared</strong> path that feeds the whole parallel group, so the answer is <strong>W in series with a parallel group of X, Y and Z</strong>.'
            ]
          },
          {
            q: 'A generating station produces <code>500 MW</code>. One Ontario home averages <code>1.25 kW</code>. Roughly how many homes can the station supply? (<code>1 MW = 1 000 kW</code>)',
            options: ['<code>400</code>', '<code>4 000</code>', '<code>40 000</code>', '<code>400 000</code>'],
            ans: 3,
            hint: 'Put both numbers into the same unit before you divide.',
            solution: [
              'Convert the station output: <code>500 MW x 1 000 = 500 000 kW</code>.',
              'Each home needs <code>1.25 kW</code>.',
              'Number of homes: <code>500 000 / 1.25 = 400 000</code>.',
              'The answer is <strong>400 000 homes</strong>, which is roughly the size of Windsor plus Kingston.'
            ]
          }
        ]
      }
    ]
  });
})(window);
