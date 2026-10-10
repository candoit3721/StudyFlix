import { test, expect } from '@playwright/test';

/**
 * The Markdown worksheets are served as raw text/markdown by GitHub Pages, so
 * the hub must open them through reader.html, which renders them.
 */
test.describe('Markdown worksheet reader', () => {
  test('hub printable card opens a .md worksheet rendered, with math typeset', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await page.locator('.profile-name', { hasText: 'Sophia' }).click();
    await page.locator('#row-printable-slider').getByText('30-Question Gauss Masterclass Workbook').click();

    await expect(page.locator('#studio-iframe')).toHaveAttribute(
      'src',
      'reader.html?src=sophia-math%2Fworksheets%2Fsophia_sequential_sums_gauss_masterclass.md',
    );
    const frame = page.frameLocator('#studio-iframe');
    const sheets = frame.locator('.sf-sheet:not(.sf-measuring)');
    await expect(sheets.locator('h1')).toContainText("Sophia's Sequential Sums & Gauss Magic Masterclass");
    await expect(sheets.locator('.katex').first()).toBeVisible();
    await expect(frame.locator('.katex-error')).toHaveCount(0);
    await expect(sheets.first()).not.toContainText('$$');
  });

  test('escaped dollar signs stay literal prices, inside and outside math', async ({ page }) => {
    await page.goto('/reader.html?src=sophia-math/worksheets/sophia_fraction_word_problems_set2.md');
    const doc = page.locator('.reader-pages');
    await expect(page.locator('#btn-print')).toBeEnabled();
    await expect(doc.locator('.katex-error')).toHaveCount(0);
    await expect(doc.locator('.katex', { hasText: '$90' }).first()).toBeVisible();
  });

  test('table of contents links resolve and diagrams fit the sheet', async ({ page }) => {
    await page.goto('/reader.html?src=olivia-math/worksheets/olivia_complete_clock_course_workbook.md');
    await expect(page.locator('#btn-print')).toBeEnabled();
    const state = await page.evaluate(() => ({
      tocLinks: document.querySelectorAll('.sf-sheet a[href^="#"]').length,
      brokenAnchors: [...document.querySelectorAll('.sf-sheet a[href^="#"]')]
        .map((a) => decodeURIComponent(a.getAttribute('href')!.slice(1)))
        .filter((name) => !document.querySelector(`.sf-sheet [data-anchor="${CSS.escape(name)}"]`)),
      overflowingDiagrams: [...document.querySelectorAll('.sf-sheet pre')]
        .filter((pre) => pre.scrollWidth > pre.clientWidth + 1).length,
    }));
    expect(state.tocLinks).toBeGreaterThan(0);
    expect(state.brokenAnchors).toEqual([]);
    expect(state.overflowingDiagrams).toBe(0);
  });

  test('a forced page break in the Markdown starts a new printed page', async ({ page }) => {
    await page.goto('/reader.html?src=sophia-math/worksheets/sophia_fraction_word_problems_set2.md');
    await expect(page.locator('#btn-print')).toBeEnabled();
    const answerKeySheet = page.locator('.sf-sheet.sf-break-before');
    await expect(answerKeySheet).toHaveCount(1);
    await expect(answerKeySheet.locator('.md-item').first()).toContainText('Answer Key');
  });

  test('table of contents links scroll to their section', async ({ page }) => {
    await page.goto('/reader.html?src=olivia-math/worksheets/olivia_complete_clock_course_workbook.md');
    await expect(page.locator('#btn-print')).toBeEnabled();
    await page.locator('.sf-sheet a[href^="#unit-3"]').click();
    await expect(page.locator('.sf-sheet h1', { hasText: 'Unit 3' })).toBeInViewport();
  });

  test('phones get one continuous column, in-page links included', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/reader.html?src=olivia-math/worksheets/olivia_complete_clock_course_workbook.md');
    await expect(page.locator('#btn-print')).toBeEnabled();
    await expect(page.locator('.reader-pages')).toBeHidden();
    const column = page.locator('.reader-fluid');
    await expect(column.locator('h1').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await column.locator('a[href^="#unit-3"]').click();
    await expect(column.locator('h1', { hasText: 'Unit 3' })).toBeInViewport();
  });

  test('clock studio opens the master workbook in the reader', async ({ page }) => {
    await page.goto('/olivia-math/clock-time.html', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: 'Open Master Course Workbook' })).toHaveAttribute(
      'href',
      '../reader.html?src=olivia-math/worksheets/olivia_complete_clock_course_workbook.md',
    );
  });

  test('refuses sources that are not same-origin Markdown files', async ({ page }) => {
    for (const src of ['https://example.com/evil.md', '//example.com/evil.md', 'index.html', '']) {
      await page.goto(`/reader.html?src=${encodeURIComponent(src)}`);
      await expect(page.locator('.reader-status--error')).toBeVisible();
      await expect(page.locator('#btn-print')).toBeDisabled();
    }
  });
});
