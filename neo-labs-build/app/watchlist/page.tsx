import { WatchlistClient } from '@/components/WatchlistClient';
import { getAllLabs } from '@/lib/data-server';

export const metadata = { title: 'Watchlist - Neo Labs Tracker' };

export default async function WatchlistPage() {
  const labs = await getAllLabs();
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>📌 Watchlist</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>私募持续跟踪池 · 自动生成风险提示 · 下一轮预期提醒</p>
      <WatchlistClient labs={labs} />
    </div>
  );
}
