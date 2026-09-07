# ⚡ Sophia's Sequential Sums & Gauss Magic Masterclass
### *Ontario Curriculum Grade 5 & 6 (Strand B: Number & Strand C: Algebra) • Waterloo CEMC Gauss Enrichment*
*Name: _______________________ Date: _________________ Score: _____ / 30 Time: _________*

---

## 📖 Part 1: Real-World Context & Concept Spotlight

### 🌟 1. The Story of 10-Year-Old Carl Friedrich Gauss (1787)
In a German classroom in 1787, schoolmaster J.G. Büttner wanted to keep his noisy class busy for an hour. He gave them a punishment task:
$$\text{“Add all whole numbers from } 1 \text{ to } 100 \text{ together!”}$$
$$(1 + 2 + 3 + 4 + 5 + \dots + 98 + 99 + 100)$$

While his classmates frantically filled their slate boards with tedious column addition, **10-year-old Carl Friedrich Gauss** thought for a few seconds, walked up to the master’s desk, and slammed down his slate with a single number: **$5050$**.

---

### 💡 2. The Gauss Pairing Discovery (Why It Works)
Gauss realized that numbers in a consecutive sequence can be **paired up from the outside inward**:

```
 1   +   2   +   3   +  ...  +  98  +  99  +  100
 │       │       │               │      │      │
 └───────┼───────┼───────────────┼──────┼──────┘  = 101
         └───────┼───────────────┼──────┘         = 101
                 └───────────────┘                = 101
```

* **Sum of each outer pair**: $1 + 100 = 101$, $2 + 99 = 101$, $3 + 98 = 101$, $\dots$, $50 + 51 = 101$.
* **How many pairs are there?** Exactly half the total count of numbers: $\frac{100}{2} = 50\text{ pairs}$.
* **Total Sum**:
  $$\text{Sum} = 50 \times 101 = 5050$$

---

### 📐 3. The Visual Proof: Two Stepped Staircases Make a Rectangle
If you build a staircase of $N$ blocks ($1$ on step 1, $2$ on step 2, up to $N$ on step $N$), you get a triangular shape.
Duplicate the staircase, turn it upside down, and lock them together:

```
  Step 1 to 4:
  # . . .  +  # # # #     # # # # #
  # # . .  +  . # # #  =  # # # # #  (Width = N + 1 = 5)
  # # # .  +  . . # #  =  # # # # #  (Height = N = 4)
  # # # #  +  . . . #     # # # # #
  [Stair 1]   [Stair 2]   [Total Rectangle Area = 4 × 5 = 20]
```

Since the combined rectangle has dimensions $N \times (N + 1)$, one single staircase has an area of:
$$\text{Sum}(1 \dots N) = \frac{N \times (N + 1)}{2}$$

#### 🚀 Instant 1-to-N Mental Shortcuts:
* **$1$ to $10$**: $\frac{10 \times 11}{2} = 5 \times 11 = \mathbf{55}$
* **$1$ to $100$**: $\frac{100 \times 101}{2} = 50 \times 101 = \mathbf{5050}$
* **$1$ to $1000$**: $\frac{1000 \times 1001}{2} = 500 \times 1001 = \mathbf{500{,}500}$
* **$1$ to $10{,}000$**: $\frac{10000 \times 10001}{2} = 5000 \times 10001 = \mathbf{50{,}005{,}000}$

---

### 🚀 4. The Universal Formula: Sequential Numbers from $A$ to $B$
What if the sequence doesn't start at 1? (e.g., $5$ to $25$, $5$ to $10{,}000$, or $5$ to $10{,}001$)?

#### ⚠️ THE CRUCIAL TRAP: The "Fencepost Rule" for Counting Numbers ($N$)
If you count fenceposts from post $5$ to post $7$: $(5, 6, 7) \implies \mathbf{3\text{ numbers}}$, but $7 - 5 = 2$!
Always add $1$ when counting inclusive consecutive numbers:
$$\text{Number of terms } N = \text{Last} - \text{First} + 1 = B - A + 1$$

* For $5$ to $25$: $N = 25 - 5 + 1 = \mathbf{21\text{ numbers}}$ (NOT $20$!)
* For $5$ to $10{,}000$: $N = 10000 - 5 + 1 = \mathbf{9996\text{ numbers}}$
* For $5$ to $10{,}001$: $N = 10001 - 5 + 1 = \mathbf{9997\text{ numbers}}$

---

#### 🌟 The Universal Gauss Sum Formula:
$$\text{Sum}(A \dots B) = \frac{N \times (\text{First} + \text{Last})}{2} = N \times \text{Average}$$

#### Worked Example 1: Sum of $5$ to $25$
1. **Count of numbers ($N$)**: $25 - 5 + 1 = 21$
2. **Pair Sum ($\text{First} + \text{Last}$)**: $5 + 25 = 30$
3. **Total Sum**: $\frac{21 \times 30}{2} = 21 \times 15 = \mathbf{315}$

