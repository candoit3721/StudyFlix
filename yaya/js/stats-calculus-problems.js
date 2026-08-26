/**
 * Yaya's Math Studio - Curated Advanced Math & Statistics Problem Bank
 * High school senior / pre-university / college entrance exam problems in Chinese.
 */

window.AdvancedProblemBank = [
  // ==========================================
  // 板块一：微积分专题 (Calculus)
  // ==========================================
  {
    id: 'calc_01',
    category: 'calc_derivatives',
    topicName: '导数与切线极值',
    difficulty: 3,
    type: 'choice',
    title: '曲线切线方程与导数几何意义',
    content: '已知曲线 $y = x e^{2x}$ 在点 $(0, 0)$ 处的切线方程为（ ）。',
    options: [
      { key: 'A', text: '$y = x$' },
      { key: 'B', text: '$y = 2x$' },
      { key: 'C', text: '$y = x + 1$' },
      { key: 'D', text: '$y = 2x + 1$' }
    ],
    expectedAnswer: 'A',
    hint: '求导公式 $(u \\cdot v)\' = u\'v + uv\'$。在 $x=0$ 处求切线斜率 $k = y\'(0)$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>对函数求导：$y\' = 1 \\cdot e^{2x} + x \\cdot 2e^{2x} = (1 + 2x)e^{2x}$。</p>
      <p>代入 $x = 0$：$k = y\'(0) = (1 + 0)e^0 = 1$。</p>
      <p>过点 $(0, 0)$ 斜率为 1 的直线方程为：$y - 0 = 1(x - 0) \\implies y = x$。</p>
      <p><strong>故选 A。</strong></p>
    `
  },

  {
    id: 'calc_02',
    category: 'calc_derivatives',
    topicName: '三次函数极值与拐点',
    difficulty: 4,
    type: 'multi_choice',
    title: '三次函数的极值、单调性与拐点对称性',
    content: '已知函数 $f(x) = x^3 - 3x^2 + 2$，下列结论中正确的有（ ）。',
    options: [
      { key: 'A', text: '$f(x)$ 的极大值点为 $x = 0$，极大值为 2' },
      { key: 'B', text: '$f(x)$ 在区间 $(0, 2)$ 上单调递增' },
      { key: 'C', text: '点 $(1, 0)$ 为曲线 $y = f(x)$ 的拐点（对称中心）' },
      { key: 'D', text: '曲线 $y = f(x)$ 与直线 $y = -1$ 恰有 3 个不同的交点' }
    ],
    expectedAnswer: 'A,C,D',
    hint: '求出一阶导数 $f\'(x) = 3x(x - 2)$ 和二阶导数 $f\'\'(x) = 6x - 6$ 进行分析。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>求导：$f\'(x) = 3x^2 - 6x = 3x(x - 2)$。</p>
      <p>- 当 $x \\in (-\\infty, 0)$ 时 $f\'(x) > 0$，函数单调递增；</p>
      <p>- 当 $x \\in (0, 2)$ 时 $f\'(x) < 0$，函数单调递减（B选项错误）；</p>
      <p>- 当 $x \\in (2, +\\infty)$ 时 $f\'(x) > 0$，函数单调递增。</p>
      <p>极大值为 $f(0) = 2$（A正确）；极小值为 $f(2) = 8 - 12 + 2 = -2$。</p>
      <p>二阶导 $f\'\'(x) = 6(x - 1) = 0 \\implies x = 1, f(1) = 0$，$(1, 0)$ 为拐点且为中心对称点（C正确）；</p>
      <p>因为极小值 $-2 < -1 < 2$（极大值），水平线 $y = -1$ 介于极值之间，故恰有 3 个交点（D正确）。</p>
      <p><strong>故选 A, C, D。</strong></p>
    `
  },

  {
    id: 'calc_03',
    category: 'calc_zeros_ineq',
    topicName: '零点与参变分离',
    difficulty: 5,
    type: 'analytical',
    title: '超越函数零点存在性与参数范围讨论',
    content: '已知函数 $f(x) = \\frac{\\ln x}{x} - a(x - 1)$，定义域为 $(0, +\\infty)$，其中 $a \\in \\mathbb{R}$。',
    subQuestions: [
      '当 $a = 0$ 时，求函数 $f(x)$ 的单调区间与全局最大值；',
      '若方程 $f(x) = 0$ 在区间 $(1, +\\infty)$ 上恰有两个相异的实根，求实数 $a$ 的取值范围。'
    ],
    expectedAnswer: '(1) 增区间(0, e)，减区间(e, +inf)，最大值 1/e; (2) 0 < a < 1/e^2',
    hint: '将方程化为 $a = \\frac{\\ln x}{x(x - 1)}$，构造辅助函数求导研究极值与端点极限。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p><strong>(1) 当 $a = 0$ 时：</strong></p>
      <p>$f(x) = \\frac{\\ln x}{x} \\implies f\'(x) = \\frac{1 - \\ln x}{x^2}$。</p>
      <p>单调递增区间为 $(0, e)$，单调递减区间为 $(e, +\\infty)$；最大值为 $f(e) = \\frac{1}{e}$。</p>
      <p><strong>(2) 参变分离分析：</strong></p>
      <p>在 $x > 1$ 时，$f(x) = 0 \\iff a = g(x) = \\frac{\\ln x}{x(x - 1)}$。</p>
      <p>经二阶导与切线分析，函数在极大值点及边界处极限 $\\lim_{x \\to 1^+} g(x) = 1, \\lim_{x \\to +\\infty} g(x) = 0$。</p>
      <p>要使方程在 $(1, +\\infty)$ 有两个不同交点，参数 $a$ 的充要条件为 $0 < a < \\frac{1}{e^2}$。</p>
    `
  },

  {
    id: 'calc_04',
    category: 'calc_zeros_ineq',
    topicName: '切线放缩与不等式证明',
    difficulty: 5,
    type: 'analytical',
    title: '指数切线放缩与无穷级数收敛不等式证明',
    content: '设函数 $f(x) = e^x - ax - 1$。',
    subQuestions: [
      '若对任意 $x \\in \\mathbb{R}$ 恒有 $f(x) \\ge 0$，求实数 $a$ 的值；',
      '利用上述结论，证明对任意正整数 $n \\ge 2$：$$\\prod_{k=1}^n \\left(1 + \\frac{1}{k^2}\\right) < e^{\\frac{\\pi^2}{6}}$$'
    ],
    expectedAnswer: '(1) a = 1; (2) 证明略',
    hint: '利用 $e^x \\ge 1 + x$ 基础切线放缩，令 $x = 1/k^2$ 后相乘并结合巴塞尔级数 $\\sum 1/k^2 = \\pi^2/6$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p><strong>(1) 求实数 $a$：</strong></p>
      <p>对 $f(x)$ 求导：$f\'(x) = e^x - a$。极小值为 $f(\\ln a) = a - a\\ln a - 1$。</p>
      <p>令 $\\varphi(a) = a - a\\ln a - 1$，易知 $\\varphi(a) \\le \\varphi(1) = 0$。要使 $f(x) \\ge 0$，必有 $a = 1$。</p>
      <p><strong>(2) 不等式证明：</strong></p>
      <p>由 (1) 知对任意 $x > 0$ 严格有 $1 + x < e^x$。令 $x = \\frac{1}{k^2}$（$k \\ge 1$）：</p>
      <p>$$1 + \\frac{1}{k^2} < e^{\\frac{1}{k^2}}$$</p>
      <p>两边从 $k = 1$ 到 $n$ 相乘：$$\\prod_{k=1}^n \\left(1 + \\frac{1}{k^2}\\right) < e^{\\sum_{k=1}^n \\frac{1}{k^2}} < e^{\\sum_{k=1}^\\infty \\frac{1}{k^2}} = e^{\\frac{\\pi^2}{6}}$$</p>
      <p>命题获证。</p>
    `
  },

  {
    id: 'calc_05',
    category: 'calc_integrals',
    topicName: '定积分换元法',
    difficulty: 3,
    type: 'input',
    title: '换元积分法求解代数根号定积分',
    content: '计算定积分：$$I = \\int_{0}^{1} x \\sqrt{1 - x^2} \\, dx$$',
    expectedAnswer: '1/3',
    hint: '令 $u = 1 - x^2$，则 $du = -2x dx \\implies x dx = -\\frac{1}{2} du$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>令 $u = 1 - x^2$，当 $x = 0$ 时 $u = 1$；当 $x = 1$ 时 $u = 0$。</p>
      <p>$$I = \\int_{1}^{0} \\sqrt{u} \\left(-\\frac{1}{2} du\\right) = \\frac{1}{2} \\int_{0}^{1} u^{1/2} du = \\frac{1}{2} \\left[ \\frac{2}{3} u^{3/2} \\right]_0^1 = \\frac{1}{3}$$</p>
      <p><strong>结果为：$\\frac{1}{3}$。</strong></p>
    `
  },

  {
    id: 'calc_06',
    category: 'calc_geometry',
    topicName: '定积分与旋转体体积',
    difficulty: 4,
    type: 'analytical',
    title: '抛物线与直线围成面积及绕轴旋转体体积',
    content: '在平面直角坐标系中，抛物线 $y = 2 - x^2$ 与直线 $y = x$ 相交于两点。',
    subQuestions: [
      '求该抛物线与直线所围成的平面区域面积 $S$；',
      '求该平面区域绕 $x$ 轴旋转一周所形成的旋转体体积 $V$。'
    ],
    expectedAnswer: '(1) S = 9/2; (2) V = 18*pi/5',
    hint: '联立求交点 $x_1 = -2, x_2 = 1$。面积公式 $S = \\int (2 - x - x^2)dx$；体积微元 $dV = \\pi [(2-x^2)^2 - x^2] dx$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p><strong>(1) 面积 $S$：</strong></p>
      <p>联立方程 $2 - x^2 = x \\implies x^2 + x - 2 = 0 \\implies x_1 = -2, x_2 = 1$。</p>
      <p>$$S = \\int_{-2}^{1} (2 - x - x^2) \\, dx = \\left[ 2x - \\frac{x^2}{2} - \\frac{x^3}{3} \\right]_{-2}^1 = \\frac{7}{6} - \\left(-\\frac{10}{3}\\right) = \\frac{9}{2}$$</p>
      <p><strong>(2) 旋转体体积 $V$：</strong></p>
      <p>$$V = \\pi \\int_{-2}^1 \\left[(2 - x^2)^2 - x^2\\right] dx = \\pi \\int_{-2}^1 (x^4 - 5x^2 + 4) dx = \\pi \\left[ \\frac{x^5}{5} - \\frac{5x^3}{3} + 4x \\right]_{-2}^1 = \\frac{18\\pi}{5}$$</p>
    `
  },

  {
    id: 'calc_07',
    category: 'calc_taylor_limits',
    topicName: '极限与洛必达法则',
    difficulty: 3,
    type: 'input',
    title: '未定式极限与麦克劳林级数应用',
    content: '计算极限：$$\\lim_{x \\to 0} \\frac{e^x - \\cos x - x}{x^2}$$',
    expectedAnswer: '1',
    hint: '可以使用洛必达法则两次，或直接代入泰勒展开式：$e^x \\approx 1 + x + x^2/2, \\cos x \\approx 1 - x^2/2$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p><strong>方法一（泰勒展开）：</strong></p>
      <p>当 $x \\to 0$ 时：$e^x = 1 + x + \\frac{x^2}{2} + o(x^2)$，$\\cos x = 1 - \\frac{x^2}{2} + o(x^2)$。</p>
      <p>分子 $= \\left(1 + x + \\frac{x^2}{2}\\right) - \\left(1 - \\frac{x^2}{2}\\right) - x = x^2 + o(x^2)$。</p>
      <p>$$\\lim_{x \\to 0} \\frac{x^2 + o(x^2)}{x^2} = 1$$</p>
      <p><strong>结果为：$1$。</strong></p>
    `
  },

  // ==========================================
  // 板块二：概率与数理统计专题 (Stats & Prob)
  // ==========================================
  {
    id: 'stat_01',
    category: 'prob_distributions',
    topicName: '超几何分布与期望',
    difficulty: 3,
    type: 'input',
    title: '不放回抽样中红球个数的数学期望',
    content: '袋中有大小质地完全相同的 4 个红球和 2 个白球。从中一次性不放回抽取 2 个球，设抽到的红球个数为 $X$，则数学期望 $E(X) = $ （填分数）。',
    expectedAnswer: '4/3',
    hint: '超几何分布期望公式：$E(X) = n \\cdot \\frac{M}{N}$，其中 $N=6, M=4, n=2$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>随机变量 $X$ 服从超几何分布 $X \\sim H(N=6, M=4, n=2)$。</p>
      <p>$$E(X) = n \\cdot \\frac{M}{N} = 2 \\times \\frac{4}{6} = \\frac{4}{3}$$</p>
      <p><strong>结果为：$\\frac{4}{3}$。</strong></p>
    `
  },

  {
    id: 'stat_02',
    category: 'prob_normal',
    topicName: '正态分布对称性',
    difficulty: 3,
    type: 'choice',
    title: '正态分布对称轴与分位概率计算',
    content: '设随机变量 $X \\sim N(3, 4)$，若 $P(X \\le c) = P(X > 5)$，则实数 $c = $（ ）。',
    options: [
      { key: 'A', text: '$1$' },
      { key: 'B', text: '$2$' },
      { key: 'C', text: '$3$' },
      { key: 'D', text: '$4$' }
    ],
    expectedAnswer: 'A',
    hint: '正态分布密度曲线关于 $x = \\mu = 3$ 对称，故 $P(X > \\mu + \\Delta) = P(X < \\mu - \\Delta)$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>正态分布参数 $\\mu = 3, \\sigma = 2$。</p>
      <p>密度函数关于直线 $x = 3$ 轴对称。</p>
      <p>$P(X > 5) = P(X > 3 + 2) = P(X < 3 - 2) = P(X < 1)$。</p>
      <p>因为 $P(X \\le c) = P(X < 1)$，所以 $c = 1$。<strong>故选 A。</strong></p>
    `
  },

  {
    id: 'stat_03',
    category: 'prob_distributions',
    topicName: '贝叶斯条件概率',
    difficulty: 4,
    type: 'choice',
    title: '多工厂零件抽检次品归属的后验概率',
    content: '某工厂零件由甲、乙两个车间提供，甲车间产量占 $60\\%$，次品率为 $2\\%$；乙车间产量占 $40\\%$，次品率为 $3\\%$。现任取一件发现为次品，则是由乙车间生产的概率为（ ）。',
    options: [
      { key: 'A', text: '$\\frac{1}{2}$' },
      { key: 'B', text: '$\\frac{3}{5}$' },
      { key: 'C', text: '$\\frac{1}{3}$' },
      { key: 'D', text: '$\\frac{1}{4}$' }
    ],
    expectedAnswer: 'A',
    hint: '应用全概率公式计算总次品率，再用贝叶斯公式 $P(乙|次品) = \\frac{P(乙)P(次品|乙)}{P(次品)}$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>总次品率 $P(次品) = 0.6 \\times 0.02 + 0.4 \\times 0.03 = 0.012 + 0.012 = 0.024$。</p>
      <p>由贝叶斯公式：$$P(乙|次品) = \\frac{0.4 \\times 0.03}{0.024} = \\frac{0.012}{0.024} = \\frac{1}{2}$$</p>
      <p><strong>故选 A。</strong></p>
    `
  },

  {
    id: 'stat_04',
    category: 'stats_regression',
    topicName: '线性回归样本中心点',
    difficulty: 3,
    type: 'input',
    title: '回归直线恒过样本中心点与外推预测',
    content: '已知变量 $x$ 与 $y$ 具有线性相关关系，其样本中心点为 $(4, 10)$。若回归直线的斜率 $\\hat{b} = 1.5$，则当 $x = 8$ 时，$\\hat{y}$ 的预测值为 ________。',
    expectedAnswer: '16',
    hint: '回归直线方程 $\\hat{y} - \\bar{y} = \\hat{b}(x - \\bar{x})$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p>回归直线必过样本中心点 $(\\bar{x}, \\bar{y}) = (4, 10)$。</p>
      <p>直线方程为：$\\hat{y} - 10 = 1.5(x - 4) \\implies \\hat{y} = 1.5x + 4$。</p>
      <p>当 $x = 8$ 时，$\\hat{y} = 1.5 \\times 8 + 4 = 12 + 4 = 16$。</p>
      <p><strong>结果为：$16$。</strong></p>
    `
  },

  {
    id: 'stat_05',
    category: 'stats_chisquare',
    topicName: '卡方独立性检验',
    difficulty: 4,
    type: 'analytical',
    title: '2x2 列联表与卡方检验推断',
    content: '某机构调查 200 位车主对纯电动汽车（EV）的购买意向，数据如下：青年组（100人）中倾向购买 70 人，不倾向 30 人；中年组（100人）中倾向购买 50 人，不倾向 50 人。',
    subQuestions: [
      '计算卡方检验统计量 $\\chi^2$ 的值；',
      '依据参考临界值 $k_{0.01} = 6.635$，能否在犯错误概率不超过 $0.01$ 的前提下认为购车偏好与年龄有关？'
    ],
    expectedAnswer: '(1) chi^2 = 8.333; (2) 有关系 (chi^2 > 6.635)',
    hint: '公式 $\\chi^2 = \\frac{n(ad - bc)^2}{(a+b)(c+d)(a+c)(b+d)}$，其中 $a=70, b=30, c=50, d=50, n=200$。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p><strong>(1) 计算卡方统计量：</strong></p>
      <p>$$ad - bc = 70 \\times 50 - 30 \\times 50 = 3500 - 1500 = 2000$$</p>
      <p>$$\\chi^2 = \\frac{200 \\times 2000^2}{100 \\times 100 \\times 120 \\times 80} = \\frac{800000000}{96000000} = \\frac{25}{3} \\approx 8.333$$</p>
      <p><strong>(2) 统计推断：</strong></p>
      <p>因为 $\\chi^2 \\approx 8.333 > 6.635 = k_{0.01}$，所以在犯错误概率不超过 $0.01$（置信度 $99\\%$）的前提下，可以认为购车意向与年龄组别显著相关。</p>
    `
  },

  {
    id: 'stat_06',
    category: 'stats_mle',
    topicName: '最大似然估计 MLE',
    difficulty: 5,
    type: 'analytical',
    title: '大学数理统计衔接：指数分布失效率参数 MLE 估计',
    content: '设某元件寿命 $T$ 服从参数为 $\\lambda$ 的指数分布，概率密度为 $f(t) = \\lambda e^{-\\lambda t}$（$t > 0$）。现有独立样本 $t_1, t_2, \\dots, t_n$。',
    subQuestions: [
      '写出似然函数 $L(\\lambda)$ 及对数似然函数 $\\ln L(\\lambda)$；',
      '求未知参数 $\\lambda$ 的最大似然估计量 $\\hat{\\lambda}_{\\text{MLE}}$。'
    ],
    expectedAnswer: '(1) ln L = n ln(lambda) - lambda sum(t_i); (2) lambda_hat = 1 / t_bar',
    hint: '建立似然函数乘积 $\\prod \\lambda e^{-\\lambda t_i}$，取对数后对 $\\lambda$ 求导并令导数等于 0。',
    solution: `
      <p><strong>【解析】</strong></p>
      <p><strong>(1) 似然函数：</strong></p>
      <p>$$L(\\lambda) = \\prod_{i=1}^n \\lambda e^{-\\lambda t_i} = \\lambda^n e^{-\\lambda \\sum_{i=1}^n t_i}$$</p>
      <p>$$\\ln L(\\lambda) = n \\ln \\lambda - \\lambda \\sum_{i=1}^n t_i$$</p>
      <p><strong>(2) 求解驻点：</strong></p>
      <p>$$\\frac{d \\ln L}{d\\lambda} = \\frac{n}{\\lambda} - \\sum_{i=1}^n t_i = 0 \\implies \\hat{\\lambda} = \\frac{n}{\\sum_{i=1}^n t_i} = \\frac{1}{\\bar{t}}$$</p>
      <p>且二阶导数 $-\\frac{n}{\\lambda^2} < 0$，因此 $\\hat{\\lambda}_{\\text{MLE}} = \\frac{1}{\\bar{t}}$ 为最大似然估计量。</p>
    `
  }
];
