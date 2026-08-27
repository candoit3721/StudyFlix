/**
 * StudyFlix Avatar Studio
 * ---------------------------------------------------------------------------
 * Full-colour character avatars for profile pictures.
 *
 * Rationale (design review): the functional icon set in icons.js is deliberately
 * monochrome line art, which is right for buttons and badges but reads as flat
 * and clinical when it is a KID'S own picture. A profile picture is the one
 * place in the product that should feel like a toy, so these are drawn as
 * illustrated characters: multiple fills, cheeks, highlights, and a playful
 * name each.
 *
 * Everything is authored on a 64x64 grid and is pure inline SVG, so an avatar
 * renders identically on every device, scales from a 28px nav chip to a 140px
 * profile tile, and never depends on platform emoji fonts.
 */
(function (global) {
  'use strict';

  // Gradient ids are document-global, so every rendered avatar gets its own.
  var seq = 0;

  /* ---------------------------------------------------------------------
     Drawing helpers. Kept tiny and shared so every character's eyes,
     cheeks, and smiles sit on the same optical system.
     ------------------------------------------------------------------- */

  function n(v) { return Math.round(v * 100) / 100; }

  /** Big cartoon eye: white, dark iris, offset catch-light. */
  function eye(x, y, r) {
    return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(r) + '" ry="' + n(r * 1.15) + '" fill="#ffffff"/>' +
      '<circle cx="' + n(x) + '" cy="' + n(y + r * 0.16) + '" r="' + n(r * 0.58) + '" fill="#22223b"/>' +
      '<circle cx="' + n(x + r * 0.28) + '" cy="' + n(y - r * 0.32) + '" r="' + n(r * 0.24) + '" fill="#ffffff"/>';
  }

  /** Solid bead eye, for characters whose fur already reads as the sclera. */
  function bead(x, y, r) {
    return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="#22223b"/>' +
      '<circle cx="' + n(x + r * 0.32) + '" cy="' + n(y - r * 0.36) + '" r="' + n(r * 0.34) + '" fill="#ffffff"/>';
  }

  function blush(x, y, c) {
    return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="4" ry="2.4" fill="' + (c || '#fb7185') + '" opacity="0.5"/>';
  }

  /** Upward smile arc centred on x. */
  function smile(x, y, w, c, sw) {
    return '<path d="M' + n(x - w) + ' ' + n(y) + 'q' + n(w) + ' ' + n(w * 0.95) + ' ' + n(w * 2) + ' 0" fill="none" stroke="' +
      (c || '#3f2a1d') + '" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round"/>';
  }

  function sparkle(x, y, r, c, o) {
    return '<path d="M' + n(x) + ' ' + n(y - r) + 'q' + n(r * 0.28) + ' ' + n(r * 0.72) + ' ' + n(r) + ' ' + n(r) +
      'q' + n(-r * 0.72) + ' ' + n(r * 0.28) + ' ' + n(-r) + ' ' + n(r) +
      'q' + n(-r * 0.28) + ' ' + n(-r * 0.72) + ' ' + n(-r) + ' ' + n(-r) +
      'q' + n(r * 0.72) + ' ' + n(-r * 0.28) + ' ' + n(r) + ' ' + n(-r) + 'Z" fill="' + (c || '#ffffff') + '" opacity="' + (o || 0.85) + '"/>';
  }

  /* ---------------------------------------------------------------------
     The cast. Each entry: a playful name kids can pick by, and the art.
     ------------------------------------------------------------------- */

  var CHARACTERS = [
    {
      id: 'fox', label: 'Clever Fox',
      draw: function () {
        return '<path d="M13 25 10 6 28 16Z" fill="#ea580c"/><path d="M51 25 54 6 36 16Z" fill="#ea580c"/>' +
          '<path d="M15.8 21.5 14.2 11 23.4 16.2Z" fill="#7f1d1d"/><path d="M48.2 21.5 49.8 11 40.6 16.2Z" fill="#7f1d1d"/>' +
          '<path d="M32 13c10.6 0 18.2 7.6 18.2 17.6C50.2 42.2 42.1 50.5 32 50.5S13.8 42.2 13.8 30.6C13.8 20.6 21.4 13 32 13Z" fill="#f97316"/>' +
          '<path d="M32 30.5c8.7 0 14.7 4.6 14.7 10.5 0 5.6-6.6 9.5-14.7 9.5s-14.7-3.9-14.7-9.5c0-5.9 6-10.5 14.7-10.5Z" fill="#fff7ed"/>' +
          eye(24.6, 27.4, 3.7) + eye(39.4, 27.4, 3.7) +
          '<path d="M32 36.2 35.7 39 32 42.4 28.3 39Z" fill="#3b1106"/>' +
          smile(32, 43, 4, '#9a3412', 1.7) +
          blush(20.4, 37.6) + blush(43.6, 37.6);
      }
    },
    {
      id: 'cat', label: 'Cool Cat',
      draw: function () {
        return '<path d="M14 26 12 8 28 16Z" fill="#94a3b8"/><path d="M50 26 52 8 36 16Z" fill="#94a3b8"/>' +
          '<path d="M16.6 22.4 15.4 12.4 23.6 16.6Z" fill="#f9a8d4"/><path d="M47.4 22.4 48.6 12.4 40.4 16.6Z" fill="#f9a8d4"/>' +
          '<ellipse cx="32" cy="32" rx="18.2" ry="17.4" fill="#cbd5e1"/>' +
          '<path d="M26 16.6q6-2.6 12 0l-1.4 5.4q-4.6-1.6-9.2 0Z" fill="#94a3b8"/>' +
          '<path d="M20.8 22.6q4-1.4 5.6 2.4l-6.6 1.4Z" fill="#94a3b8"/><path d="M43.2 22.6q-4-1.4-5.6 2.4l6.6 1.4Z" fill="#94a3b8"/>' +
          eye(24.6, 30.4, 4) + eye(39.4, 30.4, 4) +
          '<path d="M32 37.6 34.7 39.8 32 42 29.3 39.8Z" fill="#f472b6"/>' +
          '<path d="M32 42v1.6M32 43.6q-2.6 2.6-5 .6M32 43.6q2.6 2.6 5 .6" fill="none" stroke="#475569" stroke-width="1.6" stroke-linecap="round"/>' +
          '<path d="M13 36.5 6.5 34.6M13 39.4 6.8 40.2M51 36.5 57.5 34.6M51 39.4 57.2 40.2" stroke="#f1f5f9" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>' +
          blush(20, 39) + blush(44, 39);
      }
    },
    {
      id: 'panda', label: 'Chill Panda',
      draw: function () {
        return '<circle cx="16.5" cy="16.5" r="7.4" fill="#1f2937"/><circle cx="47.5" cy="16.5" r="7.4" fill="#1f2937"/>' +
          '<ellipse cx="32" cy="33" rx="18.4" ry="17" fill="#ffffff"/>' +
          '<ellipse cx="24.2" cy="30.4" rx="5.8" ry="6.6" fill="#1f2937" transform="rotate(-14 24.2 30.4)"/>' +
          '<ellipse cx="39.8" cy="30.4" rx="5.8" ry="6.6" fill="#1f2937" transform="rotate(14 39.8 30.4)"/>' +
          eye(24.4, 30.6, 2.7) + eye(39.6, 30.6, 2.7) +
          '<ellipse cx="32" cy="39.4" rx="3.4" ry="2.6" fill="#1f2937"/>' +
          smile(32, 43, 4.2, '#4b5563', 1.7) +
          blush(18.6, 38.4) + blush(45.4, 38.4);
      }
    },
    {
      id: 'owl', label: 'Wise Owl',
      draw: function () {
        return '<path d="M15.5 18 20 8.5 26.5 15.5Z" fill="#6d28d9"/><path d="M48.5 18 44 8.5 37.5 15.5Z" fill="#6d28d9"/>' +
          '<path d="M32 12c11 0 18.5 8.4 18.5 19.6S43.2 51 32 51 13.5 42.8 13.5 31.6 21 12 32 12Z" fill="#8b5cf6"/>' +
          '<path d="M32 33.5c7.4 0 12.6 4.2 12.6 9.6 0 4.6-5.6 7.9-12.6 7.9s-12.6-3.3-12.6-7.9c0-5.4 5.2-9.6 12.6-9.6Z" fill="#c4b5fd" opacity="0.75"/>' +
          '<circle cx="24" cy="28.5" r="8.4" fill="#fefce8"/><circle cx="40" cy="28.5" r="8.4" fill="#fefce8"/>' +
          '<circle cx="24" cy="28.5" r="4.6" fill="#1e1b4b"/><circle cx="40" cy="28.5" r="4.6" fill="#1e1b4b"/>' +
          '<circle cx="25.6" cy="26.8" r="1.7" fill="#ffffff"/><circle cx="41.6" cy="26.8" r="1.7" fill="#ffffff"/>' +
          '<path d="M32 32.6 36.2 37.4 32 42.2 27.8 37.4Z" fill="#f59e0b"/>' +
          '<path d="M22 46.5q4-3.4 10-3.4t10 3.4" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>';
      }
    },
    {
      id: 'dino', label: 'Rex the Dino',
      draw: function () {
        return '<path d="M22 14.5 25.5 7 29.5 13.5ZM30.5 12.5 34.5 5.5 38.5 12ZM39 13.5 43.5 8 45.5 15.5Z" fill="#15803d"/>' +
          '<path d="M32 12.5c10.4 0 17.8 7 17.8 16.4 0 6.4-3.4 11.2-8.6 13.8L41 48.5c0 1.4-1.2 2.4-2.6 2.4H25.6c-1.4 0-2.6-1-2.6-2.4l.2-5.6c-5.6-2.6-9-7.6-9-14C14.2 19.5 21.6 12.5 32 12.5Z" fill="#22c55e"/>' +
          '<path d="M32 33.5c8.4 0 14 3.6 14 8.8 0 5-6 8.6-14 8.6s-14-3.6-14-8.6c0-5.2 5.6-8.8 14-8.8Z" fill="#bbf7d0"/>' +
          eye(24.8, 26.5, 4.1) + eye(39.2, 26.5, 4.1) +
          '<circle cx="27" cy="38.5" r="1.5" fill="#166534"/><circle cx="37" cy="38.5" r="1.5" fill="#166534"/>' +
          '<path d="M22.5 43.5h19" stroke="#166534" stroke-width="1.7" stroke-linecap="round"/>' +
          '<path d="M26 43.5 27.6 46.6 29.2 43.5ZM34.8 43.5 36.4 46.6 38 43.5Z" fill="#ffffff"/>' +
          blush(20.5, 35.5, '#4ade80');
      }
    },
    {
      id: 'unicorn', label: 'Magic Unicorn',
      draw: function () {
        return '<path d="M32 3.5 37.5 17.5 26.5 17.5Z" fill="#fbbf24"/>' +
          '<path d="M29.5 9.5 34.6 9.5M28.2 13.2 35.9 13.2" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>' +
          '<path d="M20 14q-7 3-6.5 12 3-4 6-4.5Z" fill="#f472b6"/><path d="M44 14q7 3 6.5 12-3-4-6-4.5Z" fill="#f472b6"/>' +
          '<path d="M45 17q7.5 1.5 9 9.5-4-2.6-7-2Z" fill="#38bdf8"/><path d="M46 24q7 3 7.5 11-3.6-3.4-6.8-3.6Z" fill="#a78bfa"/>' +
          '<path d="M19 17q-7.5 1.5-9 9.5 4-2.6 7-2Z" fill="#38bdf8"/><path d="M18 24q-7 3-7.5 11 3.6-3.4 6.8-3.6Z" fill="#a78bfa"/>' +
          '<ellipse cx="32" cy="33" rx="17.4" ry="17.6" fill="#ffffff"/>' +
          '<path d="M32 33c7.8 0 13.2 4.2 13.2 9.6 0 4.8-5.8 8.2-13.2 8.2s-13.2-3.4-13.2-8.2C18.8 37.2 24.2 33 32 33Z" fill="#fce7f3"/>' +
          eye(24.8, 29, 3.8) + eye(39.2, 29, 3.8) +
          '<circle cx="28.6" cy="41.4" r="1.5" fill="#f472b6"/><circle cx="35.4" cy="41.4" r="1.5" fill="#f472b6"/>' +
          smile(32, 44.2, 3.6, '#ec4899', 1.7) +
          blush(20.6, 38.6) + blush(43.4, 38.6);
      }
    },
    {
      id: 'robot', label: 'Beep-Bot',
      draw: function () {
        return '<path d="M32 5v6.5" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="5" r="3.2" fill="#f43f5e"/>' +
          '<rect x="12.5" y="26" width="4.5" height="11" rx="2.2" fill="#94a3b8"/><rect x="47" y="26" width="4.5" height="11" rx="2.2" fill="#94a3b8"/>' +
          '<rect x="15.5" y="11.5" width="33" height="33" rx="9" fill="#e2e8f0"/>' +
          '<rect x="19.5" y="16" width="25" height="17.5" rx="5.5" fill="#0f172a"/>' +
          '<circle cx="26.5" cy="24.8" r="3.4" fill="#38bdf8"/><circle cx="37.5" cy="24.8" r="3.4" fill="#38bdf8"/>' +
          '<circle cx="27.5" cy="23.6" r="1.2" fill="#e0f2fe"/><circle cx="38.5" cy="23.6" r="1.2" fill="#e0f2fe"/>' +
          '<rect x="25" y="37" width="14" height="4" rx="2" fill="#94a3b8"/>' +
          '<path d="M27.5 37v4M32 37v4M36.5 37v4" stroke="#e2e8f0" stroke-width="1.2"/>' +
          '<circle cx="19.5" cy="40.5" r="1.6" fill="#f59e0b"/><circle cx="44.5" cy="40.5" r="1.6" fill="#22c55e"/>' +
          '<rect x="24" y="46.5" width="16" height="4.5" rx="2.2" fill="#94a3b8"/>';
      }
    },
    {
      id: 'astronaut', label: 'Star Explorer',
      draw: function () {
        return '<rect x="18" y="40" width="28" height="12" rx="5" fill="#e2e8f0"/>' +
          '<rect x="21" y="43.5" width="8" height="4" rx="2" fill="#f97316"/>' +
          '<circle cx="32" cy="29" r="19" fill="#f1f5f9"/><circle cx="32" cy="29" r="19" fill="none" stroke="#cbd5e1" stroke-width="2"/>' +
          '<rect x="10.5" y="25" width="5" height="9" rx="2.4" fill="#cbd5e1"/><rect x="48.5" y="25" width="5" height="9" rx="2.4" fill="#cbd5e1"/>' +
          '<ellipse cx="32" cy="29.5" rx="13.6" ry="12.4" fill="#0f172a"/>' +
          '<ellipse cx="32" cy="31" rx="9.6" ry="9.2" fill="#f8c8a0"/>' +
          bead(28, 30, 1.9) + bead(36, 30, 1.9) +
          smile(32, 34, 2.8, '#a16207', 1.6) +
          blush(26.6, 34, '#fb7185') + blush(37.4, 34, '#fb7185') +
          '<path d="M22.5 22.5q5-4.5 12-4" fill="none" stroke="#38bdf8" stroke-width="2.6" stroke-linecap="round" opacity="0.75"/>' +
          sparkle(48, 15, 3.4, '#fde68a', 0.95) + sparkle(15.5, 44.5, 2.6, '#fde68a', 0.8);
      }
    },
    {
      id: 'rocket', label: 'Blast-Off',
      draw: function () {
        return '<path d="M20 34q-6 3-7.5 11 6.5-1.5 9.5-5.5Z" fill="#f87171"/><path d="M44 34q6 3 7.5 11-6.5-1.5-9.5-5.5Z" fill="#f87171"/>' +
          '<path d="M32 5c7 6.5 10.5 16 10.5 26.5 0 6-1.2 11-3 14.5h-15c-1.8-3.5-3-8.5-3-14.5C21.5 21 25 11.5 32 5Z" fill="#f8fafc"/>' +
          '<path d="M32 5c3.6 3.4 6.2 7.6 8 12.4h-16C25.8 12.6 28.4 8.4 32 5Z" fill="#ef4444"/>' +
          '<circle cx="32" cy="27" r="7.6" fill="#0ea5e9"/><circle cx="32" cy="27" r="7.6" fill="none" stroke="#cbd5e1" stroke-width="2.2"/>' +
          '<path d="M27.5 23q3-3.2 6.4-2.6" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-linecap="round"/>' +
          '<rect x="23.5" y="38" width="17" height="3.4" rx="1.7" fill="#cbd5e1"/>' +
          '<path d="M26 46h12l-2.5 6q-3.5 3-7 0Z" fill="#fbbf24"/><path d="M28.5 46h7l-1.5 4.6q-2 2-4 0Z" fill="#f97316"/>' +
          sparkle(50.5, 14, 3.2, '#fde68a', 0.9) + sparkle(13.5, 19, 2.4, '#fde68a', 0.8);
      }
    },
    {
      id: 'alien', label: 'Cosmic Alien',
      draw: function () {
        return '<path d="M22 14 18 6" stroke="#4ade80" stroke-width="2.2" stroke-linecap="round"/><circle cx="17.4" cy="5" r="3.2" fill="#facc15"/>' +
          '<path d="M42 14 46 6" stroke="#4ade80" stroke-width="2.2" stroke-linecap="round"/><circle cx="46.6" cy="5" r="3.2" fill="#facc15"/>' +
          '<path d="M32 11.5c11.2 0 18.6 7 18.6 16.6 0 12-8.6 22.4-18.6 22.4S13.4 40.1 13.4 28.1C13.4 18.5 20.8 11.5 32 11.5Z" fill="#4ade80"/>' +
          '<path d="M20.5 24.5q4.5-3 8.5 1 3 3-1.5 6t-8-1.5q-2-3 1-5.5Z" fill="#0f172a"/>' +
          '<path d="M43.5 24.5q-4.5-3-8.5 1-3 3 1.5 6t8-1.5q2-3-1-5.5Z" fill="#0f172a"/>' +
          '<circle cx="24.4" cy="27.4" r="1.7" fill="#a7f3d0"/><circle cx="39.6" cy="27.4" r="1.7" fill="#a7f3d0"/>' +
          smile(32, 39.5, 4.4, '#166534', 1.9) +
          blush(20.4, 36.5, '#22c55e') + blush(43.6, 36.5, '#22c55e');
      }
    },
    {
      id: 'dragon', label: 'Brave Dragon',
      draw: function () {
        // The head is deliberately narrower than the other animals so the wings
        // have room to read as wings rather than as ear-muffs behind the skull.
        return '<path d="M17 21Q3 19 2.5 32.5Q6.5 29 9.5 32.5Q12.5 29 15.5 32.5L18 34Z" fill="#7c3aed"/>' +
          '<path d="M47 21Q61 19 61.5 32.5Q57.5 29 54.5 32.5Q51.5 29 48.5 32.5L46 34Z" fill="#7c3aed"/>' +
          '<path d="M17.5 23Q7 22 6 31Q9 28.5 11.5 31Q14 28.5 16.5 31Z" fill="#a78bfa"/>' +
          '<path d="M46.5 23Q57 22 58 31Q55 28.5 52.5 31Q50 28.5 47.5 31Z" fill="#a78bfa"/>' +
          '<path d="M22.5 19 19 8.5 28.5 15Z" fill="#fbbf24"/><path d="M41.5 19 45 8.5 35.5 15Z" fill="#fbbf24"/>' +
          '<ellipse cx="32" cy="32" rx="15.8" ry="15.6" fill="#0f766e"/>' +
          '<ellipse cx="32" cy="39.2" rx="11" ry="8" fill="#5eead4"/>' +
          '<path d="M21.8 25.4q4.6-3.4 9.2-.6M42.2 25.4q-4.6-3.4-9.2-.6" fill="none" stroke="#115e59" stroke-width="2.4" stroke-linecap="round"/>' +
          eye(26, 29.4, 3.5) + eye(38, 29.4, 3.5) +
          '<ellipse cx="29" cy="36.8" rx="1.5" ry="1.2" fill="#0f766e"/><ellipse cx="35" cy="36.8" rx="1.5" ry="1.2" fill="#0f766e"/>' +
          '<path d="M26.5 41.4q5.5 4 11 0" fill="none" stroke="#0f766e" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M28.4 42.6 29.8 45.6 31.2 42.6ZM32.8 42.6 34.2 45.6 35.6 42.6Z" fill="#ffffff"/>';
      }
    },
    {
      id: 'penguin', label: 'Snow Penguin',
      draw: function () {
        return '<ellipse cx="32" cy="33" rx="18" ry="18.5" fill="#1e293b"/>' +
          '<path d="M32 20.5c7.6 0 12.8 6.4 12.8 15.4 0 9.4-5.4 15.6-12.8 15.6s-12.8-6.2-12.8-15.6c0-9 5.2-15.4 12.8-15.4Z" fill="#f8fafc"/>' +
          '<path d="M32 14.5q7 0 9.8 6.5-4.6 2.4-9.8 2.4t-9.8-2.4Q25 14.5 32 14.5Z" fill="#1e293b"/>' +
          eye(26.4, 28.5, 3.6) + eye(37.6, 28.5, 3.6) +
          '<path d="M32 33.5 37.4 37.6 32 41.4 26.6 37.6Z" fill="#f59e0b"/>' +
          '<path d="M26.6 37.6h10.8" stroke="#d97706" stroke-width="1.1"/>' +
          '<path d="M19 38.5q-8.5 3.5-6 9.5 4.5 2 8-3.5Z" fill="#1e293b"/><path d="M45 38.5q8.5 3.5 6 9.5-4.5 2-8-3.5Z" fill="#1e293b"/>' +
          blush(22, 35.5) + blush(42, 35.5);
      }
    },
    {
      id: 'frog', label: 'Hoppy Frog',
      draw: function () {
        return '<circle cx="21" cy="18" r="8.6" fill="#4ade80"/><circle cx="43" cy="18" r="8.6" fill="#4ade80"/>' +
          '<circle cx="21" cy="18" r="5.4" fill="#ffffff"/><circle cx="43" cy="18" r="5.4" fill="#ffffff"/>' +
          '<circle cx="21.8" cy="18.6" r="3" fill="#14532d"/><circle cx="43.8" cy="18.6" r="3" fill="#14532d"/>' +
          '<circle cx="20.4" cy="17" r="1.2" fill="#ffffff"/><circle cx="42.4" cy="17" r="1.2" fill="#ffffff"/>' +
          '<ellipse cx="32" cy="35" rx="18.5" ry="15.5" fill="#22c55e"/>' +
          '<ellipse cx="32" cy="41.5" rx="14" ry="8.5" fill="#bbf7d0"/>' +
          '<path d="M18.5 34.5q13.5 10 27 0" fill="none" stroke="#166534" stroke-width="2.2" stroke-linecap="round"/>' +
          '<circle cx="27" cy="30.5" r="1.4" fill="#166534"/><circle cx="37" cy="30.5" r="1.4" fill="#166534"/>' +
          blush(21.5, 39, '#34d399') + blush(42.5, 39, '#34d399');
      }
    },
    {
      id: 'bear', label: 'Big Bear',
      draw: function () {
        return '<circle cx="16.5" cy="17.5" r="7.6" fill="#a16207"/><circle cx="47.5" cy="17.5" r="7.6" fill="#a16207"/>' +
          '<circle cx="16.5" cy="17.5" r="4" fill="#fbbf24"/><circle cx="47.5" cy="17.5" r="4" fill="#fbbf24"/>' +
          '<ellipse cx="32" cy="33" rx="18.4" ry="17.4" fill="#b45309"/>' +
          '<ellipse cx="32" cy="40.5" rx="11.4" ry="9" fill="#fcd34d"/>' +
          eye(25.2, 29.5, 3.4) + eye(38.8, 29.5, 3.4) +
          '<ellipse cx="32" cy="37" rx="3.6" ry="2.7" fill="#422006"/>' +
          '<path d="M32 39.7v2.4M32 42.1q-2.8 2.8-5.2.6M32 42.1q2.8 2.8 5.2.6" fill="none" stroke="#7c2d12" stroke-width="1.7" stroke-linecap="round"/>' +
          blush(20.6, 37) + blush(43.4, 37);
      }
    },
    {
      id: 'bunny', label: 'Bouncy Bunny',
      draw: function () {
        return '<ellipse cx="23" cy="14" rx="5.2" ry="12" fill="#f8fafc" transform="rotate(-9 23 14)"/>' +
          '<ellipse cx="41" cy="14" rx="5.2" ry="12" fill="#f8fafc" transform="rotate(9 41 14)"/>' +
          '<ellipse cx="23" cy="14.5" rx="2.6" ry="8.4" fill="#f9a8d4" transform="rotate(-9 23 14.5)"/>' +
          '<ellipse cx="41" cy="14.5" rx="2.6" ry="8.4" fill="#f9a8d4" transform="rotate(9 41 14.5)"/>' +
          '<ellipse cx="32" cy="36" rx="17.4" ry="15.4" fill="#ffffff"/>' +
          eye(25.2, 33, 3.6) + eye(38.8, 33, 3.6) +
          '<path d="M32 39.4 34.9 41.6 32 43.9 29.1 41.6Z" fill="#f472b6"/>' +
          '<path d="M32 43.9v1.4M32 45.3q-2.4 2.4-4.6.6M32 45.3q2.4 2.4 4.6.6" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>' +
          '<path d="M27.5 46.4h2.2M34.3 46.4h2.2" stroke="#e2e8f0" stroke-width="2.4" stroke-linecap="round"/>' +
          blush(21.4, 40) + blush(42.6, 40);
      }
    },
    {
      id: 'lion', label: 'Roar Lion',
      draw: function () {
        return '<path d="M32 6.5 38 12.4 46.2 10.6 46 19 53.4 22.8 49 30 53.4 37.2 46 41l.2 8.4-8.2-1.8L32 55.5l-6-5.9-8.2 1.8L18 43l-7.4-3.8L15 32l-4.4-7.2L18 21l-.2-8.4 8.2 1.8Z" fill="#f59e0b"/>' +
          '<circle cx="20.5" cy="20.5" r="5.4" fill="#d97706"/><circle cx="43.5" cy="20.5" r="5.4" fill="#d97706"/>' +
          '<circle cx="32" cy="32.5" r="15.4" fill="#fcd34d"/>' +
          '<ellipse cx="32" cy="39.5" rx="10.4" ry="7.6" fill="#fef3c7"/>' +
          eye(25.8, 30, 3.4) + eye(38.2, 30, 3.4) +
          '<path d="M32 35.6 34.8 37.8 32 40 29.2 37.8Z" fill="#78350f"/>' +
          '<path d="M32 40v1.6M32 41.6q-2.6 2.6-4.8.6M32 41.6q2.6 2.6 4.8.6" fill="none" stroke="#92400e" stroke-width="1.6" stroke-linecap="round"/>' +
          '<path d="M23.4 40.4h2M38.6 40.4h2" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>' +
          blush(22.6, 37.6, '#fb923c');
      }
    },
    {
      id: 'monkey', label: 'Cheeky Monkey',
      draw: function () {
        return '<circle cx="13.5" cy="30" r="7.4" fill="#a16207"/><circle cx="50.5" cy="30" r="7.4" fill="#a16207"/>' +
          '<circle cx="13.5" cy="30" r="4" fill="#fcd34d"/><circle cx="50.5" cy="30" r="4" fill="#fcd34d"/>' +
          '<ellipse cx="32" cy="31.5" rx="16.6" ry="17" fill="#b45309"/>' +
          '<path d="M32 17c7.6 0 12.4 4.2 12.4 9.4S39.6 34 32 34s-12.4-2.4-12.4-7.6S24.4 17 32 17Z" fill="#fcd34d"/>' +
          '<ellipse cx="32" cy="40.5" rx="12" ry="9.4" fill="#fde68a"/>' +
          eye(26.4, 26.4, 3.4) + eye(37.6, 26.4, 3.4) +
          '<ellipse cx="29" cy="37.4" rx="1.5" ry="1.9" fill="#78350f"/><ellipse cx="35" cy="37.4" rx="1.5" ry="1.9" fill="#78350f"/>' +
          smile(32, 41.6, 4.6, '#92400e', 1.9) +
          blush(22.4, 39.4, '#f97316') + blush(41.6, 39.4, '#f97316');
      }
    },
    {
      id: 'wizard', label: 'Spell Wizard',
      draw: function () {
        return '<path d="M32 3 47 27H17Z" fill="#4c1d95"/>' +
          '<path d="M32 3q4 10 6.5 15.5L28 22Z" fill="#6d28d9" opacity="0.8"/>' +
          sparkle(30, 13, 2.8, '#fde68a', 1) + sparkle(38, 21, 2, '#fde68a', 0.9) +
          '<rect x="14.5" y="25.5" width="35" height="5.6" rx="2.8" fill="#7c3aed"/>' +
          '<circle cx="32" cy="28.3" r="3" fill="#fbbf24"/>' +
          '<path d="M32 31c8.6 0 14 4.6 14 11 0 4-1.7 7-4.2 8.8H22.2C19.7 49 18 46 18 42c0-6.4 5.4-11 14-11Z" fill="#f8c8a0"/>' +
          bead(26.8, 36.8, 2) + bead(37.2, 36.8, 2) +
          blush(23.2, 40.4) + blush(40.8, 40.4) +
          // Sideburns to a rounded point: a beard, not a bib.
          '<path d="M18.6 40.6q2.6 1.6 4.4-.6.9 4.6 9 4.6t9-4.6q1.8 2.2 4.4.6 1.4 10.2-6 16.6H24.6q-7.4-6.4-6-16.6Z" fill="#eef2f6"/>' +
          '<path d="M25.6 41.4q3.2-2.6 6.4 0 3.2-2.6 6.4 0-2.4 3.4-6.4 1.5-4 1.9-6.4-1.5Z" fill="#cbd5e1"/>';
      }
    }
  ];

  /* ---------------------------------------------------------------------
     Backdrops. The character sits on one of these, so two kids who pick
     the same animal still get a picture that is unmistakably theirs.
     ------------------------------------------------------------------- */

  var BACKDROPS = [
    { id: 'ocean', label: 'Ocean', from: '#06b6d4', to: '#10b981' },
    { id: 'berry', label: 'Berry', from: '#a855f7', to: '#ec4899' },
    { id: 'deep', label: 'Deep Blue', from: '#1e40af', to: '#3b82f6' },
    { id: 'mocha', label: 'Mocha', from: '#b45309', to: '#d49a37' },
    { id: 'sunset', label: 'Sunset', from: '#f97316', to: '#ec4899' },
    { id: 'galaxy', label: 'Galaxy', from: '#4c1d95', to: '#7c3aed' },
    { id: 'lime', label: 'Lime', from: '#4d7c0f', to: '#22c55e' },
    { id: 'candy', label: 'Candy', from: '#f43f5e', to: '#fb923c' },
    { id: 'mint', label: 'Mint', from: '#0d9488', to: '#a3e635' },
    { id: 'sky', label: 'Sky', from: '#0ea5e9', to: '#a78bfa' }
  ];

  var CHAR_BY_ID = {};
  CHARACTERS.forEach(function (c) { CHAR_BY_ID[c.id] = c; });

  var BG_BY_ID = {};
  BACKDROPS.forEach(function (b) { BG_BY_ID[b.id] = b; });

  function character(id) { return CHAR_BY_ID[id] || CHARACTERS[0]; }
  function backdrop(id) { return BG_BY_ID[id] || BACKDROPS[0]; }

  /**
   * Build the full avatar SVG markup.
   * @param {string} charId    character id (falls back to the first character)
   * @param {string} bgId      backdrop id (falls back to the first backdrop)
   * @param {object} [opt]     { size, radius, className, title }
   */
  function render(charId, bgId, opt) {
    opt = opt || {};
    var c = character(charId);
    var bg = backdrop(bgId);
    var size = opt.size || 64;
    // Corner rounding is expressed on the 64-grid so it scales with the art.
    var rx = opt.radius === undefined ? 14 : opt.radius;
    var gid = 'sfa-g' + (++seq);
    var sid = 'sfa-s' + seq;
    var cls = 'sf-avatar' + (opt.className ? ' ' + opt.className : '');
    var label = opt.title
      ? '<title>' + String(opt.title).replace(/[<>&]/g, '') + '</title>'
      : '';

    return '<svg class="' + cls + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 64 64" role="' + (opt.title ? 'img' : 'presentation') +
      '" aria-hidden="' + (opt.title ? 'false' : 'true') + '" focusable="false">' + label +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0.65" y2="1">' +
      '<stop offset="0" stop-color="' + bg.from + '"/><stop offset="1" stop-color="' + bg.to + '"/>' +
      '</linearGradient>' +
      '<filter id="' + sid + '" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feDropShadow dx="0" dy="1.1" stdDeviation="1.1" flood-color="#0b1020" flood-opacity="0.34"/>' +
      '</filter></defs>' +
      '<rect width="64" height="64" rx="' + rx + '" fill="url(#' + gid + ')"/>' +
      // Two soft light blobs keep the flat gradient from looking like a swatch.
      '<circle cx="12" cy="10" r="16" fill="#ffffff" opacity="0.12"/>' +
      '<circle cx="56" cy="58" r="14" fill="#000000" opacity="0.10"/>' +
      // The character always carries its own shadow: a kid can put any character
      // on any backdrop, so the silhouette cannot rely on colour contrast alone.
      '<g filter="url(#' + sid + ')">' + c.draw() + '</g>' +
      '</svg>';
  }

  global.SFAvatars = {
    render: render,
    characters: CHARACTERS,
    backdrops: BACKDROPS,
    hasCharacter: function (id) { return !!CHAR_BY_ID[id]; },
    hasBackdrop: function (id) { return !!BG_BY_ID[id]; },
    labelOf: function (id) { return character(id).label; }
  };
})(window);
