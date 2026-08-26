# Sophia's Grade 5 & 6 Math Studio 📐✨

An interactive, print-ready math worksheet and practice studio designed specifically for **Grade 5 and Grade 6** students (ages 10–12).

---

## 🌟 Quick Start

1. Open [`index.html`](file:///Users/henryw/project/workdir/kids/sophia-math/index.html) in any web browser (Safari, Chrome, Edge, Firefox).
2. Choose one of the **⚡ Quick Presets** or customize topics, difficulty, and question counts.
3. Choose your mode:
   - **🖨️ Printable Worksheet**: Click **Print Worksheet** to print clean, high-density or spacious worksheets with standard test headers and paper-saving answer keys.
   - **💻 Practice Online**: Type answers directly (fractions, decimals, mixed numbers, integers, and algebraic terms are automatically supported), get instant feedback, view hints or step-by-step solutions, and celebrate with confetti!

---

## 📚 Curriculum Topics Covered

### Grade 5 Skills
- **Fractions & Mixed Numbers**:
  - Addition & Subtraction (like & unlike denominators with LCD, mixed numbers, simplifying)
  - Multiplication (fraction × fraction, fraction × whole number, mixed number × mixed number)
  - Division (Keep-Change-Flip: fraction ÷ fraction, whole ÷ fraction, fraction ÷ whole)
- **Decimals & Place Value**:
  - Multi-digit addition & subtraction with vertical decimal alignment
  - Decimal multiplication
  - Long division with decimals (clean terminating quotients)
  - Converting between fractions, decimals, and percentages
- **Order of Operations (PEMDAS)**:
  - Multi-step numerical expressions with parentheses, brackets, and exponents ($2^2, 3^3$)
- **Geometry & Measurement**:
  - Area of triangles ($A = \frac{1}{2}bh$), rectangles, parallelograms, and trapezoids
  - Volume of rectangular prisms ($V = l \times w \times h$) and surface area
  - Missing angles in triangles (sum of angles $= 180^\circ$)

### Grade 6 Skills
- **Ratios, Rates & Proportions**:
  - Simplifying ratios to lowest terms
  - Solving proportions ($a:b = c:x$)
  - Unit rates (speed, price per ounce, reading speed)
- **Percentages & Consumer Math**:
  - Calculating percent of a number ($15\%$ of $80$)
  - Finding what percent one number is of another
  - Real-world discounts, sales tax, and restaurant tips
- **Integers & Negative Numbers**:
  - Arithmetic with positive and negative numbers ($+$, $-$, $\times$, $\div$)
  - Absolute values ($|-34| = 34$)
- **Pre-Algebra & Equations**:
  - One-step equations ($x + a = b$, $ax = b$, $\frac{x}{a} = b$, $x - a = b$)
  - Two-step equations ($ax + b = c$, $ax - b = c$, $\frac{x}{a} + b = c$)
  - Combining like terms ($8x + 5x - 4x = 9x$) and evaluating algebraic expressions
- **Exponents & Number Theory**:
  - Powers of integers ($4^3 = 64$)
  - Greatest Common Factor (GCF) & Least Common Multiple (LCM)
  - Square roots of perfect squares ($\sqrt{144} = 12$)
- **Statistics & Probability**:
  - Mean, Median, Mode, and Range of datasets
  - Single-event probability (dice, marbles, spinners)
- **Multi-Step Real-World Word Problems**:
  - Comprehensive story scenarios integrating fractions, decimals, geometry, percentages, rates, and algebra.

---

## ⚡ Quick Presets Included

| Preset | Target Grade | Description |
| :--- | :--- | :--- |
| 🍕 **Fraction Mastery** | Grade 5 | 15 Questions covering Add, Sub, Mult, Div with Unlike Denominators |
| 🔢 **Decimal Operations** | Grade 5 | 15 Questions on Decimal Addition, Subtraction, Multiplication & Long Division |
| 🧩 **PEMDAS Expressions** | Grade 5 | 15 Questions evaluating multi-step expressions with Parentheses & Exponents |
| ⚖️ **Ratios & Proportions** | Grade 6 | 15 Questions solving Proportions, Unit Rates, and Ratio Simplifications |
| 🏷️ **Percentages & Sales** | Grade 6 | 15 Questions covering % of quantity, Discounts, Sales Tax & Tips |
| 💡 **Pre-Algebra Equations** | Grade 6 | 15 Questions solving 1-Step and 2-Step Equations & Combining Like Terms |
| ❄️ **Negative Integers** | Grade 6 | 20 Rapid-fire questions with positive and negative arithmetic |
| 📖 **Multi-Step Stories** | Grade 5/6 | 10 In-depth realistic word problems with multi-part questions |
| 🏆 **5th/6th Assessment** | Grade 5/6 | 20 Comprehensive mixed questions spanning all core standards |

---

## 🖨️ Print & Offline Worksheets

In addition to dynamic generation in the web app, curated printable markdown worksheets are available in [`worksheets/`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets):

- [`grade5_fractions_and_decimals.md`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets/grade5_fractions_and_decimals.md) (20 questions + detailed solutions)
- [`grade5_pemdas_and_geometry.md`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets/grade5_pemdas_and_geometry.md) (20 questions + detailed solutions)
- [`grade6_ratios_percentages_integers.md`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets/grade6_ratios_percentages_integers.md) (20 questions + detailed solutions)
- [`grade6_algebra_and_equations.md`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets/grade6_algebra_and_equations.md) (20 questions + detailed solutions)
- [`grade5_6_challenge_word_problems.md`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets/grade5_6_challenge_word_problems.md) (10 in-depth multi-step challenge problems + detailed solutions)
- [`grade5_6_geometry_and_statistics.md`](file:///Users/henryw/project/workdir/kids/sophia-math/worksheets/grade5_6_geometry_and_statistics.md) (20 questions + detailed solutions)

---

## 📁 Project Structure

```
kids/sophia-math/
├── index.html                                    # Main web application entry point
├── css/
│   └── styles.css                                # Modern styles, math layout & print formatting
├── js/
│   ├── math-engine.js                            # Core Grade 5/6 arithmetic & algebraic engine
│   ├── word-problems.js                          # Multi-step story problem generator
│   └── app.js                                    # App controller, timer, grading & confetti
├── worksheets/                                   # Curated offline printable question sets
│   ├── grade5_fractions_and_decimals.md
│   ├── grade5_pemdas_and_geometry.md
│   ├── grade6_ratios_percentages_integers.md
│   ├── grade6_algebra_and_equations.md
│   ├── grade5_6_challenge_word_problems.md
│   └── grade5_6_geometry_and_statistics.md
└── README.md                                     # User & parent/teacher guide
```
