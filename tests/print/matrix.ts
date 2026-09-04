/**
 * The layout matrix: every printable, every combination that can change how
 * much fits on a page.
 *
 * Strategy, since the full cross-product is far larger than is worth running:
 *
 *   FULL SWEEP on the density axes -- the ones that determine whether a page
 *   overflows. Question type, problem format, column count, workspace,
 *   font size. This is where the reported bug lived: olivia's horizontal
 *   layout at 4 columns overflowed while vertical at 2 fit, and nothing but a
 *   sweep of that axis would have caught it.
 *
 *   SAMPLE on the axes that provably cannot introduce a new failure. Page
 *   count mostly repeats the same packing N times, so a handful of values on
 *   representative configurations is enough; student name and worksheet title
 *   change no geometry at all.
 *
 * Adding a question type means adding one string here.
 */

import { withParams } from './helpers';

export interface Case {
  /** Manifest id of the printable this case belongs to. */
  printable: string;
  /** Full route including query string. */
  url: string;
  /** Human-readable label used in the test title. */
  label: string;
  /** Exact number of question pages expected, when the case requests one. */
  expectedWorksheetPages?: number;
  /** Part of the fast set that runs on every push. */
  smoke?: boolean;
  /**
   * True when the case sets an explicit items-per-page override. Such a
   * request may legitimately need splitting across pages, so `chunkSplits`
   * is informational rather than a failure.
   */
  allowChunkSplits?: boolean;
}

const cross = <T,>(...lists: T[][]): T[][] =>
  lists.reduce<T[][]>((acc, list) => acc.flatMap((a) => list.map((b) => [...a, b])), [[]]);

/* ------------------------------------------------------------------ sophia */

export const SOPHIA_CATEGORIES = [
  'geometry_area', 'geometry_triangles', 'geometry_quadrilaterals', 'geometry_circles',
  'geometry_composite', 'geometry_missing', 'geometry',
  'fractions', 'fractions_add_sub', 'fractions_mult', 'fractions_div',
  'decimals', 'pemdas', 'grade5_mixed',
  'ratios', 'percentages', 'algebra', 'integers', 'exponents', 'statistics', 'grade6_mixed',
  'word_problems', 'all_mixed',
];

export const SOPHIA_PRESETS = [
  'g5_fractions', 'g5_decimals', 'g5_pemdas', 'g5_6_geometry_area', 'g6_composite_shapes',
  'g6_ratios', 'g6_percentages', 'g6_equations', 'g6_integers', 'g5_6_word_problems',
  'g5_6_assessment',
];

export function sophiaCases(): Case[] {
  const out: Case[] = [];
  const route = '/sophia-math/index.html';

  // Density sweep: every category x every column count x workspace on/off.
  for (const [category, cols, workspace] of cross(
    SOPHIA_CATEGORIES,
    [1, 2, 3] as const,
    [0, 1] as const,
  ) as [string, number, number][]) {
    out.push({
      printable: 'sophia-math',
      label: `${category} ${cols}col ws=${workspace}`,
      url: withParams(route, { category, cols, workspace, pages: 2, answerkey: 1 }),
      expectedWorksheetPages: 2,
      // One representative per column count keeps the fast set honest without
      // making it slow.
      smoke: category === 'grade5_mixed' || (category === 'word_problems' && cols === 1),
    });
  }

  // Page-count contract on a few representative configurations.
  for (const [category, cols] of [
    ['grade5_mixed', 3],
    ['geometry_area', 2],
    ['word_problems', 1],
    ['statistics', 2],
    ['fractions', 3],
    ['all_mixed', 3],
  ] as [string, number][]) {
    for (const pages of [1, 2, 3, 4, 5, 6]) {
      out.push({
        printable: 'sophia-math',
        label: `${category} ${cols}col pages=${pages}`,
        url: withParams(route, { category, cols, pages, answerkey: 0 }),
        expectedWorksheetPages: pages,
        smoke: pages === 6 && category === 'grade5_mixed',
      });
    }
  }

  // The answer key at its largest: six pages of questions is what used to put
  // 168 answers on one sheet and overrun the paper by 325px.
  for (const category of ['grade6_mixed', 'word_problems', 'geometry_area']) {
    out.push({
      printable: 'sophia-math',
      label: `${category} big answer key`,
      url: withParams(route, { category, cols: 3, pages: 6, answerkey: 1 }),
      expectedWorksheetPages: 6,
      smoke: category === 'grade6_mixed',
    });
  }

  // Every preset, as shipped.
  for (const preset of SOPHIA_PRESETS) {
    out.push({
      printable: 'sophia-math',
      label: `preset ${preset}`,
      url: withParams(route, { preset }),
      smoke: true,
    });
  }

  return out;
}

/* ------------------------------------------------------------------ olivia */

export const OLIVIA_TYPES = [
  'addition', 'subtraction', 'add_sub_mixed', 'multiplication', 'division',
  'mult_div_mixed', 'all_mixed', 'comparison', 'word_problems',
];

export const OLIVIA_PRESETS = [
  'mult_core', 'add_3digit', 'sub_3digit', 'all_mixed', 'missing_ops', 'word_problems',
];

