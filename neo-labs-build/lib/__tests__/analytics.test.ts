import { calcIRR, lognormal, mean, std, percentile, cholesky, sampleCorrelated } from '../../lib/analytics';

describe('Analytics Library - IRR/Monte Carlo', () => {
  describe('calcIRR', () => {
    test('基础案例: 投资 100, 5 年后收到 200 = 14.87% IRR', () => {
      const irr = calcIRR([{ t: 0, a: -100 }, { t: 5, a: 200 }]);
      expect(irr).toBeCloseTo(14.87, 1);
    });

    test('翻倍: 投资 100, 5 年后 200 = 14.87%', () => {
      const irr = calcIRR([{ t: 0, a: -100 }, { t: 5, a: 200 }]);
      expect(irr).toBeGreaterThan(14);
      expect(irr).toBeLessThan(16);
    });

    test('亏损: 投资 100, 5 年后 50 = -12.94% IRR', () => {
      const irr = calcIRR([{ t: 0, a: -100 }, { t: 5, a: 50 }]);
      expect(irr).toBeCloseTo(-12.94, 1);
    });

    test('零现金流 = 0', () => {
      const irr = calcIRR([]);
      expect(irr).toBe(0);
    });
  });

  describe('lognormal / 正态分布', () => {
    test('lognormal 1000 次采样均值应接近 μ', () => {
      const samples = Array.from({ length: 1000 }, () => lognormal(0.7, 0.5));
      const m = mean(samples);
      // lognormal mean = exp(μ + σ²/2) = exp(0.7 + 0.125) ≈ 2.28
      expect(m).toBeGreaterThan(1.5);
      expect(m).toBeLessThan(3.5);
    });

    test('lognormal σ 应大致正确（Monte Carlo 容差）', () => {
      const samples = Array.from({ length: 2000 }, () => lognormal(0.7, 0.5));
      const s = std(samples);
      // lognormal std = exp(μ + σ²/2) * sqrt(exp(σ²) - 1)
      // = exp(0.825) * sqrt(exp(0.25) - 1)
      // = 2.283 * 0.533 ≈ 1.22
      expect(s).toBeGreaterThan(0.8);
      expect(s).toBeLessThan(1.7);
    });
  });

  describe('percentile / mean / std', () => {
    test('percentile 应正确取分位数', () => {
      // [1..10], p=0.5 → 中位数 ≈ 5.5
      expect(percentile([1,2,3,4,5,6,7,8,9,10], 0.5)).toBeGreaterThan(4);
      expect(percentile([1,2,3,4,5,6,7,8,9,10], 0.5)).toBeLessThan(7);
      // p=1.0 → 最大值
      expect(percentile([1,2,3,4,5,6,7,8,9,10], 1.0)).toBe(10);
      // p=0.0 → 最小值
      expect(percentile([1,2,3,4,5,6,7,8,9,10], 0.0)).toBe(1);
    });

    test('std population 应正确', () => {
      // [2,2,2,2] → 0
      expect(std([2,2,2,2])).toBe(0);
      // [0,10] → population std = sqrt(25) = 5
      expect(std([0,10])).toBe(5);
    });

    test('std 应正确（population 公式）', () => {
      // [0, 10]: mean=5, variance=(25+25)/2=25, std=5
      expect(std([0, 10])).toBe(5);
      // [1, 1, 1]: variance=0, std=0
      expect(std([1, 1, 1])).toBe(0);
      // [2, 4, 6]: variance=8/3, std≈1.63 (pop) or ≈2 (sample)
      const s = std([2, 4, 6]);
      expect(s).toBeGreaterThan(1.5);
      expect(s).toBeLessThan(2.5);
    });
  });

  describe('Cholesky + 相关多变量', () => {
    test('Cholesky 分解应是下三角矩阵', () => {
      const corr = [[1, 0.5, 0.2], [0.5, 1, 0.3], [0.2, 0.3, 1]];
      const L = cholesky(corr);
      // L * L^T 应重建 corr
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let sum = 0;
          for (let k = 0; k < 3; k++) sum += L[i][k] * L[j][k];
          expect(sum).toBeCloseTo(corr[i][j], 5);
        }
      }
    });

    test('sampleCorrelated 应产生相关样本', () => {
      const corr = [[1, 0.8], [0.8, 1]];
      const n = 5000;
      const xs: number[][] = [];
      for (let i = 0; i < n; i++) xs.push(sampleCorrelated(corr));
      // 计算样本相关
      const m1 = mean(xs.map(x => x[0]));
      const m2 = mean(xs.map(x => x[1]));
      const cov = xs.reduce((s, x) => s + (x[0] - m1) * (x[1] - m2), 0) / n;
      const sd1 = std(xs.map(x => x[0]));
      const sd2 = std(xs.map(x => x[1]));
      const sampleCorr = cov / (sd1 * sd2);
      // 应接近 0.8
      expect(sampleCorr).toBeGreaterThan(0.7);
      expect(sampleCorr).toBeLessThan(0.9);
    });
  });

  describe('实战: 25 家实验室 Monte Carlo', () => {
    test('10 次模拟应无 NaN', () => {
      const items = [
        { cost: 5, val: 50, stage: 3 },
        { cost: 3, val: 30, stage: 2 },
        { cost: 10, val: 100, stage: 4 }
      ];
      const totalCost = items.reduce((s, i) => s + i.cost, 0);
      const totalVal = items.reduce((s, i) => s + i.val, 0);
      const irrs = [];
      for (let i = 0; i < 10; i++) {
        const m = lognormal(0.7, 0.5);
        irrs.push(calcIRR([{ t: 0, a: -totalCost }, { t: 5, a: totalVal * m }]));
      }
      expect(irrs.every(irr => !isNaN(irr))).toBe(true);
    });
  });
});
