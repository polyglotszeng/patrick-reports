import { getAllLabs } from '@/lib/data-server';
import { fmtUsd } from '@/lib/format';
import { InvestorGraph } from '@/components/InvestorGraph';

export const metadata = { title: '投资人图谱 - Neo Labs Tracker' };

export default async function InvestorGraphPage() {
  const labs = await getAllLabs();
  
  // 统计投资人
  const investorMap: Record<string, { name: string; type: string; count: number; labs: string[]; totalValuation: number }> = {};
  
  labs.forEach(l => {
    const investment = l.investment_highlights || '';
    // 简单解析：抓取常见投资方
    const investors = ['A16Z', '红杉资本', 'Sequoia', 'DST Global', 'Greenoaks', 'SoftBank', 'NVIDIA', 'Microsoft', 'OpenAI', 'Google', 'Amazon', 'Apple', 'Jeff Bezos', 'Bezos Expeditions', 'Eric Schmidt', 'Thrive Capital', 'Lux Capital', 'CapitalG', 'Lachy Groom', 'Bain Capital Ventures', 'Gabe Newell', 'Khosla', 'General Catalyst', 'BlackRock', 'JPMorgan', 'Goldman Sachs', 'Arch Venture Partners', 'Spark Capital', 'Triatomic Capital', 'Y Combinator', 'Dimension Capital', 'Sanofi', 'Brookfield', 'Parkway VC', 'Greenoaks', 'TJNS', 'Sutter Hill', 'Index Ventures', 'Founders Fund', 'Coatue', 'Lightspeed', 'Felicis'];
    investors.forEach(inv => {
      if (investment.includes(inv)) {
        if (!investorMap[inv]) investorMap[inv] = { name: inv, type: '顶级VC', count: 0, labs: [], totalValuation: 0 };
        investorMap[inv].count++;
        investorMap[inv].labs.push(l.name);
        investorMap[inv].totalValuation += l.valuation_billion_usd || 0;
      }
    });
    // 战略投资人
    if (investment.includes('OpenAI')) {
      if (!investorMap['OpenAI 战略']) investorMap['OpenAI 战略'] = { name: 'OpenAI 战略', type: '战略', count: 0, labs: [], totalValuation: 0 };
      investorMap['OpenAI 战略'].count++;
      investorMap['OpenAI 战略'].labs.push(l.name);
    }
    if (investment.includes('NVIDIA')) {
      if (!investorMap['NVIDIA 战略']) investorMap['NVIDIA 战略'] = { name: 'NVIDIA 战略', type: '战略', count: 0, labs: [], totalValuation: 0 };
      investorMap['NVIDIA 战略'].count++;
      investorMap['NVIDIA 战略'].labs.push(l.name);
    }
  });
  
  const investors = Object.values(investorMap).sort((a, b) => b.count - a.count);
  
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>🕸️ 投资人图谱</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>25 家 Neo Labs 背后的投资人网络 · 顶级VC / 战略 / 主权基金</p>
      
      {/* KPI */}
      <div className="kpi-strip">
        <div className="kpi"><div className="label">唯一投资人</div><div className="value">{investors.length}</div></div>
        <div className="kpi"><div className="label">最活跃投资方</div><div className="value">{investors[0]?.name || '—'}</div></div>
        <div className="kpi"><div className="label">投资数</div><div className="value">{investors[0]?.count || 0} 家</div></div>
        <div className="kpi"><div className="label">触及总估值</div><div className="value">${(investors.reduce((s, i) => s + i.totalValuation, 0)).toFixed(0)}亿</div></div>
      </div>
      
      {/* 网络图 */}
      <div className="section">
        <h2>🕸️ 投资人 × 实验室 投资网络</h2>
        <InvestorGraph labs={labs} />
      </div>
      
      {/* 投资人排行 */}
      <div className="section">
        <h2>📊 投资人活跃度排行（按覆盖实验室数）</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>投资人</th>
              <th>类型</th>
              <th>覆盖实验室数</th>
              <th>触及总估值 ($B)</th>
              <th>代表标的</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv, i) => (
              <tr key={inv.name}>
                <td>{i + 1}</td>
                <td><strong>{inv.name}</strong></td>
                <td><span className="pill">{inv.type}</span></td>
                <td>{inv.count}</td>
                <td>${inv.totalValuation.toFixed(0)}</td>
                <td style={{fontSize: 11}}>{inv.labs.slice(0, 3).join(', ')}{inv.labs.length > 3 ? '...' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
