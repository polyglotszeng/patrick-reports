import { getAllLabs } from '@/lib/data-server';
import { fmtUsd } from '@/lib/format';
import Link from 'next/link';

export const metadata = { title: '团队详情 - Neo Labs Tracker' };

export default async function TeamPage() {
  const labs = await getAllLabs();
  
  // 按创始人组织
  const teamMap: Record<string, { slug: string; name: string; openai: boolean; deepmind: boolean; labs: any[] }> = {};
  
  labs.forEach(l => {
    const founders = l.founders || '';
    // 抓取常见名字
    const names = founders.match(/[A-Z][a-z]+ [A-Z][a-zA-Z]+/g) || [];
    names.forEach(name => {
      // 排除 PhD 等后缀
      if (name.includes('PhD') || name.includes('CEO') || name.includes('CTO')) return;
      if (!teamMap[name]) teamMap[name] = {
        slug: l.slug, name, openai: false, deepmind: false, labs: []
      };
      const odCount = l.founder_openai_deepmind_alumni_count || 0;
      teamMap[name].openai = teamMap[name].openai || odCount >= 1;
      teamMap[name].deepmind = teamMap[name].deepmind || odCount >= 2;
      if (!teamMap[name].labs.find(x => x.slug === l.slug)) {
        teamMap[name].labs.push({ slug: l.slug, name: l.name, role: l.category, valuation: l.valuation_billion_usd });
      }
    });
  });
  
  const teams = Object.values(teamMap)
    .filter(t => t.labs.length > 0)
    .sort((a, b) => b.labs.length - a.labs.length)
    .slice(0, 30);
  
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8}}>👥 团队详情图谱</h1>
      <p style={{color: '#6e6e73', marginBottom: 16}}>25 家 Neo Labs 背后的关键人物 · 跨机构人脉网络</p>
      
      <div className="kpi-strip">
        <div className="kpi"><div className="label">总人物数</div><div className="value">{teams.length}</div></div>
        <div className="kpi"><div className="label">最活跃创始人</div><div className="value">{teams[0]?.name || '—'}</div></div>
        <div className="kpi"><div className="label">OD 校友人物</div><div className="value">{teams.filter(t => t.openai || t.deepmind).length}</div></div>
        <div className="kpi"><div className="label">人物平均涉及</div><div className="value">{(teams.reduce((s, t) => s + t.labs.length, 0) / Math.max(teams.length, 1)).toFixed(1)} 家</div></div>
      </div>
      
      <div className="section">
        <h2>👥 关键人物 (Top 30)</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>人物</th>
              <th>OpenAI</th>
              <th>DeepMind</th>
              <th>涉及实验室数</th>
              <th>代表标的</th>
              <th>触及估值</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={t.name}>
                <td>{i + 1}</td>
                <td><strong>{t.name}</strong></td>
                <td>{t.openai ? '✅' : '—'}</td>
                <td>{t.deepmind ? '✅' : '—'}</td>
                <td>{t.labs.length}</td>
                <td style={{fontSize: 11}}>
                  {t.labs.slice(0, 3).map(l => <Link key={l.slug} href={`/labs/${l.slug}`} style={{color: '#0071e3', marginRight: 4}}>{l.name}</Link>)}
                </td>
                <td>${t.labs.reduce((s, l) => s + (l.valuation || 0), 0).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
