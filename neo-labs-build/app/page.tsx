import { getAllLabs, getMainLabs } from '@/lib/data-server';
import { fmtUsd } from '@/lib/format';
import Link from 'next/link';

export const metadata = {
  title: 'Neo Labs Tracker - 25家前沿AI实验室数据平台'
};

export default async function HomePage() {
  const allLabs = await getAllLabs();
  const mainLabs = await getMainLabs();
  const watchlist = allLabs.filter(l => l.list_section === 'watchlist');
  
  // 计算 KPI
  const totalValuation = mainLabs.reduce((s, l) => s + (l.valuation_billion_usd || 0), 0);
  const totalFunding = mainLabs.reduce((s, l) => s + (l.total_funding_billion_usd || 0), 0);
  const withRevenue = mainLabs.filter(l => l.estimated_valuation_to_revenue_ratio !== null).length;
  const highLeverage = mainLabs.filter(l => (l.valuation_to_funding_leverage || 0) > 5).length;
  
  // Top 5 (by valuation)
  const top5 = [...mainLabs]
    .filter(l => l.valuation_billion_usd !== null)
    .sort((a, b) => (b.valuation_billion_usd || 0) - (a.valuation_billion_usd || 0))
    .slice(0, 5);
  
  // 季度变化最快的 5 家
  const movers = mainLabs
    .filter(l => l.data_freshness_days < 180)
    .sort((a, b) => (a.data_freshness_days || 999) - (b.data_freshness_days || 999))
    .slice(0, 6);

  return (
    <div className="container">
      {/* Hero */}
      <div style={{marginBottom: '24px'}}>
        <h1 style={{fontSize: '36px', fontWeight: 700, marginBottom: '8px'}}>
          🔬 Neo Labs Tracker
        </h1>
        <p style={{fontSize: '16px', color: '#6e6e73'}}>
          25 家前沿 AI 实验室 · 私募视角 · 2026-07-03 H1 中期更新 (md 研究 · 25 家全量 patch + 2 新追踪)
        </p>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi">
          <div className="label">主榜总估值</div>
          <div className="value">${totalValuation.toFixed(0)}亿</div>
          <div className="delta up">↗ Q1→Q2 持续增长</div>
        </div>
        <div className="kpi">
          <div className="label">已披露累计融资</div>
          <div className="value">${totalFunding.toFixed(0)}亿+</div>
          <div className="delta">22 家披露</div>
        </div>
        <div className="kpi">
          <div className="label">已 ARR 披露</div>
          <div className="value">{withRevenue}</div>
          <div className="delta">家 (估值/营收可算)</div>
        </div>
        <div className="kpi">
          <div className="label">高杠杆标的 (5x+)</div>
          <div className="value" style={{color: '#c5221f'}}>{highLeverage}</div>
          <div className="delta">⚠️ 私募警惕</div>
        </div>
      </div>

      {/* 行动按钮 */}
      <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap'}}>
        <Link href="/labs" className="btn btn-primary">📋 查看全部 25 家 →</Link>
        <Link href="/compare" className="btn">⚖️ 对比视图</Link>
        <Link href="/portfolio" className="btn">💼 投资组合 + Sensitivity</Link>
        <a href="/data/neo-labs-main.json" download className="btn">📥 下载 JSON</a>
      </div>

      {/* Top 5 卡片 */}
      <div className="section">
        <h2>🏆 Top 5 估值最高（按 valuation 降序）</h2>
        <div className="card-grid">
          {top5.map(lab => (
            <Link href={`/labs/${lab.slug}`} key={lab.slug}>
              <div className="lab-card">
                <h3>#{lab.rank} {lab.name}</h3>
                <div className="meta">{lab.category} · {lab.hq}</div>
                <div className="row"><span className="k">估值</span><span className="v" style={{color: '#137333'}}>{fmtUsd(lab.valuation_billion_usd)}</span></div>
                <div className="row"><span className="k">累计融资</span><span className="v">{fmtUsd(lab.total_funding_billion_usd)}</span></div>
                <div className="row"><span className="k">成立</span><span className="v">{lab.founded_year}</span></div>
                <div style={{marginTop: '8px'}}>
                  <span className="pill">{lab.status_emoji} {lab.status_emoji === '✅' ? '已商业化' : lab.status_emoji === '🔬' ? '研究阶段' : '客户合作'}</span>
                  {lab.open_source && <span className="pill good">开源</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新数据动态 */}
      <div className="section">
        <h2>📡 最新数据动态 (按数据新鲜度排序)</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
          {movers.map(lab => (
            <Link href={`/labs/${lab.slug}`} key={lab.slug}>
              <div style={{background: '#f8f9fa', padding: '14px', borderRadius: '8px', border: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <strong style={{fontSize: '14px'}}>{lab.name}</strong>
                  <div style={{fontSize: '11px', color: '#6e6e73'}}>{lab.category} · {lab.last_round?.type || 'N/A'} {lab.last_round?.date || ''}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '12px', fontWeight: 700, color: '#137333'}}>{fmtUsd(lab.valuation_billion_usd)}</div>
                  <div style={{fontSize: '10px', color: '#6e6e73'}}>{lab.data_freshness_days}天前更新</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 季度变化快讯 */}
      <div className="section">
        <h2>📈 2026 Q1→Q2 季度快讯</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
          <div style={{padding: '14px', background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)', borderRadius: '8px'}}>
            <div style={{fontSize: '12px', color: '#1967d2', fontWeight: 700}}>💰 史上最大私募</div>
            <div style={{fontSize: '14px', fontWeight: 700, marginTop: '4px'}}>OpenAI $122B @ $8520亿</div>
            <div style={{fontSize: '11px', color: '#6e6e73', marginTop: '4px'}}>Amazon + Nvidia + SoftBank + A16Z</div>
          </div>
          <div style={{padding: '14px', background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)', borderRadius: '8px'}}>
            <div style={{fontSize: '12px', color: '#1967d2', fontWeight: 700}}>👑 Bezos 个人最大赌注</div>
            <div style={{fontSize: '14px', fontWeight: 700, marginTop: '4px'}}>Prometheus $12B @ $410亿</div>
            <div style={{fontSize: '11px', color: '#6e6e73', marginTop: '4px'}}>drop "Project" · 150 员工</div>
          </div>
          <div style={{padding: '14px', background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)', borderRadius: '8px'}}>
            <div style={{fontSize: '12px', color: '#1967d2', fontWeight: 700}}>🤝 OpenAI 战略 alpha</div>
            <div style={{fontSize: '14px', fontWeight: 700, marginTop: '4px'}}>Merge Labs 公开投资</div>
            <div style={{fontSize: '11px', color: '#6e6e73', marginTop: '4px'}}>$252M @ $850M 估值</div>
          </div>
        </div>
      </div>
    </div>
  );
}
