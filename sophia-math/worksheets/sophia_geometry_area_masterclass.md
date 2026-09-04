# 📐 Sophia's Geometry & Area Masterclass
### *Ontario Curriculum Grade 5 & 6 (Strand E: Spatial Sense) & Waterloo CEMC Gauss Enrichment*

---

## 🎯 Course Overview & Core Geometric Principles

**Area** measures the two-dimensional space contained within a closed boundary, measured in **square units** ($\text{mm}^2$, $\text{cm}^2$, $\text{m}^2$, $\text{km}^2$, $\text{ha}$).

Every standard area formula originates from the **fundamental unit square** ($1\text{ cm} \times 1\text{ cm} = 1\text{ cm}^2$). By decomposing, shearing, and reconstructing geometric figures, all polygons and curved figures relate directly back to rectangles!

```
                    AREA FORMULA FAMILY TREE
                    
                       [ Rectangle / Square ]
                            A = b × h
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
 [ Parallelogram ]         [ Triangle ]             [ Circle ]
    A = b × h           A = (1/2) × b × h          A = π × r²
        │                       │               (Cut into infinite
        ▼                       ▼                 wedges → rectangle)
  [ Trapezoid ]         [ Rhombus & Kite ]
A = ((a+b)/2) × h       A = (d₁ × d₂) / 2
```

---

## 📚 Section 1: Visual Proofs, Formulas & Common Traps

### 1. Rectangles & Squares
* **Formulas**: 
  $$\text{Rectangle: } A = l \times w = b \times h \qquad \text{Square: } A = s^2$$
* **Missing Side Dimension**: $l = \frac{A}{w} \quad \text{or} \quad w = \frac{A}{l}$
* **Perimeter vs. Area Distinction**: 
  - Perimeter is the linear fence around the outside ($P = 2l + 2w$, units: $\text{cm}$).
  - Area is the 2D surface covered inside ($A = l \times w$, units: $\text{cm}^2$).
* ⚠️ **Common Trap**: Confusing units! If length is in metres and width is in centimetres, convert to the same unit *before* multiplying ($1\text{ m} = 100\text{ cm} \implies 1\text{ m}^2 = 10\,000\text{ cm}^2$).

---

### 2. Triangles (Right, Acute, Obtuse)
* **Formula**:
  $$A = \frac{1}{2} \times b \times h = \frac{b \times h}{2}$$
* **Visual Proof (Doubling Method)**:
  Any triangle can be duplicated, rotated $180^\circ$, and joined along its hypotenuse/side to create a parallelogram with the exact same base and height. Therefore, the triangle's area is **exactly half** of the parallelogram.
* **Perpendicular Height ($h$) vs. Slant Side ($s$)**:
  - The height $h$ **must always be perpendicular ($90^\circ$)** to the chosen base line.
  - In an **obtuse triangle**, the perpendicular height falls *outside* the triangle onto the extended base line.
* ⚠️ **Common Trap**: Never multiply two slant sides together! Always look for the $90^\circ$ right-angle square marker.

---

### 3. Parallelograms
* **Formula**:
  $$A = b \times h$$
* **Visual Proof (Shearing / Cut-and-Slide)**:
  Cut off the right-triangular corner of a parallelogram along its vertical height $h$ and translate it to the opposite side. The resulting shape is an identical rectangle with dimensions $b$ and $h$.
* ⚠️ **Common Trap**: A parallelogram with side lengths $8\text{ cm}$ and $6\text{ cm}$ does **not** have an area of $8 \times 6 = 48\text{ cm}^2$ unless the angle is $90^\circ$. The true height $h < 6\text{ cm}$.

---

### 4. Trapezoids (Trapeziums)
* **Formula**:
  $$A = \frac{a + b}{2} \times h = \frac{(a + b) \times h}{2}$$
  *(Where $a$ and $b$ are the lengths of the two parallel bases, and $h$ is the perpendicular distance between them).*
