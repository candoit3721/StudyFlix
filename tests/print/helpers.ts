import { expect, Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { Printable } from './manifest';

/** Subpixel tolerance. Letter at 0.4in margins is 979.2px, never a round number. */
export const EPS = 1.5;

/** PDF user space is 72 units per inch; CSS px are 96 per inch. */
export const PT_PER_PX = 72 / 96;

export interface Geometry {
  pageW: number;
  pageH: number;
  printW: number;
  printH: number;
  sheetH: number;
  padX: number;
  padY: number;
}

/**
 * Read the live print geometry out of the page's CSS custom properties.
 *
 * The variables live on `:root` OUTSIDE any media query precisely so this
 * works: `getComputedStyle` cannot see into `@media print`, so if the numbers
 * lived there the test would have to hard-code a duplicate of them and the two
 * would drift.
 */
export async function readGeometry(page: Page): Promise<Geometry> {
  return page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    // Resolve a length custom property to px by letting the browser do the
    // unit maths, rather than parsing "8.5in" ourselves.
    const px = (name: string): number => {
      const probe = document.createElement('div');
      probe.style.cssText = `position:absolute;visibility:hidden;width:var(${name});`;
      document.body.appendChild(probe);
      const v = probe.getBoundingClientRect().width;
      probe.remove();
      return v;
    };
    void cs;
    return {
      pageW: px('--sf-page-w'),
      pageH: px('--sf-page-h'),
      printW: px('--sf-print-w'),
      printH: px('--sf-print-h'),
      sheetH: px('--sf-sheet-h'),
      padX: px('--sf-sheet-pad-x'),
      padY: px('--sf-sheet-pad-y'),
    };
  });
}

/**
 * Navigate to a printable and put the browser into a state where measured
 * geometry equals printed geometry.
 *
 * The viewport width is set to the *printable content width*, not the page
 * width. tests/print/00-calibration.spec.ts proves why: emulateMedia('print')
 * swaps @media matching but does not re-lay-out to the @page box or subtract
 * its margins, so at any other width text wraps wrongly, cards come out the
 * wrong height, and every page-break decision is made against a fiction. The
 * pre-existing suite measured at 816px and passed while printing overflowed.
 */
export async function gotoPrintable(
  page: Page,
  url: string,
  opts: { waitForReady?: boolean } = {},
): Promise<Geometry> {
  await page.goto(url, { waitUntil: 'load' });
  const geo = await readGeometry(page);

  await page.setViewportSize({ width: Math.ceil(geo.printW), height: 1400 });

  if (opts.waitForReady !== false) {
    // Studios that paginate publish this once measurement has settled. Pages
    // without a paginator (the hand-authored workbooks) simply never set it.
    await page
      .waitForFunction(() => document.documentElement.dataset.sfPrintReady === '1', null, {
        timeout: 5000,
      })
      .catch(() => {});
  }

  await page.emulateMedia({ media: 'print' });
  return geo;
}

export interface SheetReport {
  index: number;
  width: number;
  height: number;
  scrollHeight: number;
  clientHeight: number;
  cardCount: number;
  /** Bottom-most card edge, relative to the sheet's top. */
  maxCardBottom: number;
  /** Where the sheet's content box ends, relative to the sheet's top. */
  contentBottom: number;
  breakAfter: string;
  breakInside: string;
  className: string;
}

export interface PageReport {
  sheets: SheetReport[];
  overflowRows: number;
  chunkSplits: number;
  requestedPages: number | null;
}

/** Collect everything we assert on in a single evaluate: one round trip, one reflow. */
export async function inspect(page: Page, p: Printable): Promise<PageReport> {
  return page.evaluate(
    ({ sheetSelector, cardSelector }) => {
      const sheets = Array.from(document.querySelectorAll<HTMLElement>(sheetSelector));
      const report = sheets.map((el, index) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const padBottom = parseFloat(cs.paddingBottom) || 0;
        const cards = cardSelector
          ? Array.from(el.querySelectorAll<HTMLElement>(cardSelector))
          : [];
        let maxCardBottom = 0;
        for (const c of cards) {
          maxCardBottom = Math.max(maxCardBottom, c.getBoundingClientRect().bottom - r.top);
        }
        return {
          index,
          width: r.width,
          height: r.height,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          cardCount: cards.length,
          maxCardBottom,
          contentBottom: r.height - padBottom,
          breakAfter: cs.breakAfter || (cs as any).pageBreakAfter || '',
          breakInside: cs.breakInside || (cs as any).pageBreakInside || '',
          className: el.className,
        };
      });
      const sf = (window as any).__sfPrint || {};
      return {
        sheets: report,
        overflowRows: sf.overflowRows ?? 0,
        chunkSplits: sf.chunkSplits ?? 0,
        requestedPages: sf.requestedPages ?? null,
      };
    },
    { sheetSelector: p.sheetSelector, cardSelector: p.cardSelector ?? '' },
  );
}

