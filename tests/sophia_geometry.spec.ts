import { test, expect } from '@playwright/test';

test.describe('Sophia Geometry & Area Masterclass Studio', () => {
  // Paths are relative: the server URL comes from `baseURL` in playwright.config.ts.
  const BASE_URL = '';

  test('Page loads correctly with header, hero banner, and SVG canvas', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/geometry.html`, { waitUntil: 'domcontentloaded' });

    // Verify Title and Hero
    await expect(page).toHaveTitle(/Sophia's Geometry & Area Masterclass/);
    await expect(page.locator('h1.hero-title')).toContainText('Visual Geometry & Area Studio');

    // Verify SVG Canvas is present
    const canvas = page.locator('#geometry-svg-canvas');
    await expect(canvas).toBeVisible();

    // Verify Formula Display Box
    const formula = page.locator('#station-formula-display');
    await expect(formula).toContainText('A = ½ × b × h');
  });

  test('Interactive Station Tabs switch shapes and update SVG & calculation steps', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/geometry.html`, { waitUntil: 'domcontentloaded' });

    // 1. Parallelogram Tab
    await page.click('#tab-parallelogram');
    await expect(page.locator('#station-formula-display')).toContainText('A = b × h');
    await expect(page.locator('#geometry-svg-canvas polygon').first()).toBeVisible();
    await expect(page.locator('#val-paraBase')).toBeVisible();

    // 2. Trapezoid Tab
    await page.click('#tab-trapezoid');
    await expect(page.locator('#station-formula-display')).toContainText('A = ((a + b) / 2) × h');
    await expect(page.locator('#val-trapBaseA')).toBeVisible();
    await expect(page.locator('#val-trapBaseB')).toBeVisible();

    // 3. Rhombus & Kite Tab
    await page.click('#tab-rhombus');
    await expect(page.locator('#station-formula-display')).toContainText('A = (d₁ × d₂) / 2');
    await expect(page.locator('#val-diag1')).toBeVisible();

    // 4. Circle Tab
    await page.click('#tab-circle');
    await expect(page.locator('#station-formula-display')).toContainText('A = π × r²');
    await expect(page.locator('#geometry-svg-canvas circle').first()).toBeVisible();

    // 5. Composite Tab
    await page.click('#tab-composite');
    await expect(page.locator('#station-formula-display')).toContainText('A = A₁ + A₂');
    await expect(page.locator('#val-compOuterW')).toBeVisible();
  });

  test('Visual Proof & Decomposition toggle button functions', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/geometry.html`, { waitUntil: 'domcontentloaded' });

    const proofBtn = page.locator('#proof-action-btn');
    await expect(proofBtn).toBeVisible();

    // Click Proof Button (Triangle station)
    await proofBtn.click();
    await expect(proofBtn).toHaveClass(/active/);
    await expect(page.locator('#geometry-svg-canvas text:has-text("Duplicate Triangle")')).toBeVisible();

    // Toggle back
    await proofBtn.click();
    await expect(proofBtn).not.toHaveClass(/active/);
  });

  test('Challenge Arena 3-tier quiz, option selection, and feedback reveal', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/geometry.html`, { waitUntil: 'domcontentloaded' });

    // Arena elements
    await expect(page.locator('#arena-q-prompt')).toBeVisible();
    await expect(page.locator('#arena-diagram-container svg')).toBeVisible();

    // Select the first option
    const firstOption = page.locator('#arena-options-grid .option-btn').first();
    await firstOption.click();

    // Feedback should display
    const feedbackBox = page.locator('#arena-feedback-container');
    await expect(feedbackBox).toBeVisible();
    await expect(page.locator('#feedback-solution-text')).not.toBeEmpty();

    // Test Tier 2 Tab
    await page.click('#tier-btn-2');
    await expect(page.locator('#tier-btn-2')).toHaveClass(/active/);
    await expect(page.locator('#arena-q-badge')).toContainText('TIER 2');

    // Test Tier 3 Tab (Gauss Contest)
    await page.click('#tier-btn-3');
    await expect(page.locator('#tier-btn-3')).toHaveClass(/active/);
    await expect(page.locator('#arena-q-badge')).toContainText('TIER 3');
  });

  test('Navigating to Math Worksheet Studio from Geometry Masterclass pre-selects Geometry & Area', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/geometry.html`, { waitUntil: 'domcontentloaded' });

    // Click top nav link to Math Worksheet Studio
    const studioLink = page.locator('.studio-nav a:has-text("Math Worksheet Studio")');
    await expect(studioLink).toHaveAttribute('href', 'index.html?preset=g5_6_geometry_area');
    await studioLink.click();

    // Wait for index.html to load and assert that topic is geometry_area and worksheet title reflects Geometry
    await expect(page).toHaveURL(/preset=g5_6_geometry_area/);
    await expect(page.locator('#topic-select')).toHaveValue('geometry_area');
    await expect(page.locator('#worksheet-title-input')).toHaveValue(/Geometry & Area/);
  });

  test('Sophia Math Studio integrates Area Masterclass preset and generator options', async ({ page }) => {
    await page.goto(`${BASE_URL}/sophia-math/index.html`, { waitUntil: 'domcontentloaded' });

    // Verify Geometry Lab banner is present
    const labBanner = page.locator('a:has-text("Launch Interactive Geometry Lab")');
    await expect(labBanner).toBeVisible();

    // Click Area Masterclass Preset Button
    const areaPresetBtn = page.locator('button[data-preset="g5_6_geometry_area"]');
    await expect(areaPresetBtn).toBeVisible();
    await areaPresetBtn.click();

    // Verify topic changed to geometry_area
    const topicSelect = page.locator('#topic-select');
    await expect(topicSelect).toHaveValue('geometry_area');
  });
});
