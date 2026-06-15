import { PortfolioHeatmap } from '@/components/PortfolioHeatmap';
import { getAllLabs } from '@/lib/data-server';

export const metadata = { title: 'Portfolio Heatmap - Neo Labs Tracker' };

export default async function PortfolioHeatmapPage() {
  const labs = await getAllLabs();
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>🔥 投资组合 Heatmap</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>7 维风险可视化 · 行业分布 Doughnut · 实时 MOIC/IRR 监控</p>
      <PortfolioHeatmap labs={labs} />
    </div>
  );
}
