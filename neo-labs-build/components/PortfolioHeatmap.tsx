'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lab } from '@/lib/types';
import { fmtUsd } from '@/lib/format';
import { calcIRR, lognormal } from '@/lib/analytics';
import { Chart } from './Chart';

export function PortfolioHeatmap({ labs }: { labs: Lab[] }) {
  const [portfolio, setPortfolio] = useState<Record<string, { cost: number; ownership: number; date: string }>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem('neo-labs-portfolio-heatmap');
    if (saved) try { setPortfolio(JSON.parse(saved)); } catch(e) {}
  }, []);
  
  useEffect(() => {
    localStorage.setItem('neo-labs-portfolio-heatmap', JSON.stringify(portfolio));
  }, [portfolio]);
  
  const main = labs.filter(l => l.list_section === 'main');
  
  // 7 维风险矩阵
  const dims = [
    { key: 'valuation_to_funding_leverage', label: '估值杠杆', fn: (l: Lab) => l.valuation_to_funding_leverage || 0 },
    { key: 'data_freshness_days', label: '数据陈旧', fn: (l: Lab) => l.data_freshness_days || 0 },
    { key: 'commercialization_stage_score', label: '阶段', fn: (l: Lab) => l.commercialization_stage_score || 0, reverse: true },
    { key: 'team_stability_score', label: '团队', fn: (l: Lab) => l.team_stability_score || 0, reverse: true },
    { key: 'founder_openai_deepmind_alumni_count', label: 'OD 校友', fn: (l: Lab) => l.founder_openai_deepmind_alumni_count || 0, reverse: true },
    { key: 'estimated_runway_months', label: 'Runway', fn: (l: Lab) => l.estimated_runway_months || 0, reverse: true },
    { key: 'open_source', label: '开源', fn: (l: Lab) => l.open_source ? 1 : 0, reverse: true },
  ];
  
  function getRiskColor(value: number, dim: any): string {
    // 归一化到 0-1
    let v = value;
    if (dim.reverse) v = -v; // 反向（越高越好）
    if (v === 0) return '#137333';
    if (v < 2) return '#5ac8fa';
    if (v < 5) return '#ffcc88';
    if (v < 10) return '#b06000';
    return '#c5221f';
  }
  
  function addToPortfolio(slug: string) {
    if (portfolio[slug]) {
      const newP = { ...portfolio };
      delete newP[slug];
      setPortfolio(newP);
    } else {
      setPortfolio({ ...portfolio, [slug]: { cost: 5, ownership: 0.1, date: '2026-01-01' } });
    }
  }
  
  return (
    <div>
      {/* 候选池 */}
      <div className="section">
        <h2>🎯 选择标的（点击 toggle，最多 12 家）</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, maxHeight: 300, overflowY: 'auto'}}>
          {main.map(l => {
            const inP = !!portfolio[l.slug];
            const dim = portfolio[l.slug] ? 1 : 0;
            return (
              <button key={l.slug} onClick={() => addToPortfolio(l.slug)} style={{
                padding: 6, fontSize: 11, border: '1px solid ' + (inP ? '#137333' : '#e0e0e0'),
                background: inP ? '#fff7e0' : '#fff', borderRadius: 4, cursor: 'pointer', textAlign: 'left'
              }}>
                {inP ? '✓ ' : ''}{l.name}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 7 维风险热力图 */}
      {Object.keys(portfolio).length > 0 && (
        <div className="section">
          <h2>🔥 私募 7 维风险热力图 ({Object.keys(portfolio).length} 家持仓)</h2>
          <div style={{overflowX: 'auto'}}>
            <div style={{display: 'grid', gridTemplateColumns: `150px repeat(${dims.length}, 1fr)`, gap: 4, fontSize: 11}}>
              <div style={{fontWeight: 700, padding: 4}}>标的</div>
              {dims.map(d => <div key={d.key} style={{fontWeight: 700, textAlign: 'center', padding: 4, fontSize: 10}}>{d.label}</div>)}
              {Object.keys(portfolio).map(slug => {
                const l = main.find(x => x.slug === slug);
                if (!l) return null;
                return (
                  <>
                    <div key={slug} style={{padding: 4, fontWeight: 600, fontSize: 11}}>{l.name}</div>
                    {dims.map(d => {
                      const val = d.fn(l);
                      return (
                        <div key={`${slug}-${d.key}`} style={{
                          background: getRiskColor(val, d),
                          color: '#fff', padding: 6, textAlign: 'center', fontWeight: 700, borderRadius: 4, fontSize: 11
                        }} title={`${l.name} - ${d.label}: ${typeof val === 'number' ? val.toFixed(2) : val}`}>
                          {typeof val === 'number' ? val.toFixed(1) : val}
                        </div>
                      );
                    })}
                  </>
                );
              })}
            </div>
          </div>
          <div style={{marginTop: 12, display: 'flex', gap: 8, fontSize: 11, alignItems: 'center', flexWrap: 'wrap'}}>
            <span style={{color: '#6e6e73', fontWeight: 600}}>图例:</span>
            {[
              { c: '#137333', l: '优' },
              { c: '#5ac8fa', l: '良' },
              { c: '#ffcc88', l: '中' },
              { c: '#b06000', l: '差' },
              { c: '#c5221f', l: '极差' },
            ].map(item => (
              <span key={item.l} style={{display: 'flex', alignItems: 'center', gap: 4}}>
                <span style={{width: 14, height: 14, background: item.c, borderRadius: 3}}></span>
                {item.l}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 组合统计 */}
      {Object.keys(portfolio).length > 0 && <PortfolioStats portfolio={portfolio} labs={labs} />}
    </div>
  );
}

function PortfolioStats({ portfolio, labs }: { portfolio: any; labs: Lab[] }) {
  const items = Object.keys(portfolio).map(slug => {
    const l = labs.find(x => x.slug === slug);
    const p = portfolio[slug];
    if (!l) return null;
    return { cost: p.cost, val: (p.ownership / 100) * (l.valuation_billion_usd || 0) * 100, cat: l.category, name: l.name };
  }).filter(Boolean) as { cost: number; val: number; cat: string; name: string }[];
  
  const totalCost = items.reduce((s, i) => s + i.cost, 0);
  const totalVal = items.reduce((s, i) => s + i.val, 0);
  const ret = totalVal - totalCost;
  const moic = totalCost > 0 ? totalVal / totalCost : 0;
  const irr = totalCost > 0 ? calcIRR([{t: 0, a: -totalCost}, {t: 0.5, a: totalVal}]) : 0;
  
  // 行业分布
  const catDist: Record<string, number> = {};
  items.forEach(i => { catDist[i.cat] = (catDist[i.cat] || 0) + i.val; });
  
  return (
    <div className="section">
      <h2>📊 组合业绩概览</h2>
      <div className="kpi-strip" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
        <div className="kpi"><div className="label">总成本</div><div className="value" style={{fontSize: 20}}>${totalCost.toFixed(1)}M</div></div>
        <div className="kpi"><div className="label">当前价值</div><div className="value" style={{fontSize: 20}}>${totalVal.toFixed(1)}M</div></div>
        <div className="kpi"><div className="label">MOIC</div><div className="value" style={{fontSize: 20, color: moic > 1 ? '#137333' : '#c5221f'}}>{moic.toFixed(2)}x</div></div>
        <div className="kpi"><div className="label">Base IRR</div><div className="value" style={{fontSize: 20, color: irr >= 0 ? '#137333' : '#c5221f'}}>{irr.toFixed(0)}%</div></div>
      </div>
      
      <h3 style={{marginTop: 16, fontSize: 14, fontWeight: 700}}>📈 行业分布</h3>
      <div className="chart-container" style={{height: 240, marginTop: 8}}>
        <Chart type="doughnut" data={{
          labels: Object.keys(catDist),
          datasets: [{
            data: Object.values(catDist),
            backgroundColor: ['#0071e3', '#137333', '#b06000', '#c5221f', '#5ac8fa', '#ffcc88', '#9b59b6', '#34495e', '#16a085', '#d35400', '#8e44ad', '#2c3e50']
          }]
        }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
      </div>
    </div>
  );
}
