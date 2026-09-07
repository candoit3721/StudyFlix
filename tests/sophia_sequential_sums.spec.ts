import { test, expect } from '@playwright/test';

test.describe('Sophia Sequential Sums & Gauss Magic Masterclass Studio', () => {
  const BASE_URL = '';

  test('Page loads correctly with header, hero banner, SVG canvas and live formula', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/sequential-sums.html`, { waitUntil: 'domcontentloaded' });

    // Verify Title and Hero
    await expect(page).toHaveTitle(/Sophia's Sequential Sums & Gauss Magic Masterclass/);
    await expect(page.locator('h1.hero-title')).toContainText('Sequential Sums & Gauss Magic Studio');

    // Verify SVG Canvas is present
    const canvas = page.locator('#gauss-svg-canvas');
    await expect(canvas).toBeVisible();

    // Verify Formula Display Box
    const formula = page.locator('#station-formula-display');
    await expect(formula).toContainText('Sum = (N × (N + 1)) / 2');

    // Verify default 1 to 10 calculation is 55
    await expect(page.locator('.result-hero-val')).toContainText('55');
  });

  test('Preset chips update range calculations correctly (1..100, 5..25, 5..10000, 5..10001)', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/sequential-sums.html`, { waitUntil: 'domcontentloaded' });

    // 1. Click 1 to 100 (Gauss)
    await page.click('button.preset-chip:has-text("1 to 100")');
    await expect(page.locator('.result-hero-val')).toContainText('5,050');

    // 2. Click 1 to 1,000
    await page.click('button.preset-chip:has-text("1 to 1,000")');
    await expect(page.locator('.result-hero-val')).toContainText('500,500');

    // 3. Click 5 to 25
    await page.click('button.preset-chip:has-text("5 to 25")');
    await expect(page.locator('.result-hero-val')).toContainText('315');

    // 4. Click 5 to 10,000
    await page.click('button.preset-chip:has-text("5 to 10,000")');
    await expect(page.locator('.result-hero-val')).toContainText('50,004,990');

    // 5. Click 5 to 10,001
    await page.click('button.preset-chip:has-text("5 to 10,001")');
    await expect(page.locator('.result-hero-val')).toContainText('50,014,991');

    // 6. Click Evens (2..20)
    await page.click('button.preset-chip:has-text("Evens (2..20)")');
    await expect(page.locator('.result-hero-val')).toContainText('110');

    // 7. Click Odds (1..19)
    await page.click('button.preset-chip:has-text("Odds (1..19)")');
    await expect(page.locator('.result-hero-val')).toContainText('100');
  });

  test('Custom number inputs solve arbitrary ranges dynamically', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/sequential-sums.html`, { waitUntil: 'domcontentloaded' });

    // Set A = 10, B = 50, Step = 1
    await page.fill('#input-start-num', '10');
    await page.fill('#input-end-num', '50');
    await page.fill('#input-step-num', '1');
    await page.click('#btn-solve-now');

    // N = 41, Pair = 60 => Sum = 41 * 30 = 1,230
    await expect(page.locator('.result-hero-val')).toContainText('1,230');

    // Check Subtraction method verification is visible
    await expect(page.locator('#calculation-steps-container')).toContainText('Subtraction Check');
  });

  test('Interactive Station Tabs switch stations and update formulas', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/sequential-sums.html`, { waitUntil: 'domcontentloaded' });

    // 1. Any Range Tab
    await page.click('#tab-range-a-b');
    await expect(page.locator('#station-formula-display')).toContainText('Sum = (N × (A + B)) / 2');
    await expect(page.locator('#station-insight-box')).toContainText('Fencepost Rule');

    // 2. Evens & Odds Tab
    await page.click('#tab-evens-odds');
    await expect(page.locator('#station-formula-display')).toContainText('Evens = k(k + 1)');

    // 3. Waterloo Gauss Arena Tab
    await page.click('#tab-contest');
    await expect(page.locator('#station-formula-display')).toContainText('Handshakes = N(N - 1) / 2');

    // 4. Instant Solver Tab
    await page.click('#tab-calculator');
    await expect(page.locator('#station-formula-display')).toContainText('Sum = (N × (First + Last)) / 2');
  });

  test('Visual Proof toggle button switches between pairing arcs and staircase rectangle', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/sequential-sums.html`, { waitUntil: 'domcontentloaded' });

    const proofBtn = page.locator('#proof-action-btn');
    await expect(proofBtn).toBeVisible();

    // Click Proof Button
    await proofBtn.click();
    await expect(proofBtn).toHaveClass(/active/);
    await expect(page.locator('#gauss-svg-canvas text:has-text("2 Triangular Staircases")')).toBeVisible();

    // Toggle back
    await proofBtn.click();
    await expect(proofBtn).not.toHaveClass(/active/);
    await expect(page.locator('#gauss-svg-canvas text:has-text("Total Numbers")')).toBeVisible();
  });

  test('Challenge Arena 3-tier quiz handles options, solution reveal and tier switching', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/sequential-sums.html`, { waitUntil: 'domcontentloaded' });

    // Verify question prompt
    await expect(page.locator('#arena-q-prompt')).toContainText('sum of all whole numbers from 1 to 10');

    // Click the correct answer "55"
    const correctBtn = page.locator('#arena-options-grid .option-btn:has-text("55")');
    await correctBtn.click();

    // Verify feedback
    const feedbackBox = page.locator('#arena-feedback-container');
    await expect(feedbackBox).toBeVisible();
    await expect(page.locator('#feedback-title-text')).toContainText('Correct');

    // Switch to Tier 2
    await page.click('#tier-btn-2');
    await expect(page.locator('#tier-btn-2')).toHaveClass(/active/);
    await expect(page.locator('#arena-q-badge')).toContainText('TIER 2');

    // Switch to Tier 3
    await page.click('#tier-btn-3');
    await expect(page.locator('#tier-btn-3')).toHaveClass(/active/);
    await expect(page.locator('#arena-q-badge')).toContainText('TIER 3');
  });

  test('Math Worksheet Studio supports Gauss Sums preset and generates problems', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/index.html?preset=g5_6_gauss_sums`, { waitUntil: 'domcontentloaded' });

    // Verify title input has Gauss preset title
    const titleInput = page.locator('#worksheet-title-input');
    await expect(titleInput).toHaveValue('Grade 5 & 6: Sequential Sums & Gauss Magic');

    // Verify questions rendered
    const questions = page.locator('.problem-card');
    await expect(questions.first()).toBeVisible();
  });
});
