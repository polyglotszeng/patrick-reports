'use client';

import { Lab } from '@/lib/types';
import { fmtUsd } from '@/lib/format';
import { Chart } from '@/components/Chart';
import { useState } from 'react';

export function QuarterlyCompare({ labs }: { labs: Lab[] }) {
  const [sortBy, setSortBy] = useState<'q1' | 'q2' | 'change'>('change');
  
  // 季度数据（Q4 2025 末 → Q1 2026 末 → Q2 2026 末）
  const Q4: Record<string, number> = {
    'OpenAI': 300, 'Project Prometheus': 300, 'Safe Superintelligence (SSI)': 320,
    'Skild AI': 14, 'Thinking Machines Lab': 12, 'Periodic Labs': 13,
    'Physical Intelligence (PI)': 5.6, 'World Labs': 10, 'Edison Scientific': 2.5,
    'AMI Labs': 3.5, 'Ricursive Intelligence': 4, 'Lila Sciences': 1.3,
    'Mirendil': 1, 'General Intuition': 1.34, 'dmodel.ai': 0.2,
    'Boltz': 1.5, 'Figure AI': 39, 'Apptronik': 1, 'Modal Labs': 2.5, 'Living Models': 0.3,
  };
  const Q1: Record<string, number> = {
    'OpenAI': 852, 'Project Prometheus': 380, 'Safe Superintelligence (SSI)': 320,
    'Skild AI': 15, 'Thinking Machines Lab': 12, 'Periodic Labs': 70,
    'Physical Intelligence (PI)': 11, 'World Labs': 50, 'Edison Scientific': 2.5,
    'AMI Labs': 3.5, 'Ricursive Intelligence': 4, 'Lila Sciences': 1.3,
    'Mirendil': 1, 'General Intuition': 1.34, 'dmodel.ai': 0.2,
    'Boltz': 1.5, 'Figure AI': 39, 'Apptronik': 5, 'Modal Labs': 2.5,
    'Merge Labs': 0.85, 'Living Models': 0.3,
  };
  
  const main = labs.filter(l => l.list_section === 'main');
  const data = main.map(l => {
    const q4v = Q4[l.name] || null;
    const q1v = Q1[l.name] || null;
    const q2v = l.valuation_billion_usd;
    return {
      name: l.name, slug: l.slug, category: l.category,
      q4: q4v, q1: q1v, q2: q2v,
      q4ToQ1: q4v && q1v ? ((q1v - q4v) / q4v * 100) : null,
      q1ToQ2: q1v && q2v ? ((q2v - q1v) / q1v * 100) : null,
      total: q4v && q2v ? ((q2v - q4v) / q4v * 100) : null,
    };
  }).filter(d => d.q2);
  
  const sorted = [...data].sort((a, b) => {
    if (sortBy === 'q1') return (b.q1 || 0) - (a.q1 || 0);
    if (sortBy === 'q2') return (b.q2 || 0) - (a.q2 || 0);
    return (b.total || 0) - (a.total || 0);
  }).slice(0, 15);
  
  // 季度总规模
  const totalQ4 = data.reduce((s, d) => s + (d.q4 || 0), 0);
  const totalQ1 = data.reduce((s, d) => s + (d.q1 || 0), 0);
  const totalQ2 = data.reduce((s, d) => s + (d.q2 || 0), 0);
  
  return (
    <div>
      {/* KPI */}
      <div className="kpi-strip">
        <div className="kpi"><div className="label">Q4 2025 总估值</div><div className="value">${totalQ4.toFixed(0)}亿</div></div>
        <div className="kpi"><div className="label">Q1 2026 总估值</div><div className="value">${totalQ1.toFixed(0)}亿</div></div>
        <div className="kpi"><div className="label">Q2 2026 总估值</div><div className="value">${totalQ2.toFixed(0)}亿</div></div>
        <div className="kpi"><div className="label">Q1→Q2 增幅</div><div className="value" style={{color: totalQ2 > totalQ1 ? '#137333' : '#c5221f'}}>{((totalQ2 - totalQ1) / totalQ1 * 100).toFixed(1)}%</div></div>
      </div>
      
      {/* 估值变化排行表 */}
      <div className="section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
          <h2>📈 季度变化排行 (Top 15)</h2>
          <div style={{display: 'flex', gap: 4}}>
            <button onClick={() => setSortBy('change')} className="btn" style={{background: sortBy === 'change' ? '#0071e3' : '#fff', color: sortBy === 'change' ? '#fff' : 'inherit'}}>涨幅</button>
            <button onClick={() => setSortBy('q1')} className="btn" style={{background: sortBy === 'q1' ? '#0071e3' : '#fff', color: sortBy === 'q1' ? '#fff' : 'inherit'}}>Q1 估值</button>
            <button onClick={() => setSortBy('q2')} className="btn" style={{background: sortBy === 'q2' ? '#0071e3' : '#fff', color: sortBy === 'q2' ? '#fff' : 'inherit'}}>Q2 估值</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>名称</th>
              <th>Q4 2025</th>
              <th>Q1 2026</th>
              <th>Q2 2026</th>
              <th>Q1→Q2 %</th>
              <th>半年总 %</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => (
              <tr key={d.slug}>
                <td>{i + 1}</td>
                <td><strong>{d.name}</strong><br /><small style={{color: '#6e6e73'}}>{d.category}</small></td>
                <td>{d.q4 ? `$${d.q4.toFixed(1)}亿` : 'N/A'}</td>
                <td>{d.q1 ? `$${d.q1.toFixed(1)}亿` : 'N/A'}</td>
                <td><strong>${d.q2.toFixed(1)}亿</strong></td>
                <td>
                  {d.q1ToQ2 !== null ? (
                    <span className={`pill ${d.q1ToQ2 > 100 ? 'good' : d.q1ToQ2 > 0 ? 'warn' : 'danger'}`}>
                      {d.q1ToQ2 > 0 ? '+' : ''}{d.q1ToQ2.toFixed(0)}%
                    </span>
                  ) : 'N/A'}
                </td>
                <td>
                  {d.total !== null ? (
                    <span className={`pill ${d.total > 500 ? 'good' : d.total > 100 ? 'warn' : d.total > 0 ? '' : 'danger'}`}>
                      {d.total > 0 ? '+' : ''}{d.total.toFixed(0)}%
                    </span>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 季度变化柱状图 */}
      <div className="section">
        <h2>📊 估值变化柱状图（Q1→Q2 涨幅 Top 10）</h2>
        <div className="chart-container">
          <Chart type="val" data={{
            labels: sorted.slice(0, 10).map(d => d.name),
            datasets: [
              { label: 'Q1 2026 ($B)', data: sorted.slice(0, 10).map(d => d.q1 || 0), backgroundColor: '#5ac8fa' },
              { label: 'Q2 2026 ($B)', data: sorted.slice(0, 10).map(d => d.q2 || 0), backgroundColor: '#137333' },
            ]
          }} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { title: { display: true, text: '估值 ($B)' } } }
          }} />
        </div>
      </div>
    </div>
  );
}
