# 🍁 StudyFlix Curriculum & Design Style Guide 🇨🇦
*Unified Visual Identity, Ontario Curriculum Alignment, and Enriched Pedagogy Standards*

---

## 🎯 1. Executive Summary & Educational Vision

**StudyFlix** is an enriched, multi-profile digital learning ecosystem tailored specifically for students in **Ontario, Canada**.

Our curriculum combines:
1. 🏛️ **The Ontario Ministry of Education Curriculum** (*Mathematics 2020* & *Science and Technology 2022*).
2. 🚀 **Enriched / Advanced Rigour**: Elevated above standard classroom expectations with **Waterloo CEMC Contest** (Gauss, Pascal, Cayley, Euclid) logic, inquiry-driven science, and computational thinking.
3. 🇨🇦 **Authentic Canadian Context**: Metric system standards ($\text{km}, \text{m}, \text{cm}, \text{kg}, \text{g}, \text{L}, \text{mL}, ^\circ\text{C}$), Canadian currency ($\$CAD$), Canadian geography (Great Lakes, Canadian Shield, Algonquin, Banff), space exploration (Canadarm, Canadian Space Agency), and environmental stewardship.
4. 🎨 **Netflix-Style Visual Delight**: Sleek, gamified web interfaces paired with clean, paper-saving, distraction-free printable worksheets.

---

## 🎨 2. Visual Design System & Component Library

Every page, studio, and worksheet across all student profiles must adhere to these design tokens for brand cohesion.

### 2.1 Color Palette & Theme Tokens

#### Global Dark Hub Theme (StudyFlix Portal):
* **Background Primary**: `#141414` (Netflix Jet Black)
* **Background Surface / Card**: `#181818` / `#222222`
* **Brand Crimson**: `#E50914` (Hover: `#B80710`)
* **Text Main**: `#FFFFFF` | **Text Muted**: `#94A3B8`
* **Card Borders**: `#333333`

#### Student Profile Accent Colors:
| Profile | Target Grade & Stream | Primary Gradient | Accent Color | Theme Persona |
|---|---|---|:---:|---|
| **🌸 Olivia** | Grade 3 (Enriched Primary) | `linear-gradient(135deg, #a855f7 0%, #ec4899 100%)` | `#ec4899` (Magenta Pink) | Playful, visual, structured |
| **🚀 Sophia** | Grade 5 & 6 (Enriched Junior) | `linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #10b981 100%)` | `#06b6d4` (Cyan / Emerald) | Scientific, adventurous, investigative |
| **🎓 Yaya** | High School & Pre-University | `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #f59e0b 100%)` | `#3b82f6` (Royal Navy / Gold) | Rigorous, elegant, academic |

#### Interactive Feedback Colors:
* **Success / Correct**: `#10B981` (Emerald Green) | Background: `#D1FAE5` | Border: `#86EFAC`
* **Warning / Hint**: `#F59E0B` (Amber Gold) | Background: `#FEF3C7` | Border: `#FDE68A`
* **Error / Needs Review**: `#EF4444` (Ruby Red) | Background: `#FEE2E2` | Border: `#FCA5A5`
* **Hour Hand (Clock)**: `#EF4444` (Vivid Red)
* **Minute Hand (Clock)**: `#3B82F6` (Royal Blue)

---

### 2.2 Typography System

* **Headings & Display Titles**: `'Montserrat', 'Fredoka', sans-serif` (Bold, 800/900 weight, tight line height).
* **Body Copy & Instructions**: `'Nunito', -apple-system, BlinkMacSystemFont, sans-serif` (Weights: 400, 600, 700, 800; line height: 1.5).
* **Mathematical Formulas & Digital Clocks**: `'Space Mono', monospace` or KaTeX math rendering ($\LaTeX$).