#### Worked Example 2: Sum of $5$ to $10{,}000$
1. **Count of numbers ($N$)**: $10000 - 5 + 1 = 9996$
2. **Pair Sum**: $5 + 10000 = 10005$
3. **Total Sum**: $\frac{9996 \times 10005}{2} = 4998 \times 10005 = \mathbf{50{,}004{,}990}$

#### Worked Example 3: Sum of $5$ to $10{,}001$
1. **Count of numbers ($N$)**: $10001 - 5 + 1 = 9997$
2. **Pair Sum**: $5 + 10001 = 10006$
3. **Total Sum**: $\frac{9997 \times 10006}{2} = 9997 \times 5003 = \mathbf{50{,}014{,}991}$

---

### 🛡️ 5. The Alternative Subtraction Method (Double-Check Proof)
You can also calculate the sum from $A$ to $B$ by taking the total sum from $1$ to $B$ and **subtracting the missing prefix** from $1$ to $(A - 1)$:
$$\text{Sum}(A \dots B) = \text{Sum}(1 \dots B) - \text{Sum}(1 \dots A - 1)$$

* Example for $5$ to $25$:
  $$\text{Sum}(1 \dots 25) = \frac{25 \times 26}{2} = 325$$
  $$\text{Sum}(1 \dots 4) = \frac{4 \times 5}{2} = 10$$
  $$\text{Sum}(5 \dots 25) = 325 - 10 = \mathbf{315} \quad \checkmark \text{ (Matches perfectly!)}$$

---

### ⚖️ 6. Consecutive Evens, Odds & Step Progressions

#### A. Consecutive Even Numbers ($2 + 4 + 6 + \dots + 2k$):
* Factor out $2$: $2(1 + 2 + 3 + \dots + k) = 2 \times \frac{k(k+1)}{2} = \mathbf{k(k + 1)}$
* Example: Sum of first $10$ even numbers ($2 + 4 + \dots + 20$): $10 \times 11 = \mathbf{110}$.

#### B. Consecutive Odd Numbers ($1 + 3 + 5 + \dots + (2k - 1)$):
* Visual proof: Adding an L-shaped border of $3, 5, 7, 9$ blocks onto a $1\times 1$ square creates a $2\times 2$, $3\times 3$, $4\times 4$ square!
* Sum of first $k$ odd numbers $= \mathbf{k^2}$
* Example: Sum of first $10$ odd numbers ($1 + 3 + 5 + \dots + 19$): $10^2 = \mathbf{100}$.

#### C. General Step Progressions (Step $d$):
$$\text{Number of terms } N = \frac{\text{Last} - \text{First}}{\text{Step}} + 1 \qquad \text{Sum} = \frac{N \times (\text{First} + \text{Last})}{2}$$

---

## ✏️ Part 2: Tier 1 Benchmark Questions (1 to N Fluency)

Calculate the sum of each consecutive integer sequence using $\frac{N(N+1)}{2}$. Show your work!

1. Find the sum of all whole numbers from $1$ to $10$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

2. Find the sum of all whole numbers from $1$ to $20$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

3. Find the sum of all whole numbers from $1$ to $50$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

4. Find the sum of all whole numbers from $1$ to $100$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

5. Find the sum of all whole numbers from $1$ to $200$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

6. Find the sum of all whole numbers from $1$ to $500$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

7. Find the sum of all whole numbers from $1$ to $1000$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

8. Find the sum of all whole numbers from $1$ to $5000$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

9. Find the sum of all whole numbers from $1$ to $10{,}000$:
   - Work: $\underline{\hspace{6cm}}$
   - Answer: $\underline{\hspace{3cm}}$

10. A clock chimes $1$ time at 1 o'clock, $2$ times at 2 o'clock, up to $12$ times at 12 o'clock. How many total chimes does it ring in a 12-hour cycle?
    - Work: $\underline{\hspace{6cm}}$
    - Answer: $\underline{\hspace{3cm}}$

---

## 🚀 Part 3: Tier 2 Enriched Deep Thinkers (Arbitrary Ranges & Patterns)

Use the Universal Formula $\text{Sum} = \frac{N(A + B)}{2}$ or the Subtraction Method.

11. Sum of all integers from $5$ to $25$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

12. Sum of all integers from $10$ to $50$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

13. Sum of all integers from $21$ to $60$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

14. Sum of all integers from $50$ to $150$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

15. Sum of all integers from $100$ to $200$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

16. Sum of all integers from $5$ to $10{,}000$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

17. Sum of all integers from $5$ to $10{,}001$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

18. Sum of all integers from $11$ to $99$:
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

