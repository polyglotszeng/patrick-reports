import { fmtUsd, fmtPct } from '../format';

describe('format utilities', () => {
  test('fmtUsd 应正确格式化数字', () => {
    expect(fmtUsd(50)).toBe('$50.0亿');
    expect(fmtUsd(0.5)).toBe('$0.5亿');
    expect(fmtUsd(100)).toBe('$100.0亿');
  });

  test('fmtUsd null/undefined 应返回 —', () => {
    expect(fmtUsd(null)).toBe('—');
    expect(fmtUsd(undefined)).toBe('—');
  });

  test('fmtPct 应正确格式化百分比', () => {
    expect(fmtPct(50.7)).toBe('51%');
    expect(fmtPct(0)).toBe('0%');
    expect(fmtPct(100)).toBe('100%');
  });

  test('fmtPct null 应返回 —', () => {
    expect(fmtPct(null)).toBe('—');
  });
});
