'use client';

import { useState } from 'react';
import { Lab } from '@/lib/types';
import { fmtUsd, fmtPct } from '@/lib/format';
import { Chart } from './Chart';

export function LabDetailClient({ lab }: { lab: Lab }) {
  const [showPDF, setShowPDF] = useState(false);
  
  // 风险评分（基于 valuation_to_funding_leverage, data_freshness_days, commercialization_stage_score）
  const riskScores = {
    '估值杠杆': Math.min(4, Math.floor((lab.valuation_to_funding_leverage || 0) / 2)),
    '数据陈旧': (lab.data_freshness_days || 0) > 365 ? 4 : (lab.data_freshness_days || 0) > 180 ? 3 : (lab.data_freshness_days || 0) > 90 ? 1 : 0,
    '零收入/低商业化': lab.commercialization_stage_score <= 1 ? 4 : lab.commercialization_stage_score === 2 ? 2 : lab.commercialization_stage_score === 3 ? 1 : 0,
    '团队动荡': (lab.team_stability_score || 5) <= 2 ? 4 : lab.team_stability_score === 3 ? 2 : 0,
    '数据时效>180d': (lab.data_freshness_days || 0) > 180 ? 3 : 0,
    '阶段早': (lab.commercialization_stage_score || 0) <= 2 ? 3 : 0,
    '无 OD 校友': (lab.founder_openai_deepmind_alumni_count || 0) === 0 ? 2 : 0,
  };
  
  // 派生指标（分位数详情卡）
  const leverage = lab.valuation_to_funding_leverage || 0;
  const stage = lab.commercialization_stage_score || 0;
  const stability = lab.team_stability_score || 0;
  
  // 6 维雷达数据
  const radarData = {
    labels: ['学术权威', '商业化', '融资规模', '团队稳定', '数据新鲜', '战略协同'],
    datasets: [
      {
        label: lab.name,
        data: [
          Math.min(5, lab.founder_openai_deepmind_alumni_count * 2 + 1),
          stage,
          Math.min(5, leverage > 0 ? 6 - leverage / 2 : 1),
          stability,
          lab.data_freshness_days < 90 ? 5 : lab.data_freshness_days < 180 ? 3 : lab.data_freshness_days < 365 ? 1 : 0,
          3
        ],
        backgroundColor: 'rgba(0, 113, 227, 0.2)',
        borderColor: '#0071e3',
        borderWidth: 2
      }
    ]
  };

  // 风险热力图
  const heatData = {
    labels: Object.keys(riskScores),
    datasets: [{
      label: '风险分',
      data: Object.values(riskScores),
      backgroundColor: Object.values(riskScores).map(v => 
        v >= 4 ? '#c5221f' : v >= 3 ? '#b06000' : v >= 2 ? '#ffcc88' : v >= 1 ? '#5ac8fa' : '#137333'
      )
    }]
  };

  // 退出倍数情景（基于商业化阶段）
  const scenarios = {
    1: [0.2, 1.5, 5], 2: [0.5, 2, 8], 3: [1, 3, 10], 4: [1.5, 4, 12], 5: [2, 5, 15]
  }[stage] || [0.3, 2, 6];

  function downloadJSON() {
    const data = JSON.stringify(lab, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${lab.slug}.json`; a.click();
  }
  
  function downloadCSV() {
    const rows = [
      ['Field', 'Value'],
      ['name', lab.name],
      ['rank', lab.rank],
      ['category', lab.category],
      ['valuation_billion_usd', lab.valuation_billion_usd || ''],
      ['total_funding_billion_usd', lab.total_funding_billion_usd || ''],
      ['founded_year', lab.founded_year],
      ['hq', lab.hq],
      ['commercialization_stage_score', lab.commercialization_stage_score || ''],
      ['team_stability_score', lab.team_stability_score || ''],
      ['valuation_to_funding_leverage', lab.valuation_to_funding_leverage || ''],
      ['data_freshness_days', lab.data_freshness_days || ''],
      ['last_round_type', lab.last_round?.type || ''],
      ['last_round_date', lab.last_round?.date || ''],
    ];
    const csv = '\uFEFF' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${lab.slug}.csv`; a.click();
  }

  async function printPDF() {
    setShowPDF(true);
    setTimeout(() => {
      window.print();
      setShowPDF(false);
    }, 100);
  }
  
  return (
    <>
      {/* 操作按钮 */}
      <div style={{marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <button onClick={downloadJSON} className="btn">📥 下载 JSON</button>
        <button onClick={downloadCSV} className="btn">📊 下载 CSV</button>
        <button onClick={printPDF} className="btn">🖨️ 打印/PDF</button>
      </div>
      
      {/* 6 维雷达 + 风险热力图 */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16}}>
        <div className="section">
          <h2>📊 6 维私募评估雷达</h2>
          <div className="chart-container" style={{height: 280}}>
            <Chart type="radar" data={radarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 5 } } }} />
          </div>
        </div>
        <div className="section">
          <h2>🔥 7 维风险分</h2>
          <div className="chart-container" style={{height: 280}}>
            <Chart type="val" data={heatData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
      
      {/* 分位数详情卡（私募关键指标） */}
      <div className="section">
        <h2>📈 私募关键指标分位数（vs 25 家主榜）</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
          <PercentileCard 
            label="估值分位数" 
            value={fmtUsd(lab.valuation_billion_usd)}
            note={lab.valuation_billion_usd && lab.valuation_billion_usd > 50 ? '超头部 (前 25%)' : lab.valuation_billion_usd && lab.valuation_billion_usd > 10 ? '中头部 (25-75%)' : '长尾 (后 25%)'}
            color={lab.valuation_billion_usd && lab.valuation_billion_usd > 50 ? '#137333' : lab.valuation_billion_usd && lab.valuation_billion_usd > 10 ? '#0071e3' : '#6e6e73'}
          />
          <PercentileCard 
            label="估值杠杆分位数" 
            value={`${leverage.toFixed(2)}x`}
            note={leverage > 8 ? '极高 (前 10%)' : leverage > 5 ? '高 (前 25%)' : leverage > 2 ? '中 (25-75%)' : '低 (后 25%)'}
            color={leverage > 8 ? '#c5221f' : leverage > 5 ? '#b06000' : leverage > 2 ? '#0071e3' : '#137333'}
          />
          <PercentileCard 
            label="数据时效分位数" 
            value={`${lab.data_freshness_days}天`}
            note={lab.data_freshness_days > 365 ? '黑箱 (>365d)' : lab.data_freshness_days > 180 ? '陈旧 (180-365d)' : '新鲜 (<180d)'}
            color={lab.data_freshness_days > 365 ? '#c5221f' : lab.data_freshness_days > 180 ? '#b06000' : '#137333'}
          />
          <PercentileCard 
            label="商业化阶段" 
            value={`S${stage}`}
            note={stage >= 4 ? '成长期 / 规模化' : stage === 3 ? '商业化' : stage === 2 ? 'Beta' : '研究'}
            color={stage >= 4 ? '#137333' : stage >= 2 ? '#0071e3' : '#b06000'}
          />
          <PercentileCard 
            label="团队稳定分位数" 
            value={`S${stability}`}
            note={stability >= 4 ? '稳定' : stability >= 3 ? '一般' : '动荡'}
            color={stability >= 4 ? '#137333' : stability >= 3 ? '#0071e3' : '#c5221f'}
          />
          <PercentileCard 
            label="OD 校友密度" 
            value={`${lab.founder_openai_deepmind_alumni_count}`}
            note={lab.founder_openai_deepmind_alumni_count >= 3 ? '高密度' : lab.founder_openai_deepmind_alumni_count >= 1 ? '中密度' : '无 OD 校友'}
            color={lab.founder_openai_deepmind_alumni_count >= 3 ? '#137333' : lab.founder_openai_deepmind_alumni_count >= 1 ? '#0071e3' : '#6e6e73'}
          />
        </div>
      </div>
      
      {/* 5 年退出情景（Monte Carlo 简化版） */}
      <div className="section">
        <h2>🎯 5 年退出情景（基于当前估值 + 商业化阶段）</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
          <ScenarioCard name="🐻 Bear" mult={scenarios[0]} color="#c5221f" currentVal={lab.valuation_billion_usd || 0} />
          <ScenarioCard name="📊 Base" mult={scenarios[1]} color="#0071e3" currentVal={lab.valuation_billion_usd || 0} />
          <ScenarioCard name="🚀 Bull" mult={scenarios[2]} color="#137333" currentVal={lab.valuation_billion_usd || 0} />
        </div>
        <p style={{fontSize: 11, color: '#6e6e73', marginTop: 8}}>倍数基于商业化阶段 S{stage} 的典型范围；实际退出倍数受市场环境、战略买家、行业景气度等多因素影响</p>
      </div>
      
      {/* 打印优化样式 */}
      {showPDF && (
        <style>{`
          @media print {
            .navbar, .footer, button, .compare-bar { display: none !important; }
            body { background: #fff; }
            .container { max-width: 100%; }
          }
        `}</style>
      )}
    </>
  );
}