export interface AssertOpts {
  /** Exact number of sheets expected, when the caller asked for a page count. */
  expectedSheets?: number;
  /**
   * Fail if an explicit items-per-page request had to be split. Off by
   * default: splitting is the correct response to an impossible request, and
   * the caller decides whether it was expected.
   */
  forbidChunkSplits?: boolean;
  /** Also verify against a real PDF render. Slower; used on the smoke subset. */
  pdf?: boolean;
  /** Label prefix for assertion messages. */
  label?: string;
}

/**
 * The complete print correctness check for one rendered document.
 *
 * Assertions 1, 2 and 8 are together sufficient by pigeonhole: if every sheet
 * fits inside one printable page AND the PDF has exactly as many pages as
 * there are sheets, then no sheet spilled onto a second page and no blank page
 * was emitted.
 */
export async function assertPrintable(
  page: Page,
  p: Printable,
  geo: Geometry,
  opts: AssertOpts = {},
): Promise<PageReport> {
  const tag = opts.label ? `${opts.label}: ` : '';
  const r = await inspect(page, p);

  expect(r.sheets.length, `${tag}no printable sheets found`).toBeGreaterThan(0);

  // 1. The page-count contract: "3 pages of questions" must mean 3 sheets.
  if (opts.expectedSheets !== undefined) {
    expect(r.sheets.length, `${tag}sheet count`).toBe(opts.expectedSheets);
  }

  for (const s of r.sheets) {
    const where = `${tag}sheet ${s.index + 1}/${r.sheets.length} [${s.className}]`;

    // 2. The sheet fits the printable box.
    expect(s.height, `${where} height`).toBeLessThanOrEqual(geo.printH + EPS);
    expect(s.width, `${where} width`).toBeLessThanOrEqual(geo.printW + EPS);

    // 3. Content is not clipped and does not overhang its own sheet.
    expect(s.scrollHeight, `${where} content overflows the sheet`).toBeLessThanOrEqual(
      s.clientHeight + EPS,
    );

    // 4. No card straddles the page boundary.
    if (s.cardCount > 0) {
      expect(s.maxCardBottom, `${where} a card extends past the content box`).toBeLessThanOrEqual(
        s.contentBottom + EPS,
      );
    }

    // 5. No blank page. Hand-authored pages declare no cardSelector, so this
    //    only applies where we know what a "unit of content" is.
    if (p.cardSelector) {
      expect(s.cardCount, `${where} is blank`).toBeGreaterThan(0);
    }

    // 6. A full-page box must never be atomic: making it unbreakable is what
    //    caused the browser to push a whole overflowing sheet to the next page
    //    and leave a blank one behind.
    expect(s.breakInside, `${where} must be splittable`).not.toBe('avoid');
  }

  // 7. No trailing blank page.
  const last = r.sheets[r.sheets.length - 1];
  expect(['auto', ''], `${tag}last sheet must not force a page break after it`).toContain(
    last.breakAfter,
  );

  // 8. No row was too tall to place on any page. This is the future-proofing
  //    alarm: a new question type that cannot physically fit fails here on the
  //    day it is written, rather than overflowing quietly forever.
  expect(r.overflowRows, `${tag}a row was taller than an entire page`).toBe(0);

  if (opts.forbidChunkSplits) {
    expect(r.chunkSplits, `${tag}a page had to be split unexpectedly`).toBe(0);
  }

  // 9. Ground truth.
  if (opts.pdf) {
    await page.emulateMedia({ media: null });
    const buf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const doc = await PDFDocument.load(buf);
    expect(doc.getPageCount(), `${tag}PDF page count must equal sheet count`).toBe(
      r.sheets.length,
    );
    await page.emulateMedia({ media: 'print' });
  }

  return r;
}

/** Build a URL with query parameters, skipping undefined values. */
export function withParams(route: string, params: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) qs.set(k, String(v));
  }
  const q = qs.toString();
  return q ? `${route}?${q}` : route;
}
