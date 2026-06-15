'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lab } from '@/lib/types';
import { fmtUsd } from '@/lib/format';
import { calcIRR, lognormal, sampleCorrelated } from '@/lib/analytics';

interface PortfolioItem {
  slug: string;
  cost_usd_million: number;
  ownership_pct: number;
  invested_date: string;
}

export function PortfolioClient({ labs }: { labs: Lab[] }) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [mcResult, setMcResult] = useState<{ p50: number; p10: number; exp: number; std: number; lossProb: number } | null>(null);
  const [trials, setTrials] = useState(2000);

  // 从 localStorage 恢复
  useEffect(() => {
    const saved = localStorage.getItem('neo-labs-portfolio-v2');
    if (saved) try { setPortfolio(JSON.parse(saved)); } catch(e) {}
  }, []);

  // 持久化
  useEffect(() => {
    localStorage.setItem('neo-labs-portfolio-v2', JSON.stringify(portfolio));
  }, [portfolio]);

  const items = useMemo(() => {
    return portfolio.map(p => {
      const l = labs.find(x => x.slug === p.slug);
      if (!l) return null;
      return { ...p, lab: l, currentVal: ((p.ownership_pct || 0) / 100) * (l.valuation_billion_usd || 0) * 100 };
    }).filter(Boolean) as { slug: string; cost_usd_million: number; ownership_pct: number; invested_date: string; lab: Lab; currentVal: number }[];
  }, [portfolio, labs]);

  const summary = useMemo(() => {
    const totalCost = items.reduce((s, i) => s + i.cost_usd_million, 0);
    const totalVal = items.reduce((s, i) => s + i.currentVal, 0);
    const ret = totalVal - totalCost;
    const moic = totalCost > 0 ? totalVal / totalCost : 0;
    const irr = totalCost > 0 ? calcIRR([{ t: 0, a: -totalCost }, { t: 0.5, a: totalVal }]) : 0;
    const bearIrr = totalCost > 0 ? calcIRR([{ t: 0, a: -totalCost }, { t: 5, a: totalVal * 0.5 }]) : 0;
    const bullIrr = totalCost > 0 ? calcIRR([{ t: 0, a: -totalCost }, { t: 5, a: totalVal * 5 }]) : 0;
    return { totalCost, totalVal, ret, moic, irr, bearIrr, bullIrr };
  }, [items]);

  function addToPortfolio(slug: string) {
    if (portfolio.find(p => p.slug === slug)) {
      setPortfolio(portfolio.filter(p => p.slug !== slug));
    } else {
      setPortfolio([...portfolio, { slug, cost_usd_million: 5, ownership_pct: 0.1, invested_date: '2026-01-01' }]);
    }
  }

  function updateItem(slug: string, field: keyof PortfolioItem, value: any) {
    setPortfolio(portfolio.map(p => p.slug === slug ? { ...p, [field]: value } : p));
  }

  function runMonteCarlo() {
    if (items.length === 0) { alert('请先加入标的'); return; }
    // 简化：标的相关性按 0.3 (跨赛道)
    const corr: number[][] = [];
    for (let i = 0; i < items.length; i++) {
      corr[i] = [];
      for (let j = 0; j < items.length; j++) {
        corr[i][j] = i === j ? 1 : (items[i].lab.category === items[j].lab.category ? 0.5 : 0.2);
      }
    }
    const irrs: number[] = [];
    for (let t = 0; t < trials; t++) {
      const z = sampleCorrelated(corr);
      let totalCost = 0, totalExit = 0;
      for (let i = 0; i < items.length; i++) {
        const m = Math.exp(0.7 + 0.8 * z[i]);
        totalCost += items[i].cost_usd_million;
        totalExit += items[i].currentVal * m;
      }
      irrs.push(calcIRR([{ t: 0, a: -totalCost }, { t: 5, a: totalExit }]));
    }
    irrs.sort((a, b) => a - b);
    const exp = irrs.reduce((s, x) => s + x, 0) / irrs.length;
    const std = Math.sqrt(irrs.reduce((s, x) => s + (x - exp) ** 2, 0) / irrs.length);
    setMcResult({
      p50: irrs[Math.floor(irrs.length * 0.5)],
      p10: irrs[Math.floor(irrs.length * 0.1)],
      exp,
      std,
      lossProb: irrs.filter(x => x < 0).length / trials * 100
    });
  }

  return (
    <>
      {/* KPI */}
      <div className="kpi-strip">
        <div className="kpi"><div className="label">总成本</div><div className="value">${summary.totalCost.toFixed(1)}M</div></div>
        <div className="kpi"><div className="label">当前价值</div><div className="value">${summary.totalVal.toFixed(1)}M</div></div>
        <div className="kpi"><div className="label">MOIC</div><div className="value">{summary.moic.toFixed(2)}x</div></div>
        <div className="kpi"><div className="label">Base IRR</div><div className="value" style={{color: summary.irr >= 0 ? '#137333' : '#c5221f'}}>{summary.irr.toFixed(0)}%</div></div>
        <div className="kpi"><div className="label">Bear (0.5x, 5y)</div><div className="value" style={{color: summary.bearIrr >= 0 ? '#137333' : '#c5221f'}}>{summary.bearIrr.toFixed(0)}%</div></div>
        <div className="kpi"><div className="label">Bull (5x, 5y)</div><div className="value" style={{color: summary.bullIrr >= 0 ? '#137333' : '#c5221f'}}>{summary.bullIrr.toFixed(0)}%</div></div>
      </div>

      {/* 候选池 */}
      <div className="section">
        <h2>🎯 候选池 (点击 toggle)</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxHeight: 400, overflowY: 'auto'}}>
          {labs.filter(l => l.list_section === 'main').map(l => {
            const inP = !!portfolio.find(p => p.slug === l.slug);
            return (
              <button key={l.slug} onClick={() => addToPortfolio(l.slug)} style={{
                padding: 10, border: '1px solid ' + (inP ? '#137333' : '#e0e0e0'),
                background: inP ? '#fff7e0' : '#fff',
                borderRadius: 6, cursor: 'pointer', textAlign: 'left', fontSize: 12
              }}>
                <strong>{inP ? '✓ ' : ''}{l.name}</strong>
                <div style={{color: '#6e6e73', fontSize: 10, marginTop: 2}}>{l.category} · {fmtUsd(l.valuation_billion_usd)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 持仓详情 */}
      {items.length > 0 && (
        <div className="section">
          <h2>💼 持仓详情 ({items.length} 家)</h2>
          {items.map(i => (
            <div key={i.slug} style={{padding: 14, background: '#f8f9fa', borderRadius: 8, marginBottom: 8, border: '1px solid #e8e8e8'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div>
                  <strong>{i.lab.name}</strong>
                  <span className="pill" style={{marginLeft: 8}}>{i.lab.category}</span>
                  <span className="pill good" style={{marginLeft: 4}}>S{i.lab.commercialization_stage_score}</span>
                </div>
                <button onClick={() => addToPortfolio(i.slug)} style={{padding: '4px 10px', background: '#fce8e6', color: '#c5221f', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11}}>移除</button>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8}}>
                <div>
                  <label style={{fontSize: 10, color: '#6e6e73', textTransform: 'uppercase'}}>成本 ($M)</label>
                  <input type="number" step="0.1" value={i.cost_usd_million} onChange={e => updateItem(i.slug, 'cost_usd_million', parseFloat(e.target.value))} style={{width: '100%', padding: 4, border: '1px solid #d0d0d0', borderRadius: 4}} />
                </div>
                <div>
                  <label style={{fontSize: 10, color: '#6e6e73', textTransform: 'uppercase'}}>持股 %</label>
                  <input type="number" step="0.01" value={i.ownership_pct} onChange={e => updateItem(i.slug, 'ownership_pct', parseFloat(e.target.value))} style={{width: '100%', padding: 4, border: '1px solid #d0d0d0', borderRadius: 4}} />
                </div>
                <div>
                  <label style={{fontSize: 10, color: '#6e6e73', textTransform: 'uppercase'}}>入场日期</label>
                  <input type="date" value={i.invested_date} onChange={e => updateItem(i.slug, 'invested_date', e.target.value)} style={{width: '100%', padding: 4, border: '1px solid #d0d0d0', borderRadius: 4, fontSize: 12}} />
                </div>
                <div>
                  <label style={{fontSize: 10, color: '#6e6e73', textTransform: 'uppercase'}}>当前价值</label>
                  <div style={{fontSize: 16, fontWeight: 700, padding: 4}}>${i.currentVal.toFixed(1)}M</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monte Carlo */}
      {items.length > 0 && (
        <div className="section">
          <h2>🎲 Monte Carlo 模拟（含相关性建模）</h2>
          <button onClick={runMonteCarlo} className="btn btn-primary" style={{marginBottom: 12}}>运行 {trials} 次模拟（按赛道类内 ρ=0.5, 跨 ρ=0.2）</button>
          {mcResult && (
            <div className="kpi-strip" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
              <div className="kpi"><div className="label">P10</div><div className="value" style={{color: '#c5221f', fontSize: 18}}>{mcResult.p10.toFixed(1)}%</div></div>
              <div className="kpi"><div className="label">P50</div><div className="value" style={{fontSize: 18}}>{mcResult.p50.toFixed(1)}%</div></div>
              <div className="kpi"><div className="label">E[IRR]</div><div className="value" style={{fontSize: 18}}>{mcResult.exp.toFixed(1)}%</div></div>
              <div className="kpi"><div className="label">σ</div><div className="value" style={{fontSize: 18}}>{mcResult.std.toFixed(1)}%</div></div>
              <div className="kpi"><div className="label">P(亏损)</div><div className="value" style={{color: '#c5221f', fontSize: 18}}>{mcResult.lossProb.toFixed(1)}%</div></div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