function PercentileCard({ label, value, note, color }: { label: string; value: string; note: string; color: string }) {
  return (
    <div style={{padding: 14, background: '#f8f9fa', borderRadius: 8, border: '1px solid #e8e8e8'}}>
      <div style={{fontSize: 10, color: '#6e6e73', textTransform: 'uppercase', fontWeight: 600}}>{label}</div>
      <div style={{fontSize: 22, fontWeight: 700, color, marginTop: 4}}>{value}</div>
      <div style={{fontSize: 11, color, marginTop: 2}}>{note}</div>
    </div>
  );
}

function ScenarioCard({ name, mult, color, currentVal }: { name: string; mult: number; color: string; currentVal: number }) {
  const futureVal = currentVal * mult;
  const irr = mult > 0 ? (Math.pow(mult, 1/5) - 1) * 100 : 0;
  return (
    <div style={{padding: 16, background: '#fff', borderRadius: 10, border: `2px solid ${color}`, textAlign: 'center'}}>
      <div style={{fontSize: 14, fontWeight: 700, color}}>{name}</div>
      <div style={{fontSize: 28, fontWeight: 700, marginTop: 8}}>{mult}x</div>
      <div style={{fontSize: 12, color: '#6e6e73', marginTop: 4}}>未来估值: <strong>${futureVal.toFixed(0)}亿</strong></div>
      <div style={{fontSize: 12, color: '#6e6e73'}}>IRR: <strong style={{color}}>{irr.toFixed(0)}%/年</strong></div>
    </div>
  );
}