* **Visual Proof (Average Bases / Dual Pair)**:
  1. **Dual Pair**: Joining two identical trapezoids upside-down forms a single large parallelogram of base $(a + b)$ and height $h$. The area of one trapezoid is half: $\frac{1}{2}(a + b)h$.
  2. **Average Bases**: $\frac{a + b}{2}$ represents the *median width* of the trapezoid. Multiplying this average width by $h$ produces an equivalent rectangle.
* ⚠️ **Common Trap**: Adding the non-parallel slanted legs instead of the parallel bases $a$ and $b$.

---

### 5. Rhombuses & Kites
* **Formula**:
  $$A = \frac{d_1 \times d_2}{2}$$
  *(Where $d_1$ and $d_2$ are the lengths of the two intersecting perpendicular diagonals).*
* **Visual Proof (Bounding Rectangle)**:
  A rectangle drawn around the vertices of a kite or rhombus has width $d_1$ and height $d_2$ with total area $d_1 \times d_2$. The four outer corner triangles exactly equal the four inner triangles. Hence, the inner shape occupies exactly half ($50\%$) of the bounding box.

---

### 6. Circles & Annulus (Rings)
* **Formulas**:
  $$\text{Circle Area: } A = \pi r^2 \qquad \text{Circumference: } C = 2\pi r = \pi d$$
  $$\text{Annulus (Ring) Area: } A = \pi R^2 - \pi r^2 = \pi(R^2 - r^2)$$
  *(Use $\pi \approx 3.14$ or $\pi \approx \frac{22}{7}$; $r = \text{radius} = \frac{d}{2}$, $R = \text{outer radius}$, $r = \text{inner radius}$)*
* **Visual Proof (Sector Unrolling)**:
  Slice a circle into 16 or 32 equal pizza wedges and interlock them alternately. As the wedges become infinitely thin, the rearranged shape forms a rectangle of height $r$ and length equal to half the circumference ($\frac{1}{2} \times 2\pi r = \pi r$).
  $$\text{Area} = \text{length} \times \text{width} = (\pi r) \times r = \pi r^2$$
* ⚠️ **Common Trap**: Squaring the diameter instead of the radius! If diameter $d = 10\text{ cm}$, then $r = 5\text{ cm}$, and $A = \pi \times 5^2 = 25\pi \approx 78.5\text{ cm}^2$ (NOT $100\pi$).

---

### 7. Composite 2D Shapes & Shaded Regions
* **Two Master Strategies**:
  1. **Additive Method (Decomposition)**: Cut the irregular shape into non-overlapping standard shapes (rectangles, triangles, semicircles) and calculate the sum:
     $$A_{\text{total}} = A_1 + A_2 + A_3 + \dots$$
  2. **Subtractive Method (Bounding Box / Cutouts)**: Enclose the figure in a simple bounding rectangle and subtract the unshaded empty spaces:
     $$A_{\text{shaded}} = A_{\text{total bounding}} - A_{\text{unshaded cutouts}}$$

---

### 8. Surface Area of 3D Prisms
* **Formulas**:
  - **Rectangular Prism (Box)**: 
    $$SA = 2(lw + lh + wh)$$
  - **Triangular Prism**:
    $$SA = 2 \times (\text{Base Triangle Area}) + (s_1 + s_2 + s_3) \times L$$
    *(Sum of the 2 triangular end bases plus the 3 rectangular side walls).*

---

## 📝 Section 2: 30-Question Enriched Practice Arena

### ⭐ Tier 1: Ontario Core Benchmarks (Foundations & Single-Shape Applications)

