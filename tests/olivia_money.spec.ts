import { test, expect, Page } from '@playwright/test';

/**
 * Olivia's Money & Coin Math course.
 *
 * The point of these tests is the ARITHMETIC, not the chrome. A money studio
 * that renders beautifully and prints an answer key with the wrong change in
 * it is worse than no studio at all, so the printed answers are recomputed
 * here from the coins actually drawn on the page rather than trusted.
 *
 * Paths are relative: the server URL comes from `baseURL` in playwright.config.ts.
 */

const MONEY = '/olivia-math/money-coins.html';

/** Cent value of each Canadian coin, keyed by the name in its aria-label. */
const COIN_CENTS: Record<string, number> = {
  Nickel: 5,
  Dime: 10,
  Quarter: 25,
  Loonie: 100,
  Toonie: 200,
};

/** "$3.45" -> 345. The page's own formatter is the inverse of this. */
function parseMoney(text: string): number {
  const m = text.match(/\$(\d+)\.(\d{2})/);
  if (!m) throw new Error(`not a money string: ${text}`);
  return Number(m[1]) * 100 + Number(m[2]);
}

/**
 * The fewest coins that make an amount, by dynamic programming.
 *
 * The studio uses a greedy algorithm, which is only correct because of the
 * particular Canadian denominations. This independent, obviously-correct
 * implementation is what proves that claim rather than assuming it.
 */
function fewestByDP(cents: number): number {
  const denoms = [5, 10, 25, 100, 200];
  const best = new Array(cents + 1).fill(Infinity);
  best[0] = 0;
  for (let v = 5; v <= cents; v += 5) {
    for (const d of denoms) {
      if (d <= v && best[v - d] + 1 < best[v]) best[v] = best[v - d] + 1;
    }
  }
  return best[cents];
}

async function gotoMoney(page: Page, query = '') {
  await page.goto(`${MONEY}${query}`, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof (window as any).SFMoney !== 'undefined');
}

test.describe('Money engine arithmetic', () => {
  test('formats cents as Canadian dollars, always two decimal places', async ({ page }) => {
    await gotoMoney(page);
    const out = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      return [0, 5, 45, 100, 105, 1234, 2000].map((c) => M.formatMoney(c));
    });
    expect(out).toEqual(['$0.00', '$0.05', '$0.45', '$1.00', '$1.05', '$12.34', '$20.00']);
  });

  test('says small amounts in cents and large ones in dollars', async ({ page }) => {
    await gotoMoney(page);
    const out = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      return [5, 65, 99, 100, 345].map((c) => M.formatCents(c));
    });
    expect(out).toEqual(['5¢', '65¢', '99¢', '$1.00', '$3.45']);
  });

  test('the fewest-coins breakdown is exact and genuinely minimal', async ({ page }) => {
    await gotoMoney(page);

    const results = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      const out: { amount: number; total: number; count: number }[] = [];
      // Every payable amount up to $20, not a sample: the answer key prints
      // these, so an off-by-one at one awkward value would reach paper.
      for (let cents = 5; cents <= 2000; cents += 5) {
        const breakdown = M.fewestPieces(cents);
        out.push({
          amount: cents,
          total: breakdown.reduce(
            (sum: number, b: { key: string; count: number }) => sum + M.valueOf(b.key) * b.count,
            0,
          ),
          count: M.pieceCount(breakdown),
        });
      }
      return out;
    });

    for (const r of results) {
      expect(r.total, `coins for ${r.amount}¢ must add to ${r.amount}¢`).toBe(r.amount);
      expect(r.count, `coins for ${r.amount}¢ must be the fewest possible`).toBe(
        fewestByDP(r.amount),
      );
    }
  });

  test('applies the Canadian cash rounding rule at every ending', async ({ page }) => {
    await gotoMoney(page);
    const out = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      // A whole run of ten cents, so every rounding case is covered once.
      return [730, 731, 732, 733, 734, 735, 736, 737, 738, 739].map((c) => M.roundToNickel(c));
    });
    expect(out).toEqual([730, 730, 730, 735, 735, 735, 735, 735, 740, 740]);
  });

  test('the count-up ladder adds up to exactly the change', async ({ page }) => {
    await gotoMoney(page);

    const checks = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      const out: {
        price: number;
        paid: number;
        change: number;
        hopTotal: number;
        monotonic: boolean;
        piecesMatch: boolean;
      }[] = [];

      for (let price = 5; price <= 1995; price += 5) {
        const paid = Math.ceil((price + 1) / 100) * 100;
        const steps = M.countUpLadder(price, paid);
        let cursor = price;
        let monotonic = true;
        let piecesMatch = true;
        let hopTotal = 0;

        for (const s of steps) {
          if (s.from !== cursor || s.to <= s.from || s.to > paid) monotonic = false;
          const pieceSum = s.pieces.reduce(
            (sum: number, b: { key: string; count: number }) => sum + M.valueOf(b.key) * b.count,
            0,
          );
          if (pieceSum !== s.add) piecesMatch = false;
          hopTotal += s.add;
          cursor = s.to;
        }

        out.push({
          price,
          paid,
          change: M.changeFor(price, paid),
          hopTotal,
          monotonic,
          piecesMatch,
        });
      }
      return out;
    });

    for (const c of checks) {
      expect(c.hopTotal, `${c.price} up to ${c.paid}`).toBe(c.change);
      expect(c.monotonic, `${c.price} up to ${c.paid}: hops must move forward`).toBe(true);
      expect(c.piecesMatch, `${c.price} up to ${c.paid}: each hop's coins must equal the hop`).toBe(
        true,
      );
    }
  });

  test('generated piles and prices stay inside the chosen level', async ({ page }) => {
    await gotoMoney(page);

    const bad = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      const ceilings: Record<string, number> = {
        coins_small: 99,
        coins_all: 999,
        with_bills: 4999,
      };
      const problems: string[] = [];

      for (const level of Object.keys(ceilings)) {
        for (let i = 0; i < 300; i++) {
          const pile = M.randomPile(level);
          const total = M.sumCents(pile);
          if (!pile.length) problems.push(`${level}: empty pile`);
          if (total > ceilings[level]) problems.push(`${level}: pile of ${total}¢ busts the level`);

          const price = M.randomPrice(level);
          if (price % 5 !== 0) problems.push(`${level}: price ${price}¢ is not payable in coins`);

          // Change must be positive: "$0.00 change" is not a question.
          const paid = M.paymentFor(price, level);
          if (paid <= price) problems.push(`${level}: paid ${paid}¢ for a ${price}¢ item`);
        }
      }
      return problems.slice(0, 5);
    });

    expect(bad).toEqual([]);
  });
});

