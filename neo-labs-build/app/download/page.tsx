import { getAllLabs, getMainLabs } from '@/lib/data-server';
import Link from 'next/link';

export const metadata = { title: '数据下载 - Neo Labs Tracker' };

export default async function DownloadPage() {
  const labs = await getAllLabs();
  const main = await getMainLabs();
  const watchlist = labs.filter(l => l.list_section === 'watchlist');
  
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>📥 数据下载</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>所有 Neo Labs 数据以多种格式导出 (公开版 17 字段 / 内部版 29 字段)</p>
      
      <div className="kpi-strip">
        <div className="kpi"><div className="label">主榜</div><div className="value">{main.length}</div></div>
        <div className="kpi"><div className="label">Watchlist</div><div className="value">{watchlist.length}</div></div>
        <div className="kpi"><div className="label">总实验室</div><div className="value">{labs.length}</div></div>
        <div className="kpi"><div className="label">数据快照</div><div className="value" style={{fontSize: 16}}>2026-06-14</div></div>
      </div>
      
      <div className="section">
        <h2>📥 JSON 完整数据</h2>
        <p style={{marginBottom: 12, color: '#6e6e73'}}>包含 25 家完整数据 (29 字段) — 适合进一步分析或集成</p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
          <a href="/neo-labs/labs.json" download className="btn btn-primary">📦 完整 25 家 (labs.json)</a>
          <a href="/neo-labs/main.json" download className="btn">📦 主榜 20 家 (main.json)</a>
          <a href="/neo-labs/watchlist.json" download className="btn">📦 Watchlist 5 家 (watchlist.json)</a>
        </div>
      </div>
      
      <div className="section">
        <h2>📊 CSV 导出（Excel 友好）</h2>
        <p style={{marginBottom: 12, color: '#6e6e73'}}>UTF-8 BOM 编码 · 直接 Excel/Numbers 打开</p>
        <p style={{fontSize: 13, color: '#6e6e73'}}>从项目根目录访问: <code style={{background: '#f0f0f0', padding: '2px 8px', borderRadius: 4}}>/Users/zl/Documents/neo-labs.csv</code></p>
      </div>
      
      <div className="section">
        <h2>📋 公开版 vs 内部版字段说明</h2>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
          <div>
            <h3 style={{fontSize: 14, fontWeight: 700, marginBottom: 8}}>📗 公开版 (17 字段)</h3>
            <p style={{fontSize: 12, color: '#6e6e73', marginBottom: 8}}>适合媒体/学术/求职/外部</p>
            <ul style={{fontSize: 12, lineHeight: 1.7, paddingLeft: 20}}>
              <li>rank / name / slug / category / hq</li>
              <li>founded_year / founders / theory_basis</li>
              <li>achievements / investment_highlights</li>
              <li>status_emoji / open_source / last_round (粗)</li>
              <li>data_freshness / valuation_range (区间)</li>
            </ul>
          </div>
          <div>
            <h3 style={{fontSize: 14, fontWeight: 700, marginBottom: 8}}>📕 内部版 (29 字段)</h3>
            <p style={{fontSize: 12, color: '#6e6e73', marginBottom: 8}}>适合 Patrick + 授权 LP</p>
            <ul style={{fontSize: 12, lineHeight: 1.7, paddingLeft: 20}}>
              <li>公开版全部 + 估值/融资 (具体数字)</li>
              <li>founder_openai_deepmind_alumni_count</li>
              <li>valuation_to_funding_leverage (派生)</li>
              <li>commercialization_stage_score / team_stability_score</li>
              <li>next_expected_round / risk_signals</li>
              <li>data_freshness_days / estimated_runway_months</li>
              <li>_private_memo (私募备忘)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h2>📈 高级导出（多维 CSV）</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12}}>
          <a href="/neo-labs/quarterly-trend.csv" download className="btn">📅 季度变化 CSV (Q4 2025 → Q2 2026)</a>
          <a href="/neo-labs/by-category.csv" download className="btn">🏷️ 按赛道聚合 CSV</a>
          <a href="/neo-labs/by-investor.csv" download className="btn">💰 按投资人聚合 CSV</a>
          <a href="/neo-labs/by-region.csv" download className="btn">🌍 按地区聚合 CSV</a>
          <a href="/neo-labs/by-freshness.csv" download className="btn">📅 按数据新鲜度 CSV</a>
          <a href="/neo-labs/by-stage.csv" download className="btn">📊 按商业化阶段 CSV</a>
        </div>
        <p style={{fontSize: 11, color: '#6e6e73', marginTop: 8}}>⚠️ 多维 CSV 在项目根目录 <code>/Users/zl/Documents/</code>，可手动复制到 public/ 后部署</p>
      </div>
    </div>
  );
}
