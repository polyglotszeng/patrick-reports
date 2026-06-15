import { QuarterlyCompare } from '@/components/QuarterlyCompare';
import { getAllLabs } from '@/lib/data-server';

export const metadata = { title: '季度对比 - Neo Labs Tracker' };

export default async function QuarterlyComparePage() {
  const labs = await getAllLabs();
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>📅 季度对比</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>Q4 2025 → Q1 2026 → Q2 2026 三个季度估值变化对比</p>
      <QuarterlyCompare labs={labs} />
    </div>
  );
}