1. **Rectangle Dimensions**: A rectangular outdoor ice rink in Ottawa has a length of $24\text{ m}$ and a width of $15\text{ m}$. Calculate its total surface area and perimeter.
2. **Right Triangle**: A triangular solar panel on a Canadian satellite has a perpendicular base of $18\text{ cm}$ and a height of $14\text{ cm}$. What is the surface area of the panel?
3. **Square Garden**: Sophia designs a square vegetable garden with an area of $144\text{ m}^2$. What is the perimeter of the garden fence?
4. **Parallelogram**: A stained glass window pane is shaped as a parallelogram with a base of $16\text{ cm}$ and a perpendicular height of $9.5\text{ cm}$. Find its area.
5. **Trapezoid Flowerbed**: A community garden flowerbed is an isosceles trapezoid with parallel bases measuring $12\text{ m}$ and $20\text{ m}$, and a perpendicular distance between them of $7\text{ m}$. Calculate the area.
6. **Obtuse Triangle**: An obtuse triangle has a base of $15\text{ cm}$. Its perpendicular height, measured to the extended horizontal baseline outside the triangle, is $8.4\text{ cm}$. What is its area?
7. **Rhombus Kite**: A diamond-shaped celebration kite has two perpendicular cross-struts (diagonals) of lengths $40\text{ cm}$ and $28\text{ cm}$. Find the total area of nylon fabric required.
8. **Circle Patio**: A circular fire pit at Algonquin Park has a radius of $1.5\text{ m}$. Using $\pi \approx 3.14$, calculate the ground area covered by the pit.
9. **Circle from Diameter**: A circular trampoline has a diameter of $4\text{ m}$. Using $\pi \approx 3.14$, determine the area of the jumping mat.
10. **Box Surface Area**: A gift box measures $10\text{ cm}$ long, $6\text{ cm}$ wide, and $4\text{ cm}$ high. How many square centimetres of wrapping paper are needed to cover all 6 faces without overlap?

---

### ⭐⭐ Tier 2: Multi-Step & Reverse Dimensions (Enriched Problem Solving)

11. **Reverse Triangle Dimension**: A triangle has an area of $84\text{ cm}^2$ and a base of $14\text{ cm}$. What is its perpendicular height?
12. **Reverse Trapezoid Height**: A trapezoid with parallel bases of $11\text{ cm}$ and $19\text{ cm}$ has an area of $120\text{ cm}^2$. Determine the perpendicular height between the bases.
13. **L-Shaped Room Flooring**: A junior study room is L-shaped with an outer bounding width of $8\text{ m}$ and length of $10\text{ m}$. An inner corner measuring $4\text{ m} \times 5\text{ m}$ is cut out. Hardwood flooring costs $\$45\text{ per m}^2$. What is the total cost to floor the room?
14. **Trapezoid vs. Triangle Comparison**: Trapezoid $T$ has parallel bases $6\text{ cm}$ and $10\text{ cm}$ with height $8\text{ cm}$. Triangle $K$ has a base of $16\text{ cm}$. If both shapes have the exact same area, what is the height of Triangle $K$?
15. **Circular Ring (Annulus)**: A circular fountain with a radius of $3\text{ m}$ is surrounded by a paved walking ring that is $1\text{ m}$ wide all around. Using $\pi \approx 3.14$, find the area of the paved walking ring.
16. **House Silhouette Composite**: A birdhouse front facade consists of a square base of side $12\text{ cm}$ topped with a triangular roof of base $12\text{ cm}$ and peak height $8\text{ cm}$. A circular entrance hole of diameter $4\text{ cm}$ is drilled in the centre. Using $\pi \approx 3.14$, find the remaining solid wooden surface area.
17. **Square and Diagonal Rhombus**: A square has side length $10\text{ cm}$. A rhombus is drawn inside by connecting the midpoints of the four sides of the square. 
    - (a) What are the lengths of the diagonals of the rhombus?
    - (b) What is the area of the rhombus?
    - (c) What fraction of the square's area does the rhombus occupy?
