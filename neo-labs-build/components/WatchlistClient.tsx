'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lab } from '@/lib/types';
import { fmtUsd } from '@/lib/format';

export function WatchlistClient({ labs }: { labs: Lab[] }) {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<{[slug: string]: { type: string; msg: string; date: string }}>({});
  
  useEffect(() => {
    const saved = localStorage.getItem('neo-labs-watchlist-v2');
    if (saved) try { setWatchlist(new Set(JSON.parse(saved))); } catch(e) {}
  }, []);
  
  useEffect(() => {
    localStorage.setItem('neo-labs-watchlist-v2', JSON.stringify([...watchlist]));
  }, [watchlist]);
  
  function toggle(slug: string) {
    const newSet = new Set(watchlist);
    if (newSet.has(slug)) newSet.delete(slug);
    else {
      newSet.add(slug);
      // 自动生成 alert
      const lab = labs.find(l => l.slug === slug);
      if (lab) {
        let alertType = '正常跟踪';
        let alertMsg = '持续监控关键融资 + 战略动作';
        if ((lab.valuation_to_funding_leverage || 0) > 8) { alertType = '⚠️ 估值杠杆极高'; alertMsg = '8x+ 杠杆 = IP 对赌，警惕下行'; }
        else if ((lab.data_freshness_days || 0) > 365) { alertType = '⚠️ 数据黑箱'; alertMsg = '365+ 天未更新，建议直接访谈'; }
        else if (lab.next_expected_round?.expected_window) { alertType = '⏰ 下一轮预期'; alertMsg = `${lab.next_expected_round.type} 在 ${lab.next_expected_round.expected_window}`; }
        setAlerts({ ...alerts, [slug]: { type: alertType, msg: alertMsg, date: new Date().toISOString().slice(0, 10) } });
      }
    }
    setWatchlist(newSet);
  }
  
  const watchLabs = labs.filter(l => watchlist.has(l.slug));
  const main = labs.filter(l => l.list_section === 'main' && !watchlist.has(l.slug));
  
  return (
    <div>
      {/* 候选池 */}
      <div className="section">
        <h2>🎯 候选池 (25 家，点击 toggle 加入 Watchlist)</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, maxHeight: 500, overflowY: 'auto'}}>
          {main.map(l => (
            <button key={l.slug} onClick={() => toggle(l.slug)} style={{
              padding: 8, fontSize: 11, border: '1px solid #e0e0e0', background: '#fff',
              borderRadius: 4, cursor: 'pointer', textAlign: 'left'
            }}>
              <strong>{l.name}</strong>
              <div style={{color: '#6e6e73', fontSize: 10, marginTop: 2}}>{l.category}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Watchlist */}
      {watchLabs.length > 0 && (
        <div className="section">
          <h2>📌 我的 Watchlist ({watchLabs.length} 家)</h2>
          {watchLabs.map(l => {
            const alert = alerts[l.slug];
            return (
              <div key={l.slug} style={{padding: 16, background: '#fff7e0', borderRadius: 10, border: '1px solid #b06000', marginBottom: 8}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                  <div>
                    <Link href={`/labs/${l.slug}`} style={{fontWeight: 700, fontSize: 16}}>{l.name}</Link>
                    <span className="pill" style={{marginLeft: 8}}>{l.category}</span>
                    {l.open_source && <span className="pill good">开源</span>}
                  </div>
                  <button onClick={() => toggle(l.slug)} style={{padding: '4px 10px', background: '#fce8e6', color: '#c5221f', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11}}>移除</button>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 12, marginBottom: 8}}>
                  <div><strong>估值:</strong> {fmtUsd(l.valuation_billion_usd)}</div>
                  <div><strong>融资:</strong> {fmtUsd(l.total_funding_billion_usd)}</div>
                  <div><strong>阶段:</strong> S{l.commercialization_stage_score}</div>
                  <div><strong>时效:</strong> {l.data_freshness_days}天</div>
                </div>
                {alert && (
                  <div style={{padding: 10, background: alert.type.includes('⚠️') ? '#fef7f0' : '#f0f4ff', borderRadius: 6, fontSize: 12}}>
                    <strong>{alert.type}</strong> · {alert.msg} · 加入 {alert.date}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {watchLabs.length === 0 && (
        <div className="section" style={{textAlign: 'center', padding: 40, color: '#6e6e73'}}>
          候选池里点击任意实验室加入 Watchlist
        </div>
      )}
    </div>
  );
}