test.describe('Money course interactions', () => {
  test('the coin gallery draws every coin at its true relative size', async ({ page }) => {
    await gotoMoney(page);

    const sizes = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#coin-gallery .coin-card')).map((card) => ({
        name: card.querySelector('strong')!.textContent,
        width: card.querySelector('svg')!.getBoundingClientRect().width,
      })),
    );

    expect(sizes.map((s) => s.name)).toEqual(['Nickel', 'Dime', 'Quarter', 'Loonie', 'Toonie']);

    const by = (n: string) => sizes.find((s) => s.name === n)!.width;
    // The whole teaching point of the gallery: the dime is worth twice the
    // nickel and is nonetheless the smallest coin in the set.
    expect(by('Dime')).toBeLessThan(by('Nickel'));
    expect(by('Nickel')).toBeLessThan(by('Quarter'));
    expect(by('Quarter')).toBeLessThan(by('Loonie'));
    expect(by('Loonie')).toBeLessThan(by('Toonie'));
  });

  test('counting a pile accepts the right total and explains a wrong one', async ({ page }) => {
    await gotoMoney(page, '?view=count_money');

    const total = await page.evaluate(() => (window as any).SFMoney.state.count.totalCents);
    expect(total).toBeGreaterThan(0);

    // A wrong answer must teach, not just buzz.
    await page.fill('#count-dollars-input', String(Math.floor(total / 100)));
    await page.fill('#count-cents-input', String((total % 100) + 1));
    await page.click('text=Check Total');
    await expect(page.locator('#count-feedback')).toHaveClass(/error/);
    await expect(page.locator('#count-ladder')).toBeVisible();

    await page.fill('#count-dollars-input', String(Math.floor(total / 100)));
    await page.fill('#count-cents-input', String(total % 100));
    await page.click('text=Check Total');
    await expect(page.locator('#count-feedback')).toHaveClass(/success/);
    await expect(page.locator('#count-feedback')).toContainText(
      await page.evaluate((c) => (window as any).SFMoney.formatMoney(c), total),
    );
  });

  test('the purse rewards the exact amount and names the fewest-coin payment', async ({ page }) => {
    await gotoMoney(page, '?view=build_amount');

    const plan = await page.evaluate(() => {
      const M = (window as any).SFMoney;
      const target = M.state.build.targetCents;
      return { target, breakdown: M.fewestPieces(target) };
    });

    for (const part of plan.breakdown as { key: string; count: number }[]) {
      for (let i = 0; i < part.count; i++) {
        await page.click(`.coin-btn[data-coin="${part.key}"]`);
      }
    }

    await expect(page.locator('#build-current-total')).toHaveText(
      await page.evaluate((c) => (window as any).SFMoney.formatMoney(c), plan.target),
    );

    await page.click('text=Check My Purse');
    await expect(page.locator('#build-feedback')).toHaveClass(/success/);
    await expect(page.locator('#build-feedback')).toContainText('PERFECT PAYMENT');
  });

  test('an overfilled purse says how much too much, not just "wrong"', async ({ page }) => {
    await gotoMoney(page, '?view=build_amount');

    // Enough toonies to be certain of overshooting any target this level sets.
    await page.evaluate(() => {
      const target = (window as any).SFMoney.state.build.targetCents;
      const needed = Math.ceil(target / 200) + 1;
      for (let i = 0; i < needed; i++) {
        (document.querySelector('.coin-btn[data-coin="toonie"]') as HTMLButtonElement).click();
      }
    });

    await page.click('text=Check My Purse');
    await expect(page.locator('#build-feedback')).toHaveClass(/error/);
    await expect(page.locator('#build-feedback')).toContainText('too much');
  });

  test('making change checks the answer and shows the count-up ladder', async ({ page }) => {
    await gotoMoney(page, '?view=make_change');

    const { priceCents: price, paidCents: paid, changeCents: change } = await page.evaluate(
      () => (window as any).SFMoney.state.change,
    );
    expect(paid).toBeGreaterThan(price);

    // The receipt on screen must be the transaction the engine is grading.
    expect(parseMoney((await page.textContent('#change-price-display'))!)).toBe(price);
    expect(parseMoney((await page.textContent('#change-paid-display'))!)).toBe(paid);

    await page.fill('#change-dollars-input', String(Math.floor(change / 100)));
    await page.fill('#change-cents-input', String(change % 100));
    await page.click('text=Check Change');
    await expect(page.locator('#change-feedback')).toHaveClass(/success/);

    await page.click('text=Show Count-Up Ladder');
    await expect(page.locator('#change-ladder')).toBeVisible();
    await expect(page.locator('#change-ladder')).toContainText(
      await page.evaluate((c) => (window as any).SFMoney.formatMoney(c), change),
    );
  });

  test('story problems mark the right option right and explain the wrong one', async ({ page }) => {
    await gotoMoney(page, '?view=word_problems');

    const answer = await page.evaluate(() => (window as any).SFMoney.state.currentStory.ans);
    const options = page.locator('.story-option-btn');
    await expect(options).toHaveCount(4);

    await options.nth((answer + 1) % 4).click();
    await expect(page.locator('#story-feedback')).toHaveClass(/error/);
    // The correct option is revealed rather than left for the learner to guess.
    await expect(options.nth(answer)).toHaveClass(/correct/);

    await page.click('text=Next Money Story');
    const next = await page.evaluate(() => (window as any).SFMoney.state.currentStory.ans);
    await page.locator('.story-option-btn').nth(next).click();
    await expect(page.locator('#story-feedback')).toHaveClass(/success/);
  });

  test('every contest puzzle can be answered, and its deck is well formed', async ({ page }) => {
    await gotoMoney(page, '?view=contest_puzzles');

    const deck = await page.evaluate(() => (window as any).SFMoney.CONTEST);
    expect(deck.length).toBeGreaterThan(0);

    for (const puzzle of deck as { options: string[]; ans: number; exp: string }[]) {
      expect(puzzle.options.length, `${puzzle.exp}: needs choices`).toBeGreaterThan(1);
      expect(puzzle.ans, 'answer index must point at a real option').toBeLessThan(
        puzzle.options.length,
      );
      expect(puzzle.exp.length, 'every puzzle must explain itself').toBeGreaterThan(0);
    }

    // Walk the whole deck, answering each puzzle correctly, and confirm the
    // points actually accrue.
    let score = Number(await page.textContent('#money-score'));
    for (let i = 0; i < deck.length; i++) {
      const index = await page.evaluate(() => (window as any).SFMoney.state.contestIndex);
      await page.locator('.contest-opt-btn').nth(deck[index].ans).click();
      await expect(page.locator('#contest-feedback')).toHaveClass(/success/);

      const after = Number(await page.textContent('#money-score'));
      expect(after).toBeGreaterThan(score);
      score = after;

      await page.click('text=Next Contest Puzzle');
    }
  });

  test('every story problem states an answer that is one of its options', async ({ page }) => {
    await gotoMoney(page);
    const stories = await page.evaluate(() => (window as any).SFMoney.STORIES);

    for (const story of stories as { text: string; options: string[]; ans: number; exp: string }[]) {
      expect(story.options.length, story.text).toBe(4);
      expect(story.ans, story.text).toBeLessThan(story.options.length);
      expect(story.exp.length, `${story.text}: needs a worked explanation`).toBeGreaterThan(0);
      // Every option is an amount or a sentence about one; a blank option is a
      // content bug that only shows up on screen.
      for (const opt of story.options) expect(opt.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe('Printable money test', () => {
  /** Wait for the paginator to settle, the same contract the print suite uses. */
  async function settled(page: Page) {
    await page.waitForFunction(
      () => document.documentElement.dataset.sfPrintReady === '1',
      null,
      { timeout: 10000 },
    );
  }

  test('the printed answer key matches the coins actually drawn', async ({ page }) => {
    await page.goto(`${MONEY}?view=worksheet_gen&mode=count&answers=1&count=12`, {
      waitUntil: 'load',
    });
    await settled(page);

    const items = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.sf-sheet:not(.sf-measuring) .printable-money-item')).map(
        (item) => ({
          coins: Array.from(item.querySelectorAll('.print-pile svg')).map(
            (svg) => svg.getAttribute('aria-label') || '',
          ),
          answer: (item.querySelector('.print-answer')?.textContent || '').replace(/[[\]]/g, ''),
        }),
      ),
    );

    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      expect(item.coins.length, 'a counting question must show coins').toBeGreaterThan(0);
      const total = item.coins.reduce((sum, label) => {
        const name = label.split(',')[0].trim();
        expect(COIN_CENTS[name], `unknown coin on the sheet: ${label}`).toBeDefined();
        return sum + COIN_CENTS[name];
      }, 0);
      expect(parseMoney(item.answer), `answer for ${item.coins.join(' + ')}`).toBe(total);
    }
  });

  test('the printed change answers match the printed receipts', async ({ page }) => {
    await page.goto(`${MONEY}?view=worksheet_gen&mode=change&answers=1&count=12`, {
      waitUntil: 'load',
    });
    await settled(page);

    const items = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.sf-sheet:not(.sf-measuring) .printable-money-item')).map(
        (item) => ({
          amounts: Array.from(item.querySelectorAll('.print-receipt strong')).map(
            (el) => el.textContent || '',
          ),
          answer: (item.querySelector('.print-answer')?.textContent || '').replace(/[[\]]/g, ''),
        }),
      ),
    );

    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      const [price, paid] = item.amounts.map(parseMoney);
      expect(paid, 'a change question must hand over more than the price').toBeGreaterThan(price);
      expect(parseMoney(item.answer), `change from ${item.amounts.join(' / ')}`).toBe(paid - price);
    }
  });

  test('hides the answer key unless it is asked for', async ({ page }) => {
    await page.goto(`${MONEY}?view=worksheet_gen&mode=mixed&count=12`, { waitUntil: 'load' });
    await settled(page);
    await expect(page.locator('.print-answer')).toHaveCount(0);
  });

  test('a mixed test asks all three kinds of money question', async ({ page }) => {
    await page.goto(`${MONEY}?view=worksheet_gen&mode=mixed&count=12`, { waitUntil: 'load' });
    await settled(page);

    const questions = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('.sf-sheet:not(.sf-measuring) .printable-money-item .q-num'),
      ).map((el) => el.textContent || ''),
    );

    expect(questions.some((q) => /Count the money/.test(q))).toBe(true);
    expect(questions.some((q) => /Make change/.test(q))).toBe(true);
    expect(questions.some((q) => /fewest coins/.test(q))).toBe(true);
    // Question numbers are contiguous from 1, whatever the page breaks.
    expect(questions.map((q) => parseInt(q, 10))).toEqual(
      questions.map((_, i) => i + 1),
    );
  });
});

test.describe('Hub wiring', () => {
  test('the Money & Coin Math card opens the money course', async ({ page }) => {
    // The reported defect: this card opened the generic worksheet studio,
    // which has no money content at all.
    await page.goto('/index.html', { waitUntil: 'load' });
    await page.click('.profile-card[aria-label^="Olivia"]');

    const card = page.locator('.media-card', { hasText: 'Money & Coin Math' }).first();
    await card.scrollIntoViewIfNeeded();
    await card.click();

    const iframe = page.locator('#studio-iframe');
    await expect(iframe).toHaveAttribute('src', /money-coins\.html/);
    await expect(
      page.frameLocator('#studio-iframe').locator('.brand-text h1'),
    ).toContainText('Money & Coin Math');
  });
});
