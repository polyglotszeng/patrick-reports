import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLabs, getLabBySlug } from '@/lib/data-server';
import { fmtUsd } from '@/lib/format';
import { LabDetailClient } from '@/components/LabDetailClient';

export async function generateStaticParams() {
  const labs = await getAllLabs();
  return labs.map(l => ({ slug: l.slug }));
}

export default async function LabDetailPage({ params }: { params: { slug: string } }) {
  const lab = await getLabBySlug(params.slug);
  if (!lab) return notFound();
  
  return (
    <div className="container">
      <Link href="/labs" style={{color: '#0071e3', fontSize: 13, marginBottom: 12, display: 'inline-block'}}>← 返回列表</Link>
      
      {/* Header */}
      <div className="detail-header">
        <h1>
          {lab.name}
          <span className="rank">#{lab.rank} in Top {lab.list_section === 'main' ? '20' : 'Watchlist'}</span>
        </h1>
        <div className="tag-row">
          <span className="tag">{lab.category}</span>
          <span className="tag" style={{background: '#e6f4ea', color: '#137333'}}>{lab.status_emoji} {lab.status_emoji === '✅' ? '已商业化' : lab.status_emoji === '🔬' ? '研究阶段' : '客户合作'}</span>
          {lab.open_source && <span className="tag" style={{background: '#137333', color: '#fff'}}>✅ 开源</span>}
          <span className="tag" style={{background: '#f8f9fa', color: '#6e6e73'}}>{lab.hq}</span>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="mini-kpi">
          <div className="label">估值</div>
          <div className="value">{fmtUsd(lab.valuation_billion_usd)}</div>
        </div>
        <div className="mini-kpi">
          <div className="label">累计融资</div>
          <div className="value">{fmtUsd(lab.total_funding_billion_usd)}</div>
        </div>
        <div className="mini-kpi">
          <div className="label">估值杠杆</div>
          <div className="value">{(lab.valuation_to_funding_leverage || 0).toFixed(2)}x</div>
        </div>
        <div className="mini-kpi">
          <div className="label">OD 校友</div>
          <div className="value">{lab.founder_openai_deepmind_alumni_count}</div>
        </div>
      </div>

      {/* 图表 + 分位数 + 退出情景 (LabDetailClient) */}
      <LabDetailClient lab={lab} />

      {/* 理论基础 */}
      <div className="section">
        <h2>💡 理论基础</h2>
        <div className="theory">{lab.theory_basis}</div>
      </div>

      {/* 创始人 */}
      <div className="section">
        <h2>👥 创始团队</h2>
        <p style={{fontSize: 14, lineHeight: 1.7}}>{lab.founders}</p>
      </div>

      {/* 融资时间轴 */}
      <div className="section">
        <h2>💰 融资时间轴</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="date">最近一轮</div>
            <div className="desc">
              <strong>{lab.last_round?.type || 'N/A'}</strong> · {lab.last_round?.date || 'N/A'} · ${lab.last_round?.amount_billion_usd ?? '?'}亿 → 估值 {fmtUsd(lab.last_round?.valuation_billion_usd ?? null)}
            </div>
          </div>
          <div className="timeline-item">
            <div className="date">下一轮预期</div>
            <div className="desc">
              {lab.next_expected_round.type} · {lab.next_expected_round.estimated_window_months}窗口（{lab.next_expected_round.expected_window}）
            </div>
          </div>
        </div>
      </div>

      {/* 风险 + 机会 */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24}}>
        <div className="section">
          <h2>⚠️ 风险信号</h2>
          <div className="risk-box">
            {lab.risk_signals.map((r, i) => <div className="item" key={i}>{r}</div>)}
          </div>
        </div>
        <div className="section">
          <h2>✅ 机会</h2>
          <div className="opp-box">
            <div className="item">{lab.investment_highlights}</div>
            <div className="item">{lab.achievements}</div>
          </div>
        </div>
      </div>

      {/* AI 投资观察 */}
      <div className="section">
        <div className="ai-summ">
          <div className="label">🤖 AI 投资观察</div>
          <div className="text">
            <strong>风险信号组合分析：</strong>估值杠杆 {(lab.valuation_to_funding_leverage || 0).toFixed(2)}x ·
            数据时效 {lab.data_freshness_days}天 ·
            商业化阶段 S{lab.commercialization_stage_score} ·
            OD 校友 {lab.founder_openai_deepmind_alumni_count}人。<br />
            <strong>私募视角：</strong>
            {(lab.valuation_to_funding_leverage || 0) > 8 && '⚠️ 估值杠杆 8x+ = 严重 IP 对赌，私募进入前必须访谈创始人。'}
            {(lab.valuation_to_funding_leverage || 0) > 5 && (lab.valuation_to_funding_leverage || 0) <= 8 && '⚠️ 估值杠杆 5-8x = 中高风险，密切跟踪下一轮 close 结果。'}
            {(lab.valuation_to_funding_leverage || 0) > 2 && (lab.valuation_to_funding_leverage || 0) <= 5 && '✅ 估值杠杆 2-5x = 合理区间，可考虑。'}
            {(lab.valuation_to_funding_leverage || 0) <= 2 && '✅ 估值杠杆 < 2x = 高度合理，私募可积极进入。'}
            {lab.data_freshness_days > 365 && ' ⚠️ 数据时效 365d+ = 私募黑箱，必须直接访谈。'}
          </div>
        </div>
      </div>
    </div>
  );
}