18. **Parallelogram Lawn & Sidewalk**: A rectangular lawn measures $30\text{ m} \times 20\text{ m}$. A paved diagonal path shaped as a parallelogram with horizontal base $2.5\text{ m}$ and vertical height $20\text{ m}$ runs through the lawn. What is the remaining grass area?
19. **Triangular Prism Tent**: A camping tent is shaped as a triangular prism. The two triangular end walls have a base of $2\text{ m}$ and a height of $1.5\text{ m}$. The tent is $3.5\text{ m}$ long, and each of the two slanted roof sides measures $1.8\text{ m}$ wide. Calculate the total surface area of fabric including the rectangular floor ($2\text{ m} \times 3.5\text{ m}$).
20. **Double-Circle Target**: An archery target consists of a central gold bullseye circle of radius $6\text{ cm}$ and an outer red ring of radius $12\text{ cm}$. What percentage of the total target area does the gold bullseye represent?

---

### ⭐⭐⭐ Tier 3: Waterloo CEMC Gauss Contest Challenges (Shaded Puzzles & Geometric Insight)

21. **Four Corner Semicircles (Waterloo Gauss Style)**: Inside a square of side length $20\text{ cm}$, four identical semicircles are drawn using the four sides of the square as their diameters. Find the area of the square *not* covered by the semicircles, and the area of the central 4-petal flower overlap (use $\pi \approx 3.14$).
22. **Shaded Triangle in a Grid**: In a $6 \times 4$ grid of $1\text{ cm} \times 1\text{ cm}$ unit squares, a triangle has vertices at $(0, 0)$, $(6, 1)$, and $(2, 4)$. Using the subtractive bounding box method, calculate the exact area of the triangle.
23. **Overlapping Equilateral Triangles (Hexagram Star)**: Two identical equilateral triangles each with an area of $36\text{ cm}^2$ overlap so that their intersection forms a regular 6-pointed star (Star of David), with a regular hexagon in the centre. What is the area of the central regular hexagon, and what is the total union area of the star?
24. **Ratio of Shaded Regions**: A square $ABCD$ with side length $12\text{ cm}$ has point $M$ at the midpoint of $BC$ and point $N$ at the midpoint of $CD$. Line segments $AM$ and $AN$ are drawn. Find the area of Triangle $AMN$.
25. **The Yin-Yang Semicircle Split**: A large circle has a diameter of $16\text{ cm}$. A continuous S-curve composed of two identical semicircles divides the circle into two congruent halves. Find the exact area and perimeter of one of the halves (express in terms of $\pi$).
26. **Trapezoid Divided by Diagonal**: A trapezoid $ABCD$ has parallel sides $AB = 8\text{ cm}$ and $CD = 14\text{ cm}$. Diagonal $AC$ splits the trapezoid into two triangles, $\triangle ABC$ and $\triangle ACD$. If the total area of the trapezoid is $110\text{ cm}^2$, find the individual areas of $\triangle ABC$ and $\triangle ACD$.
27. **Circle Inscribed in a Square vs. Square Inscribed in a Circle**: 
    - Square $S_1$ has a circle $C$ inscribed tightly inside it.
    - Inside circle $C$, a smaller square $S_2$ is inscribed with its four vertices touching the circle.
    - What is the exact ratio of the area of the large square $S_1$ to the small square $S_2$?
28. **The Tiled Patio Puzzle**: A rectangular patio is paved with 12 identical rectangular stone tiles. The tiles are arranged so that 3 horizontal tiles match the length of 4 vertical tiles. If the perimeter of each single tile is $70\text{ cm}$, find the total area of the entire patio in square metres ($\text{m}^2$).
29. **Three Overlapping Circles**: Three identical circular Canadian coins of radius $2\text{ cm}$ are placed flat on a table so that each coin is tangent (touches) the other two coins. A triangular gap is trapped in the middle. Find the area of this trapped central region using $\pi \approx 3.14$ and $\sqrt{3} \approx 1.732$.
30. **Folded Paper Triangle**: A rectangular strip of paper $4\text{ cm}$ wide and $20\text{ cm}$ long is folded along a straight crease so that one corner touches the opposite long edge, forming a right-angled triangle. If the crease line has a length of $5\text{ cm}$, calculate the area of the overlapping double-thickness region.

