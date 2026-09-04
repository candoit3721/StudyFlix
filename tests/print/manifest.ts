/**
 * The registry of every printable artifact on the site.
 *
 * This file is the single source of truth for print testing. Adding a studio
 * means adding one entry here, after which it is automatically covered by
 * all-printables.spec.ts and css-contract.spec.ts.
 *
 * It is not merely a convenience: manifest-coverage.spec.ts scans the repo for
 * anything that can print (a `window.print()` call, an `@media print` block,
 * an `@page` rule) and FAILS if the route is missing from this list. That is
 * what turns "remember to print-test the new thing" from a convention into a
 * build error.
 */

export type Paper = 'letter' | 'a4';

export interface Printable {
  /** Stable id, used in test titles. */
  id: string;
  /** Route relative to baseURL. */
  route: string;
  /**
   * Selector matching one printed page. Every sheet carries `.sf-sheet`.
   * `:not(.sf-measuring)` excludes the transient scratch sheet the
   * paginator lays out off-screen while it measures.
   */
  sheetSelector: string;
  /**
   * True when JS paginates the content at render time. False for
   * hand-authored pages, where the sheets are literal markup.
   */
  paginated: boolean;
  /** Paper the page declares via @page. Drives the test viewport width. */
  paper: Paper;
  /** Selector for the atomic content units inside a sheet, if any. */
  cardSelector?: string;
  /** Human note shown on failure. */
  note?: string;
}

export const PRINTABLES: Printable[] = [
  {
    id: 'sophia-math',
    route: '/sophia-math/index.html',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    cardSelector: '.problem-card, .key-item',
    paginated: true,
    paper: 'letter',
  },
  {
    id: 'olivia-math',
    route: '/olivia-math/index.html',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    cardSelector: '.problem-card, .word-problem-card, .compact-answer-item',
    paginated: true,
    paper: 'letter',
  },
  {
    id: 'olivia-clock',
    // The studio opens on its course lessons; the printable worksheet is a
    // tab. Printing works from any view -- that was the bug -- but the sheet
    // is only on screen when its own tab is showing, which the print tests
    // need in order to compare screen geometry against print geometry.
    route: '/olivia-math/clock-time.html?view=worksheet_gen',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    cardSelector: '.printable-clock-item',
    paginated: true,
    paper: 'letter',
  },
  {
    id: 'yaya-exam',
    route: '/yaya/index.html',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    // The answer sheet is built from quick-answer cells and worked-solution
    // blocks, not problem cards; omitting them would make every key page look
    // blank to the no-blank-page assertion.
    cardSelector: '.problem-card, .quick-answer-item, .solution-item',
    paginated: true,
    paper: 'a4',
    note: 'A4 exam paper with KaTeX-rendered mathematics.',
  },
  {
    id: 'workbook-science',
    route: '/sophia-science/workbook.html',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    paginated: false,
    paper: 'letter',
  },
  {
    id: 'workbook-rome',
    route: '/sophia-rome/workbook.html',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    paginated: false,
    paper: 'letter',
  },
  {
    id: 'workbook-mama',
    route: '/mama/workbook.html',
    sheetSelector: '.sf-sheet:not(.sf-measuring)',
    paginated: false,
    paper: 'letter',
  },
];

export const PAPER_SIZES: Record<Paper, { w: number; h: number }> = {
  // CSS px at 96dpi.
  letter: { w: 8.5 * 96, h: 11 * 96 },
  a4: { w: (210 / 25.4) * 96, h: (297 / 25.4) * 96 },
};
