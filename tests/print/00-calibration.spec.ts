import { test, expect, Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

/**
 * Print calibration.
 *
 * Everything else in tests/print/ measures printed geometry through
 * `emulateMedia({ media: 'print' })` + `boundingBox()`. That is only
 * trustworthy if we know exactly what Chromium does in that mode, so this
 * spec establishes the rules empirically against a fixture whose dimensions
 * are known by construction (tests/print/fixtures/calibration.html: three
 * sheets, each one cushion-pixel short of a full printable page).
 *
 * The claims being pinned down:
 *
 *   1. emulateMedia('print') swaps `@media` matching only. It does NOT
 *      re-lay-out to the @page box and does NOT apply @page margins. So the
 *      layout viewport stays whatever setViewportSize() set it to.
 *   2. Therefore the viewport width must be set to the *printable content
 *      width* (page width minus both @page margins). Otherwise text wraps at
 *      the wrong width, cards come out the wrong height, and every page-break
 *      decision downstream is made against a fiction.
 *   3. page.pdf({ preferCSSPageSize: true }) is the ground truth for page
 *      count, and its media box agrees with the CSS page size.
 *
 * If any of these fail, the measurement strategy in helpers.ts has to change
 * -- which is exactly why this runs first and in isolation.
 */

const FIXTURE = '/tests/print/fixtures/calibration.html';

/** US Letter at 96 CSS dpi, 0.4in margins. Literals, not derived. */
const LETTER = {
  pageW: 8.5 * 96,          // 816
  pageH: 11 * 96,           // 1056
  margin: 0.4 * 96,         // 38.4
  get printW() { return this.pageW - 2 * this.margin; },   // 739.2
  get printH() { return this.pageH - 2 * this.margin; },   // 979.2
};

/** PDF user-space units are 72 per inch; CSS px are 96 per inch. */
const PT_PER_PX = 72 / 96;
const EPS = 1.5;

async function sheetBoxes(page: Page) {
  return page.$$eval('.sheet', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { width: r.width, height: r.height, top: r.top };
    }),
  );
}

test.describe('print measurement calibration', () => {
  test('emulateMedia(print) does not resize the layout viewport or apply @page margins', async ({ page }) => {
    // A viewport deliberately WIDER than the printable box.
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const screenWidth = await page.evaluate(() => document.documentElement.clientWidth);
    await page.emulateMedia({ media: 'print' });
    const printWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // Claim 1: the viewport is untouched by the media swap.
    expect(printWidth).toBe(screenWidth);
    expect(printWidth).toBe(1200);

    // ...and the @page margin is not subtracted from it either. If Chromium
    // ever starts honouring @page here, this assertion fires and we revisit
    // the whole strategy rather than silently measuring the wrong box.
    expect(printWidth).not.toBeCloseTo(LETTER.printW, 0);
  });

  test('media print rules ARE applied even though the viewport is not', async ({ page }) => {
    await page.setViewportSize({ width: Math.ceil(LETTER.printW), height: 1200 });
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const screenMargin = await page.evaluate(
      () => getComputedStyle(document.querySelectorAll('.sheet')[1]).marginTop,
    );
    await page.emulateMedia({ media: 'print' });
    const printMargin = await page.evaluate(
      () => getComputedStyle(document.querySelectorAll('.sheet')[1]).marginTop,
    );

    expect(screenMargin).toBe('24px');   // .sheet + .sheet { margin-top: 24px }
    expect(printMargin).toBe('0px');     // @media print { .sheet { margin: 0 !important } }
  });

  test('at the printable-width viewport, sheets measure exactly one printable page', async ({ page }) => {
    await page.setViewportSize({ width: Math.ceil(LETTER.printW), height: 1200 });
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });

    const boxes = await sheetBoxes(page);
    expect(boxes).toHaveLength(3);

    for (const [i, box] of boxes.entries()) {
      // Claim 2: width is the printable width, so wrapping is realistic.
      expect(box.width, `sheet ${i + 1} width`).toBeCloseTo(LETTER.printW, 0);
      // Height is one cushion pixel under a full printable page.
      expect(box.height, `sheet ${i + 1} height`).toBeLessThanOrEqual(LETTER.printH + EPS);
      expect(box.height, `sheet ${i + 1} height`).toBeGreaterThan(LETTER.printH - 10);
    }
  });

  test('page.pdf is the ground truth: three sheets print as exactly three pages', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'print', 'page.pdf() is Chromium-headless only');

    await page.setViewportSize({ width: Math.ceil(LETTER.printW), height: 1200 });
    await page.goto(FIXTURE, { waitUntil: 'load' });

    // page.pdf() drives its own print rendering; emulateMedia must be off.
    await page.emulateMedia({ media: null });
    const buf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const doc = await PDFDocument.load(buf);

    // Claim 3a: no sheet spilled onto a second page, and no blank page was
    // emitted after the last one.
    expect(doc.getPageCount()).toBe(3);

    // Claim 3b: preferCSSPageSize really did pick up `size: letter portrait`.
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo(LETTER.pageW * PT_PER_PX, 0);    // 612pt
    expect(height).toBeCloseTo(LETTER.pageH * PT_PER_PX, 0);   // 792pt
  });

  test('the guard bites: a sheet one pixel too tall becomes two PDF pages', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'print', 'page.pdf() is Chromium-headless only');

    await page.setViewportSize({ width: Math.ceil(LETTER.printW), height: 1200 });
    await page.goto(FIXTURE, { waitUntil: 'load' });

    // Overgrow the first sheet past the printable height. This is the exact
    // failure mode the whole suite exists to catch, so prove the detector
    // actually detects it before trusting it on 390 real cases.
    await page.evaluate((printH) => {
      (document.querySelector('#s1') as HTMLElement).style.height = `${printH + 40}px`;
    }, LETTER.printH);

    await page.emulateMedia({ media: null });
    const buf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const doc = await PDFDocument.load(buf);

    // 3 sheets, but 4 pages: sheet 1 straddled a boundary.
    expect(doc.getPageCount()).toBe(4);
  });
});