---

## 🔑 Section 3: Comprehensive Worked Answer Key & Explanations

### Tier 1 Solutions

1. **Ice Rink**:
   - Area: $A = l \times w = 24\text{ m} \times 15\text{ m} = \mathbf{360\text{ m}^2}$.
   - Perimeter: $P = 2(24 + 15) = 2(39) = \mathbf{78\text{ m}}$.
2. **Solar Panel Triangle**:
   - $A = \frac{1}{2} b h = \frac{1}{2} \times 18\text{ cm} \times 14\text{ cm} = 9 \times 14 = \mathbf{126\text{ cm}^2}$.
3. **Square Garden Perimeter**:
   - Side length $s = \sqrt{144} = 12\text{ m}$.
   - Perimeter: $P = 4s = 4 \times 12\text{ m} = \mathbf{48\text{ m}}$.
4. **Stained Glass Parallelogram**:
   - $A = b \times h = 16\text{ cm} \times 9.5\text{ cm} = \mathbf{152\text{ cm}^2}$.
5. **Trapezoid Flowerbed**:
   - $A = \frac{a + b}{2} \times h = \frac{12 + 20}{2} \times 7 = \frac{32}{2} \times 7 = 16 \times 7 = \mathbf{112\text{ m}^2}$.
6. **Obtuse Triangle**:
   - $A = \frac{1}{2} b h = \frac{1}{2} \times 15\text{ cm} \times 8.4\text{ cm} = 15 \times 4.2 = \mathbf{63\text{ cm}^2}$.
7. **Rhombus Kite**:
   - $A = \frac{d_1 \times d_2}{2} = \frac{40 \times 28}{2} = 40 \times 14 = \mathbf{560\text{ cm}^2}$.
8. **Circle Fire Pit Area**:
   - $A = \pi r^2 \approx 3.14 \times (1.5)^2 = 3.14 \times 2.25 = \mathbf{7.065\text{ m}^2}$.
9. **Trampoline Mat**:
   - Radius $r = \frac{d}{2} = \frac{4}{2} = 2\text{ m}$.
   - $A = \pi r^2 \approx 3.14 \times 2^2 = 3.14 \times 4 = \mathbf{12.56\text{ m}^2}$.
10. **Gift Box Surface Area**:
    - $SA = 2(lw + lh + wh) = 2(10 \times 6 + 10 \times 4 + 6 \times 4) = 2(60 + 40 + 24) = 2(124) = \mathbf{248\text{ cm}^2}$.

---

### Tier 2 Solutions

11. **Reverse Triangle Height**:
    - Formula: $A = \frac{1}{2} b h \implies 84 = \frac{1}{2} \times 14 \times h \implies 84 = 7h \implies h = \frac{84}{7} = \mathbf{12\text{ cm}}$.
12. **Reverse Trapezoid Height**:
    - Formula: $A = \frac{a + b}{2} \times h \implies 120 = \frac{11 + 19}{2} \times h \implies 120 = 15h \implies h = \frac{120}{15} = \mathbf{8\text{ cm}}$.
13. **L-Shaped Room Flooring**:
    - Total outer bounding area: $8\text{ m} \times 10\text{ m} = 80\text{ m}^2$.
    - Cutout corner area: $4\text{ m} \times 5\text{ m} = 20\text{ m}^2$.
    - Net floor area: $80 - 20 = 60\text{ m}^2$.
    - Total cost: $60\text{ m}^2 \times \$45 = \mathbf{\$2\,700}$.
14. **Trapezoid vs. Triangle Comparison**:
    - Area of Trapezoid $T$: $A = \frac{6 + 10}{2} \times 8 = 8 \times 8 = 64\text{ cm}^2$.
    - For Triangle $K$: $A = \frac{1}{2} b h \implies 64 = \frac{1}{2} \times 16 \times h \implies 64 = 8h \implies h = \mathbf{8\text{ cm}}$.
