// Monte Carlo / IRR 计算工具

// Newton-Raphson IRR 求解
export function calcIRR(cashFlows: { t: number; a: number }[]): number {
  if (cashFlows.length < 2) return 0;
  let rate = 0.2;
  for (let iter = 0; iter < 50; iter++) {
    let npv = 0, dnpv = 0;
    for (const cf of cashFlows) {
      npv += cf.a / Math.pow(1 + rate, cf.t);
      dnpv -= cf.t * cf.a / Math.pow(1 + rate, cf.t + 1);
    }
    if (Math.abs(dnpv) < 1e-9) break;
    const nr = rate - npv / dnpv;
    if (Math.abs(nr - rate) < 1e-6) return nr * 100;
    rate = nr;
  }
  return rate * 100;
}

// Box-Muller 标准正态分布
export function randn(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// 对数正态分布
export function lognormal(mu: number, sigma: number): number {
  return Math.exp(mu + sigma * randn());
}

// Cholesky 分解（用于相关多变量正态采样）
export function cholesky(corr: number[][]): number[][] {
  const n = corr.length;
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      if (i === j) L[i][j] = Math.sqrt(Math.max(0, corr[i][i] - sum));
      else L[i][j] = (corr[i][j] - sum) / (L[j][j] || 1);
    }
  }
  return L;
}

// 多元正态采样
export function sampleCorrelated(corr: number[][]): number[] {
  const n = corr.length;
  const z = Array.from({ length: n }, () => randn());
  const L = cholesky(corr);
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j <= i; j++) s += L[i][j] * z[j];
    result[i] = s;
  }
  return result;
}

// 计算组合 IRR 分布
export function simulatePortfolioIRR(
  portfolio: { cost: number; val: number }[],
  mu: number,
  sigma: number,
  muY: number,
  sigmaY: number,
  trials: number,
  correlationMode: 'independent' | 'category' | 'high' = 'category',
  portfolioCategories: string[] = []
): { irrsInd: number[]; irrsCorr: number[] } {
  if (portfolio.length === 0) return { irrsInd: [], irrsCorr: [] };

  // 相关矩阵
  const corr: number[][] = [];
  for (let i = 0; i < portfolio.length; i++) {
    corr[i] = [];
    for (let j = 0; j < portfolio.length; j++) {
      if (i === j) corr[i][j] = 1;
      else {
        const sameCat = portfolioCategories[i] === portfolioCategories[j];
        if (correlationMode === 'independent') corr[i][j] = 0;
        else if (correlationMode === 'category') corr[i][j] = sameCat ? 0.6 : 0.2;
        else corr[i][j] = 0.8;
      }
    }
  }

  // 独立模拟
  const irrsInd: number[] = [];
  for (let t = 0; t < trials; t++) {
    let totalCost = 0, totalExit = 0;
    for (const item of portfolio) {
      const m = lognormal(mu, sigma);
      totalCost += item.cost;
      totalExit += item.val * m;
    }
    irrsInd.push(calcIRR([{ t: 0, a: -totalCost }, { t: muY, a: totalExit }]));
  }

  // 相关模拟
  const irrsCorr: number[] = [];
  for (let t = 0; t < trials; t++) {
    const z = sampleCorrelated(corr);
    let totalCost = 0, totalExit = 0;
    for (let i = 0; i < portfolio.length; i++) {
      const m = Math.exp(mu + sigma * z[i]);
      totalCost += portfolio[i].cost;
      totalExit += portfolio[i].val * m;
    }
    irrsCorr.push(calcIRR([{ t: 0, a: -totalCost }, { t: muY, a: totalExit }]));
  }

  return { irrsInd: irrsInd.sort((a, b) => a - b), irrsCorr: irrsCorr.sort((a, b) => a - b) };
}

// 计算分位数
export function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  return arr[Math.min(arr.length - 1, Math.floor(arr.length * p))];
}

// 计算均值/标准差
export function mean(arr: number[]): number { return arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0; }
export function std(arr: number[]): number {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
}

// 格式化货币
export function fmtUsd(n: number | null, suffix = '亿'): string {
  if (n === null || n === undefined) return '—';
  return `$${n.toFixed(1)}${suffix}`;
}