export function oliviaCases(): Case[] {
  const out: Case[] = [];
  const route = '/olivia-math/index.html';

  // THE REPORTED BUG'S AXIS. Full sweep of format x columns for every type.
  for (const [type, format, cols] of cross(
    OLIVIA_TYPES,
    ['vertical', 'horizontal'] as const,
    [2, 3, 4] as const,
  ) as [string, string, number][]) {
    out.push({
      printable: 'olivia-math',
      label: `${type} ${format} ${cols}col`,
      url: withParams(route, { type, format, cols, pages: 2, answerkey: 1 }),
      expectedWorksheetPages: 2,
      smoke: type === 'all_mixed' && (cols === 4 || cols === 2),
    });
  }

  // Missing-operand problems always render horizontally whatever the format
  // switch says (olivia-math/js/app.js buildProblemCard), so that asymmetry
  // gets its own sweep.
  for (const [type, cols] of cross(
    ['addition', 'subtraction', 'add_sub_mixed', 'multiplication', 'division', 'mult_div_mixed', 'all_mixed'],
    [2, 3, 4] as const,
  ) as [string, number][]) {
    out.push({
      printable: 'olivia-math',
      label: `${type} missing-operand ${cols}col`,
      url: withParams(route, { type, cols, missing: 1, pages: 2 }),
      expectedWorksheetPages: 2,
      smoke: type === 'all_mixed' && cols === 4,
    });
  }

  // Digit range and regrouping change how wide a number is, hence how a card
  // wraps, hence how tall it is.
  for (const [type, digits, cols] of cross(
    ['addition', 'subtraction'],
    ['2digit', '3digit'] as const,
    [2, 3, 4] as const,
  ) as [string, string, number][]) {
    out.push({
      printable: 'olivia-math',
      label: `${type} ${digits} ${cols}col`,
      url: withParams(route, { type, digits, cols, format: 'vertical', pages: 2 }),
      expectedWorksheetPages: 2,
    });
  }

  for (const pages of [1, 2, 3, 4, 5, 6]) {
    for (const [type, format, cols] of [
      ['all_mixed', 'vertical', 3],
      ['all_mixed', 'horizontal', 4],
      ['comparison', 'vertical', 3],
      ['word_problems', 'vertical', 1],
    ] as [string, string, number][]) {
      out.push({
        printable: 'olivia-math',
        label: `${type} ${format} ${cols}col pages=${pages}`,
        url: withParams(route, { type, format, cols, pages, answerkey: 0 }),
        expectedWorksheetPages: pages,
        smoke: pages === 6 && type === 'all_mixed' && format === 'horizontal',
      });
    }
  }

  for (const preset of OLIVIA_PRESETS) {
    out.push({
      printable: 'olivia-math',
      label: `preset ${preset}`,
      url: withParams(route, { preset }),
      smoke: true,
    });
  }

  return out;
}

/* -------------------------------------------------------------------- yaya */

export const YAYA_CATEGORIES = [
  'calc_all', 'calc_derivatives', 'calc_zeros_ineq', 'calc_integrals', 'calc_geometry',
  'calc_taylor_limits', 'stats_all', 'prob_distributions', 'prob_normal',
  'stats_regression', 'stats_chisquare', 'stats_mle', 'all_mixed',
];

export function yayaCases(): Case[] {
  const out: Case[] = [];
  const route = '/yaya/index.html';

  // Columns x explicit per-page x font size: the three axes that decide how
  // much KaTeX-typeset mathematics fits on an A4 page.
  for (const [cols, perpage, font] of cross(
    [1, 2] as const,
    ['auto', '2', '3', '4', '6', '8'] as const,
    ['normal', 'large', 'compact'] as const,
  ) as [number, string, string][]) {
    out.push({
      printable: 'yaya-exam',
      label: `all_mixed ${cols}col per=${perpage} font=${font}`,
      url: withParams(route, { category: 'all_mixed', count: 12, cols, perpage, font }),
      allowChunkSplits: perpage !== 'auto',
      smoke: perpage === 'auto' && font === 'normal',
    });
  }

  for (const [category, cols] of cross(YAYA_CATEGORIES, [1, 2] as const) as [string, number][]) {
    out.push({
      printable: 'yaya-exam',
      label: `${category} ${cols}col`,
      url: withParams(route, { category, cols, count: 8, perpage: 'auto', font: 'normal' }),
      smoke: category === 'all_mixed',
    });
  }

  for (const [count, workspace] of cross([4, 8, 12, 20] as const, [0, 1] as const) as [number, number][]) {
    out.push({
      printable: 'yaya-exam',
      label: `count=${count} ws=${workspace}`,
      url: withParams(route, { category: 'all_mixed', count, workspace, cols: 1, perpage: 'auto' }),
      smoke: count === 20 && workspace === 1,
    });
  }

  return out;
}

/* ------------------------------------------------------------------- clock */

export function clockCases(): Case[] {
  const out: Case[] = [];
  const route = '/olivia-math/clock-time.html';
  for (const [answers, count, cols] of cross(
    [0, 1] as const,
    [12, 16, 24, 32] as const,
    [3, 4] as const,
  ) as [number, number, number][]) {
    out.push({
      printable: 'olivia-clock',
      label: `clocks=${count} ${cols}col answers=${answers}`,
      url: withParams(route, { view: 'worksheet_gen', answers, count, cols }),
      smoke: count === 32 && cols === 3 && answers === 1,
    });
  }
  return out;
}

/* --------------------------------------------------------------- workbooks */

export function workbookCases(): Case[] {
  return [
    { printable: 'workbook-science', url: '/sophia-science/workbook.html', label: 'science workbook', smoke: true },
    { printable: 'workbook-rome', url: '/sophia-rome/workbook.html', label: 'rome workbook', smoke: true },
    { printable: 'workbook-mama', url: '/mama/workbook.html', label: 'mama workbook', smoke: true },
  ];
}

export function allCases(): Case[] {
  return [
    ...sophiaCases(),
    ...oliviaCases(),
    ...yayaCases(),
    ...clockCases(),
    ...workbookCases(),
  ];
}