19. Sum of the first $25$ consecutive even numbers ($2 + 4 + 6 + \dots + 50$):
    - Formula: $k(k+1)$ where $k = 25$
    - Total: $\underline{\hspace{3cm}}$

20. Sum of the first $30$ consecutive odd numbers ($1 + 3 + 5 + \dots + 59$):
    - Formula: $k^2$ where $k = 30$
    - Total: $\underline{\hspace{3cm}}$

21. Sum of all multiples of $5$ from $5$ to $100$ ($5 + 10 + 15 + \dots + 100$):
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

22. Sum of all multiples of $7$ between $10$ and $100$ ($14 + 21 + 28 + \dots + 98$):
    - $N = \underline{\quad}$, Pair Sum $= \underline{\quad}$
    - Total: $\underline{\hspace{3cm}}$

---

## 🏆 Part 4: Tier 3 Waterloo CEMC Contest & Multi-Step Challenges

23. **The Handshake Problem (Waterloo Gauss Classic)**:
    At the Ottawa STEM Championship, $16$ students meet. If every student shakes hands with every other student exactly once, how many total handshakes occur?
    - *Hint*: The 1st person shakes $15$ hands, the 2nd shakes $14$, etc. Sum $= 15 + 14 + \dots + 1$.
    - Answer: $\underline{\hspace{3cm}}$

24. **The Bowling Pin Pyramid**:
    A massive bowling alley display stacks pins in a triangle: $1$ pin in row 1, $2$ pins in row 2, $3$ pins in row 3, up to $20$ pins in row 20. How many total pins are in the pyramid?
    - Answer: $\underline{\hspace{3cm}}$

25. **Consecutive Integer Mystery**:
    The sum of $5$ consecutive whole numbers is $165$. What is the middle number, and what is the smallest number?
    - *Hint*: If $N$ is odd, the average is the middle number!
    - Middle Number: $\underline{\hspace{2cm}}$, Smallest: $\underline{\hspace{2cm}}$

26. **The Even Integer Balance**:
    The sum of $4$ consecutive even numbers is $100$. Find the $4$ numbers.
    - Numbers: $\underline{\hspace{4cm}}$

27. **The Reverse Gauss Equation**:
    If $1 + 2 + 3 + \dots + n = 210$, what is the value of $n$?
    - *Hint*: $n(n+1) = 420$. What two consecutive numbers multiply to $420$?
    - Answer: $n = \underline{\hspace{2cm}}$

28. **The Missing Page Number Riddle**:
    Sophia adds up all the page numbers in a book from page $1$ to page $n$. By accident, she counted one page number twice, getting a total sum of $410$.
    - What is the total number of pages $n$, and which page was counted twice?
    - Total Pages $n = \underline{\quad}$, Repeated Page $= \underline{\quad}$

29. **Difference of Two Sequences**:
    Without calculating both giant sums individually, find the value of:
    $$(2 + 4 + 6 + \dots + 100) - (1 + 3 + 5 + \dots + 99)$$
    - *Hint*: Pair each term: $(2 - 1) + (4 - 3) + (6 - 5) + \dots + (100 - 99)$.
    - Answer: $\underline{\hspace{3cm}}$

30. **Waterloo Gauss Arena: The Staircase Tiling Challenge**:
    A staircase is built using $1\text{ cm} \times 1\text{ cm}$ square tiles. The 1st step has $5$ tiles, the 2nd step has $7$ tiles, the 3rd step has $9$ tiles, continuing with this pattern up to the 50th step.
    - What is the total number of tiles used to build all 50 steps?
    - *Hint*: Sequence is $5, 7, 9, \dots, (5 + 49 \times 2 = 103)$.
    - Answer: $\underline{\hspace{3cm}}$

---

## 🔑 Comprehensive Answer Key & Step-by-Step Solutions

### Part 2 Solutions (Tier 1)
1. **$55$**: $\frac{10 \times 11}{2} = 5 \times 11 = 55$.
2. **$210$**: $\frac{20 \times 21}{2} = 10 \times 21 = 210$.
3. **$1275$**: $\frac{50 \times 51}{2} = 25 \times 51 = 1275$.
4. **$5050$**: $\frac{100 \times 101}{2} = 50 \times 101 = 5050$.
5. **$20{,}100$**: $\frac{200 \times 201}{2} = 100 \times 201 = 20{,}100$.
6. **$125{,}250$**: $\frac{500 \times 501}{2} = 250 \times 501 = 125{,}250$.
7. **$500{,}500$**: $\frac{1000 \times 1001}{2} = 500 \times 1001 = 500{,}500$.
8. **$12{,}502{,}500$**: $\frac{5000 \times 5001}{2} = 2500 \times 5001 = 12{,}502{,}500$.
9. **$50{,}005{,}000$**: $\frac{10000 \times 10001}{2} = 5000 \times 10001 = 50{,}005{,}000$.
10. **$78\text{ chimes}$**: Sum of $1 \dots 12 = \frac{12 \times 13}{2} = 6 \times 13 = 78$.

