/**
 * StudyFlix Key Art
 * ---------------------------------------------------------------------------
 * Every catalog tile gets a drawn scene instead of an arbitrary gradient.
 *
 * Rationale (design review): a Netflix row reads as a curated shelf because
 * every tile is distinct key art. Arbitrary per-card gradients read as a
 * palette test. Each scene here is a flat, poster-style SVG on a palette
 * owned by its SUBJECT FAMILY, so a row holds together while every tile
 * still says something about what it opens.
 *
 * Scenes are pure functions of (palette) -> svg body, so they are
 * deterministic: the same card always shows the same art.
 */
(function (global) {
  'use strict';

  var W = 320, H = 200;

  /* -----------------------------------------------------------------------
     Subject families. Only these palettes are allowed, which is what stops a
     row from turning into a swatch collection.
     -------------------------------------------------------------------- */
  var FAMILIES = {
    rome:     { sky: ['#7f1d2b', '#2b0d12'], stone: '#f0dfc4', ink: '#2b0d12', accent: '#e0b64a', shade: '#c99a3c' },
    science:  { sky: ['#0e4f6e', '#08202f'], stone: '#dff3fb', ink: '#08202f', accent: '#38d0c8', shade: '#1d8fa5' },
    math:     { sky: ['#3b2f7a', '#160f33'], stone: '#e6e2fb', ink: '#160f33', accent: '#8b7cf6', shade: '#5b4bc4' },
    grade3:   { sky: ['#7a2f5e', '#2b0f22'], stone: '#fde4f1', ink: '#2b0f22', accent: '#f472b6', shade: '#c2478c' },
    calculus: { sky: ['#12305e', '#08182f'], stone: '#dce9fb', ink: '#08182f', accent: '#f2a63b', shade: '#3b6fb5' },
    coffee:   { sky: ['#5a2f13', '#1e1109'], stone: '#f6e7d2', ink: '#1e1109', accent: '#e5a93c', shade: '#a9682a' }
  };

  function bg(p, id) {
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + p.sky[0] + '"/>' +
      '<stop offset="1" stop-color="' + p.sky[1] + '"/></linearGradient></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/>';
  }

  // Shared ground plane most scenes stand on.
  function ground(p, y) {
    y = y || 158;
    return '<rect x="0" y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="' + p.ink + '" opacity="0.55"/>' +
      '<rect x="0" y="' + y + '" width="' + W + '" height="2" fill="' + p.accent + '" opacity="0.55"/>';
  }

  function sun(p, cx, cy, r) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + p.accent + '" opacity="0.22"/>';
  }

  /* -----------------------------------------------------------------------
     Scenes
     -------------------------------------------------------------------- */
  var SCENES = {

    /* ---------------- Rome ---------------- */
    'rome-forum': function (p) {
      var s = sun(p, 236, 62, 44);
      // Colonnade of a temple front with pediment.
      s += '<g fill="' + p.stone + '">';
      s += '<path d="M40 74 L124 34 L208 74 Z"/>';           // pediment
      s += '<rect x="34" y="76" width="180" height="9"/>';    // architrave
      for (var i = 0; i < 5; i++) {
        var x = 44 + i * 40;
        s += '<rect x="' + x + '" y="88" width="18" height="62" opacity="0.94"/>';
        s += '<rect x="' + (x - 3) + '" y="85" width="24" height="5"/>';   // capital
        s += '<rect x="' + (x - 3) + '" y="150" width="24" height="6"/>';  // base
      }
      s += '</g>';
      s += '<g fill="' + p.shade + '" opacity="0.45">';
      for (var j = 0; j < 5; j++) s += '<rect x="' + (56 + j * 40) + '" y="88" width="6" height="62"/>';
      s += '</g>';
      return s + ground(p);
    },

    'rome-arch': function (p) {
      var s = sun(p, 250, 56, 40);
      // Semi-circular arch with a highlighted keystone.
      s += '<g fill="' + p.stone + '">';
      s += '<rect x="52" y="96" width="30" height="60"/>';
      s += '<rect x="182" y="96" width="30" height="60"/>';
      s += '<path d="M52 96 A80 80 0 0 1 212 96 L182 96 A50 50 0 0 0 82 96 Z"/>';
      s += '</g>';
      // Voussoirs radiating from centre.
      s += '<g stroke="' + p.ink + '" stroke-width="2" opacity="0.35">';
      for (var a = 0; a <= 180; a += 22.5) {
        var r1 = 50, r2 = 80, cx = 132, cy = 96;
        var rad = (180 + a) * Math.PI / 180;
        s += '<line x1="' + (cx + r1 * Math.cos(rad)).toFixed(1) + '" y1="' + (cy + r1 * Math.sin(rad)).toFixed(1) +
             '" x2="' + (cx + r2 * Math.cos(rad)).toFixed(1) + '" y2="' + (cy + r2 * Math.sin(rad)).toFixed(1) + '"/>';
      }
      s += '</g>';
      s += '<path d="M124 16 L140 16 L145 44 L119 44 Z" fill="' + p.accent + '"/>'; // keystone
      return s + ground(p);
    },

    'rome-aqueduct': function (p) {
      var s = sun(p, 60, 50, 34);
      s += '<g fill="' + p.stone + '">';
      s += '<rect x="0" y="60" width="' + W + '" height="14"/>';   // water channel
      for (var i = 0; i < 5; i++) {
        var x = 12 + i * 64;
        s += '<path d="M' + x + ' 74 h44 v82 h-13 v-58 a9 9 0 0 0-18 0 v58 h-13 z"/>';
      }
      s += '</g>';
      s += '<rect x="0" y="60" width="' + W + '" height="5" fill="' + p.accent + '" opacity="0.8"/>'; // flowing water
      return s + ground(p);
    },

    'rome-cipher': function (p) {
      // Two concentric cipher rings offset by a shift.
      var s = '<circle cx="160" cy="94" r="66" fill="none" stroke="' + p.stone + '" stroke-width="3" opacity="0.8"/>';
      s += '<circle cx="160" cy="94" r="44" fill="none" stroke="' + p.accent + '" stroke-width="3"/>';
      s += '<circle cx="160" cy="94" r="12" fill="' + p.accent + '" opacity="0.35"/>';
      for (var i = 0; i < 16; i++) {
        var a = i * 22.5 * Math.PI / 180;
        s += '<line x1="' + (160 + 56 * Math.cos(a)).toFixed(1) + '" y1="' + (94 + 56 * Math.sin(a)).toFixed(1) +
             '" x2="' + (160 + 66 * Math.cos(a)).toFixed(1) + '" y2="' + (94 + 66 * Math.sin(a)).toFixed(1) +
             '" stroke="' + p.stone + '" stroke-width="2.5" opacity="0.75"/>';
        var b = (i * 22.5 + 11) * Math.PI / 180;
        s += '<line x1="' + (160 + 34 * Math.cos(b)).toFixed(1) + '" y1="' + (94 + 34 * Math.sin(b)).toFixed(1) +
             '" x2="' + (160 + 44 * Math.cos(b)).toFixed(1) + '" y2="' + (94 + 44 * Math.sin(b)).toFixed(1) +
             '" stroke="' + p.accent + '" stroke-width="2.5"/>';
      }
      s += '<path d="M160 28 l7 14 h-14 z" fill="' + p.accent + '"/>';
      return s;
    },

    'rome-numerals': function (p) {
      // Carved numerals on a stone tablet.
      var s = '<rect x="46" y="34" width="228" height="132" rx="6" fill="' + p.stone + '"/>';
      s += '<rect x="56" y="44" width="208" height="112" rx="3" fill="none" stroke="' + p.shade + '" stroke-width="2.5"/>';
      s += '<g fill="' + p.ink + '" font-family="Georgia,serif" font-weight="700" font-size="34" text-anchor="middle">';
      s += '<text x="105" y="88">IV</text><text x="215" y="88">IX</text>';
      s += '<text x="105" y="138">XL</text><text x="215" y="138">CM</text></g>';
      s += '<rect x="160" y="52" width="2" height="96" fill="' + p.shade + '" opacity="0.5"/>';
      s += '<rect x="64" y="112" width="192" height="2" fill="' + p.shade + '" opacity="0.5"/>';
      return s;
    },

    'rome-senate': function (p) {
      // Scales of law over a tablet.
      var s = sun(p, 160, 78, 52);
      s += '<g stroke="' + p.stone + '" stroke-width="4" fill="none" stroke-linecap="round">';
      s += '<line x1="160" y1="44" x2="160" y2="140"/><line x1="92" y1="60" x2="228" y2="60"/>';
      s += '<path d="M92 60 L74 100 h36 z" fill="' + p.accent + '" stroke="none"/>';
      s += '<path d="M228 60 L210 100 h36 z" fill="' + p.accent + '" stroke="none"/>';
      s += '<line x1="126" y1="140" x2="194" y2="140"/></g>';
      s += '<circle cx="160" cy="40" r="7" fill="' + p.accent + '"/>';
      return s + ground(p, 148);
    },

    'rome-vesuvius': function (p) {
      var s = '<circle cx="160" cy="46" r="30" fill="' + p.accent + '" opacity="0.28"/>';
      s += '<path d="M-10 160 L96 62 L134 100 L186 46 L330 160 Z" fill="' + p.stone + '" opacity="0.92"/>';
      s += '<path d="M186 46 L162 74 h48 z" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.accent + '" opacity="0.5">';
      s += '<circle cx="196" cy="30" r="13"/><circle cx="176" cy="20" r="9"/><circle cx="214" cy="20" r="8"/></g>';
      return s + ground(p);
    },

    'rome-quiz': function (p) {
      // Laurel wreath framing a target.
      var s = '<circle cx="160" cy="98" r="52" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<circle cx="160" cy="98" r="32" fill="none" stroke="' + p.stone + '" stroke-width="4" opacity="0.6"/>';
      s += '<circle cx="160" cy="98" r="13" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.accent + '" opacity="0.9">';
      for (var i = 0; i < 7; i++) {
        var a = (150 + i * 12) * Math.PI / 180;
        var b = (390 - i * 12) * Math.PI / 180;
        s += '<ellipse cx="' + (160 + 72 * Math.cos(a)).toFixed(1) + '" cy="' + (98 + 72 * Math.sin(a)).toFixed(1) + '" rx="9" ry="4.5" transform="rotate(' + (150 + i * 12) + ' ' + (160 + 72 * Math.cos(a)).toFixed(1) + ' ' + (98 + 72 * Math.sin(a)).toFixed(1) + ')"/>';
        s += '<ellipse cx="' + (160 + 72 * Math.cos(b)).toFixed(1) + '" cy="' + (98 + 72 * Math.sin(b)).toFixed(1) + '" rx="9" ry="4.5" transform="rotate(' + (390 - i * 12) + ' ' + (160 + 72 * Math.cos(b)).toFixed(1) + ' ' + (98 + 72 * Math.sin(b)).toFixed(1) + ')"/>';
      }
      s += '</g>';
      return s;
    },

    /* ---------------- Science ---------------- */
    'sci-periodic': function (p) {
      var s = '';
      var cols = 9, rows = 4;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var lit = (r * cols + c) % 7 === 0;
          s += '<rect x="' + (34 + c * 28) + '" y="' + (44 + r * 28) + '" width="23" height="23" rx="3" fill="' +
            (lit ? p.accent : p.stone) + '" opacity="' + (lit ? 0.95 : 0.30) + '"/>';
        }
      }
      s += '<rect x="34" y="44" width="23" height="23" rx="3" fill="' + p.accent + '"/>';
      s += '<text x="45.5" y="61" font-family="Montserrat,sans-serif" font-size="13" font-weight="800" fill="' + p.ink + '" text-anchor="middle">H</text>';
      return s;
    },

    'sci-atom': function (p) {
      var s = '<g fill="none" stroke="' + p.stone + '" stroke-width="2.5" opacity="0.85">';
      s += '<ellipse cx="160" cy="100" rx="86" ry="34"/>';
      s += '<ellipse cx="160" cy="100" rx="86" ry="34" transform="rotate(60 160 100)"/>';
      s += '<ellipse cx="160" cy="100" rx="86" ry="34" transform="rotate(120 160 100)"/></g>';
      s += '<circle cx="160" cy="100" r="16" fill="' + p.accent + '"/>';
      s += '<circle cx="246" cy="100" r="7" fill="' + p.accent + '"/>';
      s += '<circle cx="117" cy="26" r="7" fill="' + p.stone + '"/>';
      s += '<circle cx="117" cy="174" r="7" fill="' + p.stone + '"/>';
      return s;
    },

    'sci-reaction': function (p) {
      // Flask with bubbling reaction.
      var s = '<path d="M136 34 v40 L98 148 a10 10 0 0 0 9 16 h106 a10 10 0 0 0 9-16 L184 74 V34 Z" fill="' + p.stone + '" opacity="0.22" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<path d="M112 126 h96 l9 22 a10 10 0 0 1-9 16 h-96 a10 10 0 0 1-9-16 Z" fill="' + p.accent + '" opacity="0.85"/>';
      s += '<line x1="128" y1="34" x2="192" y2="34" stroke="' + p.stone + '" stroke-width="5" stroke-linecap="round"/>';
      s += '<g fill="' + p.stone + '" opacity="0.75"><circle cx="140" cy="112" r="6"/><circle cx="166" cy="96" r="4.5"/><circle cx="186" cy="110" r="5.5"/><circle cx="156" cy="76" r="3.5"/></g>';
      return s;
    },

    'sci-cell': function (p) {
      var s = '<rect x="34" y="34" width="252" height="132" rx="26" fill="' + p.stone + '" opacity="0.20" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<circle cx="128" cy="100" r="30" fill="' + p.accent + '" opacity="0.9"/>';
      s += '<circle cx="128" cy="100" r="12" fill="' + p.ink + '" opacity="0.45"/>';
      s += '<g fill="' + p.stone + '" opacity="0.8">';
      s += '<ellipse cx="212" cy="72" rx="26" ry="13" transform="rotate(-18 212 72)"/>';
      s += '<ellipse cx="222" cy="126" rx="22" ry="11" transform="rotate(14 222 126)"/>';
      s += '<circle cx="76" cy="140" r="8"/><circle cx="186" cy="148" r="6"/><circle cx="70" cy="64" r="6"/></g>';
      return s;
    },

    'sci-coaster': function (p) {
      var s = '<path d="M-4 152 C 60 152, 56 44, 116 44 S 176 152, 216 120 S 268 60, 324 74" fill="none" stroke="' + p.stone + '" stroke-width="5" stroke-linecap="round"/>';
      s += '<g stroke="' + p.stone + '" stroke-width="2.5" opacity="0.45">';
      for (var i = 0; i < 12; i++) { var x = 8 + i * 26; s += '<line x1="' + x + '" y1="' + (150 - Math.sin(i / 2) * 8) + '" x2="' + x + '" y2="158"/>'; }
      s += '</g>';
      s += '<g fill="' + p.accent + '"><rect x="98" y="28" width="38" height="18" rx="5"/><circle cx="106" cy="49" r="5"/><circle cx="128" cy="49" r="5"/></g>';
      return s + ground(p);
    },

    'sci-decoder': function (p) {
      var s = '';
      var syms = ['C', 'A', 'Fe', 'N', 'O', 'S'];
      for (var i = 0; i < 6; i++) {
        var x = 26 + (i % 3) * 92, y = 46 + Math.floor(i / 3) * 66;
        var lit = i % 2 === 0;
        s += '<rect x="' + x + '" y="' + y + '" width="76" height="52" rx="7" fill="' + (lit ? p.accent : p.stone) + '" opacity="' + (lit ? 0.92 : 0.26) + '"/>';
        s += '<text x="' + (x + 38) + '" y="' + (y + 34) + '" font-family="Montserrat,sans-serif" font-size="20" font-weight="800" fill="' + (lit ? p.ink : p.stone) + '" text-anchor="middle">' + syms[i] + '</text>';
      }
      return s;
    },

    /* ---------------- Science: Grade 6 Ontario strands ---------------- */
    'sci-biodiversity': function (p) {
      // A tree of life: one root splitting into four identified organisms,
      // which is what a dichotomous key actually looks like.
      var s = '<g stroke="' + p.stone + '" stroke-width="2.5" fill="none" opacity="0.7">';
      s += '<path d="M160 152 V126 M160 126 H92 M160 126 H228 M92 126 V96 M228 126 V96"/>';
      s += '<path d="M92 96 H56 M92 96 H128 M228 96 H192 M228 96 H264 M56 96 V72 M128 96 V72 M192 96 V72 M264 96 V72"/>';
      s += '</g>';
      // Four leaf nodes, two of them "identified" in the accent colour.
      var nodes = [[56, 1], [128, 0], [192, 0], [264, 1]];
      for (var i = 0; i < 4; i++) {
        var x = nodes[i][0], lit = nodes[i][1];
        s += '<circle cx="' + x + '" cy="58" r="15" fill="' + (lit ? p.accent : p.stone) + '" opacity="' + (lit ? 0.95 : 0.32) + '"/>';
      }
      // Leaf pair at the root, so the scene reads as living things.
      s += '<path d="M160 152 c-16-6-24-20-22-34 14-2 26 6 30 18" fill="' + p.accent + '" opacity="0.85"/>';
      s += '<path d="M160 152 c16-6 24-20 22-34-14-2-26 6-30 18" fill="' + p.stone + '" opacity="0.42"/>';
      s += '<circle cx="160" cy="126" r="7" fill="' + p.stone + '" opacity="0.85"/>';
      return s + ground(p);
    },

    'sci-flight': function (p) {
      // Aerofoil in a wind tunnel: streamlines crowd over the curved upper
      // surface, which is the whole of Bernoulli in one picture.
      var s = '<g stroke="' + p.stone + '" stroke-width="2.2" fill="none" opacity="0.5" stroke-linecap="round">';
      s += '<path d="M8 62 C 96 50, 150 44, 312 56"/>';
      s += '<path d="M8 78 C 96 62, 150 56, 312 74"/>';
      s += '<path d="M8 132 C 96 140, 150 144, 312 132"/>';
      s += '<path d="M8 150 C 96 156, 150 158, 312 150"/>';
      s += '</g>';
      // The wing itself.
      s += '<path d="M64 112 C 110 82, 196 80, 258 100 C 200 112, 132 120, 64 112 Z" fill="' + p.stone + '" opacity="0.92"/>';
      s += '<path d="M64 112 C 132 120, 200 112, 258 100 C 196 110, 128 116, 64 112 Z" fill="' + p.shade + '" opacity="0.7"/>';
      // Lift up, weight down.
      s += '<g stroke="' + p.accent + '" stroke-width="4" stroke-linecap="round">';
      s += '<path d="M160 92 V44"/><path d="M160 128 V172"/></g>';
      s += '<g fill="' + p.accent + '">';
      s += '<path d="M160 34 l9 15 h-18 z"/><path d="M160 182 l9-15 h-18 z"/></g>';
      return s;
    },

    'sci-space': function (p) {
      // Sun at the left limb with three orbits and a satellite trail.
      var s = '';
      for (var i = 0; i < 40; i++) {
        var sx = (i * 97) % 320, sy = (i * 53) % 200;
        s += '<circle cx="' + sx + '" cy="' + sy + '" r="' + (i % 3 === 0 ? 1.6 : 1) + '" fill="' + p.stone + '" opacity="0.45"/>';
      }
      s += '<circle cx="34" cy="100" r="46" fill="' + p.accent + '" opacity="0.2"/>';
      s += '<circle cx="34" cy="100" r="27" fill="' + p.accent + '"/>';
      s += '<g stroke="' + p.stone + '" stroke-width="2" fill="none" opacity="0.55">';
      s += '<ellipse cx="34" cy="100" rx="96" ry="66"/>';
      s += '<ellipse cx="34" cy="100" rx="150" ry="86"/>';
      s += '<ellipse cx="34" cy="100" rx="206" ry="104"/></g>';
      s += '<circle cx="126" cy="60" r="8" fill="' + p.stone + '" opacity="0.9"/>';
      s += '<circle cx="176" cy="150" r="12" fill="' + p.accent + '" opacity="0.9"/>';
      s += '<circle cx="180" cy="146" r="4.5" fill="' + p.ink + '" opacity="0.35"/>';
      s += '<circle cx="238" cy="52" r="6" fill="' + p.stone + '" opacity="0.65"/>';
      // Canadarm-style boom reaching in from the top right.
      s += '<g stroke="' + p.stone + '" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.9">';
      s += '<path d="M312 22 L276 54 L292 88"/></g>';
      s += '<rect x="284" y="86" width="18" height="9" rx="3" fill="' + p.accent + '"/>';
      return s;
    },

    'sci-electricity': function (p) {
      // A closed loop with a cell and a lit lamp: the smallest complete circuit.
      var s = '<rect x="46" y="46" width="228" height="108" rx="12" fill="none" stroke="' + p.stone + '" stroke-width="4" opacity="0.75"/>';
      // Battery cell on the bottom rail.
      s += '<rect x="118" y="140" width="34" height="28" rx="4" fill="' + p.ink + '" opacity="0.85"/>';
      s += '<g stroke="' + p.stone + '" stroke-width="4" stroke-linecap="round">';
      s += '<path d="M128 146 V162"/><path d="M142 150 V158"/></g>';
      // Lamp on the top rail, glowing.
      s += '<circle cx="160" cy="46" r="26" fill="' + p.accent + '" opacity="0.22"/>';
      s += '<circle cx="160" cy="46" r="16" fill="' + p.accent + '"/>';
      s += '<path d="M154 54 h12 M156 60 h8" stroke="' + p.ink + '" stroke-width="3" stroke-linecap="round" opacity="0.6"/>';
      // Charge carriers travelling the rails.
      s += '<g fill="' + p.stone + '">';
      s += '<circle cx="46" cy="86" r="5"/><circle cx="46" cy="120" r="5"/>';
      s += '<circle cx="274" cy="80" r="5"/><circle cx="274" cy="116" r="5"/>';
      s += '<circle cx="216" cy="154" r="5"/><circle cx="80" cy="154" r="5"/></g>';
      // Discharge bolt across the gap, for the static half of the strand.
      s += '<path d="M252 26 L232 62 h14 l-8 30 24-40 h-14 z" fill="' + p.accent + '" opacity="0.9"/>';
      return s;
    },

    /* ---------------- Math (Grade 5/6) ---------------- */
    'math-fractions': function (p) {
      // Three pies at halves / thirds / quarters.
      var s = '';
      var cfg = [[78, 2], [160, 3], [242, 4]];
      for (var k = 0; k < cfg.length; k++) {
        var cx = cfg[k][0], n = cfg[k][1], cy = 100, r = 36;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + p.stone + '" opacity="0.22" stroke="' + p.stone + '" stroke-width="2.5"/>';
        var a0 = -Math.PI / 2, a1 = a0 + 2 * Math.PI / n;
        s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) +
          ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + ' Z" fill="' + p.accent + '"/>';
        for (var i = 0; i < n; i++) {
          var a = a0 + i * 2 * Math.PI / n;
          s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r * Math.cos(a)).toFixed(1) + '" y2="' + (cy + r * Math.sin(a)).toFixed(1) + '" stroke="' + p.stone + '" stroke-width="2.5"/>';
        }
        s += '<text x="' + cx + '" y="164" font-family="Montserrat,sans-serif" font-size="15" font-weight="800" fill="' + p.stone + '" text-anchor="middle" opacity="0.85">1/' + n + '</text>';
      }
      return s;
    },

    'math-geometry': function (p) {
      var s = '<path d="M40 152 L112 44 L184 152 Z" fill="none" stroke="' + p.accent + '" stroke-width="4" stroke-linejoin="round"/>';
      s += '<rect x="176" y="86" width="66" height="66" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<circle cx="248" cy="62" r="32" fill="none" stroke="' + p.stone + '" stroke-width="4" opacity="0.7"/>';
      s += '<path d="M40 152 h144" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<path d="M176 140 h12 v12" fill="none" stroke="' + p.accent + '" stroke-width="3"/>';
      return s;
    },

    'math-operations': function (p) {
      var s = '';
      var ops = ['+', '−', '×', '÷'];
      for (var i = 0; i < 4; i++) {
        var x = 30 + i * 70, lit = i === 2;
        s += '<rect x="' + x + '" y="62" width="58" height="58" rx="12" fill="' + (lit ? p.accent : p.stone) + '" opacity="' + (lit ? 0.95 : 0.24) + '"/>';
        s += '<text x="' + (x + 29) + '" y="104" font-family="Montserrat,sans-serif" font-size="32" font-weight="800" fill="' + (lit ? p.ink : p.stone) + '" text-anchor="middle">' + ops[i] + '</text>';
      }
      s += '<rect x="30" y="140" width="260" height="5" rx="2.5" fill="' + p.stone + '" opacity="0.3"/>';
      s += '<rect x="30" y="140" width="150" height="5" rx="2.5" fill="' + p.accent + '"/>';
      return s;
    },

    'math-worksheet': function (p) {
      var s = '<rect x="72" y="24" width="176" height="152" rx="6" fill="' + p.stone + '"/>';
      s += '<rect x="88" y="44" width="88" height="9" rx="4.5" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.ink + '" opacity="0.28">';
      for (var i = 0; i < 6; i++) s += '<rect x="88" y="' + (68 + i * 17) + '" width="' + (144 - (i % 3) * 34) + '" height="7" rx="3.5"/>';
      s += '</g>';
      s += '<g stroke="' + p.accent + '" stroke-width="3" fill="none" stroke-linecap="round"><path d="M196 148 l10 10 l20 -24"/></g>';
      return s;
    },

    /* ---------------- Grade 3 ---------------- */
    'g3-clock': function (p) {
      var s = '<circle cx="160" cy="100" r="66" fill="' + p.stone + '" opacity="0.16" stroke="' + p.stone + '" stroke-width="4"/>';
      for (var i = 0; i < 12; i++) {
        var a = i * 30 * Math.PI / 180;
        s += '<line x1="' + (160 + 54 * Math.sin(a)).toFixed(1) + '" y1="' + (100 - 54 * Math.cos(a)).toFixed(1) +
             '" x2="' + (160 + 62 * Math.sin(a)).toFixed(1) + '" y2="' + (100 - 62 * Math.cos(a)).toFixed(1) +
             '" stroke="' + p.stone + '" stroke-width="' + (i % 3 === 0 ? 4 : 2) + '" opacity="0.8"/>';
      }
      s += '<line x1="160" y1="100" x2="160" y2="64" stroke="' + p.accent + '" stroke-width="6" stroke-linecap="round"/>';
      s += '<line x1="160" y1="100" x2="200" y2="116" stroke="' + p.stone + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<circle cx="160" cy="100" r="6" fill="' + p.accent + '"/>';
      return s;
    },

    'g3-numberline': function (p) {
      var s = '<line x1="24" y1="132" x2="296" y2="132" stroke="' + p.stone + '" stroke-width="4"/>';
      for (var i = 0; i < 7; i++) {
        var x = 30 + i * 44;
        s += '<line x1="' + x + '" y1="124" x2="' + x + '" y2="140" stroke="' + p.stone + '" stroke-width="3" opacity="0.85"/>';
      }
      // Jump arcs: one big, two small.
      s += '<path d="M30 128 q66 -70 132 0" fill="none" stroke="' + p.accent + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<path d="M162 128 q22 -34 44 0" fill="none" stroke="' + p.accent + '" stroke-width="4" opacity="0.75" stroke-linecap="round"/>';
      s += '<path d="M206 128 q22 -26 44 0" fill="none" stroke="' + p.accent + '" stroke-width="4" opacity="0.55" stroke-linecap="round"/>';
      s += '<circle cx="30" cy="132" r="7" fill="' + p.accent + '"/><circle cx="250" cy="132" r="7" fill="' + p.stone + '"/>';
      return s;
    },

    'g3-money': function (p) {
      var s = '';
      var coins = [[92, 116, 34], [148, 104, 27], [196, 118, 22], [236, 106, 18]];
      for (var i = 0; i < coins.length; i++) {
        var c = coins[i];
        s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + (i % 2 ? p.stone : p.accent) + '" opacity="' + (i % 2 ? 0.5 : 0.95) + '"/>';
        s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (c[2] - 6) + '" fill="none" stroke="' + p.ink + '" stroke-width="2" opacity="0.28"/>';
      }
      s += '<rect x="60" y="40" width="104" height="42" rx="5" fill="' + p.stone + '" opacity="0.85"/>';
      s += '<text x="112" y="70" font-family="Montserrat,sans-serif" font-size="24" font-weight="800" fill="' + p.ink + '" text-anchor="middle">$</text>';
      return s + ground(p);
    },

    'g3-times': function (p) {
      var s = '';
      for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
        var lit = r < 2 && c < 3;
        s += '<circle cx="' + (78 + c * 33) + '" cy="' + (54 + r * 32) + '" r="11" fill="' + (lit ? p.accent : p.stone) + '" opacity="' + (lit ? 0.95 : 0.24) + '"/>';
      }
      s += '<text x="160" y="188" font-family="Montserrat,sans-serif" font-size="17" font-weight="800" fill="' + p.stone + '" text-anchor="middle" opacity="0.85">2 × 3 = 6</text>';
      return s;
    },

    'g3-column': function (p) {
      // Column addition with a carry mark.
      var s = '<g font-family="Montserrat,sans-serif" font-size="40" font-weight="800" text-anchor="end">';
      s += '<text x="212" y="76" fill="' + p.stone + '">248</text>';
      s += '<text x="212" y="124" fill="' + p.stone + '">176</text>';
      s += '<text x="128" y="124" fill="' + p.accent + '">+</text></g>';
      s += '<rect x="118" y="136" width="96" height="4" rx="2" fill="' + p.stone + '"/>';
      s += '<text x="212" y="180" font-family="Montserrat,sans-serif" font-size="40" font-weight="800" text-anchor="end" fill="' + p.accent + '">424</text>';
      s += '<circle cx="152" cy="40" r="13" fill="' + p.accent + '"/>';
      s += '<text x="152" y="46" font-family="Montserrat,sans-serif" font-size="15" font-weight="800" fill="' + p.ink + '" text-anchor="middle">1</text>';
      return s;
    },

    'g3-column-borrow': function (p) {
      // Column subtraction with a borrow strike-through.
      var s = '<g font-family="Montserrat,sans-serif" font-size="40" font-weight="800" text-anchor="end">';
      s += '<text x="212" y="76" fill="' + p.stone + '">305</text>';
      s += '<text x="212" y="124" fill="' + p.stone + '">128</text>';
      s += '<text x="128" y="124" fill="' + p.accent + '">−</text></g>';
      s += '<rect x="118" y="136" width="96" height="4" rx="2" fill="' + p.stone + '"/>';
      s += '<text x="212" y="180" font-family="Montserrat,sans-serif" font-size="40" font-weight="800" text-anchor="end" fill="' + p.accent + '">177</text>';
      s += '<line x1="146" y1="80" x2="176" y2="50" stroke="' + p.accent + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<text x="184" y="46" font-family="Montserrat,sans-serif" font-size="20" font-weight="800" fill="' + p.accent + '" text-anchor="middle">2</text>';
      return s;
    },

    'g3-missing': function (p) {
      // A mystery box inside an equation.
      var s = '<g font-family="Montserrat,sans-serif" font-size="34" font-weight="800" fill="' + p.stone + '" text-anchor="middle">';
      s += '<text x="60" y="114">38</text><text x="100" y="114">+</text>';
      s += '<text x="212" y="114">=</text><text x="264" y="114">95</text></g>';
      s += '<rect x="128" y="76" width="62" height="52" rx="8" fill="none" stroke="' + p.accent + '" stroke-width="4" stroke-dasharray="8 6"/>';
      s += '<text x="159" y="114" font-family="Montserrat,sans-serif" font-size="30" font-weight="800" fill="' + p.accent + '" text-anchor="middle">?</text>';
      return s;
    },

    /* ---------------- Calculus / Stats ---------------- */
    'calc-derivative': function (p) {
      var s = '<line x1="26" y1="164" x2="296" y2="164" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      s += '<line x1="40" y1="20" x2="40" y2="176" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      s += '<path d="M40 150 C 100 40, 150 178, 292 44" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<line x1="112" y1="126" x2="228" y2="52" stroke="' + p.accent + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<circle cx="170" cy="89" r="8" fill="' + p.accent + '"/>';
      return s;
    },

    'calc-integral': function (p) {
      var s = '<line x1="26" y1="164" x2="296" y2="164" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      s += '<path d="M40 140 C 110 24, 190 24, 280 118 L280 164 L40 164 Z" fill="' + p.accent + '" opacity="0.35"/>';
      s += '<path d="M40 140 C 110 24, 190 24, 280 118" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<g stroke="' + p.stone + '" stroke-width="2" opacity="0.5">';
      for (var i = 0; i < 7; i++) { var x = 62 + i * 32; s += '<line x1="' + x + '" y1="164" x2="' + x + '" y2="' + (150 - Math.sin(i / 2.2) * 58) + '"/>'; }
      s += '</g>';
      return s;
    },

    'calc-distribution': function (p) {
      var s = '<line x1="26" y1="160" x2="296" y2="160" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      var hs = [14, 30, 56, 90, 116, 90, 56, 30, 14];
      for (var i = 0; i < hs.length; i++) {
        s += '<rect x="' + (46 + i * 26) + '" y="' + (156 - hs[i]) + '" width="20" height="' + hs[i] + '" rx="3" fill="' + (i === 4 ? p.accent : p.stone) + '" opacity="' + (i === 4 ? 0.95 : 0.42) + '"/>';
      }
      s += '<path d="M46 152 C 100 150, 116 34, 160 34 S 220 150, 282 152" fill="none" stroke="' + p.accent + '" stroke-width="3.5"/>';
      return s;
    },

    'calc-regression': function (p) {
      var s = '<line x1="34" y1="164" x2="296" y2="164" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      s += '<line x1="46" y1="20" x2="46" y2="176" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      var pts = [[70, 140], [98, 128], [124, 132], [150, 108], [176, 96], [202, 88], [228, 66], [256, 58]];
      s += '<line x1="62" y1="148" x2="272" y2="48" stroke="' + p.accent + '" stroke-width="4" stroke-linecap="round"/>';
      for (var i = 0; i < pts.length; i++) s += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="6.5" fill="' + p.stone + '"/>';
      return s;
    },

    'calc-exam': function (p) {
      var s = '<rect x="66" y="20" width="188" height="160" rx="5" fill="' + p.stone + '"/>';
      s += '<rect x="84" y="40" width="152" height="8" rx="4" fill="' + p.ink + '" opacity="0.5"/>';
      s += '<g fill="' + p.ink + '" opacity="0.22">';
      for (var i = 0; i < 7; i++) s += '<rect x="84" y="' + (62 + i * 16) + '" width="' + (152 - (i % 4) * 30) + '" height="6" rx="3"/>';
      s += '</g>';
      s += '<circle cx="212" cy="150" r="20" fill="' + p.accent + '"/>';
      s += '<text x="212" y="157" font-family="Montserrat,sans-serif" font-size="17" font-weight="800" fill="' + p.ink + '" text-anchor="middle">A</text>';
      return s;
    },

    'calc-tangent': function (p) {
      // Curve with its two extrema called out.
      var s = '<line x1="26" y1="164" x2="296" y2="164" stroke="' + p.stone + '" stroke-width="3" opacity="0.6"/>';
      s += '<path d="M40 60 C 96 190, 160 12, 220 140 S 280 150, 292 120" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<line x1="76" y1="140" x2="150" y2="140" stroke="' + p.accent + '" stroke-width="3.5" stroke-linecap="round"/>';
      s += '<line x1="130" y1="52" x2="200" y2="52" stroke="' + p.accent + '" stroke-width="3.5" stroke-linecap="round"/>';
      s += '<circle cx="113" cy="140" r="8" fill="' + p.accent + '"/><circle cx="165" cy="52" r="8" fill="' + p.accent + '"/>';
      return s;
    },

    'calc-roots': function (p) {
      // Curve crossing the axis, roots marked.
      var s = '<line x1="26" y1="110" x2="296" y2="110" stroke="' + p.stone + '" stroke-width="3" opacity="0.7"/>';
      s += '<line x1="46" y1="20" x2="46" y2="180" stroke="' + p.stone + '" stroke-width="3" opacity="0.5"/>';
      s += '<path d="M52 40 C 110 200, 150 20, 200 160 S 268 96, 292 66" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<g fill="' + p.accent + '"><circle cx="86" cy="110" r="8"/><circle cx="140" cy="110" r="8"/><circle cx="228" cy="110" r="8"/></g>';
      s += '<g stroke="' + p.accent + '" stroke-width="2" stroke-dasharray="5 5" opacity="0.7">';
      s += '<line x1="86" y1="110" x2="86" y2="180"/><line x1="140" y1="110" x2="140" y2="180"/><line x1="228" y1="110" x2="228" y2="180"/></g>';
      return s;
    },

    'calc-table': function (p) {
      // 2x2 contingency table.
      var s = '<rect x="66" y="42" width="188" height="118" rx="6" fill="' + p.stone + '" opacity="0.16" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<line x1="160" y1="42" x2="160" y2="160" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<line x1="66" y1="101" x2="254" y2="101" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<g font-family="Montserrat,sans-serif" font-size="24" font-weight="800" text-anchor="middle">';
      s += '<text x="113" y="82" fill="' + p.accent + '">a</text><text x="207" y="82" fill="' + p.stone + '">b</text>';
      s += '<text x="113" y="141" fill="' + p.stone + '">c</text><text x="207" y="141" fill="' + p.accent + '">d</text></g>';
      s += '<text x="160" y="188" font-family="Georgia,serif" font-size="18" font-weight="700" fill="' + p.accent + '" text-anchor="middle">χ²</text>';
      return s;
    },

    /* ---------------- Coffee ---------------- */
    'coffee-cup': function (p) {
      var s = sun(p, 160, 74, 56);
      s += '<path d="M84 74 h116 v46 a34 34 0 0 1-34 34 h-48 a34 34 0 0 1-34-34 z" fill="' + p.stone + '"/>';
      s += '<path d="M200 86 h14 a22 22 0 0 1 0 44 h-14" fill="none" stroke="' + p.stone + '" stroke-width="7"/>';
      s += '<ellipse cx="142" cy="76" rx="58" ry="10" fill="' + p.accent + '"/>';
      s += '<g stroke="' + p.stone + '" stroke-width="4" fill="none" opacity="0.55" stroke-linecap="round">';
      s += '<path d="M124 56 q10 -12 0 -24"/><path d="M148 56 q10 -12 0 -24"/><path d="M172 56 q10 -12 0 -24"/></g>';
      s += '<rect x="86" y="160" width="150" height="8" rx="4" fill="' + p.ink + '" opacity="0.5"/>';
      return s;
    },

    'coffee-belt': function (p) {
      // Globe with the coffee belt band.
      var s = '<circle cx="160" cy="100" r="70" fill="' + p.stone + '" opacity="0.16" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<path d="M90 100 a70 70 0 0 0 140 0 a70 70 0 0 0 -140 0" fill="none" stroke="' + p.stone + '" stroke-width="2.5" opacity="0.45"/>';
      s += '<rect x="90" y="86" width="140" height="28" fill="' + p.accent + '" opacity="0.55"/>';
      s += '<g fill="none" stroke="' + p.stone + '" stroke-width="2.5" opacity="0.5">';
      s += '<ellipse cx="160" cy="100" rx="30" ry="70"/><ellipse cx="160" cy="100" rx="58" ry="70"/></g>';
      s += '<g fill="' + p.accent + '"><circle cx="126" cy="94" r="6"/><circle cx="172" cy="106" r="6"/><circle cx="206" cy="96" r="6"/></g>';
      return s;
    },

    'coffee-cherry': function (p) {
      var s = '<circle cx="122" cy="112" r="42" fill="' + p.accent + '"/>';
      s += '<circle cx="122" cy="112" r="26" fill="' + p.stone + '" opacity="0.35"/>';
      s += '<ellipse cx="122" cy="112" rx="13" ry="24" fill="' + p.stone + '"/>';
      s += '<path d="M122 112 q6 -18 0 -36" stroke="' + p.ink + '" stroke-width="2.5" fill="none" opacity="0.4"/>';
      s += '<path d="M122 70 q-4 -22 -30 -30 q6 26 30 30" fill="' + p.stone + '" opacity="0.55"/>';
      s += '<g fill="none" stroke="' + p.stone + '" stroke-width="3" opacity="0.75">';
      s += '<circle cx="224" cy="80" r="24"/><circle cx="238" cy="132" r="18"/></g>';
      return s;
    },

    'coffee-roast': function (p) {
      var s = '';
      var shades = ['#d8b48a', '#bb8b56', '#96632f', '#6f4318', '#45280c'];
      for (var i = 0; i < shades.length; i++) {
        s += '<ellipse cx="' + (58 + i * 51) + '" cy="100" rx="22" ry="30" fill="' + shades[i] + '"/>';
        s += '<path d="M' + (58 + i * 51) + ' 72 q7 28 0 56" stroke="' + p.ink + '" stroke-width="2.5" fill="none" opacity="0.5"/>';
      }
      s += '<rect x="34" y="150" width="252" height="6" rx="3" fill="' + p.stone + '" opacity="0.28"/>';
      s += '<rect x="34" y="150" width="160" height="6" rx="3" fill="' + p.accent + '"/>';
      return s;
    },

    'coffee-flavour': function (p) {
      // Flavour wheel segments.
      var s = '';
      var cols = [p.accent, '#c84b31', '#2d6a4f', '#831843', '#d8b48a', '#7c3aed'];
      for (var i = 0; i < 12; i++) {
        var a0 = i * 30 * Math.PI / 180, a1 = (i + 1) * 30 * Math.PI / 180;
        var r0 = 26, r1 = 68;
        s += '<path d="M' + (160 + r0 * Math.cos(a0)).toFixed(1) + ' ' + (100 + r0 * Math.sin(a0)).toFixed(1) +
          ' L' + (160 + r1 * Math.cos(a0)).toFixed(1) + ' ' + (100 + r1 * Math.sin(a0)).toFixed(1) +
          ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + (160 + r1 * Math.cos(a1)).toFixed(1) + ' ' + (100 + r1 * Math.sin(a1)).toFixed(1) +
          ' L' + (160 + r0 * Math.cos(a1)).toFixed(1) + ' ' + (100 + r0 * Math.sin(a1)).toFixed(1) +
          ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + (160 + r0 * Math.cos(a0)).toFixed(1) + ' ' + (100 + r0 * Math.sin(a0)).toFixed(1) + ' Z" fill="' + cols[i % 6] + '" opacity="0.85"/>';
      }
      s += '<circle cx="160" cy="100" r="20" fill="' + p.stone + '"/>';
      return s;
    },

    'coffee-brew': function (p) {
      // V60 dripper over a carafe.
      var s = '<path d="M104 46 h112 L172 122 h-24 z" fill="' + p.stone + '" opacity="0.9"/>';
      s += '<g stroke="' + p.ink + '" stroke-width="2" opacity="0.25">';
      for (var i = 1; i < 6; i++) s += '<line x1="' + (104 + i * 18.6) + '" y1="46" x2="' + (148 + i * 8) + '" y2="122"/>';
      s += '</g>';
      s += '<rect x="98" y="38" width="124" height="10" rx="5" fill="' + p.accent + '"/>';
      s += '<path d="M160 122 v14" stroke="' + p.accent + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<path d="M118 140 h84 v22 a18 18 0 0 1-18 18 h-48 a18 18 0 0 1-18-18 z" fill="' + p.stone + '" opacity="0.35" stroke="' + p.stone + '" stroke-width="3"/>';
      s += '<path d="M120 158 h80 v4 a18 18 0 0 1-18 18 h-44 a18 18 0 0 1-18-18 z" fill="' + p.accent + '" opacity="0.8"/>';
      return s;
    },

    'coffee-journal': function (p) {
      var s = '<rect x="72" y="26" width="176" height="150" rx="5" fill="' + p.stone + '"/>';
      s += '<rect x="72" y="26" width="16" height="150" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.ink + '" opacity="0.24">';
      for (var i = 0; i < 6; i++) s += '<rect x="102" y="' + (52 + i * 20) + '" width="' + (126 - (i % 3) * 28) + '" height="6" rx="3"/>';
      s += '</g>';
      s += '<g fill="' + p.accent + '">';
      for (var j = 0; j < 5; j++) s += '<circle cx="' + (112 + j * 20) + '" cy="160" r="6" opacity="' + (j < 4 ? 1 : 0.3) + '"/>';
      s += '</g>';
      return s;
    },

    'coffee-mountain': function (p) {
      // High-altitude terroir.
      var s = sun(p, 240, 48, 30);
      s += '<path d="M-10 160 L70 68 L118 126 L168 52 L246 160 Z" fill="' + p.stone + '" opacity="0.55"/>';
      s += '<path d="M96 160 L172 74 L226 132 L272 88 L340 160 Z" fill="' + p.stone + '" opacity="0.9"/>';
      s += '<path d="M168 52 L146 82 h44 z" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.accent + '" opacity="0.9"><circle cx="196" cy="140" r="7"/><circle cx="222" cy="148" r="7"/><circle cx="170" cy="150" r="7"/></g>';
      return s + ground(p);
    },

    'coffee-varietal': function (p) {
      // Branch with paired leaves and cherries.
      var s = '<path d="M52 170 C 110 140, 150 92, 268 40" fill="none" stroke="' + p.stone + '" stroke-width="5" stroke-linecap="round"/>';
      var pts = [[104, 142], [146, 116], [188, 90], [230, 64]];
      for (var i = 0; i < pts.length; i++) {
        var x = pts[i][0], y = pts[i][1];
        s += '<ellipse cx="' + (x - 20) + '" cy="' + (y - 22) + '" rx="24" ry="12" transform="rotate(-38 ' + (x - 20) + ' ' + (y - 22) + ')" fill="' + p.stone + '" opacity="0.85"/>';
        s += '<ellipse cx="' + (x + 20) + '" cy="' + (y + 22) + '" rx="24" ry="12" transform="rotate(-38 ' + (x + 20) + ' ' + (y + 22) + ')" fill="' + p.stone + '" opacity="0.55"/>';
        s += '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + p.accent + '"/>';
      }
      return s;
    },

    'coffee-processing': function (p) {
      // Three drying beds: washed, honey, natural.
      var s = '';
      var tone = ['#dff3fb', p.accent, '#c84b31'];
      for (var i = 0; i < 3; i++) {
        var x = 26 + i * 96;
        s += '<rect x="' + x + '" y="56" width="80" height="92" rx="8" fill="' + p.stone + '" opacity="0.18" stroke="' + p.stone + '" stroke-width="2.5"/>';
        for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
          s += '<circle cx="' + (x + 22 + c * 18) + '" cy="' + (78 + r * 25) + '" r="7" fill="' + tone[i] + '" opacity="0.92"/>';
        }
        s += '<rect x="' + (x + 24) + '" y="158" width="32" height="5" rx="2.5" fill="' + tone[i] + '" opacity="0.8"/>';
      }
      return s;
    },

    'generic-quiz': function (p) {
      // Laurel wreath framing a target: the "test yourself" mark.
      var s = '<circle cx="160" cy="98" r="52" fill="none" stroke="' + p.stone + '" stroke-width="4"/>';
      s += '<circle cx="160" cy="98" r="32" fill="none" stroke="' + p.stone + '" stroke-width="4" opacity="0.6"/>';
      s += '<circle cx="160" cy="98" r="13" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.accent + '" opacity="0.9">';
      for (var i = 0; i < 7; i++) {
        var a = (150 + i * 12) * Math.PI / 180, b = (390 - i * 12) * Math.PI / 180;
        var ax = (160 + 72 * Math.cos(a)).toFixed(1), ay = (98 + 72 * Math.sin(a)).toFixed(1);
        var bx = (160 + 72 * Math.cos(b)).toFixed(1), by = (98 + 72 * Math.sin(b)).toFixed(1);
        s += '<ellipse cx="' + ax + '" cy="' + ay + '" rx="9" ry="4.5" transform="rotate(' + (150 + i * 12) + ' ' + ax + ' ' + ay + ')"/>';
        s += '<ellipse cx="' + bx + '" cy="' + by + '" rx="9" ry="4.5" transform="rotate(' + (390 - i * 12) + ' ' + bx + ' ' + by + ')"/>';
      }
      s += '</g>';
      return s;
    },

    /* ---------------- generic fallbacks ---------------- */
    'generic-quest': function (p) {
      var s = sun(p, 160, 84, 58);
      s += '<path d="M62 150 L120 62 L160 108 L206 46 L262 150 Z" fill="' + p.stone + '" opacity="0.9"/>';
      s += '<path d="M206 46 l16 26 h-32 z" fill="' + p.accent + '"/>';
      return s + ground(p);
    },
    'generic-lesson': function (p) {
      var s = '<path d="M52 58 q56 -20 108 0 v92 q-52 -18 -108 0 z" fill="' + p.stone + '" opacity="0.9"/>';
      s += '<path d="M268 58 q-56 -20 -108 0 v92 q52 -18 108 0 z" fill="' + p.stone + '" opacity="0.65"/>';
      s += '<rect x="156" y="52" width="8" height="102" rx="4" fill="' + p.accent + '"/>';
      return s;
    },
    'generic-printable': function (p) {
      var s = '<rect x="86" y="24" width="148" height="152" rx="5" fill="' + p.stone + '"/>';
      s += '<rect x="104" y="46" width="76" height="9" rx="4.5" fill="' + p.accent + '"/>';
      s += '<g fill="' + p.ink + '" opacity="0.24">';
      for (var i = 0; i < 6; i++) s += '<rect x="104" y="' + (70 + i * 17) + '" width="' + (112 - (i % 3) * 26) + '" height="6" rx="3"/>';
      s += '</g>';
      return s;
    }
  };

  var FALLBACK = { quest: 'generic-quest', lesson: 'generic-lesson', printable: 'generic-printable' };

  /**
   * Render key art as an inline SVG string.
   * @param {string} scene   key in SCENES
   * @param {string} family  key in FAMILIES
   * @param {string} [kind]  quest|lesson|printable, used if scene is unknown
   */
  function art(scene, family, kind) {
    var p = FAMILIES[family] || FAMILIES.science;
    var draw = SCENES[scene] || SCENES[FALLBACK[kind] || 'generic-quest'];
    var uid = 'sfg-' + (scene || 'x') + '-' + (family || 'y');
    return '<svg class="sf-keyart" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" ' +
      'preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      bg(p, uid) + draw(p) + '</svg>';
  }

  function palette(family) { return FAMILIES[family] || FAMILIES.science; }

  global.SFKeyArt = { art: art, palette: palette, scenes: Object.keys(SCENES), families: Object.keys(FAMILIES) };
})(window);