```css
/* Font Scale Guidelines */
--font-hero: clamp(2rem, 4vw, 2.8rem);
--font-h1: clamp(1.6rem, 3vw, 2.2rem);
--font-h2: clamp(1.3rem, 2.5vw, 1.7rem);
--font-h3: 1.25rem;
--font-body: 1.05rem;
--font-small: 0.875rem;
--font-mono: 1.15rem;
```

---

### 2.3 UI & Component Architecture

1. **Top Navbar**: Sticky header with StudyFlix branding, XP counter, streak fire pill, and avatar dropdown.
2. **Hero Billboard**: Cinematic backdrop, category tag (`TAG`), bold headline, description, and high-contrast Action Buttons.
3. **Media Slider Cards**: 280px wide horizontal sliding cards with icon, badge, title, 2-line snippet, and smooth hover scale (`transform: scale(1.08) translateY(-6px)`).
4. **Fullscreen Studio Viewer**: Modal iframe container with persistent top return bar (`← Return to StudyFlix Hub` + `↗️ Open New Tab`).
5. **Printable Worksheets**: Automatic dual-mode layout:
   * Screen mode: Interactive with inputs, feedback, and celebratory confetti.
   * Print mode (`@media print`): Hides all headers/buttons, renders clean black-and-white vector SVGs, 2-column or 3-column question grids, standard test headers, and a compact paper-saving answer key at the bottom.

---

## 🇨🇦 3. Ontario Curriculum Standards & Canadian Conventions

All materials must strictly adhere to Canadian standards and Ontario Ministry of Education guidelines:

### 3.1 Canadian Writing & Formatting Conventions
* **Metric System Exclusively**:
  * Length: $\text{mm}, \text{cm}, \text{m}, \text{km}$ (Never inches, feet, or miles).
  * Mass: $\text{mg}, \text{g}, \text{kg}$ (Never ounces or pounds).
  * Liquid Volume: $\text{mL}, \text{L}$ (Never gallons, quarts, or cups).
  * Temperature: $^\circ\text{C}$ (Celsius).
  * Speed: $\text{km/h}$.
* **Canadian Currency**:
  * Write with a dollar sign before the number: $\$5.25$, $\$120.00$.
  * Word problems should feature nickels ($5¢$), dimes ($10¢$), quarters ($25¢$), loonies ($\$1$), and toonies ($\$2$).
* **Canadian Spelling**:
  * Use Canadian/British spelling: *colour*, *centre*, *metre*, *litre*, *neighbour*, *practise* (verb), *traveled/travelled*.
* **Canadian Geography & Cultural Contexts**:
  * Reference Canadian cities (Toronto, Ottawa, Vancouver, Montreal, Calgary, Halifax), provincial parks (Algonquin, Banff), landmarks (CN Tower, Niagara Falls, Lake Ontario), Canadian fauna (beaver, moose, loon, polar bear, beluga whale), and winter activities (ice hockey, curling, snowshoeing, skating on the Rideau Canal).

---

### 3.2 Ontario Mathematics Strands Alignment (Grades 1–8)

Every math module must connect to one of the **6 Ontario Curriculum Strands**:
1. **Strand A: Social-Emotional Learning (SEL) & Mathematical Processes**: Building confidence, perseverance, and problem-solving strategies.
2. **Strand B: Number**: Number sense, place value, operations with regrouping/borrowing, fractions, decimals, ratios, and integers.
3. **Strand C: Algebra & Coding**: Patterning, algebraic expressions, variables, inequalities, and computational algorithms.
4. **Strand D: Data**: Data literacy, frequency tables, bar/line graphs, and theoretical/experimental probability.
5. **Strand E: Spatial Sense**: 2D/3D geometry, transformations (reflections, rotations, translations), perimeter, area, volume, and analog clock time / elapsed time.
6. **Strand F: Financial Literacy**: Money math, consumer awareness, earning, saving, and budgeting.

---

### 3.3 Ontario Science & Technology Strands (2022 Curriculum)

