/**
 * StudyFlix Icon System
 * ---------------------------------------------------------------------------
 * One consistent line-icon set used for every FUNCTIONAL icon in the product:
 * navigation, buttons, card badges, modals, stat pills.
 *
 * Rationale (design review): functional emoji render differently per platform,
 * cannot be recoloured or optically sized to a palette, and cannot carry a
 * distinct meaning per screen. These glyphs are drawn on a single 24x24 grid
 * with a 1.75 stroke so they sit together at any size and inherit currentColor.
 *
 * Emoji remain welcome as informal flourishes inside body copy.
 */
(function (global) {
  'use strict';

  // Every path is authored on a 24x24 grid, stroked, never filled.
  var PATHS = {
    /* ---- navigation & chrome ---- */
    home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5M9.5 21v-6h5v6',
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M16.2 16.2 21 21',
    close: 'M6 6 18 18M18 6 6 18',
    chevronLeft: 'M14.5 5 8 12l6.5 7',
    chevronRight: 'M9.5 5 16 12l-6.5 7',
    chevronDown: 'M5 9.5 12 16l7-6.5',
    arrowLeft: 'M20 12H4M10 6l-6 6 6 6',
    externalLink: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    settings: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4M19.3 14.5a1.5 1.5 0 0 0 .3 1.65l.05.05a1.8 1.8 0 1 1-2.55 2.55l-.05-.05a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37V20a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.05.05a1.8 1.8 0 1 1-2.55-2.55l.05-.05a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9H4a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.05-.05a1.8 1.8 0 1 1 2.55-2.55l.05.05a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .9-1.37V4a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.05-.05a1.8 1.8 0 1 1 2.55 2.55l-.05.05a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.9H20a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.37.9',
    users: 'M15.5 20v-1.8a3.5 3.5 0 0 0-3.5-3.5H6.5A3.5 3.5 0 0 0 3 18.2V20M9.25 11.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2M21 20v-1.8a3.5 3.5 0 0 0-2.6-3.38M15.6 4.12a3.6 3.6 0 0 1 0 6.97',
    check: 'M4.5 12.5 9.5 17.5 19.5 6.5',
    pencil: 'M4 20h4.2L19.6 8.6a2.26 2.26 0 0 0-3.2-3.2L5 16.8zM14.8 7l3.2 3.2',
    sparkle: 'M11 3.5 12.9 8.6 18 10.5l-5.1 1.9L11 17.5 9.1 12.4 4 10.5l5.1-1.9zM18 15l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z',

    /* ---- actions ---- */
    play: 'M7 4.8v14.4a.6.6 0 0 0 .92.5l11.3-7.2a.6.6 0 0 0 0-1l-11.3-7.2A.6.6 0 0 0 7 4.8Z',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 11v5.5M12 7.6h.01',
    printer: 'M7 9V3.5h10V9M7 17.5H5.5A1.5 1.5 0 0 1 4 16V11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1.5 1.5 0 0 1-1.5 1.5H17M7 14h10v6.5H7z',
    refresh: 'M20 5.5v5h-5M4 18.5v-5h5M19.1 10.5a7.5 7.5 0 0 0-12.6-3L4 10.5M5 13.5a7.5 7.5 0 0 0 12.6 3L20 13.5',
    lightbulb: 'M9.2 17.5h5.6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.45.95 1.1 1 1.85h5.2c.05-.75.4-1.4 1-1.85A6 6 0 0 0 12 3Z',
    volumeOn: 'M11 5 6.5 8.75H3.5v6.5h3L11 19zM15.4 9.2a4 4 0 0 1 0 5.6M18.2 6.4a8 8 0 0 1 0 11.2',
    volumeOff: 'M11 5 6.5 8.75H3.5v6.5h3L11 19zM16 9.75 21 14.25M21 9.75 16 14.25',

    /* ---- stats ---- */
    star: 'M12 3.5 14.6 9l5.9.85-4.25 4.15 1 5.9-5.25-2.8-5.25 2.8 1-5.9L3.5 9.85 9.4 9Z',
    flame: 'M12 21a5.5 5.5 0 0 0 5.5-5.5c0-4.5-4-5.5-3-9.5-3 1-6 4-6 8 0-1.4-.6-2.6-1.6-3.4A6.4 6.4 0 0 0 6.5 15.5 5.5 5.5 0 0 0 12 21Z',
    trophy: 'M8 4h8v5.5a4 4 0 0 1-8 0zM8 5.5H5.2a.7.7 0 0 0-.7.7 4.3 4.3 0 0 0 3.7 4.25M16 5.5h2.8a.7.7 0 0 1 .7.7 4.3 4.3 0 0 1-3.7 4.25M12 13.5V17M8.5 20.5h7l-.7-2.4a1 1 0 0 0-.96-.7h-3.68a1 1 0 0 0-.96.7z',
    medal: 'M12 14.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 16.9l.7 1.45 1.6.23-1.15 1.12.27 1.6L12 20.55l-1.42.75.27-1.6L9.7 18.58l1.6-.23zM8.5 13.4 5.5 3h5l2 5M15.5 13.4 18.5 3h-5',

    /* ---- content-type marks (a card's icon must say what it opens) ---- */
    quest: 'M4.5 6.2 9.5 4l5 2.2L19.5 4v13.8l-5 2.2-5-2.2-5 2.2zM9.5 4v13.8M14.5 6.2V20',
    lesson: 'M4 5.2A1.2 1.2 0 0 1 5.2 4H10a2.5 2.5 0 0 1 2 1v14a2.5 2.5 0 0 0-2-1H5.2A1.2 1.2 0 0 1 4 16.8zM20 5.2A1.2 1.2 0 0 0 18.8 4H14a2.5 2.5 0 0 0-2 1v14a2.5 2.5 0 0 1 2-1h4.8a1.2 1.2 0 0 0 1.2-1.2z',
    printable: 'M6 3.5h8L18 7.5v13H6zM14 3.5v4h4M9 12.5h6M9 16h4',
    // Problem-format marks. These draw the arrangement they actually produce:
    // a stacked column sum (operands stacked, rule, answer line) versus a
    // single-line equation. Three plain strokes cannot say which is which -
    // horizontal strokes read as "rows" and vertical strokes as "columns",
    // which is the opposite of the format each one names.
    formatVertical: 'M10.5 5.5h8M10.5 10h8M4 13.5h16M10.5 17.5h8',
    formatHorizontal: 'M3 12h4.5M10 12h4.5M17 9.5h4v5h-4z',
    // Column-count marks: one page outline divided into N columns, so the
    // icon shows the actual layout rather than an abstract grid.
    columns1: 'M4 5h16v14H4z',
    columns2: 'M4 5h16v14H4zM12 5v14',
    columns3: 'M4 5h16v14H4zM9.3 5v14M14.7 5v14',
    columns4: 'M4 5h16v14H4zM8 5v14M12 5v14M16 5v14',

    /* ---- subject glyphs ---- */
    temple: 'M3.5 8.5 12 3.5l8.5 5M4.5 8.5h15M6.5 11v6.5M10 11v6.5M14 11v6.5M17.5 11v6.5M4 20h16M4.5 17.5h15',
    flask: 'M9.5 3.5v5.2L4.9 17a2 2 0 0 0 1.75 3h10.7A2 2 0 0 0 19.1 17l-4.6-8.3V3.5M8.4 3.5h7.2M7.2 13.5h9.6',
    atom: 'M12 14.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4M12 3.2c4.2 0 7.6 3.94 7.6 8.8s-3.4 8.8-7.6 8.8-7.6-3.94-7.6-8.8S7.8 3.2 12 3.2M4.5 7.7c2.1-3.64 7-4.34 11.2-1.9s6.1 6.98 4 10.62-7 4.34-11.2 1.9-6.1-6.98-4-10.62M19.5 7.7c2.1 3.64.2 8.18-4 10.62s-9.1 1.74-11.2-1.9-.2-8.18 4-10.62 9.1-1.74 11.2 1.9',
    ruler: 'M14.6 2.9 21.1 9.4a1.2 1.2 0 0 1 0 1.7L11.1 21.1a1.2 1.2 0 0 1-1.7 0L2.9 14.6a1.2 1.2 0 0 1 0-1.7L12.9 2.9a1.2 1.2 0 0 1 1.7 0M12 5.8l2.2 2.2M9.2 8.6l1.5 1.5M6.4 11.4l2.2 2.2M8.6 14.8l1.5 1.5',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5.2l3.4 2',
    coffee: 'M4 8.5h13v6.2a4.3 4.3 0 0 1-4.3 4.3H8.3A4.3 4.3 0 0 1 4 14.7zM17 10h1.6a2.6 2.6 0 0 1 0 5.2H17M6.5 2.5v2.6M10.5 2.5v2.6M14.5 2.5v2.6M3 21.5h15',
    sigma: 'M17.5 4.5h-11l6.4 7.5-6.4 7.5h11',
    chartLine: 'M4 4v15.5a.5.5 0 0 0 .5.5H20M7.5 15.5l3.5-4.5 3 2.5 4.5-6',
    cipher: 'M8.5 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 10.5 20 19.5M17 16.5l-2 2M14 13.5l-2 2',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M3.4 9.5h17.2M3.4 14.5h17.2M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18',
    microscope: 'M9.5 16h6M6 20.5h13M13 4.5l3.2 3.2a3.5 3.5 0 0 1 0 5L14.5 14.5 8 8l1.7-1.7a3.5 3.5 0 0 1 5 0zM10.5 11 6 15.5a2.5 2.5 0 0 0 3.5 3.5',
    map: 'M9 4 3.5 6.2v13.3L9 17.3l6 2.2 5.5-2.2V4L15 6.2zM9 4v13.3M15 6.2V19.5',
    arch: 'M4 20V11.5a8 8 0 0 1 16 0V20M8.5 20v-8.5a3.5 3.5 0 0 1 7 0V20M2.5 20h19M10.2 5.1h3.6l.7 3.2h-5z',
    amphitheatre: 'M12 20.5c5.25 0 9.5-2.24 9.5-5V8.5c0-2.76-4.25-5-9.5-5S2.5 5.74 2.5 8.5v7c0 2.76 4.25 5 9.5 5M2.5 8.5c0 2.76 4.25 5 9.5 5s9.5-2.24 9.5-5M12 13.5v7M7 12.3v6.9M17 12.3v6.9',
    dome: 'M3.5 13.5a8.5 8.5 0 0 1 17 0M3.5 13.5h17M5.5 13.5V20M18.5 13.5V20M3.5 20.5h17M12 3.4v1.8M9.6 8.6a3.4 3.4 0 0 1 4.8 0',
    person: 'M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5M4.5 20.5a7.5 7.5 0 0 1 15 0',
    leaf: 'M4.5 19.5C3 15 4.5 9.5 9 6.5c3.6-2.4 8-2.2 11-2 .2 3 .4 7.4-2 11-3 4.5-8.5 6-13 4.5M11.5 12.5 4.5 19.5',
    droplet: 'M12 3.2s6.5 6.4 6.5 10.7A6.5 6.5 0 0 1 5.5 13.9C5.5 9.6 12 3.2 12 3.2M9.2 15.4a2.9 2.9 0 0 0 2.8 2.4',
    cell: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M13.4 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8M8 15.6h.01M16.4 15.9h.01M7.6 8.6h.01',

    /* Grade 6 Ontario strands */
    species: 'M7.5 21c-2 0-3.5-1.6-3.5-3.6 0-3 2.6-4.6 3.5-7.4M16.5 21c2 0 3.5-1.6 3.5-3.6 0-3-2.6-4.6-3.5-7.4M7.5 21h9M6 8.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8M18 8.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8M12 6.6a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4',
    plane: 'M10.4 3.3a1.6 1.6 0 0 1 3.2 0V9l7.9 4.6v2.6l-7.9-2.4v4.1l2.6 1.9v1.9L12 20.6l-4.2 1.1v-1.9l2.6-1.9v-4.1L2.5 16.2v-2.6L10.4 9Z',
    rocket: 'M12 2.5c3.2 2.4 5 6 5 10l-1.9 3.4H8.9L7 12.5c0-4 1.8-7.6 5-10M12 11.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8M8.9 15.9 6.4 18l1.2 3.5L12 19.4l4.4 2.1 1.2-3.5-2.5-2.1M7 12.5 3.9 14.7l.7 3.6M17 12.5l3.1 2.2-.7 3.6',
    bolt: 'M13.6 2.5 5 13.4h5.4l-.9 8.1L18.5 10.6h-5.4z',
    circuit: 'M4.5 12H8m8 0h3.5M4.5 12v5.5h6M19.5 12V6.5h-6M12 14.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8M10.5 17.5h3M10.5 6.5h3',
    telescope: 'M3.4 13.6 6 6.9l4.7 1.8-2.6 6.7zM10.7 8.7 15.4 5l3.4 4.6-4.7 3.7zM8.1 15.4l2.4 6M8.1 15.4 5 21M6.6 17.5h5.3'
  };

  // Glyphs whose silhouette needs a fill to read at small sizes.
  var FILLED = { play: true, star: true, flame: true, sparkle: true, bolt: true, plane: true };

  var ALIASES = {
    worksheets: 'printer', print: 'printer', trophies: 'trophy',
    allSubjects: 'grid', profile: 'person', science: 'flask',
    chemistry: 'flask', history: 'temple', rome: 'temple',
    math: 'ruler', calculus: 'sigma', statistics: 'chartLine',
    time: 'clock', biology: 'cell', ecology: 'leaf', water: 'droplet',
    biodiversity: 'species', flight: 'plane', space: 'rocket',
    electricity: 'bolt', physics: 'chartLine'
  };

  function resolve(name) {
    return PATHS[name] ? name : (ALIASES[name] || null);
  }

  /**
   * Build an <svg> markup string for the named icon.
   * @param {string} name  key from PATHS or ALIASES
   * @param {object} [opt] { size, stroke, className, title }
   */
  function icon(name, opt) {
    opt = opt || {};
    var key = resolve(name);
    if (!key) {
      // Unknown glyph: render nothing rather than a broken box.
      if (global.console) console.warn('[sf-icon] unknown icon:', name);
      return '';
    }
    var size = opt.size || 20;
    var filled = FILLED[key];
    var cls = 'sf-icon' + (opt.className ? ' ' + opt.className : '');
    var label = opt.title
      ? '<title>' + String(opt.title).replace(/[<>&]/g, '') + '</title>'
      : '';
    return '<svg class="' + cls + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="' + (filled ? 'currentColor' : 'none') +
      '" stroke="currentColor" stroke-width="' + (opt.stroke || 1.75) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="' +
      (opt.title ? 'false' : 'true') + '" focusable="false"' +
      (opt.title ? ' role="img"' : '') + '>' + label +
      '<path d="' + PATHS[key] + '"/></svg>';
  }

  /**
   * Replace every [data-sf-icon] placeholder in `root` with its SVG.
   * Idempotent: an element is only upgraded once.
   */
  function upgrade(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-sf-icon]:not([data-sf-icon-done])');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var markup = icon(el.getAttribute('data-sf-icon'), {
        size: parseFloat(el.getAttribute('data-sf-size')) || 20,
        stroke: parseFloat(el.getAttribute('data-sf-stroke')) || 1.75,
        title: el.getAttribute('data-sf-title') || ''
      });
      if (markup) {
        el.innerHTML = markup;
        el.setAttribute('data-sf-icon-done', '');
      }
    }
  }

  global.SFIcons = { icon: icon, upgrade: upgrade, has: function (n) { return !!resolve(n); }, names: Object.keys(PATHS) };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { upgrade(); });
  } else {
    upgrade();
  }
})(window);