15. **Circular Ring (Annulus)**:
    - Inner radius $r = 3\text{ m} \implies A_{\text{inner}} = 3.14 \times 3^2 = 28.26\text{ m}^2$.
    - Outer radius $R = 3 + 1 = 4\text{ m} \implies A_{\text{outer}} = 3.14 \times 4^2 = 50.24\text{ m}^2$.
    - Ring Area: $A_{\text{ring}} = 50.24 - 28.26 = \mathbf{21.98\text{ m}^2}$ (or $\pi(4^2 - 3^2) = 7\pi \approx 21.98\text{ m}^2$).
16. **House Silhouette Composite**:
    - Square base: $12 \times 12 = 144\text{ cm}^2$.
    - Triangular roof: $\frac{1}{2} \times 12 \times 8 = 48\text{ cm}^2$.
    - Circular entrance hole: radius $r = 2\text{ cm} \implies A_{\text{hole}} = 3.14 \times 2^2 = 12.56\text{ cm}^2$.
    - Total solid area: $(144 + 48) - 12.56 = 192 - 12.56 = \mathbf{179.44\text{ cm}^2}$.
17. **Square and Midpoint Rhombus**:
    - (a) Diagonals connect opposite midpoints, so $d_1 = 10\text{ cm}$ and $d_2 = 10\text{ cm}$.
    - (b) Rhombus Area: $A = \frac{d_1 \times d_2}{2} = \frac{10 \times 10}{2} = \mathbf{50\text{ cm}^2}$.
    - (c) Square Area $= 10^2 = 100\text{ cm}^2$. Fraction $= \frac{50}{100} = \mathbf{\frac{1}{2} \text{ or } 50\%}$.
18. **Parallelogram Lawn Path**:
    - Total lawn area: $30\text{ m} \times 20\text{ m} = 600\text{ m}^2$.
    - Path area (parallelogram): $b \times h = 2.5\text{ m} \times 20\text{ m} = 50\text{ m}^2$.
    - Remaining grass area: $600 - 50 = \mathbf{550\text{ m}^2}$.
19. **Triangular Prism Tent Surface Area**:
    - 2 Triangular ends: $2 \times (\frac{1}{2} \times 2 \times 1.5) = 2 \times 1.5 = 3.0\text{ m}^2$.
    - 2 Slanted roof sides: $2 \times (1.8 \times 3.5) = 2 \times 6.3 = 12.6\text{ m}^2$.
    - 1 Floor: $2.0 \times 3.5 = 7.0\text{ m}^2$.
    - Total Surface Area: $3.0 + 12.6 + 7.0 = \mathbf{22.6\text{ m}^2}$.
20. **Double-Circle Target Percentage**:
    - Gold bullseye area: $A_{\text{gold}} = \pi \times 6^2 = 36\pi$.
    - Total target area: $A_{\text{total}} = \pi \times 12^2 = 144\pi$.
    - Percentage: $\frac{36\pi}{144\pi} = \frac{36}{144} = \frac{1}{4} = \mathbf{25\%}$.

---

### Tier 3 Solutions (Waterloo CEMC Gauss Level)

21. **Four Semicircles in a Square**:
    - Square area: $20 \times 20 = 400\text{ cm}^2$.
    - Each semicircle has diameter $20\text{ cm} \implies r = 10\text{ cm}$. Area of 1 semicircle $= \frac{1}{2}\pi(10^2) = 50\pi \approx 157\text{ cm}^2$.
    - 4 semicircles together $= 4 \times 50\pi = 200\pi \approx 628\text{ cm}^2$.
    - Because the 4 semicircles overlap in a 4-petal flower in the centre while leaving 4 corner spaces empty:
      - Corner non-covered regions: Two opposing semicircles have combined area $100\pi \approx 314\text{ cm}^2$. The two white corner regions outside them equal $400 - 314 = 86\text{ cm}^2$. All 4 corner gaps equal $2 \times 86 = 86\text{ cm}^2$ (or $400 - 100\pi = \mathbf{86\text{ cm}^2}$).
      - Central 4-petal flower overlap: Total semicircle area $-$ (Square $-$ Corners) $= 200\pi - 400 + (400 - 100\pi) = 100\pi - 400 + 400 = 100\pi - 400 \approx 314 - 400 + 400 - 86 = \mathbf{228\text{ cm}^2}$ (exact: $200\pi - 400 \approx 628 - 400 = \mathbf{228\text{ cm}^2}$).
