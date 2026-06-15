'use client';

import { useState, useEffect } from 'react';
import { Lab } from '@/lib/types';
import { fmtUsd } from '@/lib/format';

export default function ComparePage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  
  // 客户端加载数据 + URL 参数
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get('ids')?.split(',') || [];
    setSelected(ids);
    
    fetch(window.location.pathname.replace(/\/compare\/?$/, '/neo-labs/labs.json').replace(/^.*?\/neo-labs/, '/neo-labs'))
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setLabs(data.labs); setLoaded(true); }
      })
      .catch(() => {
        // 备用：硬编码基础 URL
        fetch('/neo-labs/labs.json').then(r => r.json()).then(data => {
          setLabs(data.labs); setLoaded(true);
        });
      });
  }, []);
  
  function toggle(slug: string) {
    if (selected.includes(slug)) setSelected(selected.filter(s => s !== slug));
    else {
      if (selected.length >= 3) { alert('最多 3 家'); return; }
      setSelected([...selected, slug]);
    }
    // 更新 URL
    const url = new URL(window.location.href);
    url.searchParams.set('ids', [...selected, slug].slice(0, 3).join(','));
    window.history.replaceState({}, '', url.toString());
  }
  
  const compareLabs = labs.filter(l => selected.includes(l.slug));
  
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>⚖️ 对比视图</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>最多选择 3 家实验室并排对比 16 项关键指标</p>
      
      {!loaded && <div className="section" style={{textAlign: 'center', padding: 40}}>加载中...</div>}
      
      {loaded && (
        <>
          <div className="section">
            <h2>选择 2-3 家（点击 toggle）</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxHeight: 400, overflowY: 'auto'}}>
              {labs.map(l => (
                <button
                  key={l.slug}
                  onClick={() => toggle(l.slug)}
                  style={{
                    padding: 10, border: '1px solid ' + (selected.includes(l.slug) ? '#0071e3' : '#e0e0e0'),
                    background: selected.includes(l.slug) ? '#e8f0fe' : '#fff',
                    borderRadius: 6, cursor: 'pointer', textAlign: 'left', fontSize: 12
                  }}
                >
                  <strong>{selected.includes(l.slug) ? '✓ ' : ''}{l.name}</strong>
                  <div style={{color: '#6e6e73', fontSize: 10, marginTop: 2}}>{l.category}</div>
                </button>
              ))}
            </div>
          </div>
          
          {compareLabs.length >= 2 && (
            <div className="section">
              <h2>并排对比（{compareLabs.length} 家）</h2>
              <div style={{overflowX: 'auto'}}>
                <table>
                  <thead>
                    <tr>
                      <th>字段</th>
                      {compareLabs.map(l => <th key={l.slug}>{l.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>估值</strong></td>{compareLabs.map(l => <td key={l.slug}><strong>{fmtUsd(l.valuation_billion_usd)}</strong></td>)}</tr>
                    <tr><td><strong>累计融资</strong></td>{compareLabs.map(l => <td key={l.slug}>{fmtUsd(l.total_funding_billion_usd)}</td>)}</tr>
                    <tr><td><strong>估值杠杆</strong></td>{compareLabs.map(l => <td key={l.slug}>{(l.valuation_to_funding_leverage || 0).toFixed(2)}x</td>)}</tr>
                    <tr><td><strong>成立年</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.founded_year}</td>)}</tr>
                    <tr><td><strong>赛道</strong></td>{compareLabs.map(l => <td key={l.slug}><span className="pill">{l.category}</span></td>)}</tr>
                    <tr><td><strong>HQ</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.hq}</td>)}</tr>
                    <tr><td><strong>创始人</strong></td>{compareLabs.map(l => <td key={l.slug} style={{fontSize: 11}}>{(l.founders || '').slice(0, 100)}...</td>)}</tr>
                    <tr><td><strong>阶段</strong></td>{compareLabs.map(l => <td key={l.slug}>S{l.commercialization_stage_score}</td>)}</tr>
                    <tr><td><strong>团队</strong></td>{compareLabs.map(l => <td key={l.slug}>S{l.team_stability_score}</td>)}</tr>
                    <tr><td><strong>OD 校友</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.founder_openai_deepmind_alumni_count}</td>)}</tr>
                    <tr><td><strong>时效</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.data_freshness_days}天</td>)}</tr>
                    <tr><td><strong>末轮</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.last_round?.type || 'N/A'} {l.last_round?.date || ''}</td>)}</tr>
                    <tr><td><strong>下一轮</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.next_expected_round?.type} ({l.next_expected_round?.expected_window})</td>)}</tr>
                    <tr><td><strong>风险数</strong></td>{compareLabs.map(l => <td key={l.slug}>{(l.risk_signals || []).length}</td>)}</tr>
                    <tr><td><strong>状态</strong></td>{compareLabs.map(l => <td key={l.slug} style={{fontSize: 18}}>{l.status_emoji}</td>)}</tr>
                    <tr><td><strong>开源</strong></td>{compareLabs.map(l => <td key={l.slug}>{l.open_source ? '✅' : '❌'}</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {compareLabs.length < 2 && loaded && (
            <div className="section" style={{textAlign: 'center', padding: 40, color: '#6e6e73'}}>
              请选择至少 2 家实验室开始对比
            </div>
          )}
        </>
      )}
    </div>
  );
}
