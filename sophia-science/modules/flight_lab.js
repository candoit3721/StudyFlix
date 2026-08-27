/**
 * StudyFlix - Grade 6 Ontario Strand D: Structures and Mechanisms, Flight
 * ---------------------------------------------------------------------------
 * D1. assess the environmental impacts of flying machines
 * D2. demonstrate an understanding of the ways in which properties of air can
 *     be applied to the principles of flight and flying machines
 *
 * Stations:
 *   1. Four Forces Flight Deck - lift / weight / thrust / drag, solved live
 *   2. Aerofoil & Bernoulli    - camber and angle of attack change the pressure
 *   3. Wings Compared          - bird, bat and aircraft wing loading
 *
 * The aerodynamics is a real (if simplified) model, not a lookup table:
 *   rho  = 1.225 * e^(-altitude / 8.5)      air thins with height
 *   L    = 0.5 * rho * v^2 * S * Cl         the lift equation
 *   Cl   = 0.10 * alpha + 0.15, stalling past 15 degrees
 *   D    = 0.5 * rho * v^2 * S * Cd         with induced drag from Cl
 * Aircraft is a de Havilland Canada Dash 8 Q400: 29 000 kg, wing area 63 m2.
 */
(function (global) {
  'use strict';

  // Shared lab controls live in g6_core.js so all four strands look identical.
  var ui = SFG6.ui;
  var slider = ui.slider, bind = ui.bind, setSlider = ui.setSlider;
  var stat = ui.stat, setStat = ui.setStat;

  var MASS_KG = 29000;
  var GRAVITY = 9.81;
  var WING_AREA = 63;
  var WEIGHT_KN = MASS_KG * GRAVITY / 1000;

  /* =======================================================================
     Shared aerodynamics
     ======================================================================= */

  function airDensity(altKm) {
    return 1.225 * Math.exp(-altKm / 8.5);
  }

  function liftCoefficient(alphaDeg) {
    var cl = 0.10 * alphaDeg + 0.15;
    // Past the critical angle the airflow separates and lift falls away.
    if (alphaDeg > 15) cl = (0.10 * 15 + 0.15) * (1 - (alphaDeg - 15) * 0.09);
    return Math.max(cl, -0.4);
  }

  function solveFlight(speedKmh, alphaDeg, thrustKn, altKm) {
    var v = speedKmh / 3.6;
    var rho = airDensity(altKm);
    var cl = liftCoefficient(alphaDeg);
    var cd = 0.022 + (cl * cl) / (Math.PI * 9 * 0.8);
    var lift = 0.5 * rho * v * v * WING_AREA * cl / 1000;
    var drag = 0.5 * rho * v * v * WING_AREA * cd / 1000;
    return {
      rho: rho, cl: cl, lift: lift, drag: drag,
      weight: WEIGHT_KN, thrust: thrustKn,
      vertical: lift - WEIGHT_KN,
      horizontal: thrustKn - drag,
      stalled: alphaDeg > 15
    };
  }

  /* =======================================================================
     STATION 1 - Four Forces Flight Deck
     ======================================================================= */

  var deck = { speed: 560, alpha: 4, thrust: 46, alt: 7 };

  function renderDeck(host) {
    host.innerHTML =
      '<p class="g6-note"><strong>Four forces act on every aircraft.</strong> ' +
        '<strong>Lift</strong> opposes <strong>weight</strong>, and <strong>thrust</strong> ' +
        'opposes <strong>drag</strong>. When each pair is balanced the aeroplane flies straight ' +
        'and level. Unbalance a pair and the aeroplane climbs, dives, speeds up or slows down.</p>' +
      '<div class="g6-lab-grid">' +
        '<div>' +
          '<div class="g6-canvas"><svg id="fly-deck-svg" viewBox="0 0 620 360" role="img" ' +
            'aria-label="Aircraft with the four forces of flight drawn to scale"></svg></div>' +
          '<div class="g6-legend">' +
            '<span><i class="g6-swatch" style="background:#06b6d4"></i>Lift</span>' +
            '<span><i class="g6-swatch" style="background:#ef4444"></i>Weight</span>' +
            '<span><i class="g6-swatch" style="background:#10b981"></i>Thrust</span>' +
            '<span><i class="g6-swatch" style="background:#f59e0b"></i>Drag</span>' +
          '</div>' +
        '</div>' +
        '<div class="g6-controls">' +
          slider('fly-speed', 'Airspeed', deck.speed, 200, 900, 10, 'km/h') +
          slider('fly-alpha', 'Angle of attack', deck.alpha, -2, 20, 1, 'degrees') +
          slider('fly-thrust', 'Engine thrust', deck.thrust, 0, 120, 1, 'kN') +
          slider('fly-alt', 'Altitude', deck.alt, 0, 12, 1, 'km') +
          '<div class="g6-readout">' +
            stat('fly-lift', 'Lift') + stat('fly-weight', 'Weight') +
            stat('fly-thrustv', 'Thrust') + stat('fly-drag', 'Drag') +
            stat('fly-rho', 'Air density') + stat('fly-cl', 'Lift coefficient') +
          '</div>' +
          '<p class="g6-note" id="fly-verdict"></p>' +
          '<div class="g6-chips">' +
            '<button type="button" class="g6-chip" data-preset="cruise">Set: level cruise</button>' +
            '<button type="button" class="g6-chip" data-preset="climb">Set: climbing out</button>' +
            '<button type="button" class="g6-chip" data-preset="stall">Set: stall</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    bind('fly-speed', function (v) { deck.speed = v; updateDeck(); });
    bind('fly-alpha', function (v) { deck.alpha = v; updateDeck(); });
    bind('fly-thrust', function (v) { deck.thrust = v; updateDeck(); });
    bind('fly-alt', function (v) { deck.alt = v; updateDeck(); });

    host.querySelectorAll('[data-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-preset');
        if (p === 'cruise') deck = { speed: 560, alpha: 3, thrust: 34, alt: 7 };
        else if (p === 'climb') deck = { speed: 340, alpha: 9, thrust: 96, alt: 2 };
        else deck = { speed: 260, alpha: 19, thrust: 20, alt: 3 };
        setSlider('fly-speed', deck.speed);
        setSlider('fly-alpha', deck.alpha);
        setSlider('fly-thrust', deck.thrust);
        setSlider('fly-alt', deck.alt);
        updateDeck();
      });
    });

    updateDeck();
  }

  function updateDeck() {
    var f = solveFlight(deck.speed, deck.alpha, deck.thrust, deck.alt);

    setStat('fly-lift', f.lift.toFixed(0) + ' kN', f.vertical > 3 ? 'good' : f.vertical < -3 ? 'bad' : '');
    setStat('fly-weight', f.weight.toFixed(0) + ' kN', '');
    setStat('fly-thrustv', f.thrust.toFixed(0) + ' kN', f.horizontal > 1 ? 'good' : f.horizontal < -1 ? 'bad' : '');
    setStat('fly-drag', f.drag.toFixed(1) + ' kN', '');
    setStat('fly-rho', f.rho.toFixed(3) + ' kg/m3', '');
    setStat('fly-cl', f.cl.toFixed(2), f.stalled ? 'bad' : '');

    var vert = f.stalled
      ? 'The wing has <strong>stalled</strong>. Past about 15 degrees the air can no longer follow the curved upper surface, it separates, and lift collapses. Lower the nose to recover.'
      : f.vertical > 3 ? 'Lift beats weight by <strong>' + f.vertical.toFixed(0) + ' kN</strong>, so the aircraft <strong>climbs</strong>.'
      : f.vertical < -3 ? 'Weight beats lift by <strong>' + Math.abs(f.vertical).toFixed(0) + ' kN</strong>, so the aircraft <strong>descends</strong>.'
      : 'Lift and weight are <strong>balanced</strong>, so the aircraft holds its altitude.';

    var horiz = f.horizontal > 1 ? ' Thrust beats drag, so it <strong>accelerates</strong>.'
      : f.horizontal < -1 ? ' Drag beats thrust, so it <strong>slows down</strong>.'
      : ' Thrust and drag are <strong>balanced</strong>, so the speed holds steady.';

    var verdict = document.getElementById('fly-verdict');
    verdict.className = 'g6-note' + (f.stalled ? ' g6-note--warn' : '');
    verdict.innerHTML = vert + horiz;

    drawDeck(f);
  }

  function drawDeck(f) {
    var svg = document.getElementById('fly-deck-svg');
    if (!svg) return;
    var cx = 310, cy = 190;
    var scale = 0.62;   // kN -> pixels
    var s = '<rect width="620" height="360" fill="#f8fafc"/>';

    // Sky bands thin out with altitude, so "air has mass" stays visible.
    var bands = Math.max(2, Math.round(10 - deck.alt * 0.7));
    for (var b = 0; b < bands; b++) {
      s += '<line x1="20" y1="' + (62 + b * 30) + '" x2="600" y2="' + (62 + b * 30) +
        '" stroke="#cbd5e1" stroke-width="1" opacity="0.5"/>';
    }

    // Aircraft: a clean side-view silhouette, tilted by the angle of attack.
    s += '<g transform="rotate(' + (-deck.alpha) + ' ' + cx + ' ' + cy + ')">';
    // Tailplane and fin first, so the fuselage overlaps them.
    s += '<path d="M' + (cx - 104) + ' ' + cy + ' l-4 -34 h10 l22 26 z" fill="#475569"/>';
    s += '<path d="M' + (cx - 100) + ' ' + (cy + 2) + ' l-16 14 h20 l14 -12 z" fill="#64748b"/>';
    // Fuselage.
    s += '<path d="M' + (cx + 118) + ' ' + cy +
      ' q-16 -15 -46 -18 h-150 q-24 2 -30 18 q6 16 30 18 h150 q30 -3 46 -18 z" fill="#334155"/>';
    // Wing, swept back from the fuselage.
    s += '<path d="M' + (cx - 6) + ' ' + (cy - 4) + ' l-30 -38 h20 l44 34 z" fill="#0891b2"/>';
    s += '<path d="M' + (cx - 6) + ' ' + (cy + 4) + ' l-30 38 h20 l44 -34 z" fill="#06b6d4"/>';
    // Engine nacelle and cabin windows.
    s += '<ellipse cx="' + (cx - 16) + '" cy="' + (cy + 16) + '" rx="19" ry="8" fill="#1e293b"/>';
    for (var w = 0; w < 6; w++) {
      s += '<circle cx="' + (cx - 58 + w * 20) + '" cy="' + (cy - 4) + '" r="3" fill="#e0f2fe"/>';
    }
    s += '<path d="M' + (cx + 92) + ' ' + (cy - 6) + ' l16 4 l-16 5 z" fill="#e0f2fe"/>';
    s += '</g>';

    // Force arrows, drawn to scale from the solved values.
    // Vertical labels ride the arrow tip; horizontal labels sit in fixed lanes
    // at the canvas edges, because a small force gives a short arrow whose tip
    // would otherwise land on top of the fuselage.
    s += arrow(cx, cy, 0, -Math.min(f.lift * scale, 118), '#06b6d4',
               'Lift ' + f.lift.toFixed(0) + ' kN', 'up');
    s += arrow(cx, cy, 0, Math.min(f.weight * scale, 118), '#ef4444',
               'Weight ' + f.weight.toFixed(0) + ' kN', 'down');
    s += arrow(cx, cy, Math.min(f.thrust * scale * 1.9, 168), 0, '#10b981',
               'Thrust ' + f.thrust.toFixed(0) + ' kN', 'right');
    s += arrow(cx, cy, -Math.min(f.drag * scale * 1.9, 168), 0, '#f59e0b',
               'Drag ' + f.drag.toFixed(1) + ' kN', 'left');

    // Altitude caption lives along the bottom, well clear of the lift label.
    s += '<text x="20" y="353" font-family="Nunito,sans-serif" font-size="11" font-weight="700" ' +
      'fill="#94a3b8">Altitude ' + deck.alt + ' km &bull; air density ' + f.rho.toFixed(3) +
      ' kg/m3 &bull; thinner air means fewer guide lines</text>';

    if (f.stalled) {
      s += '<text x="600" y="26" text-anchor="end" font-family="Montserrat,sans-serif" ' +
        'font-size="14" font-weight="800" fill="#b91c1c">STALL - airflow has separated</text>';
    }
    svg.innerHTML = s;
  }

  /** One labelled force vector. Length is proportional to the force in kN. */
  function arrow(x, y, dx, dy, colour, label, dir) {
    var ex = x + dx, ey = y + dy;
    var head = '';
    if (dir === 'up') head = 'M' + ex + ' ' + (ey - 11) + ' l7 13 h-14 z';
    if (dir === 'down') head = 'M' + ex + ' ' + (ey + 11) + ' l7 -13 h-14 z';
    if (dir === 'right') head = 'M' + (ex + 11) + ' ' + ey + ' l-13 7 v-14 z';
    if (dir === 'left') head = 'M' + (ex - 11) + ' ' + ey + ' l13 7 v-14 z';

    // Vertical labels track the arrow tip. Horizontal labels are pinned to a
    // fixed lane at the canvas edge so a short arrow cannot push its label
    // back on top of the aircraft.
    var lx = ex, ly = ey, anchor = 'middle';
    if (dir === 'up') ly = ey - 16;
    if (dir === 'down') ly = ey + 26;
    if (dir === 'right') { lx = 600; ly = y - 46; anchor = 'end'; }
    if (dir === 'left') { lx = 20; ly = y - 46; anchor = 'start'; }

    return '<line x1="' + x + '" y1="' + y + '" x2="' + ex + '" y2="' + ey + '" stroke="' + colour +
      '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="' + head + '" fill="' + colour + '"/>' +
      '<text x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '" font-family="Nunito,sans-serif" ' +
      'font-size="12.5" font-weight="800" fill="' + colour + '">' + label + '</text>';
  }

  /* =======================================================================
     STATION 2 - Aerofoil & Bernoulli
     ======================================================================= */

  var foil = { camber: 6, alpha: 5 };

  function renderFoil(host) {
    host.innerHTML =
      '<p class="g6-note"><strong>Bernoulli\'s principle:</strong> where air moves faster, ' +
        'its pressure drops. A wing is curved more on top than underneath, so air over the ' +
        'upper surface has further to travel, speeds up, and its pressure falls. Higher ' +
        'pressure underneath then pushes the wing upward. That push is <strong>lift</strong>.</p>' +
      '<div class="g6-lab-grid">' +
        '<div class="g6-canvas"><svg id="fly-foil-svg" viewBox="0 0 620 320" role="img" ' +
          'aria-label="Cross-section of a wing with streamlines and pressure"></svg></div>' +
        '<div class="g6-controls">' +
          slider('foil-camber', 'Upper surface curve (camber)', foil.camber, 0, 14, 1, '%') +
          slider('foil-alpha', 'Angle of attack', foil.alpha, -4, 20, 1, 'degrees') +
          '<div class="g6-readout">' +
            stat('foil-upper', 'Speed over top') + stat('foil-lower', 'Speed underneath') +
            stat('foil-dp', 'Pressure difference') + stat('foil-lift', 'Lift produced') +
          '</div>' +
          '<p class="g6-note" id="foil-verdict"></p>' +
        '</div>' +
      '</div>';

    bind('foil-camber', function (v) { foil.camber = v; updateFoil(); });
    bind('foil-alpha', function (v) { foil.alpha = v; updateFoil(); });
    updateFoil();
  }

  function updateFoil() {
    var base = 240;                                   // km/h of the free stream
    var cl = liftCoefficient(foil.alpha) + foil.camber * 0.055;
    var stalled = foil.alpha > 15;
    if (stalled) cl = Math.max(cl * 0.45, 0.1);

    var upper = base * (1 + 0.055 * foil.camber + 0.019 * Math.max(foil.alpha, 0));
    var lower = base * (1 - 0.012 * foil.camber - 0.006 * Math.max(foil.alpha, 0));
    if (stalled) upper = base * 0.92;

    // Bernoulli, in the form 0.5 * rho * (v_lower^2 - v_upper^2), reported in kPa.
    var vu = upper / 3.6, vl = lower / 3.6;
    var dp = 0.5 * 1.225 * (vu * vu - vl * vl) / 1000;
    var lift = 0.5 * 1.225 * Math.pow(base / 3.6, 2) * WING_AREA * cl / 1000;

    setStat('foil-upper', upper.toFixed(0) + ' km/h', 'good');
    setStat('foil-lower', lower.toFixed(0) + ' km/h', '');
    setStat('foil-dp', dp.toFixed(2) + ' kPa', stalled ? 'bad' : 'good');
    setStat('foil-lift', Math.max(lift, 0).toFixed(0) + ' kN', stalled ? 'bad' : 'good');

    var verdict = document.getElementById('foil-verdict');
    verdict.className = 'g6-note' + (stalled ? ' g6-note--warn' : '');
    verdict.innerHTML = stalled
      ? 'Past <strong>15 degrees</strong> the air cannot stay attached to the upper surface. ' +
        'The streamlines break away into turbulence, the speed difference disappears, and the ' +
        'wing <strong>stalls</strong>. More angle is not always more lift.'
      : foil.camber === 0
        ? 'With <strong>zero camber</strong> this is a flat plate. It can still make lift by ' +
          'deflecting air downward at an angle, which is why a paper aeroplane flies, but it is ' +
          'far less efficient than a curved wing.'
        : 'Air over the top is travelling <strong>' + (upper - lower).toFixed(0) +
          ' km/h faster</strong> than the air underneath. That speed gap is what creates the ' +
          'pressure difference of <strong>' + dp.toFixed(2) + ' kPa</strong> holding the aircraft up.';

    drawFoil(stalled);
  }

  function drawFoil(stalled) {
    var svg = document.getElementById('fly-foil-svg');
    if (!svg) return;
    var cx = 310, cy = 168, chord = 250, c = foil.camber;
    var s = '<rect width="620" height="320" fill="#f8fafc"/>';

    // Streamlines. They bunch up over the curved top: closer lines = faster air.
    s += '<g fill="none" stroke-linecap="round">';
    for (var i = 0; i < 7; i++) {
      var offset = -78 + i * 26;
      var over = offset < 0;
      // Lines above the wing get pulled toward it, and pinched more with camber.
      var squeeze = over ? (1 - Math.abs(offset) / 100) * (c * 1.5 + foil.alpha * 0.8) : 0;
      var y0 = cy + offset;
      var yMid = y0 - squeeze * (over ? 1 : 0) + (over ? 0 : c * 0.25);
      var colour = over ? '#0891b2' : '#94a3b8';
      var width = over ? 2.6 : 2;
      if (stalled && over && Math.abs(offset) < 60) {
        // Separated flow: a ragged wake instead of a clean line.
        s += '<path d="M20 ' + y0 + ' L' + (cx - 60) + ' ' + (yMid - 4) +
          ' l16 -9 l14 16 l16 -14 l15 13 l17 -11 l18 12 l20 -8" stroke="#ef4444" stroke-width="2.4"/>';
        continue;
      }
      s += '<path d="M20 ' + y0 + ' C' + (cx - 110) + ' ' + y0 + ', ' + (cx - 60) + ' ' + yMid +
        ', ' + cx + ' ' + yMid + ' S' + (cx + 120) + ' ' + y0 + ', 600 ' + y0 +
        '" stroke="' + colour + '" stroke-width="' + width + '"/>';
    }
    s += '</g>';

    // The aerofoil itself, tilted to the angle of attack.
    var half = chord / 2;
    var top = 'M' + (cx - half) + ' ' + cy +
      ' C' + (cx - half + 40) + ' ' + (cy - 16 - c * 2.4) + ', ' + (cx + 30) + ' ' + (cy - 12 - c * 2.6) +
      ', ' + (cx + half) + ' ' + cy;
    var bottom = ' C' + (cx + 30) + ' ' + (cy + 8 + c * 0.35) + ', ' + (cx - half + 40) + ' ' +
      (cy + 12 + c * 0.3) + ', ' + (cx - half) + ' ' + cy + ' Z';
    s += '<g transform="rotate(' + (-foil.alpha) + ' ' + cx + ' ' + cy + ')">';
    s += '<path d="' + top + bottom + '" fill="#334155"/>';
    s += '<path d="' + top + '" fill="none" stroke="#06b6d4" stroke-width="3"/>';
    s += '</g>';

    // Pressure marks: minus above (low pressure), plus below (high pressure).
    var pressure = stalled ? 2 : Math.max(2, Math.round(3 + c * 0.5 + Math.max(foil.alpha, 0) * 0.3));
    for (var p = 0; p < pressure; p++) {
      var px = cx - 96 + p * (192 / Math.max(pressure - 1, 1));
      // Drawn as bars rather than text: a hyphen glyph rendered almost
      // invisibly next to the bold red plus signs.
      var my = cy - 50 - c * 1.6;
      s += '<rect x="' + (px - 8) + '" y="' + (my - 2.5) + '" width="16" height="5" rx="2.5" ' +
        'fill="#0891b2"/>';
      var py2 = cy + 60;
      s += '<rect x="' + (px - 8) + '" y="' + (py2 - 2.5) + '" width="16" height="5" rx="2.5" fill="#ef4444"/>';
      s += '<rect x="' + (px - 2.5) + '" y="' + (py2 - 8) + '" width="5" height="16" rx="2.5" fill="#ef4444"/>';
    }

    s += '<text x="24" y="26" font-family="Nunito,sans-serif" font-size="11.5" font-weight="800" ' +
      'fill="#0891b2">FASTER AIR, LOWER PRESSURE</text>';
    s += '<text x="24" y="300" font-family="Nunito,sans-serif" font-size="11.5" font-weight="800" ' +
      'fill="#ef4444">SLOWER AIR, HIGHER PRESSURE</text>';
    if (!stalled) {
      s += arrow(cx, cy - 96 - c * 1.4, 0, -34, '#10b981', 'Net upward push = LIFT', 'up');
    }
    svg.innerHTML = s;
  }

  /* =======================================================================
     STATION 3 - Wings Compared
     ======================================================================= */

  var FLYERS = [
    {
      id: 'monarch', name: 'Monarch butterfly', kind: 'Insect',
      massKg: 0.0005, spanM: 0.10, areaM2: 0.0011,
      note: 'Enormous wing area for almost no mass, so it can glide on rising air all the way ' +
        'from Ontario to Mexico, 4 000 km, on a body lighter than a paper clip.'
    },
    {
      id: 'bat', name: 'Little brown bat', kind: 'Mammal',
      massKg: 0.008, spanM: 0.24, areaM2: 0.012,
      note: 'Its wing is a skin membrane stretched over long finger bones. It can change the ' +
        'wing shape mid-beat, giving it turning ability no aircraft can match.'
    },
    {
      id: 'goose', name: 'Canada goose', kind: 'Bird',
      massKg: 4.5, spanM: 1.6, areaM2: 0.22,
      note: 'Hollow bones, overlapping feathers and a strong keel bone for flight muscles. ' +
        'Flying in a V lets each bird ride the upwash of the one ahead, saving energy.'
    },
    {
      id: 'cl415', name: 'Canadair CL-415 water bomber', kind: 'Aircraft',
      massKg: 19890, spanM: 28.6, areaM2: 100.3,
      note: 'Built in Canada to scoop 6 137 L of water in 12 seconds. Big wings and low wing ' +
        'loading let it fly slowly and safely over a forest fire.'
    },
    {
      id: 'dash8', name: 'de Havilland Dash 8 Q400', kind: 'Aircraft',
      massKg: 29257, spanM: 28.4, areaM2: 63.1,
      note: 'A Canadian regional airliner. Higher wing loading than the water bomber, so it ' +
        'cruises faster at 667 km/h but needs a longer runway.'
    }
  ];

  var flyerId = 'goose';

  function renderFlyers(host) {
    var chips = '';
    for (var i = 0; i < FLYERS.length; i++) {
      chips += '<button type="button" class="g6-chip' + (FLYERS[i].id === flyerId ? ' active' : '') +
        '" data-flyer="' + FLYERS[i].id + '">' + FLYERS[i].name + '</button>';
    }

    host.innerHTML =
      '<p class="g6-note"><strong>Wing loading</strong> is the weight each square metre of wing ' +
        'has to carry: <code>wing loading = weight / wing area</code>. Low wing loading means ' +
        'slow, gentle, gliding flight. High wing loading means fast flight and a long runway. ' +
        'It is the single number that explains why a butterfly and an airliner fly so differently.</p>' +
      '<div class="g6-chips" style="margin-bottom:18px">' + chips + '</div>' +
      '<div class="g6-canvas"><svg id="fly-flyer-svg" viewBox="0 0 620 300" role="img" ' +
        'aria-label="Wing loading compared across five flyers"></svg></div>' +
      '<div class="g6-readout" style="margin-top:16px">' +
        stat('flyer-mass', 'Mass') + stat('flyer-span', 'Wingspan') +
        stat('flyer-area', 'Wing area') + stat('flyer-load', 'Wing loading') +
      '</div>' +
      '<p class="g6-note" id="flyer-note" style="margin-top:16px"></p>';

    host.querySelectorAll('[data-flyer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        flyerId = btn.getAttribute('data-flyer');
        host.querySelectorAll('[data-flyer]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        updateFlyer();
      });
    });
    updateFlyer();
  }

  function loadingOf(f) { return f.massKg * GRAVITY / f.areaM2; }

  function updateFlyer() {
    var f = null;
    for (var i = 0; i < FLYERS.length; i++) if (FLYERS[i].id === flyerId) f = FLYERS[i];
    if (!f) return;

    setStat('flyer-mass', f.massKg < 1 ? (f.massKg * 1000).toFixed(1) + ' g' : f.massKg.toLocaleString('en-CA') + ' kg', '');
    setStat('flyer-span', f.spanM < 1 ? (f.spanM * 100).toFixed(0) + ' cm' : f.spanM.toFixed(1) + ' m', '');
    setStat('flyer-area', f.areaM2 < 1 ? (f.areaM2 * 10000).toFixed(0) + ' cm2' : f.areaM2.toFixed(1) + ' m2', '');
    var load = loadingOf(f);
    setStat('flyer-load', load.toFixed(1) + ' N/m2', load < 50 ? 'good' : load > 1500 ? 'bad' : 'warn');

    document.getElementById('flyer-note').innerHTML =
      '<strong>' + f.name + ' (' + f.kind + ').</strong> ' + f.note;

    drawFlyers();
  }

  function drawFlyers() {
    var svg = document.getElementById('fly-flyer-svg');
    if (!svg) return;
    var baseY = 230, maxH = 176, slot = 116, left = 46;
    // Wing loading spans four orders of magnitude, so the axis is logarithmic.
    var s = '<rect width="620" height="300" fill="#f8fafc"/>';
    s += '<text x="24" y="24" font-family="Nunito,sans-serif" font-size="11" font-weight="800" ' +
      'fill="#94a3b8">WING LOADING IN N/m2 (logarithmic scale)</text>';

    for (var i = 0; i < FLYERS.length; i++) {
      var f = FLYERS[i];
      var load = loadingOf(f);
      var h = Math.max(10, (Math.log(load) / Math.log(10) + 1) / 5 * maxH);
      var x = left + i * slot;
      var on = f.id === flyerId;

      s += '<rect x="' + x + '" y="' + (baseY - h) + '" width="66" height="' + h + '" rx="8" fill="' +
        (on ? '#06b6d4' : '#cbd5e1') + '"/>';
      s += '<text x="' + (x + 33) + '" y="' + (baseY - h - 8) + '" text-anchor="middle" ' +
        'font-family="Space Mono,monospace" font-size="12" font-weight="700" fill="' +
        (on ? '#0e7490' : '#94a3b8') + '">' + load.toFixed(0) + '</text>';
      s += '<text x="' + (x + 33) + '" y="' + (baseY + 20) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="10.5" font-weight="800" fill="' +
        (on ? '#334155' : '#94a3b8') + '">' + wrapLabel(f.name) + '</text>';
      s += '<text x="' + (x + 33) + '" y="' + (baseY + 34) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="9.5" fill="#94a3b8">' + f.kind + '</text>';
    }

    s += '<line x1="30" y1="' + baseY + '" x2="600" y2="' + baseY + '" stroke="#334155" stroke-width="2"/>';
    s += '<text x="30" y="' + (baseY + 58) + '" font-family="Nunito,sans-serif" font-size="10.5" ' +
      'fill="#94a3b8">Left: light, slow, highly manoeuvrable. Right: heavy, fast, needs a runway.</text>';
    svg.innerHTML = s;
  }

  function wrapLabel(name) {
    return name.length > 15 ? name.split(' ')[0] + ' ' + (name.split(' ')[1] || '') : name;
  }

  /* =======================================================================
     Registration
     ======================================================================= */

  SFG6.register({
    id: 'flight',
    tabLabel: 'Flight',
    icon: 'plane',
    strandTag: 'STRAND D - STRUCTURES AND MECHANISMS',
    title: 'Flight, Aerodynamics & the Four Forces',
    intro: 'Air is not nothing. It has <strong>mass</strong>, it takes up <strong>space</strong>, ' +
      'it can be <strong>compressed</strong>, and it exerts <strong>pressure</strong>. Every ' +
      'flying machine and every flying animal works by pushing that air around. Balance the four ' +
      'forces on a Canadian Dash 8, reshape a wing until it stalls, then see why a monarch ' +
      'butterfly and a water bomber fly so differently.',
    expectations: [
      'D1. assess the environmental impacts of flying machines',
      'D2. demonstrate an understanding of the ways in which properties of air can be applied to the principles of flight and flying machines'
    ],
    badgeId: 'flight_engineer',
    badgeName: 'Flight Engineer',
    stations: [
      {
        id: 'forces', label: 'Four Forces Deck', icon: 'plane',
        tag: 'FORCE BALANCE SIMULATOR',
        title: 'Station 1: Balance Lift, Weight, Thrust and Drag',
        blurb: 'Every arrow below is drawn to scale from the real lift equation. Move a slider and watch the aircraft climb, accelerate, slow or stall.',
        render: renderDeck
      },
      {
        id: 'aerofoil', label: 'Aerofoil & Bernoulli', icon: 'chartLine',
        tag: 'WIND TUNNEL',
        title: 'Station 2: Shape a Wing and Watch the Pressure Change',
        blurb: 'Add camber, raise the nose, and watch the streamlines crowd together over the top of the wing until the airflow finally breaks away.',
        render: renderFoil
      },
      {
        id: 'wings', label: 'Wings Compared', icon: 'species',
        tag: 'ADAPTATION LAB',
        title: 'Station 3: Butterfly, Bat, Goose, Water Bomber',
        blurb: 'Living things and machines solve the same problem with the same physics. Compare their wing loading on one logarithmic scale.',
        render: renderFlyers
      }
    ],
    tiers: [
      {
        name: 'Ontario Core',
        desc: 'The Grade 6 benchmark: the four forces, the properties of air and how a wing works.',
        xp: 10,
        questions: [
          {
            q: 'Which force <strong>opposes weight</strong> and holds an aircraft up?',
            options: ['Thrust', 'Drag', 'Lift', 'Friction'],
            ans: 2,
            hint: 'The four forces work in two opposing pairs. Weight pulls down, so its partner pushes up.',
            solution: [
              'The four forces of flight are lift, weight, thrust and drag.',
              'They act in two opposing pairs: <strong>lift against weight</strong>, and thrust against drag.',
              'Thrust pushes forward and drag pulls backward, so neither of those opposes weight.',
              'Weight is gravity pulling the aircraft down, so the force pushing it up is <strong>lift</strong>.'
            ]
          },
          {
            q: 'Which statement about air is <strong>false</strong>?',
            options: [
              'Air has mass',
              'Air takes up space',
              'Air can be compressed',
              'Air has no pressure'
            ],
            ans: 3,
            hint: 'Three of these are the properties of air that make flight possible. One contradicts a weather forecast.',
            solution: [
              'Air genuinely has mass: the air in an average classroom masses roughly 60 kg.',
              'Air takes up space, which is why an inflated basketball is firm.',
              'Air can be compressed, which is how a bicycle pump works.',
              'Air pressure at sea level is about <code>101 kPa</code>, and it is reported in every weather forecast, so <strong>"air has no pressure"</strong> is the false statement.'
            ]
          },
          {
            q: 'On a wing, the upper surface is more curved than the lower surface. According to Bernoulli\'s principle, the air over the top moves:',
            options: [
              'faster, so its pressure is lower',
              'faster, so its pressure is higher',
              'slower, so its pressure is lower',
              'slower, so its pressure is higher'
            ],
            ans: 0,
            hint: 'Faster-moving air always has lower pressure. That is the whole of Bernoulli in one sentence.',
            solution: [
              'The curved upper surface gives the air a longer path, so it must travel <strong>faster</strong>.',
              'Bernoulli\'s principle says that where a fluid speeds up, its pressure <strong>drops</strong>.',
              'So there is lower pressure above the wing and higher pressure below it.',
              'The higher pressure underneath pushes the wing upward, producing lift: <strong>faster, so its pressure is lower</strong>.'
            ]
          },
          {
            q: 'A Dash 8 is flying straight and level at a steady 560 km/h. What must be true?',
            options: [
              'Lift is greater than weight and thrust is greater than drag',
              'Lift equals weight and thrust equals drag',
              'All four forces are zero',
              'Lift equals thrust and weight equals drag'
            ],
            ans: 1,
            hint: 'Straight means no climbing or diving. Level speed means no speeding up or slowing down.',
            solution: [
              'Flying <strong>level</strong> means the vertical forces are balanced, so lift equals weight.',
              'Flying at a <strong>steady speed</strong> means the horizontal forces are balanced, so thrust equals drag.',
              'The forces are not zero, they are equal and opposite, which is what balanced means.',
              'Lift never pairs with thrust, so the answer is <strong>lift equals weight and thrust equals drag</strong>.'
            ]
          },
          {
            q: 'Which adaptation helps a Canada goose fly that an aircraft copies with a different material?',
            options: [
              'Hollow, lightweight bones that reduce weight',
              'Feathers that grow back each year',
              'A warm-blooded body temperature',
              'The ability to eat grass'
            ],
            ans: 0,
            hint: 'Look for the one that solves a flight problem, and think what force it reduces.',
            solution: [
              'Every flying thing has the same problem: <strong>weight</strong> must be kept as low as possible.',
              'A goose solves it with <strong>hollow bones</strong> that are strong but very light.',
              'Aircraft solve the same problem with aluminium and carbon fibre instead of solid steel.',
              'Regrowing feathers, being warm-blooded and eating grass do not reduce weight, so the answer is <strong>hollow, lightweight bones that reduce weight</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Enriched Deep Thinker',
        desc: 'Predict motion from unbalanced force pairs, and reason about stalls and altitude.',
        xp: 15,
        questions: [
          {
            q: 'An aircraft has lift <code>310 kN</code>, weight <code>287 kN</code>, thrust <code>40 kN</code> and drag <code>46 kN</code>. What is it doing?',
            options: [
              'Climbing and slowing down',
              'Climbing and speeding up',
              'Descending and slowing down',
              'Descending and speeding up'
            ],
            ans: 0,
            hint: 'Work out each pair separately. Subtract, and see which force in the pair wins.',
            solution: [
              'Vertical pair: <code>310 - 287 = 23 kN</code> upward, so lift wins and the aircraft <strong>climbs</strong>.',
              'Horizontal pair: <code>40 - 46 = -6 kN</code>, so drag wins and the aircraft <strong>slows down</strong>.',
              'Both pairs are unbalanced, and they point in different directions.',
              'The answer is <strong>climbing and slowing down</strong>, which is exactly what happens if you pull the nose up without adding power.'
            ]
          },
          {
            q: 'A pilot keeps raising the nose to get more lift. Past about <strong>15 degrees</strong> the lift suddenly collapses. Why?',
            options: [
              'The engines run out of fuel',
              'Air stops flowing smoothly over the wing and separates into turbulence',
              'Gravity increases at higher angles',
              'The wings become heavier'
            ],
            ans: 1,
            hint: 'Watch the streamlines in Station 2 as you push past 15 degrees.',
            solution: [
              'Up to about 15 degrees, air follows the curved upper surface smoothly and speeds up, making lift.',
              'Past that critical angle the air can no longer stay attached and <strong>separates</strong> into turbulence.',
              'With no smooth fast flow there is no low-pressure region, so lift falls away sharply.',
              'This is called a <strong>stall</strong>, so the answer is <strong>air stops flowing smoothly over the wing and separates into turbulence</strong>.'
            ]
          },
          {
            q: 'At <code>11 km</code> altitude the air is about <strong>one quarter</strong> as dense as at sea level. To make the <strong>same lift</strong> at that height, an aircraft must:',
            options: [
              'fly slower',
              'fly faster or use a bigger angle of attack',
              'make its wings smaller',
              'nothing changes'
            ],
            ans: 1,
            hint: 'Lift depends on how much air the wing meets each second. Thin air means less air per second.',
            solution: [
              'Lift comes from pushing air downward. Thin air means <strong>fewer air molecules</strong> hitting the wing each second.',
              'To restore the same lift the wing must either meet the air <strong>faster</strong>, or deflect it more steeply.',
              'That is why airliners cruise at 800 to 900 km/h up high but land at only about 250 km/h.',
              'The answer is <strong>fly faster or use a bigger angle of attack</strong>.'
            ]
          },
          {
            q: 'A monarch butterfly has a wing loading near <code>4 N/m2</code>; a Dash 8 is near <code>4 550 N/m2</code>. What does this predict?',
            options: [
              'The butterfly is stronger than the aircraft',
              'The butterfly can fly slowly and turn tightly; the aircraft must fly fast',
              'The aircraft can hover',
              'They fly at the same speed'
            ],
            ans: 1,
            hint: 'Wing loading is weight per square metre of wing. What does carrying less per square metre let you do?',
            solution: [
              'Wing loading is <code>weight / wing area</code>: how much each square metre of wing must hold up.',
              'Low wing loading means the wing makes enough lift even at very <strong>low speed</strong>.',
              'High wing loading means the wing only makes enough lift when the air rushes past <strong>fast</strong>.',
              'So the answer is <strong>the butterfly can fly slowly and turn tightly; the aircraft must fly fast</strong>.'
            ]
          },
          {
            q: 'Assessing the environmental impact of aviation, which action would <strong>most</strong> reduce the carbon emitted per passenger on a Toronto to Vancouver flight?',
            options: [
              'Painting the aircraft a lighter colour',
              'Flying the route with a full aircraft instead of a half-empty one',
              'Serving fewer meals on board',
              'Flying at a lower altitude'
            ],
            ans: 1,
            hint: 'The fuel burn barely changes with how many people are aboard. So what changes the share each person carries?',
            solution: [
              'An aircraft burns nearly the same fuel whether it is half full or completely full.',
              'Emissions <strong>per passenger</strong> are total emissions divided by the number of passengers.',
              'Doubling the passengers on the same flight roughly <strong>halves</strong> each person\'s share.',
              'Paint and meals are negligible, and lower altitude means denser air and <em>more</em> drag, so the answer is <strong>flying the route with a full aircraft instead of a half-empty one</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Waterloo CEMC Challenge',
        desc: 'Contest-style: ratios, scaling laws and multi-step fuel arithmetic.',
        xp: 25,
        questions: [
          {
            q: 'Lift is proportional to the <strong>square</strong> of airspeed. A wing makes <code>120 kN</code> of lift at <code>300 km/h</code>. How much lift does it make at <code>450 km/h</code>, with everything else unchanged?',
            options: ['<code>180 kN</code>', '<code>240 kN</code>', '<code>270 kN</code>', '<code>360 kN</code>'],
            ans: 2,
            hint: 'Find the speed ratio first, then square it before multiplying.',
            solution: [
              'Speed ratio: <code>450 / 300 = 1.5</code>.',
              'Lift goes with speed <strong>squared</strong>, so the lift ratio is <code>1.5^2 = 2.25</code>.',
              'New lift: <code>120 x 2.25 = 270 kN</code>.',
              'The answer is <strong>270 kN</strong>. Half again the speed gives more than double the lift.'
            ]
          },
          {
            q: 'A water bomber scoops <code>6 000 L</code> of water. Water has a mass of <code>1 kg</code> per litre. Using <code>g = 10 N/kg</code>, by how much does the aircraft\'s <strong>weight</strong> increase?',
            options: ['<code>6 000 N</code>', '<code>60 000 N</code>', '<code>600 N</code>', '<code>600 000 N</code>'],
            ans: 1,
            hint: 'First find the added mass in kilograms, then convert mass to weight with W = mg.',
            solution: [
              'Added mass: <code>6 000 L x 1 kg/L = 6 000 kg</code>.',
              'Weight is mass times gravitational field strength: <code>W = m x g</code>.',
              '<code>W = 6 000 kg x 10 N/kg = 60 000 N</code>.',
              'The answer is <strong>60 000 N</strong>, which is 60 kN of extra lift the wings must find.'
            ]
          },
          {
            q: 'Aircraft P has a lift-to-drag ratio of <code>16</code>; aircraft Q has <code>12</code>. Both weigh <code>240 kN</code> and fly level. How much <strong>more thrust</strong> does Q need than P?',
            options: ['<code>4 kN</code>', '<code>5 kN</code>', '<code>15 kN</code>', '<code>20 kN</code>'],
            ans: 1,
            hint: 'In level flight lift equals weight, and thrust equals drag. So drag = weight / (L/D).',
            solution: [
              'Level flight means <code>lift = weight = 240 kN</code> for both aircraft.',
              'Aircraft P: <code>drag = 240 / 16 = 15 kN</code>, so it needs 15 kN of thrust.',
              'Aircraft Q: <code>drag = 240 / 12 = 20 kN</code>, so it needs 20 kN of thrust.',
              'Difference: <code>20 - 15 = 5 kN</code>. The answer is <strong>5 kN</strong>.'
            ]
          },
          {
            q: 'A glider descends <code>1 m</code> for every <code>40 m</code> it travels forward. Released at <code>2 400 m</code> over Ontario in still air, how far can it glide?',
            options: ['<code>60 km</code>', '<code>96 km</code>', '<code>24 km</code>', '<code>40 km</code>'],
            ans: 1,
            hint: 'A 40:1 glide ratio means forward distance is 40 times the height lost. Watch your units at the end.',
            solution: [
              'The glide ratio is <code>40 m forward : 1 m down</code>.',
              'Total forward distance: <code>2 400 m x 40 = 96 000 m</code>.',
              'Convert to kilometres: <code>96 000 m = 96 km</code>.',
              'The answer is <strong>96 km</strong>, roughly Toronto to Kitchener without an engine.'
            ]
          },
          {
            q: 'A flight burns <code>5 400 kg</code> of fuel and carries <code>72</code> passengers. A newer aircraft burns <code>18%</code> less fuel and carries <code>90</code> passengers on the same route. What is the drop in fuel <strong>per passenger</strong>?',
            options: ['<code>18%</code>', '<code>25%</code>', '<code>34.4%</code>', '<code>42%</code>'],
            ans: 2,
            hint: 'Work out kg per passenger for each aircraft separately, then compare the two numbers.',
            solution: [
              'Old aircraft: <code>5 400 / 72 = 75 kg</code> of fuel per passenger.',
              'New fuel burn: <code>5 400 x 0.82 = 4 428 kg</code>.',
              'New aircraft: <code>4 428 / 90 = 49.2 kg</code> per passenger.',
              'Drop: <code>(75 - 49.2) / 75 = 25.8 / 75 = 0.344 = 34.4%</code>. The answer is <strong>34.4%</strong>.'
            ]
          }
        ]
      }
    ]
  });
})(window);
