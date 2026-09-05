# Olivia's Grade 3 Math Worksheet Studio ✏️

An interactive and print-ready math worksheet generator designed specifically for Grade 3 elementary students (and their parents/teachers).

---

## 🌟 Quick Start

1. Open `index.html` directly in any web browser (Safari, Google Chrome, Edge, Firefox).
2. Choose a preset or customize the problem types, number of questions, and layout format.
3. Click **🖨️ Print Worksheet** to print clean worksheets on standard paper, or switch to **💻 Practice Online** for interactive digital practice with instant grading and celebratory confetti!

---

## 📚 Grade 3 Topics & Features Included

### 1. Operations
- **Addition**: 2-digit and 3-digit addition with options for:
  - *Mixed regrouping*
  - *Require regrouping (carrying)*
  - *No regrouping*
  - *Missing addend equations* ($38 + \underline{\quad} = 95$)
- **Subtraction**: 2-digit and 3-digit subtraction (guaranteed non-negative) with options for:
  - *Mixed borrowing*
  - *Require borrowing*
  - *No borrowing*
  - *Missing subtrahend/minuend* ($\underline{\quad} - 28 = 45$)
- **Multiplication**:
  - *Core Times Tables (0–10)*
  - *Full Times Tables (0–12)*
  - *Multiples of 10* (e.g. $40 \times 6$)
  - *2-Digit $\times$ 1-Digit* (e.g. $24 \times 3$)
  - *Targeted Practice* (pick specific tables like 6×, 7×, 8×, 9×)
  - *Missing factor drills* ($7 \times \underline{\quad} = 56$)
- **Division**:
  - *Fact division* (dividends up to 100 or 144, divisors 1–12)
  - *Clean quotient mode* or *optional remainders*
  - *Missing dividend/divisor drills* ($\underline{\quad} \div 8 = 7$)
- **Mixed Operations**:
  - Addition & Subtraction mixed
  - Multiplication & Division mixed
  - All 4 operations sprint ($+$, $-$, $\times$, $\div$)
- **Grade 3 Story / Word Problems**:
  - Real-world scenarios (sharing items equally, arrays of chairs, buying toys, elapsed reading time, multi-step word problems)
- **Comparisons**:
  - Fill in $<$, $>$, or $=$ between arithmetic expressions

### 2. ⏰ Clock & Elapsed Time Course (Ontario Enriched)
- **Interactive Clock Studio**: Open [`clock-time.html`](./clock-time.html) for:
  - *Read the Clock*: High-contrast vector analog clock with hour and minute hands.
  - *Set the Hands*: Interactive hand controls to match digital target times.
  - *Mountain Jump Builder*: Interactive timeline jumps (+1hr Mountains, +15m Hills, +1m Rocks).
  - *Canadian Story Problems*: Multi-step schedules (Blue Jays, Rideau Canal, Ottawa).
  - *Waterloo CEMC Contest Logic*: Mirror reflection clocks, faulty museum clocks, time zone flights.
- **Master Course Workbook**: [`worksheets/olivia_complete_clock_course_workbook.md`](./worksheets/olivia_complete_clock_course_workbook.md) — 5-chapter printable workbook with complete solutions!

### 3. 🪙 Money & Coin Math Course (Ontario Financial Literacy)

Open [`money-coins.html`](./money-coins.html) for the full Canadian money course.
Every coin is drawn as vector art at its **true relative diameter**, so the dime really is the smallest coin in the set even though it beats the nickel.

- **Course Lessons Hub**: 5 chapters covering the coins, dollar and cent notation, counting a pile biggest-first, the count-up change ladder, and the Canadian cash rounding rule.
- **Count the Money**: Add up a random pile of nickels, dimes, quarters, loonies, toonies and bills, with a skip-count ladder as the hint.
- **Build the Amount**: Fill a purse to an exact target and find out whether a cashier could have done it with fewer coins.
- **Making Change**: Count up from the price to what was handed over, with the ladder showing each hop and the coins that make it.
- **Canadian Money Stories**: Sugar bush, bake sale, hockey card and farmers market problems, several of them multi-step.
- **Fewest-Coins Contest Logic**: Enriched puzzles on coin combinations, the six-coin dollar, and penny-free rounding.
- **Printable Money Tests**: Count-the-coins, making-change and fewest-coin questions, 1 to 3 columns, with an optional answer key.

All money arithmetic is done in **integer cents** and only formatted as dollars at the edge, so no drill or answer key can ever be off by a floating-point remainder.
The arithmetic is exposed as `window.SFMoney` and is covered by `tests/olivia_money.spec.ts`, which recomputes every printed answer from the coins actually drawn on the sheet.

---

## 🖨️ Print Layout & Sheet Options

- **Vertical Column Format**: Classic stacked elementary arithmetic with operator, solid line, and optional carry/borrowing boxes.
- **Horizontal Equation Format**: Clean algebraic equations ($a + b = \_\_\_$).
- **Configurable Questions**: 10, 15, 20, 25, 30, or 40 questions per worksheet.
- **Grid Density**: 2, 3, or 4 columns per page.
- **Simplified Paper-Saver Answer Key**: Generates a high-density, compact grid of question IDs and answers (e.g. `1. 84   2. 35   3. 120...`) that takes up minimal space on paper instead of repeating entire problem cards.
- **Clean Print Styling (`@media print`)**: Sidebars, buttons, and website navigation are automatically omitted when printing so only the clean paper test prints.

---

## 💻 Practice Online Mode

- Click **Practice Online** in the top bar to switch to interactive mode.
- Olivia can type her answers directly into the boxes on computer or tablet.
- Press **Enter** to jump smoothly to the next problem.
- Click **Check My Answers** to get instant scoring, time elapsed, and celebratory confetti on a perfect score!

---

## 📁 File Structure

```
olivia-math/
├── index.html              # Worksheet studio: the arithmetic generator
├── clock-time.html         # Clock & elapsed time course
├── money-coins.html        # Money & coin math course
├── css/
│   ├── styles.css          # Worksheet studio UI and print styles
│   ├── clock-styles.css    # Clock course styles
│   └── money-styles.css    # Money course styles and its @page rule
├── js/
│   ├── math-engine.js      # Core arithmetic generator & Grade 3 algorithms
│   ├── word-problems.js    # Grade 3 word problems template engine
│   ├── app.js              # Worksheet studio controller, presets & interactive logic
│   ├── clock-engine.js     # Vector clocks, elapsed time & clock worksheets
│   └── money-engine.js     # Canadian currency, change arithmetic & money tests
├── worksheets/             # Printable master workbooks
└── README.md               # User guide
```

Page breaks for every printable here come from `assets/sf/paginate.js`, which measures the real cards in the real print box.
See `tests/print/README.md` before changing anything that affects how tall a question is.