22. **Shaded Triangle in Grid**:
    - Bounding box from $(0,0)$ to $(6,4)$ has width 6 and height 4: Area $= 6 \times 4 = 24\text{ cm}^2$.
    - Outside Triangle 1 (bottom): base 6, height 1 along bottom $\implies \frac{1}{2} \times 6 \times 1 = 3\text{ cm}^2$.
    - Outside Triangle 2 (left): base 2, height 4 along left $\implies \frac{1}{2} \times 2 \times 4 = 4\text{ cm}^2$.
    - Outside Trapezoid 3 (top right): width 4 (from $x=2$ to $6$), vertical left height 4 (from $y=0$ to 4), right height 3 (from $y=1$ to 4) $\implies \text{Area} = \frac{1}{2} \times (4 - 1 + 0) \dots$ Let's split into rectangle $4 \times 3$ plus top triangle:
      - Top triangle between $(2,4)$ and $(6,1)$: $\frac{1}{2} \times (6-2) \times (4-1) = \frac{1}{2} \times 4 \times 3 = 6\text{ cm}^2$.
    - Total subtracted area: $3 + 4 + 6 = 13\text{ cm}^2$.
    - Shaded Triangle Area: $24 - 13 = \mathbf{11\text{ cm}^2}$.
23. **Hexagram Star & Hexagon**:
    - In a 6-pointed star formed by 2 overlapping equilateral triangles, the figure is composed of 12 congruent small equilateral triangles: 6 form the central regular hexagon and 6 form the outer star points.
    - Each original large equilateral triangle contains 9 of these small triangles ($3^2 = 9$).
    - Since Area of 1 large triangle $= 36\text{ cm}^2$, each small triangle has area $\frac{36}{9} = 4\text{ cm}^2$.
    - Central Hexagon (6 small triangles): $6 \times 4 = \mathbf{24\text{ cm}^2}$.
    - Total Union Area (12 small triangles): $12 \times 4 = \mathbf{48\text{ cm}^2}$.
24. **Ratio of Shaded Triangle $AMN$**:
    - Square area: $12 \times 12 = 144\text{ cm}^2$.
    - Subtract the 3 non-shaded outer right triangles:
      - $\triangle ABM$: $\frac{1}{2} \times AB \times BM = \frac{1}{2} \times 12 \times 6 = 36\text{ cm}^2$.
      - $\triangle ADN$: $\frac{1}{2} \times AD \times DN = \frac{1}{2} \times 12 \times 6 = 36\text{ cm}^2$.
      - $\triangle MCN$: $\frac{1}{2} \times MC \times NC = \frac{1}{2} \times 6 \times 6 = 18\text{ cm}^2$.
    - Sum of unshaded triangles: $36 + 36 + 18 = 90\text{ cm}^2$.
    - Area of $\triangle AMN$: $144 - 90 = \mathbf{54\text{ cm}^2}$ (which is exactly $\frac{3}{8}$ of the square).