---

### Part 3 Solutions (Tier 2)
11. **$315$**: $N = 25 - 5 + 1 = 21$, Pair Sum $= 5 + 25 = 30$. $\text{Sum} = \frac{21 \times 30}{2} = 21 \times 15 = 315$.
12. **$1230$**: $N = 50 - 10 + 1 = 41$, Pair Sum $= 10 + 50 = 60$. $\text{Sum} = \frac{41 \times 60}{2} = 41 \times 30 = 1230$.
13. **$1620$**: $N = 60 - 21 + 1 = 40$, Pair Sum $= 21 + 60 = 81$. $\text{Sum} = \frac{40 \times 81}{2} = 20 \times 81 = 1620$.
14. **$10{,}100$**: $N = 150 - 50 + 1 = 101$, Pair Sum $= 50 + 150 = 200$. $\text{Sum} = \frac{101 \times 200}{2} = 101 \times 100 = 10{,}100$.
15. **$15{,}150$**: $N = 200 - 100 + 1 = 101$, Pair Sum $= 100 + 200 = 300$. $\text{Sum} = \frac{101 \times 300}{2} = 101 \times 150 = 15{,}150$.
16. **$50{,}004{,}990$**: $N = 10000 - 5 + 1 = 9996$, Pair Sum $= 5 + 10000 = 10005$. $\text{Sum} = \frac{9996 \times 10005}{2} = 4998 \times 10005 = 50{,}004{,}990$. (Or: $\text{Sum}(1..10000) - \text{Sum}(1..4) = 50{,}005{,}000 - 10 = 50{,}004{,}990$).
17. **$50{,}014{,}991$**: $N = 10001 - 5 + 1 = 9997$, Pair Sum $= 5 + 10001 = 10006$. $\text{Sum} = \frac{9997 \times 10006}{2} = 9997 \times 5003 = 50{,}014{,}991$. (Or: $50{,}004{,}990 + 10001 = 50{,}014{,}991$).
18. **$4895$**: $N = 99 - 11 + 1 = 89$, Pair Sum $= 11 + 99 = 110$. $\text{Sum} = \frac{89 \times 110}{2} = 89 \times 55 = 4895$.
19. **$650$**: $k = 25 \implies k(k+1) = 25 \times 26 = 650$.
20. **$900$**: $k = 30 \implies k^2 = 30^2 = 900$.
21. **$1050$**: Multiples of $5$: $5(1 + 2 + \dots + 20) = 5 \times 210 = 1050$. (Or $N = 20$, Pair $= 105 \implies \frac{20 \times 105}{2} = 1050$).
22. **$728$**: Terms are $14, 21, \dots, 98$. $N = \frac{98 - 14}{7} + 1 = 12 + 1 = 13$ terms. Pair Sum $= 14 + 98 = 112$. $\text{Sum} = \frac{13 \times 112}{2} = 13 \times 56 = 728$.

---

### Part 4 Solutions (Tier 3 Waterloo CEMC)
23. **$120\text{ handshakes}$**: $\frac{16 \times 15}{2} = 8 \times 15 = 120$.
24. **$210\text{ pins}$**: $\frac{20 \times 21}{2} = 10 \times 21 = 210$.
25. **Middle $= 33$, Smallest $= 31$**: Average $= \frac{165}{5} = 33$. The 5 numbers are $31, 32, 33, 34, 35$. Smallest is $31$.
26. **$22, 24, 26, 28$**: Average of 4 consecutive evens is $25$. The numbers centered on $25$ are $22, 24, 26, 28$. Sum $= 22 + 24 + 26 + 28 = 100$.
27. **$n = 20$**: $\frac{n(n+1)}{2} = 210 \implies n(n+1) = 420$. Since $20 \times 21 = 420$, $n = 20$.
28. **$n = 28$ pages, Repeated Page $= 4$**:
    - The largest triangular number below $410$ is for $n = 28$: $\text{Sum}(1 \dots 28) = \frac{28 \times 29}{2} = 406$.
    - The excess is $410 - 406 = 4$, so page $4$ was counted twice!
29. **$50$**:
    - Pairing terms: $(2 - 1) + (4 - 3) + (6 - 5) + \dots + (100 - 99)$.
    - Each of the $50$ pairs equals $1$. Total $= 50 \times 1 = 50$.
30. **$2700\text{ tiles}$**:
    - First term $a = 5$, Last term $l = 5 + (50 - 1) \times 2 = 103$.
    - $N = 50$ steps.
    - $\text{Sum} = \frac{50 \times (5 + 103)}{2} = 25 \times 108 = 2700\text{ tiles}$.