Every science module must connect to the **Ontario Science Framework**:
* **Strand A: STEM Skills and Connections**: Scientific research, scientific inquiry (I-D-C variable testing), engineering design process, and real-world technology connections.
* **Strand B: Life Systems**:
  * Grade 3: Plants and Growth.
  * Grade 4: Habitats and Communities.
  * Grade 5: Human Organ Systems & Health.
  * Grade 6: Biodiversity & Cell Biology Preview.
* **Strand C: Matter and Energy**:
  * Grade 3: Forces and Movement.
  * Grade 5: Properties of and Changes in Matter (Physical vs. Chemical changes).
  * Grade 6: Electricity & Electrical Devices.
  * Grade 7/8: Pure Substances, Mixtures & The Periodic Table.
* **Strand D: Structures and Mechanisms**:
  * Grade 3: Strong and Stable Structures.
  * Grade 5: Forces Acting on Structures and Mechanisms.
  * Grade 6: Flight & Space Vehicles.
* **Strand E: Earth and Space Systems**:
  * Grade 3: Soils in the Environment.
  * Grade 5: Conservation of Energy and Resources.
  * Grade 6: Space & Solar System.
  * Grade 7: Interactions in the Environment & Earth's Spheres.

---

## 🧠 4. Pedagogical Blueprint: The "Advanced / Enriched" Standard

To satisfy the requirement that **questions and materials are advanced and challenging**, every topic must follow a **3-Tier Difficulty Architecture** and an **Inquiry-First Narrative Structure**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     THE 3-TIER DIFFICULTY ARCHITECTURE                 │
│                                                                        │
│  ⭐ TIER 1: ONTARIO BENCHMARK (Grade Level Proficiency)                 │
│     Standard curriculum mastery (e.g., standard 3-digit subtraction,   │
│     reading clock to 5-min, identifying physical vs. chemical change). │
│                                                                        │
│  ⭐⭐ TIER 2: ENRICHED DEEP THINKER (Multi-Step & Non-Routine)          │
│     Requires combining two or more concepts, working backward, or      │
│     analyzing edge cases (e.g., elapsed time across midnight,          │
│     conservation of mass with escaping gas, algebraic missing terms).  │
│                                                                        │
│  ⭐⭐⭐ TIER 3: WATERLOO CEMC / OLYMPIAD CHALLENGE (Contest Level)      │
│     Logic puzzles, non-standard problem-solving modeled on the         │
│     University of Waterloo Gauss, Kangaroo Math, or Science Fair inquiry│
│     (e.g., optimizing schedules, pattern extrapolation, multi-variable │
│     experimental flaw detection).                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.1 The "Learn-As-You-Go" Story Framework

When introducing any new lesson, worksheet, or interactive module, always follow this 4-step pedagogical rhythm:

1. 📖 **The Story Hook (Real-World Context)**:
   * Introduce a lively, relatable Canadian scenario (e.g., *“Olivia is baking blueberry maple muffins in Ottawa at 3:20 PM…”* or *“Sophia is investigating why Lake Ontario freezes on top while fish survive below…”*).
2. 💡 **Concept Spotlight & Visual Model**:
   * Present concise, high-contrast diagrams, ASCII/SVG schematics, or memorable mnemonics (*“Happy Henry Likes Berries…”*, *“The I-D-C Variable Rule”*).
3. ✏️ **Embedded Checkpoint Practice**:
   * Active recall questions immediately follow each mini-story so students apply the concept while fresh.
4. 🧐 **Deep Thinker Inquiry Prompt**:
   * An open-ended question that prompts scientific reasoning (*“Why do you think…?”, “What would happen if…?”*).

---

## 👥 5. Grade-by-Grade Profile Specifications

### 🌸 Profile 1: Olivia (Grade 3 Enriched — Ages 8–9)