25. **Yin-Yang Semicircle Split**:
    - Large circle has diameter $16\text{ cm} \implies$ radius $R = 8\text{ cm}$. Total area $= \pi(8^2) = 64\pi\text{ cm}^2$.
    - The S-curve divides the circle into two symmetric halves:
      $$\text{Area of one half} = \frac{64\pi}{2} = \mathbf{32\pi\text{ cm}^2} \approx \mathbf{100.48\text{ cm}^2}$$
    - Perimeter of one half consists of 1 large outer semicircle arc ($\frac{1}{2} \times 2\pi R = 8\pi$) + 2 smaller internal semicircle arcs of diameter $8\text{ cm}$ ($\frac{1}{2} \times 2\pi(4) \times 2 = 8\pi$):
      $$\text{Perimeter} = 8\pi + 8\pi = \mathbf{16\pi\text{ cm}} \approx \mathbf{50.24\text{ cm}}$$
26. **Trapezoid Divided by Diagonal**:
    - The height $h$ is identical for both $\triangle ABC$ and $\triangle ACD$.
    - Trapezoid Area: $\frac{8 + 14}{2} \times h = 11h = 110 \implies h = 10\text{ cm}$.
    - Area of $\triangle ABC$: $\frac{1}{2} \times 8 \times 10 = \mathbf{40\text{ cm}^2}$.
    - Area of $\triangle ACD$: $\frac{1}{2} \times 14 \times 10 = \mathbf{70\text{ cm}^2}$.
    *(Note: The areas are in the exact ratio of their parallel bases: $8 : 14$).*
27. **Inscribed and Circumscribed Squares Ratio**:
    - Let the circle radius be $r$.
    - Side of outer square $S_1 = 2r \implies \text{Area}(S_1) = (2r)^2 = 4r^2$.
    - Diagonal of inner square $S_2 = 2r \implies \text{Area}(S_2) = \frac{d^2}{2} = \frac{(2r)^2}{2} = \frac{4r^2}{2} = 2r^2$.
    - Ratio $\frac{\text{Area}(S_1)}{\text{Area}(S_2)} = \frac{4r^2}{2r^2} = \mathbf{2 : 1}$ (the outer square is exactly twice the area of the inner square!).
28. **Tiled Patio Puzzle**:
    - Let each tile have length $L$ and width $W$.
    - 3 horizontal tiles match length of 4 vertical tiles: $3L = 4W \implies L = \frac{4}{3}W$.
    - Perimeter of one tile: $2(L + W) = 70 \implies L + W = 35$.
    - Substitute $L$: $\frac{4}{3}W + W = 35 \implies \frac{7}{3}W = 35 \implies W = 15\text{ cm}$, $L = 20\text{ cm}$.
    - Area of 1 tile: $20 \times 15 = 300\text{ cm}^2$.
    - Total patio area (12 tiles): $12 \times 300 = 3\,600\text{ cm}^2 = \mathbf{0.36\text{ m}^2}$.
29. **Three Overlapping Coins Gap**:
    - Connecting the three coin centres forms an equilateral triangle with side length $s = 2r = 4\text{ cm}$.
    - Area of equilateral triangle: $\frac{\sqrt{3}}{4} s^2 = \frac{1.732}{4} \times 16 = 4 \times 1.732 = 6.928\text{ cm}^2$.
    - The triangle contains three $60^\circ$ circular sectors (one from each coin). Three $60^\circ$ sectors $= 180^\circ =$ one semicircle!
    - Area of semicircle: $\frac{1}{2} \pi r^2 = \frac{1}{2} \times 3.14 \times 2^2 = 2 \times 3.14 = 6.28\text{ cm}^2$.
    - Trapped central area: $6.928 - 6.28 = \mathbf{0.648\text{ cm}^2}$.
30. **Folded Paper Triangle**:
    - When the corner is folded so the crease has length $5\text{ cm}$ across width $4\text{ cm}$, the right-angled triangle formed has hypotenuse $5\text{ cm}$ and one leg $4\text{ cm}$.
    - By Pythagorean theorem, the other leg is $\sqrt{5^2 - 4^2} = \sqrt{25 - 16} = \sqrt{9} = 3\text{ cm}$.
    - Area of the overlapping right triangle: $\frac{1}{2} \times 3\text{ cm} \times 4\text{ cm} = \mathbf{6\text{ cm}^2}$.
