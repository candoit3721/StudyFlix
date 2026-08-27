/**
 * StudyFlix - Grade 6 Ontario Strand E: Earth and Space Systems, Space
 * ---------------------------------------------------------------------------
 * E1. assess the impact of space exploration on humans, society, and the
 *     environment
 * E2. demonstrate an understanding of the solar system, the phenomena that
 *     result from the movement of different bodies within it, and the
 *     technologies used in space exploration
 *
 * Stations:
 *   1. Orbit Simulator     - eight planets at their true relative periods
 *   2. Axial Tilt & Seasons - why 23.5 degrees, not distance, makes winter
 *   3. Mass vs Weight       - the same kilograms, eight different newton readings
 *
 * The seasons station computes the solar declination and Toronto's day length
 * from the real astronomical formulae, so the numbers on screen match a
 * Canadian almanac rather than being decoration.
 */
(function (global) {
  'use strict';

  var ui = SFG6.ui;
  var slider = ui.slider, bind = ui.bind, stat = ui.stat, setStat = ui.setStat;
  var esc = ui.svgText;

  var TORONTO_LAT = 43.7;

  /* =======================================================================
     Solar system data. Distances in millions of km, periods in Earth days.
     ======================================================================= */

  var PLANETS = [
    {
      id: 'mercury', name: 'Mercury', colour: '#a8a29e', r: 5,
      diameterKm: 4879, periodDays: 88, rotationHours: 1408, distMkm: 57.9,
      gravity: 3.7, moons: 0, tempC: '-173 to 427',
      fact: 'Closest to the Sun and the fastest orbit of all. One Mercury year is only 88 Earth days, but a single day-night cycle lasts 176 Earth days.'
    },
    {
      id: 'venus', name: 'Venus', colour: '#fbbf24', r: 8,
      diameterKm: 12104, periodDays: 225, rotationHours: 5832, distMkm: 108.2,
      gravity: 8.9, moons: 0, tempC: '464',
      fact: 'Hotter than Mercury even though it is further out, because a thick carbon dioxide atmosphere traps heat. It also spins backwards.'
    },
    {
      id: 'earth', name: 'Earth', colour: '#3b82f6', r: 8.5,
      diameterKm: 12756, periodDays: 365.25, rotationHours: 24, distMkm: 149.6,
      gravity: 9.81, moons: 1, tempC: '-89 to 57',
      fact: 'The only world known to have liquid surface water and life. Its 23.5 degree axial tilt is what gives Canada four distinct seasons.'
    },
    {
      id: 'mars', name: 'Mars', colour: '#ef4444', r: 6,
      diameterKm: 6792, periodDays: 687, rotationHours: 24.6, distMkm: 227.9,
      gravity: 3.7, moons: 2, tempC: '-140 to 20',
      fact: 'A Martian day is almost exactly as long as ours. Canadian instruments have flown on Mars landers to study its weather and dust.'
    },
    {
      id: 'jupiter', name: 'Jupiter', colour: '#d97706', r: 20,
      diameterKm: 142984, periodDays: 4333, rotationHours: 9.9, distMkm: 778.6,
      gravity: 24.8, moons: 95, tempC: '-108',
      fact: 'The largest planet, a gas giant with no solid surface. Its Great Red Spot is a storm wider than Earth that has raged for centuries.'
    },
    {
      id: 'saturn', name: 'Saturn', colour: '#facc15', r: 17,
      diameterKm: 120536, periodDays: 10759, rotationHours: 10.7, distMkm: 1433.5,
      gravity: 10.4, moons: 146, tempC: '-138',
      fact: 'Famous for rings made of billions of pieces of ice and rock. Saturn is so low in density that it would float in a big enough ocean.'
    },
    {
      id: 'uranus', name: 'Uranus', colour: '#67e8f9', r: 12,
      diameterKm: 51118, periodDays: 30687, rotationHours: 17.2, distMkm: 2872.5,
      gravity: 8.9, moons: 28, tempC: '-195',
      fact: 'An ice giant tipped right over on its side, rolling around the Sun at a tilt of 98 degrees. Each pole gets 42 years of sunlight, then 42 of darkness.'
    },
    {
      id: 'neptune', name: 'Neptune', colour: '#2563eb', r: 12,
      diameterKm: 49528, periodDays: 60190, rotationHours: 16.1, distMkm: 4495.1,
      gravity: 11.2, moons: 16, tempC: '-201',
      fact: 'The windiest world in the solar system, with storms above 2 000 km/h. It takes almost 165 Earth years to complete one orbit.'
    }
  ];

  var SMALL_BODIES = [
    { name: 'Comet', what: 'Ice, dust and rock. Near the Sun it heats up and grows a glowing tail that always points AWAY from the Sun.' },
    { name: 'Asteroid', what: 'Rock and metal, mostly orbiting in the asteroid belt between Mars and Jupiter. Too small to be a planet.' },
    { name: 'Meteoroid', what: 'A small chunk of rock in space. It becomes a METEOR (shooting star) while burning in the atmosphere, and a METEORITE if it lands.' },
    { name: 'Natural satellite', what: 'A moon: any body in orbit around a planet. Earth has 1, Saturn has 146.' }
  ];

  /* =======================================================================
     STATION 1 - Orbit Simulator
     ======================================================================= */

  var orbit = { t: 0, speed: 6, running: true, selected: 'earth', raf: null };

  function renderOrbit(host) {
    var chips = '';
    for (var i = 0; i < PLANETS.length; i++) {
      chips += '<button type="button" class="g6-chip' + (PLANETS[i].id === orbit.selected ? ' active' : '') +
        '" data-planet="' + PLANETS[i].id + '">' + PLANETS[i].name + '</button>';
    }

    host.innerHTML =
      '<p class="g6-note">Every planet orbits the Sun, but the further out it is, the slower it ' +
        'travels and the longer its year. Watch Mercury lap the inner solar system while Neptune ' +
        'barely moves. <strong>Orbit sizes here are compressed so all eight fit on one screen; ' +
        'the orbital periods are the real ones.</strong></p>' +
      '<div class="g6-lab-grid">' +
        '<div>' +
          '<div class="g6-canvas g6-canvas--night"><svg id="spc-orbit-svg" viewBox="0 0 480 480" ' +
            'role="img" aria-label="The eight planets orbiting the Sun"></svg></div>' +
          '<div class="g6-chips" style="margin-top:14px">' +
            '<button type="button" class="g6-chip active" id="spc-orbit-play">Pause</button>' +
            '<button type="button" class="g6-chip" id="spc-orbit-reset">Reset to day 0</button>' +
          '</div>' +
        '</div>' +
        '<div class="g6-controls">' +
          slider('spc-speed', 'Simulation speed', orbit.speed, 1, 40, 1, 'days/frame') +
          '<div class="g6-chips">' + chips + '</div>' +
          '<div id="spc-planet-card"></div>' +
          '<div class="g6-stat"><span class="g6-stat-label">Elapsed</span>' +
            '<span class="g6-stat-value" id="spc-elapsed">0 days</span></div>' +
        '</div>' +
      '</div>' +
      '<h4 class="spc-subhead">The smaller bodies of the solar system</h4>' +
      '<table class="g6-table"><thead><tr><th>Body</th><th>What it is</th></tr></thead><tbody>' +
        SMALL_BODIES.map(function (b) {
          return '<tr><td><strong>' + b.name + '</strong></td><td>' + b.what + '</td></tr>';
        }).join('') +
      '</tbody></table>';

    bind('spc-speed', function (v) { orbit.speed = v; });
    host.querySelectorAll('[data-planet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        orbit.selected = btn.getAttribute('data-planet');
        host.querySelectorAll('[data-planet]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        showPlanetCard();
        drawOrbit();
      });
    });

    document.getElementById('spc-orbit-play').addEventListener('click', function () {
      orbit.running = !orbit.running;
      this.textContent = orbit.running ? 'Pause' : 'Play';
      this.classList.toggle('active', orbit.running);
      if (orbit.running) tickOrbit();
    });
    document.getElementById('spc-orbit-reset').addEventListener('click', function () {
      orbit.t = 0;
      drawOrbit();
      document.getElementById('spc-elapsed').textContent = '0 days';
    });

    showPlanetCard();
    tickOrbit();
  }

  function tickOrbit() {
    if (orbit.raf) cancelAnimationFrame(orbit.raf);
    function frame() {
      if (!document.getElementById('spc-orbit-svg')) return;
      if (orbit.running) {
        orbit.t += orbit.speed;
        drawOrbit();
        var years = orbit.t / 365.25;
        document.getElementById('spc-elapsed').textContent =
          orbit.t < 730
            ? Math.round(orbit.t) + ' days'
            : years.toFixed(1) + ' Earth years';
      }
      orbit.raf = requestAnimationFrame(frame);
    }
    orbit.raf = requestAnimationFrame(frame);
  }

  function drawOrbit() {
    var svg = document.getElementById('spc-orbit-svg');
    if (!svg) return;
    var cx = 240, cy = 240;
    var s = '<rect width="480" height="480" fill="#0b1220"/>';

    for (var st = 0; st < 70; st++) {
      var sx = (st * 137) % 480, sy = (st * 79) % 480;
      s += '<circle cx="' + sx + '" cy="' + sy + '" r="' + (st % 4 === 0 ? 1.4 : 0.8) +
        '" fill="#e2e8f0" opacity="0.5"/>';
    }

    s += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="#f59e0b" opacity="0.22"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="17" fill="#fbbf24"/>';
    s += '<text x="' + cx + '" y="' + (cy + 44) + '" text-anchor="middle" ' +
      'font-family="Nunito,sans-serif" font-size="11" font-weight="800" fill="#fbbf24">Sun</text>';

    for (var i = 0; i < PLANETS.length; i++) {
      var p = PLANETS[i];
      var rad = 44 + i * 24;
      var angle = (orbit.t / p.periodDays) * Math.PI * 2;
      var px = cx + Math.cos(angle) * rad;
      var py = cy + Math.sin(angle) * rad * 0.62;   // slight tilt, so it reads as a plane
      var on = p.id === orbit.selected;

      s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rad + '" ry="' + (rad * 0.62) +
        '" fill="none" stroke="' + (on ? '#06b6d4' : '#334155') + '" stroke-width="' +
        (on ? 1.8 : 1) + '"/>';
      if (on) {
        s += '<circle cx="' + px + '" cy="' + py + '" r="' + (p.r * 0.55 + 7) +
          '" fill="#06b6d4" opacity="0.28"/>';
      }
      s += '<circle cx="' + px + '" cy="' + py + '" r="' + (p.r * 0.55 + 2.5) +
        '" fill="' + p.colour + '"/>';
      if (p.id === 'saturn') {
        s += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + (p.r * 0.55 + 8) + '" ry="3" ' +
          'fill="none" stroke="#fde68a" stroke-width="1.6" opacity="0.9"/>';
      }
      if (on) {
        s += '<text x="' + px + '" y="' + (py - p.r * 0.55 - 10) + '" text-anchor="middle" ' +
          'font-family="Nunito,sans-serif" font-size="11" font-weight="800" fill="#e2e8f0">' +
          esc(p.name) + '</text>';
      }
    }
    svg.innerHTML = s;
  }

  function showPlanetCard() {
    var card = document.getElementById('spc-planet-card');
    if (!card) return;
    var p = null;
    for (var i = 0; i < PLANETS.length; i++) if (PLANETS[i].id === orbit.selected) p = PLANETS[i];
    if (!p) return;

    var yearText = p.periodDays < 800
      ? p.periodDays + ' Earth days'
      : (p.periodDays / 365.25).toFixed(1) + ' Earth years';

    card.innerHTML =
      '<div class="spc-card">' +
        '<div class="spc-card-top"><span class="spc-dot" style="background:' + p.colour + '"></span>' +
          '<h4>' + p.name + '</h4></div>' +
        '<table class="g6-table"><tbody>' +
          row('Diameter', p.diameterKm.toLocaleString('en-CA') + ' km') +
          row('Distance from Sun', p.distMkm.toLocaleString('en-CA') + ' million km') +
          row('One orbit (year)', yearText) +
          row('One rotation (day)', p.rotationHours < 48
            ? p.rotationHours + ' hours'
            : (p.rotationHours / 24).toFixed(0) + ' Earth days') +
          row('Gravity', p.gravity + ' N/kg') +
          row('Natural satellites', String(p.moons)) +
          row('Surface temperature', p.tempC + ' degrees C') +
        '</tbody></table>' +
        '<p class="spc-card-fact">' + p.fact + '</p>' +
      '</div>';
  }

  function row(k, v) { return '<tr><td>' + k + '</td><td><strong>' + v + '</strong></td></tr>'; }

  /* =======================================================================
     STATION 2 - Axial Tilt & the Seasons
     ======================================================================= */

  var seasons = { day: 172 };   // 21 June, the northern summer solstice

  function renderSeasons(host) {
    host.innerHTML =
      '<p class="g6-note"><strong>The biggest misconception in Grade 6 science:</strong> seasons ' +
        'are NOT caused by Earth\'s distance from the Sun. Earth is actually <em>closest</em> to ' +
        'the Sun in early January, in the middle of a Canadian winter. Seasons come from the ' +
        '<strong>23.5 degree tilt of Earth\'s axis</strong>, which changes how directly sunlight ' +
        'strikes each hemisphere.</p>' +
      '<div class="g6-lab-grid">' +
        '<div class="g6-canvas g6-canvas--night"><svg id="spc-season-svg" viewBox="0 0 620 340" ' +
          'role="img" aria-label="Earth tilted on its axis at four points around its orbit"></svg></div>' +
        '<div class="g6-controls">' +
          slider('spc-day', 'Day of the year', seasons.day, 1, 365, 1, '') +
          '<div class="g6-chips">' +
            '<button type="button" class="g6-chip" data-day="80">20 Mar equinox</button>' +
            '<button type="button" class="g6-chip active" data-day="172">21 Jun solstice</button>' +
            '<button type="button" class="g6-chip" data-day="266">22 Sep equinox</button>' +
            '<button type="button" class="g6-chip" data-day="355">21 Dec solstice</button>' +
          '</div>' +
          '<div class="g6-readout">' +
            stat('spc-date', 'Date') + stat('spc-season', 'Season in Toronto') +
            stat('spc-decl', 'Sun overhead at') + stat('spc-daylight', 'Toronto daylight') +
            stat('spc-dist', 'Distance to Sun') + stat('spc-angle', 'Noon sun angle') +
          '</div>' +
          '<p class="g6-note" id="spc-season-note"></p>' +
        '</div>' +
      '</div>';

    bind('spc-day', function (v) { seasons.day = v; updateSeasons(); markDayChip(host); });
    host.querySelectorAll('[data-day]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        seasons.day = parseInt(btn.getAttribute('data-day'), 10);
        ui.setSlider('spc-day', seasons.day);
        updateSeasons();
        markDayChip(host);
      });
    });
    updateSeasons();
  }

  function markDayChip(host) {
    host.querySelectorAll('[data-day]').forEach(function (b) {
      b.classList.toggle('active', parseInt(b.getAttribute('data-day'), 10) === seasons.day);
    });
  }

  /** Solar declination: the latitude where the Sun is directly overhead. */
  function declination(day) {
    return -23.44 * Math.cos(2 * Math.PI * (day + 10) / 365.25);
  }

  /** Hours of daylight at a latitude, from the sunrise hour-angle equation. */
  function dayLength(day, latDeg) {
    var d = declination(day) * Math.PI / 180;
    var lat = latDeg * Math.PI / 180;
    var cosH = -Math.tan(lat) * Math.tan(d);
    if (cosH >= 1) return 0;
    if (cosH <= -1) return 24;
    return 2 * Math.acos(cosH) * 180 / Math.PI / 15;
  }

  function dateLabel(day) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var lens = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var d = day, m = 0;
    while (m < 12 && d > lens[m]) { d -= lens[m]; m++; }
    return d + ' ' + months[Math.min(m, 11)];
  }

  function updateSeasons() {
    var day = seasons.day;
    var decl = declination(day);
    var hours = dayLength(day, TORONTO_LAT);
    // Earth's orbit is slightly elliptical: perihelion around 3 January.
    var dist = 149.6 + 2.5 * -Math.cos(2 * Math.PI * (day - 3) / 365.25);
    var noonAngle = 90 - TORONTO_LAT + decl;

    var season = decl > 12 ? 'Summer' : decl > 2 ? 'Late spring' : decl > -2 ? 'Equinox'
      : decl > -12 ? 'Late autumn' : 'Winter';

    setStat('spc-date', dateLabel(day), '');
    setStat('spc-season', season, decl > 2 ? 'good' : decl < -12 ? 'bad' : '');
    setStat('spc-decl', Math.abs(decl).toFixed(1) + ' degrees ' + (decl >= 0 ? 'N' : 'S'), '');
    setStat('spc-daylight', hours.toFixed(1) + ' hours', hours > 13 ? 'good' : hours < 10 ? 'bad' : '');
    setStat('spc-dist', dist.toFixed(1) + ' million km', '');
    setStat('spc-angle', noonAngle.toFixed(0) + ' degrees', '');

    var note = document.getElementById('spc-season-note');
    var closer = dist < 149.6;
    note.className = 'g6-note' + (decl < -12 ? ' g6-note--warn' : '');
    note.innerHTML = 'On <strong>' + dateLabel(day) + '</strong> the Sun is directly overhead at ' +
      '<strong>' + Math.abs(decl).toFixed(1) + ' degrees ' + (decl >= 0 ? 'north' : 'south') +
      '</strong>. Toronto gets <strong>' + hours.toFixed(1) + ' hours</strong> of daylight, and ' +
      'the noon Sun sits <strong>' + noonAngle.toFixed(0) + ' degrees</strong> above the horizon. ' +
      'Earth is <strong>' + (closer ? 'closer to' : 'further from') + '</strong> the Sun than ' +
      'average right now, at ' + dist.toFixed(1) + ' million km' +
      (closer && decl < -10
        ? ' - proof that distance is not what makes winter cold.'
        : '.');

    drawSeasons(day, decl, hours);
  }

  function drawSeasons(day, decl, hours) {
    var svg = document.getElementById('spc-season-svg');
    if (!svg) return;
    var cx = 300, cy = 168, rx = 186, ry = 96;
    var angle = 2 * Math.PI * (day - 3) / 365.25;
    var ex = cx + Math.cos(angle) * rx;
    var ey = cy + Math.sin(angle) * ry;
    var s = '<rect width="620" height="340" fill="#0b1220"/>';

    for (var st = 0; st < 50; st++) {
      s += '<circle cx="' + ((st * 149) % 620) + '" cy="' + ((st * 71) % 340) +
        '" r="0.9" fill="#e2e8f0" opacity="0.4"/>';
    }

    s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
      '" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 5"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="34" fill="#f59e0b" opacity="0.2"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="21" fill="#fbbf24"/>';

    // Sunlight reaching Earth's current position.
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey +
      '" stroke="#fde68a" stroke-width="2" opacity="0.55" stroke-dasharray="5 4"/>';

    // Earth, always tilted the same way in space: that fixed tilt is the point.
    var R = 30;
    s += '<g transform="translate(' + ex + ',' + ey + ')">';
    s += '<circle r="' + R + '" fill="#1d4ed8"/>';
    // Day side faces the Sun.
    var toSun = Math.atan2(cy - ey, cx - ex) * 180 / Math.PI;
    s += '<path d="M0 -' + R + ' A' + R + ' ' + R + ' 0 0 1 0 ' + R + ' Z" fill="#3b82f6" ' +
      'transform="rotate(' + (toSun + 90) + ')"/>';
    s += '<g transform="rotate(-23.5)">';
    s += '<line x1="0" y1="-' + (R + 13) + '" x2="0" y2="' + (R + 13) +
      '" stroke="#f8fafc" stroke-width="2.2"/>';
    s += '<line x1="-' + R + '" y1="0" x2="' + R + '" y2="0" stroke="#f8fafc" ' +
      'stroke-width="1.4" opacity="0.75" stroke-dasharray="3 3"/>';
    s += '<text x="0" y="-' + (R + 20) + '" text-anchor="middle" font-family="Nunito,sans-serif" ' +
      'font-size="10" font-weight="800" fill="#f8fafc">N</text>';
    s += '</g></g>';

    s += '<text x="' + ex + '" y="' + (ey + R + 30) + '" text-anchor="middle" ' +
      'font-family="Nunito,sans-serif" font-size="11.5" font-weight="800" fill="#e2e8f0">' +
      esc(dateLabel(day)) + '</text>';

    // The four cardinal points of the orbit, labelled.
    var marks = [
      { d: 80, t: 'Mar equinox' }, { d: 172, t: 'Jun solstice' },
      { d: 266, t: 'Sep equinox' }, { d: 355, t: 'Dec solstice' }
    ];
    // Captions are pushed outside the orbit. Sitting on it, they were covered
    // by the Earth globe whenever Earth reached that point in its year.
    for (var m = 0; m < marks.length; m++) {
      var a = 2 * Math.PI * (marks[m].d - 3) / 365.25;
      var mx = cx + Math.cos(a) * rx, my = cy + Math.sin(a) * ry;
      var lx = cx + Math.cos(a) * (rx + 72), ly = cy + Math.sin(a) * (ry + 40);
      s += '<circle cx="' + mx + '" cy="' + my + '" r="3" fill="#64748b"/>';
      s += '<text x="' + lx + '" y="' + (ly + 3) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="9.5" fill="#64748b">' + marks[m].t + '</text>';
    }

    s += '<text x="18" y="26" font-family="Nunito,sans-serif" font-size="11" font-weight="800" ' +
      'fill="#94a3b8">AXIS TILT LOCKED AT 23.5 DEGREES ALL YEAR</text>';
    s += '<text x="18" y="322" font-family="Nunito,sans-serif" font-size="11" fill="#94a3b8">' +
      'Toronto daylight today: ' + hours.toFixed(1) + ' h &bull; Sun overhead at ' +
      Math.abs(decl).toFixed(1) + ' degrees ' + (decl >= 0 ? 'N' : 'S') + '</text>';
    svg.innerHTML = s;
  }

  /* =======================================================================
     STATION 3 - Mass vs Weight
     ======================================================================= */

  var WORLDS = [
    { name: 'Mercury', g: 3.7, colour: '#a8a29e' },
    { name: 'Venus', g: 8.9, colour: '#fbbf24' },
    { name: 'Earth', g: 9.81, colour: '#3b82f6' },
    { name: 'The Moon', g: 1.62, colour: '#cbd5e1' },
    { name: 'Mars', g: 3.7, colour: '#ef4444' },
    { name: 'Jupiter', g: 24.8, colour: '#d97706' },
    { name: 'Saturn', g: 10.4, colour: '#facc15' },
    { name: 'Uranus', g: 8.9, colour: '#67e8f9' },
    { name: 'Neptune', g: 11.2, colour: '#2563eb' }
  ];

  var scale = { mass: 40 };

  function renderScale(host) {
    host.innerHTML =
      '<p class="g6-note"><strong>Mass</strong> is how much matter something is made of. It is ' +
        'measured in <strong>kilograms</strong> and it never changes, no matter where you stand. ' +
        '<strong>Weight</strong> is the pull of gravity on that mass. It is a force, measured in ' +
        '<strong>newtons</strong>, and it changes from world to world: <code>W = m x g</code>.</p>' +
      '<div class="g6-controls" style="margin-bottom:18px">' +
        slider('spc-mass', 'Your mass', scale.mass, 10, 120, 1, 'kg') +
      '</div>' +
      '<div class="g6-canvas"><svg id="spc-scale-svg" viewBox="0 0 620 320" role="img" ' +
        'aria-label="Weight in newtons on nine different worlds"></svg></div>' +
      '<div class="g6-readout" style="margin-top:16px">' +
        stat('spc-mass-out', 'Mass everywhere') + stat('spc-earth-w', 'Weight on Earth') +
        stat('spc-moon-w', 'Weight on the Moon') + stat('spc-jup-w', 'Weight on Jupiter') +
      '</div>' +
      '<p class="g6-note" id="spc-scale-note" style="margin-top:16px"></p>';

    bind('spc-mass', function (v) { scale.mass = v; updateScale(); });
    updateScale();
  }

  function updateScale() {
    var m = scale.mass;
    setStat('spc-mass-out', m + ' kg', '');
    setStat('spc-earth-w', Math.round(m * 9.81) + ' N', '');
    setStat('spc-moon-w', Math.round(m * 1.62) + ' N', 'good');
    setStat('spc-jup-w', Math.round(m * 24.8) + ' N', 'bad');

    var ratio = (24.8 / 1.62).toFixed(1);
    document.getElementById('spc-scale-note').innerHTML =
      'Your <strong>mass stays ' + m + ' kg</strong> on every single world - the bar chart above ' +
      'is not showing mass, it is showing <strong>weight</strong>. On Jupiter you would weigh ' +
      '<strong>' + ratio + ' times</strong> what you weigh on the Moon, because Jupiter\'s ' +
      'gravitational field is that much stronger. This is why astronauts on the Moon could bounce ' +
      'in a bulky suit: same mass, far less weight.';

    drawScale();
  }

  function drawScale() {
    var svg = document.getElementById('spc-scale-svg');
    if (!svg) return;
    var baseY = 248, maxH = 200, slot = 64, left = 30;
    var maxW = scale.mass * 24.8;
    var s = '<rect width="620" height="320" fill="#f8fafc"/>';
    s += '<text x="20" y="22" font-family="Nunito,sans-serif" font-size="11" font-weight="800" ' +
      'fill="#94a3b8">WEIGHT IN NEWTONS FOR A MASS OF ' + scale.mass + ' kg</text>';

    for (var i = 0; i < WORLDS.length; i++) {
      var w = WORLDS[i];
      var newtons = scale.mass * w.g;
      var h = newtons / maxW * maxH;
      var x = left + i * slot;

      s += '<rect x="' + x + '" y="' + (baseY - h) + '" width="44" height="' + h +
        '" rx="7" fill="' + w.colour + '" opacity="0.92"/>';
      s += '<text x="' + (x + 22) + '" y="' + (baseY - h - 7) + '" text-anchor="middle" ' +
        'font-family="Space Mono,monospace" font-size="11" font-weight="700" fill="#334155">' +
        Math.round(newtons) + '</text>';
      s += '<text x="' + (x + 22) + '" y="' + (baseY + 18) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="9.5" font-weight="800" fill="#334155">' +
        esc(w.name.replace('The ', '')) + '</text>';
      s += '<text x="' + (x + 22) + '" y="' + (baseY + 31) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="9" fill="#94a3b8">' + w.g + ' N/kg</text>';
    }

    s += '<line x1="20" y1="' + baseY + '" x2="600" y2="' + baseY + '" stroke="#334155" stroke-width="2"/>';
    s += '<text x="20" y="' + (baseY + 56) + '" font-family="Nunito,sans-serif" font-size="10.5" ' +
      'fill="#94a3b8">Mass is constant at ' + scale.mass +
      ' kg on every bar. Only the gravitational field strength g changes.</text>';
    svg.innerHTML = s;
  }

  /* =======================================================================
     Registration
     ======================================================================= */

  SFG6.register({
    id: 'space',
    tabLabel: 'Space',
    icon: 'rocket',
    strandTag: 'STRAND E - EARTH AND SPACE SYSTEMS',
    title: 'Space Exploration & the Solar System',
    intro: 'Eight planets, one star, and a Canadian robotic arm that built a space station. ' +
      'Run the orbits at their true relative speeds, tilt Earth on its axis to find out why ' +
      'Ontario has winter, then step on a scale on nine different worlds to learn the difference ' +
      'between <strong>mass</strong> and <strong>weight</strong>.',
    expectations: [
      'E1. assess the impact of space exploration on humans, society, and the environment',
      'E2. demonstrate an understanding of the solar system, the phenomena that result from the movement of different bodies within it, and the technologies used in space exploration'
    ],
    badgeId: 'space_commander',
    badgeName: 'Space Commander',
    stations: [
      {
        id: 'orbits', label: 'Orbit Simulator', icon: 'rocket',
        tag: 'SOLAR SYSTEM SIMULATOR',
        title: 'Station 1: Run the Solar System',
        blurb: 'Each planet moves at its real orbital period. Click any world for its diameter, distance, day length, gravity and moons.',
        render: renderOrbit
      },
      {
        id: 'seasons', label: 'Tilt & Seasons', icon: 'globe',
        tag: 'SEASONS LAB',
        title: 'Station 2: Why Canada Has Winter',
        blurb: 'Move Earth around its orbit and watch Toronto\'s daylight hours, the noon sun angle and the distance to the Sun all change together.',
        render: renderSeasons
      },
      {
        id: 'gravity', label: 'Mass vs Weight', icon: 'chartLine',
        tag: 'GRAVITY BENCH',
        title: 'Station 3: The Same You on Nine Worlds',
        blurb: 'Set your mass in kilograms once, then read your weight in newtons everywhere from the Moon to Jupiter.',
        render: renderScale
      }
    ],
    tiers: [
      {
        name: 'Ontario Core',
        desc: 'The Grade 6 benchmark: solar system components, rotation, revolution and seasons.',
        xp: 10,
        questions: [
          {
            q: 'What causes <strong>day and night</strong> on Earth?',
            options: [
              'Earth revolving around the Sun',
              'Earth rotating once on its axis every 24 hours',
              'The Moon blocking the Sun',
              'Earth\'s 23.5 degree tilt'
            ],
            ans: 1,
            hint: 'One of these takes 24 hours, and one takes 365 days. Which matches a day?',
            solution: [
              '<strong>Rotation</strong> is spinning on your own axis. Earth does this once every 24 hours.',
              '<strong>Revolution</strong> is travelling around the Sun. Earth takes 365.25 days for that.',
              'Day and night last about 24 hours, which matches the rotation exactly.',
              'So the answer is <strong>Earth rotating once on its axis every 24 hours</strong>. The tilt causes seasons, not day and night.'
            ]
          },
          {
            q: 'A small chunk of rock burns up as it streaks through Earth\'s atmosphere. While it is glowing in the sky, what is it called?',
            options: ['A meteoroid', 'A meteor', 'A meteorite', 'A comet'],
            ans: 1,
            hint: 'Three words, three stages: in space, in the sky, on the ground.',
            solution: [
              'In space it is a <strong>meteoroid</strong>.',
              'Burning up in the atmosphere as a streak of light, it is a <strong>meteor</strong>, often called a shooting star.',
              'If any piece survives and lands on the ground, that piece is a <strong>meteorite</strong>.',
              'The question describes the glowing stage, so the answer is <strong>a meteor</strong>.'
            ]
          },
          {
            q: 'Which Canadian technology is a robotic arm used to build and service the International Space Station?',
            options: ['RADARSAT', 'The Canadarm', 'The Hubble telescope', 'GPS'],
            ans: 1,
            hint: 'The name says exactly what it is and which country built it.',
            solution: [
              'RADARSAT is a Canadian <strong>Earth observation satellite</strong>, not an arm.',
              'Hubble is an American space telescope.',
              'GPS is a navigation network of satellites.',
              'The <strong>Canadarm</strong>, and later Canadarm2 and Dextre, were built by the Canadian Space Agency to move cargo and astronauts. The answer is <strong>the Canadarm</strong>.'
            ]
          },
          {
            q: 'What actually causes the seasons?',
            options: [
              'Earth is closer to the Sun in summer',
              'The 23.5 degree tilt of Earth\'s axis changes how directly sunlight strikes each hemisphere',
              'The Sun gets hotter in July',
              'The Moon shades Earth in winter'
            ],
            ans: 1,
            hint: 'Check the distance readout in Station 2 in January, then think about a Canadian winter.',
            solution: [
              'Earth is actually <strong>closest</strong> to the Sun in early January, during a Canadian winter, so distance cannot be the cause.',
              'Earth\'s axis is tilted <strong>23.5 degrees</strong> and always points the same way in space.',
              'For half the year the northern hemisphere leans toward the Sun, so sunlight arrives more directly and days are longer.',
              'The answer is <strong>the 23.5 degree tilt of Earth\'s axis changes how directly sunlight strikes each hemisphere</strong>.'
            ]
          },
          {
            q: 'Which list contains <strong>only</strong> natural components of the solar system?',
            options: [
              'Sun, planets, comets, asteroids',
              'Sun, planets, satellites such as RADARSAT, comets',
              'Planets, the Canadarm, asteroids, moons',
              'Sun, GPS satellites, meteoroids, planets'
            ],
            ans: 0,
            hint: 'Two of the words in the wrong answers are things humans launched.',
            solution: [
              'RADARSAT, the Canadarm and GPS satellites are all built by people, so they are <strong>artificial</strong>.',
              'The Sun, the planets, comets and asteroids all formed naturally about 4.6 billion years ago.',
              'A <strong>natural satellite</strong> means a moon, which is different from an artificial satellite.',
              'The only all-natural list is <strong>Sun, planets, comets, asteroids</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Enriched Deep Thinker',
        desc: 'Mass against weight in newtons, orbital speed, and reasoning about tilt.',
        xp: 15,
        questions: [
          {
            q: 'Sophia has a mass of <code>40 kg</code>. On the Moon, gravitational field strength is <code>1.6 N/kg</code>. What are her <strong>mass</strong> and <strong>weight</strong> on the Moon?',
            options: [
              'Mass 40 kg, weight 64 N',
              'Mass 6.7 kg, weight 64 N',
              'Mass 40 kg, weight 392 N',
              'Mass 64 kg, weight 40 N'
            ],
            ans: 0,
            hint: 'Mass never changes. Weight is W = m x g, using the Moon\'s value of g.',
            solution: [
              '<strong>Mass</strong> is the amount of matter in her body. It does not change when she travels, so it stays <code>40 kg</code>.',
              '<strong>Weight</strong> is a force: <code>W = m x g</code>.',
              'On the Moon: <code>W = 40 kg x 1.6 N/kg = 64 N</code>.',
              'So the answer is <strong>mass 40 kg, weight 64 N</strong>. On Earth the same girl would weigh about 392 N.'
            ]
          },
          {
            q: 'Neptune takes about <code>165</code> Earth years to orbit the Sun; Mercury takes <code>88</code> days. What best explains the difference?',
            options: [
              'Neptune is heavier so it moves more slowly',
              'Neptune is much further out, so it has a far longer path and the Sun\'s pull there is weaker',
              'Neptune spins more slowly on its axis',
              'Neptune orbits in the opposite direction'
            ],
            ans: 1,
            hint: 'Two things change with distance: how far around the track is, and how hard the Sun pulls.',
            solution: [
              'Neptune orbits at about <code>4 495</code> million km; Mercury at about <code>58</code> million km.',
              'A far larger orbit means a much <strong>longer path</strong> to travel each lap.',
              'Gravity also weakens with distance, so distant planets travel <strong>more slowly</strong> along that longer path.',
              'Both effects add together, so the answer is <strong>Neptune is much further out, so it has a far longer path and the Sun\'s pull there is weaker</strong>.'
            ]
          },
          {
            q: 'On <strong>21 December</strong> Toronto gets about 9 hours of daylight, while Sydney, Australia gets about 14.5 hours. Why?',
            options: [
              'Sydney is closer to the Sun',
              'The southern hemisphere is tilted toward the Sun on that date',
              'Australia has a different Sun',
              'Earth stops rotating in December'
            ],
            ans: 1,
            hint: 'Earth\'s axis points one fixed way. If the north leans away, what is the south doing?',
            solution: [
              'Earth\'s axis stays pointed in the same direction in space all year.',
              'In December the <strong>northern</strong> hemisphere leans away from the Sun, giving Toronto short days and low sun.',
              'At the very same moment the <strong>southern</strong> hemisphere must be leaning toward the Sun.',
              'So Sydney gets long days and high sun: <strong>the southern hemisphere is tilted toward the Sun on that date</strong>.'
            ]
          },
          {
            q: 'Assessing the impact of space exploration, which is a genuine <strong>everyday benefit</strong> that came out of space technology?',
            options: [
              'GPS navigation and satellite weather forecasting',
              'The invention of the wheel',
              'Electricity in homes',
              'The discovery of gravity'
            ],
            ans: 0,
            hint: 'Which one literally depends on objects orbiting Earth right now?',
            solution: [
              'The wheel, household electricity and the idea of gravity all predate spaceflight by a long way.',
              '<strong>GPS</strong> works by timing signals from a constellation of satellites in orbit.',
              'Weather forecasting relies on imaging satellites, including Canada\'s RADARSAT for ice and flood monitoring.',
              'Both exist only because of space exploration, so the answer is <strong>GPS navigation and satellite weather forecasting</strong>.'
            ]
          },
          {
            q: 'A comet\'s tail always points <strong>away from the Sun</strong>, even when the comet is travelling away. What does that tell you?',
            options: [
              'The tail is blown outward by the solar wind and sunlight, not left behind like exhaust',
              'The tail is made of solid rock',
              'The comet is moving backwards',
              'The tail is a reflection of the comet'
            ],
            ans: 0,
            hint: 'If the tail were exhaust it would trail behind the direction of travel. It does not.',
            solution: [
              'A trail left behind by motion would point <strong>opposite to the direction of travel</strong>.',
              'A comet\'s tail instead points away from the <strong>Sun</strong> at all times, including on the outbound leg when the tail leads the way.',
              'That means something coming <em>from the Sun</em> is pushing it: the solar wind and the pressure of sunlight.',
              'The answer is <strong>the tail is blown outward by the solar wind and sunlight, not left behind like exhaust</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Waterloo CEMC Challenge',
        desc: 'Contest-style: orbital period ratios, light-travel time and scale modelling.',
        xp: 25,
        questions: [
          {
            q: 'Light travels <code>300 000 km</code> every second. The Sun is <code>150 000 000 km</code> from Earth. How long does sunlight take to reach us?',
            options: ['<code>50 seconds</code>', '<code>500 seconds</code>', '<code>5 000 seconds</code>', '<code>5 seconds</code>'],
            ans: 1,
            hint: 'Time equals distance divided by speed. Cancel the zeros before dividing.',
            solution: [
              '<code>time = distance / speed</code>.',
              '<code>150 000 000 / 300 000</code>. Cancel five zeros from each: <code>1 500 / 3</code>.',
              '<code>1 500 / 3 = 500</code> seconds.',
              'The answer is <strong>500 seconds</strong>, which is 8 minutes 20 seconds. Sunlight you see now left the Sun before recess started.'
            ]
          },
          {
            q: 'Mercury orbits in <code>88</code> days and Venus in <code>225</code> days. They line up on the same side of the Sun today. After <strong>440 days</strong>, how many <strong>complete</strong> orbits has each finished?',
            options: [
              'Mercury 5, Venus 1',
              'Mercury 5, Venus 2',
              'Mercury 4, Venus 2',
              'Mercury 6, Venus 1'
            ],
            ans: 0,
            hint: 'Divide 440 by each period, then throw away the fractional part.',
            solution: [
              'Mercury: <code>440 / 88 = 5</code> exactly, so it has completed <strong>5</strong> full orbits.',
              'Venus: <code>440 / 225 = 1.96</code>.',
              'Only whole orbits count, and 1.96 is less than 2, so Venus has completed <strong>1</strong> full orbit.',
              'The answer is <strong>Mercury 5, Venus 1</strong>.'
            ]
          },
          {
            q: 'On a scale model, Earth\'s diameter of <code>12 756 km</code> is drawn as <code>2 cm</code>. Jupiter is <code>142 984 km</code> across. How wide should Jupiter be, to the nearest centimetre?',
            options: ['<code>11 cm</code>', '<code>22 cm</code>', '<code>28 cm</code>', '<code>14 cm</code>'],
            ans: 1,
            hint: 'Find how many times wider Jupiter is than Earth, then scale the 2 cm by that factor.',
            solution: [
              'Size ratio: <code>142 984 / 12 756 = 11.2</code>, so Jupiter is about 11.2 Earths wide.',
              'The model keeps the same ratio: <code>2 cm x 11.2 = 22.4 cm</code>.',
              'To the nearest centimetre that is <code>22 cm</code>.',
              'The answer is <strong>22 cm</strong>. The common mistake is answering 11 cm, which forgets that Earth was drawn as 2 cm, not 1 cm.'
            ]
          },
          {
            q: 'An astronaut and her equipment have a combined mass of <code>150 kg</code>. On Mars, <code>g = 3.7 N/kg</code>. If her suit can safely carry <code>600 N</code>, by how much is she <strong>under</strong> the limit on Mars?',
            options: ['<code>45 N</code>', '<code>55 N</code>', '<code>555 N</code>', '<code>150 N</code>'],
            ans: 0,
            hint: 'Work out the Mars weight first with W = m x g, then subtract from 600 N.',
            solution: [
              'Weight on Mars: <code>W = 150 kg x 3.7 N/kg = 555 N</code>.',
              'The suit limit is <code>600 N</code>.',
              'Margin: <code>600 - 555 = 45 N</code>.',
              'The answer is <strong>45 N</strong>. On Earth the same 150 kg would weigh 1 472 N and far exceed the limit.'
            ]
          },
          {
            q: 'Planet X has a year of <code>4</code> Earth years and a day of <code>16</code> Earth hours. How many <strong>Planet X days</strong> are there in one Planet X year? Use a 365-day Earth year.',
            options: ['<code>1 460</code>', '<code>2 190</code>', '<code>5 840</code>', '<code>365</code>'],
            ans: 1,
            hint: 'Convert the year to hours first, then divide by the length of one of its days.',
            solution: [
              'One Planet X year in Earth hours: <code>4 x 365 x 24 = 35 040 hours</code>.',
              'One Planet X day is <code>16</code> hours long.',
              'Days per year: <code>35 040 / 16 = 2 190</code>.',
              'The answer is <strong>2 190</strong> Planet X days in a Planet X year.'
            ]
          }
        ]
      }
    ]
  });
})(window);