#### Key Pedagogical Objectives:
* Master multi-digit vertical operations with regrouping and borrowing across zeros.
* 12×12 Multiplication Tables speed fluency.
* **Clock & Elapsed Time**: Reading analog clocks to the exact minute, timeline jump strategies, and multi-step schedule story problems.
* **Financial Literacy**: Calculating change using Canadian coins (dimes, quarters, loonies, toonies).
* **Enriched Waterloo Prep**: Logic riddles, missing number algebra ($38 + \underline{\quad} = 95$), visual geometric shape symmetry.

#### Tone & Design:
* Cheerful pastel purple/pink tones (`#8B5CF6`, `#EC4899`).
* High visual feedback with large SVG clocks, interactive coin counters, and instant positive reinforcement.

---

### 🚀 Profile 2: Sophia (Grade 5 & 6 Readiness — Ages 10–12)

#### Key Pedagogical Objectives:
* **Ancient Rome & Early Civilizations (Social Studies & STEM)**: The Roman Republic vs. Empire, Senate, Patricians vs. Plebeians, Twelve Tables & Rule of Law (connection to Canadian Charter), Roman semi-circular arch & keystone compression physics, aqueduct gravity gradient hydraulics ($0.2\% - 0.5\%$), volcanic pozzolana concrete (*opus caementicium*), Pantheon dome & Colosseum hypogeum mechanics, Roman road engineering (*Via Appia*), Roman numeral arithmetic, Caesar cipher military encryption, and Latin roots in French/English.
* **Advanced Chemistry**: The Periodic Table first 20 elements, element superpowers, Dmitri Mendeleev's periodic law, atomic structure (protons, neutrons, electrons), chemical compound formulas ($H_2O, NaCl, C_6H_{12}O_6$), and Latin symbol origins ($Au, Fe, K, Na$).
* **Grade 5 Core Science**: Physical vs. Chemical changes, Conservation of Mass, Ecosystems (photosynthesis, food webs, 10% energy rule, trophic cascades), Earth's 4 spheres (Atmosphere, Hydrosphere, Geosphere, Biosphere).
* **Grade 6 Super-Prep**: Cell Biology preview (Cell City organelles, Plant vs. Animal cell walls/chloroplasts), Physics in Motion (Potential vs. Kinetic energy on roller coasters, Newton's 3 Laws), and Scientific Method Mastery (Independent, Dependent, and Controlled variables).
* **Grade 5/6 Math Studio**: Fractions with unlike denominators, Keep-Change-Flip division, PEMDAS order of operations, decimal long division, pre-algebra expressions, and area/perimeter of composite polygons.

#### Tone & Design:
* Cyan, emerald green, imperial crimson and laurel gold (`#06B6D4`, `#10B981`, `#C8102E`, `#D4AF37`).
* Detective badges, secret word decoders, scientific laboratory & imperial Roman aesthetic.

---

### 🎓 Profile 3: Yaya (High School & Pre-University — Ages 16–18+)

#### Key Pedagogical Objectives:
* **Ontario Curriculum Alignment**: MCV4U (*Calculus and Vectors*), MHF4U (*Advanced Functions*), MDM4U (*Data Management*).
* **Calculus Topics**: Limits, derivative rules, tangent lines, inflection points, optimization, integration by substitution, integration by parts, volumes of solids of revolution.
* **Probability & Statistics**: Discrete distributions (Hypergeometric, Binomial), Normal distribution $Z$-scores, $2 \times 2$ Contingency tables & $\chi^2$ Chi-Square independence tests, Least-squares linear regression, and Maximum Likelihood Estimation (MLE).
* **Enriched University / Contest Prep**: Waterloo Euclid Contest problems, AP Calculus AB/BC diagnostics, Gaokao/National Olympiad style multi-step proofs.

#### Tone & Design:
* Deep navy blue, charcoal, and warm gold (`#1E3A8A`, `#3B82F6`, `#F59E0B`).
* Clean mathematical $\LaTeX$ formulas, academic exam layout, step-by-step rigorous solutions.

---

## 📝 6. Worksheet & Module Authoring Standards

When creating any new `.md`, `.html`, or `.js` worksheet, follow this standardized template:

### Markdown Worksheet Structure Template:
```markdown
# [Icon] [Topic Name]: [Subtitle / Catchy Hook]
*Curriculum Level: Ontario Grade [X] Enriched • Target Stream: [Math / Science]*
*Name: _______________________ Date: _________________ Score: _____ / [Total]*

---

## 📖 Part 1: Real-World Context & Concept Spotlight
[Engaging Canadian narrative / scientific hook]
[High-contrast diagram, ASCII art, or KaTeX formula]
[Clear memory hacks or rules]

---

## ✏️ Part 2: Skill Mastery & Checkpoint Questions
[Tier 1 & Tier 2 Practice Questions with clear blanks]

---

## 🏆 Part 3: Waterloo CEMC / Challenge Arena
[Tier 3 Olympiad / Contest-Style problem requiring multi-step reasoning]

---

## 🔑 Comprehensive Answer Key & Teacher/Parent Solutions
[Detailed step-by-step solutions with pedagogical explanations of "WHY"]
```

---

## 🖨️ 7. Printable Layout Rules (Zero Paper Waste)

1. **Standard Page Sizing**: Worksheets must fit cleanly onto standard North American **Letter** ($8.5 \times 11\text{ inches}$) or international **A4** without accidental trailing 2-line blank pages.
2. **High-Contrast Vector Graphics**: All clock faces, geometric polygons, and diagrams must be crisp inline SVG vectors with pure black lines (`stroke="#000000"`) for sharp printing on home inkjet/laser printers.
3. **Paper-Saving Answer Key**: Place answer keys in a compact 4-column or 5-column grid at the bottom or on a dedicated page so parents can review in seconds without wasting paper.
4. **Header Test Stamp**: Every printable worksheet must include standard school test header lines:
   `Name: ___________ Date: ___________ Score: ___________ Time: ___________`

---

## 🖼️ 8. Free Image & Asset API Integration Guide

To enrich digital learning pages, lesson stories, hero billboards, and topic cards with high-quality visual media, use the following free image services and APIs:

| API Service | Best For | Rate Limit (Free Tier) | Core Advantage |
|---|---|---|---|
| [**Pexels API**](https://www.pexels.com/api/) | All-purpose apps & video | 200 requests/hour (10k/month) | Easiest to use, includes free video files |
| [**Unsplash API**](https://unsplash.com/developers) | Premium visual aesthetics | 50 requests/hour (Demo) / 5k (Production) | Widest variety of stunning, high-quality photos |
| [**Pixabay API**](https://pixabay.com/api/docs/) | Asset caching & downloads | 5,000 requests/hour | Very generous limits, allows direct file downloading |
| [**Lorem Picsum**](https://picsum.photos/) | Fast UI placeholders | Unlimited (No key needed) | Perfect for quick prototyping without an account |

### 💡 Quick Usage Examples:
* **Lorem Picsum (Zero Setup Placeholder)**:
  ```html
  <!-- Quick 600x400 science or nature placeholder -->
  <img src="https://picsum.photos/600/400?random=1" alt="Science Illustration">
  ```
* **Dynamic Search (Fetch API Example)**:
  ```javascript
  // Example query for Canadian Nature or Science Lab topics
  async function fetchTopicImage(query) {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: { Authorization: "YOUR_PEXELS_API_KEY" }
    });
    const data = await res.json();
    return data.photos[0]?.src?.medium;
  }
  ```

---

## 🌟 Summary: The StudyFlix Quality Promise

By following this style guide, every subject created for Olivia, Sophia, Yaya, and future students will feel like part of a **single, world-class Canadian learning universe**:
* **Visually cohesive**: Polished Netflix-style digital hub.
* **Academically rigorous**: Advanced questions that foster genuine problem-solving and critical thinking.
* **Locally relevant**: 100% Ontario & Canadian curriculum compliant.
* **Equally powerful online & offline**: Instant digital feedback + beautiful printable worksheets! 🍁🚀✨
