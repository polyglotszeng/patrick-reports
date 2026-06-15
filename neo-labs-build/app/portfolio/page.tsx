import { PortfolioClient } from '@/components/PortfolioClient';
import { getAllLabs } from '@/lib/data-server';

export const metadata = { title: '投资组合 - Neo Labs Tracker' };

export default async function PortfolioPage() {
  const labs = await getAllLabs();
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>💼 投资组合</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>私募视角组合管理 · MOIC/IRR/退出情景 · localStorage 持久化</p>
      <PortfolioClient labs={labs} />
    </div>
  );
}
