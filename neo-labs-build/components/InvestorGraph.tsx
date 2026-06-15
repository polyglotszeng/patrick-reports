'use client';

import { Lab } from '@/lib/types';

export function InvestorGraph({ labs }: { labs: Lab[] }) {
  // 抓取 8 个最活跃投资人 + 25 家实验室
  const invKeywords = ['A16Z', 'Sequoia', 'NVIDIA', 'OpenAI', 'SoftBank', 'Microsoft', 'Amazon', 'Jeff Bezos', 'Thrive Capital', 'Lux Capital', 'CapitalG', 'Greenoaks', 'BlackRock', 'JPMorgan'];
  
  const investorSet: Record<string, { name: string; labs: string[] }> = {};
  labs.forEach(l => {
    const text = l.investment_highlights || '';
    invKeywords.forEach(kw => {
      if (text.includes(kw)) {
        if (!investorSet[kw]) investorSet[kw] = { name: kw, labs: [] };
        if (!investorSet[kw].labs.includes(l.name)) investorSet[kw].labs.push(l.name);
      }
    });
  });
  
  const topInvestors = Object.values(investorSet).sort((a, b) => b.labs.length - a.labs.length).slice(0, 12);
  const topLabs = labs.filter(l => l.list_section === 'main').sort((a, b) => (b.valuation_billion_usd || 0) - (a.valuation_billion_usd || 0)).slice(0, 12);
  
  // 简单表格图谱
  return (
    <div style={{overflowX: 'auto'}}>
      <table style={{fontSize: 11, minWidth: 800}}>
        <thead>
          <tr>
            <th style={{minWidth: 120}}>投资人 \ 实验室</th>
            {topLabs.map(l => (
              <th key={l.slug} style={{writingMode: 'vertical-rl', padding: 8, fontSize: 10, minWidth: 32}}>
                {l.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topInvestors.map(inv => (
            <tr key={inv.name}>
              <td style={{fontWeight: 700, fontSize: 12, padding: 6}}>{inv.name}</td>
              {topLabs.map(l => {
                const invested = inv.labs.includes(l.name);
                return (
                  <td key={l.slug} style={{
                    background: invested ? '#137333' : '#f0f0f0',
                    color: invested ? '#fff' : '#999',
                    textAlign: 'center',
                    fontWeight: invested ? 700 : 400,
                    padding: 4
                  }}>
                    {invested ? '✓' : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{fontSize: 11, color: '#6e6e73', marginTop: 8}}>🟢 = 投资人覆盖该实验室 | ⚪ = 未公开覆盖</p>
    </div>
  );
}
