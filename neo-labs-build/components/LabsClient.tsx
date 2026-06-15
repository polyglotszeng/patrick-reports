'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Lab } from '@/lib/types';
import { fmtUsd } from '@/lib/format';

export function LabsClient({ labs, categories }: { labs: Lab[]; categories: string[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [list, setList] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Lab>('valuation_billion_usd');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [compareSet, setCompareSet] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = labs.filter(l => {
      if (search && !JSON.stringify(l).toLowerCase().includes(search.toLowerCase())) return false;
      if (category && l.category !== category) return false;
      if (status && l.status_emoji !== status) return false;
      if (list && l.list_section !== list) return false;
      if (openOnly && !l.open_source) return false;
      return true;
    });
    result.sort((a, b) => {
      const va = a[sortKey] ?? -1;
      const vb = b[sortKey] ?? -1;
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return result;
  }, [labs, search, category, status, list, openOnly, sortKey, sortDir]);

  function handleSort(key: keyof Lab) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function toggleCompare(slug: string) {
    const newSet = new Set(compareSet);
    if (newSet.has(slug)) newSet.delete(slug);
    else {
      if (newSet.size >= 3) { alert('最多 3 家'); return; }
      newSet.add(slug);
    }
    setCompareSet(newSet);
    if (typeof window !== 'undefined') {
      localStorage.setItem('neo-labs-compare', JSON.stringify([...newSet]));
    }
  }

  return (
    <>
      {/* 筛选 */}
      <div className="filters">
        <label>🔍</label>
        <input type="text" placeholder="搜索名称/创始人/赛道" value={search} onChange={e => setSearch(e.target.value)} style={{flex: 1, minWidth: 200}} />
        <label>赛道</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">全部</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <label>状态</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">全部</option>
          <option value="✅">✅ 产品</option>
          <option value="🔬">🔬 研究</option>
          <option value="🤝">🤝 客户</option>
        </select>
        <label>列表</label>
        <select value={list} onChange={e => setList(e.target.value)}>
          <option value="">全部</option>
          <option value="main">主榜</option>
          <option value="watchlist">Watchlist</option>
        </select>
        <label><input type="checkbox" checked={openOnly} onChange={e => setOpenOnly(e.target.checked)} /> 仅开源</label>
      </div>

      {/* 表格 */}
      <div className="section" style={{padding: 0, overflow: 'hidden'}}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('name')}>名称</th>
              <th onClick={() => handleSort('category')}>赛道</th>
              <th onClick={() => handleSort('founded_year')}>成立</th>
              <th onClick={() => handleSort('valuation_billion_usd')}>估值 $B</th>
              <th onClick={() => handleSort('total_funding_billion_usd')}>融资 $B</th>
              <th onClick={() => handleSort('commercialization_stage_score')}>阶段</th>
              <th onClick={() => handleSort('data_freshness_days')}>新鲜度</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.slug} style={{background: compareSet.has(l.slug) ? '#fff7e0' : ''}}>
                <td>{l.rank}</td>
                <td>
                  <Link href={`/labs/${l.slug}`}><strong>{l.name}</strong></Link>
                  {l.list_section === 'watchlist' && <span className="pill warn" style={{marginLeft: 6}}>W</span>}
                  <br />
                  <small style={{color: '#6e6e73', fontSize: 11}}>{l.hq}</small>
                </td>
                <td><span className="pill">{l.category}</span></td>
                <td>{l.founded_year}</td>
                <td><strong>{fmtUsd(l.valuation_billion_usd)}</strong></td>
                <td>{fmtUsd(l.total_funding_billion_usd)}</td>
                <td>S{l.commercialization_stage_score}</td>
                <td><span className={`pill ${l.data_freshness_days > 365 ? 'danger' : l.data_freshness_days > 180 ? 'warn' : 'good'}`}>{l.data_freshness_days}天</span></td>
                <td style={{fontSize: 16}}>{l.status_emoji}</td>
                <td>
                  <button onClick={() => toggleCompare(l.slug)} className="btn" style={{fontSize: 11, padding: '4px 8px', background: compareSet.has(l.slug) ? '#137333' : '#fff', color: compareSet.has(l.slug) ? '#fff' : 'inherit'}}>
                    ⚖️ {compareSet.has(l.slug) ? '已选' : '对比'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{padding: 40, textAlign: 'center', color: '#6e6e73'}}>
            没有匹配的实验室
          </div>
        )}
      </div>

      {/* 对比浮动条 */}
      {compareSet.size > 0 && (
        <div className="compare-bar">
          <span>已选 <strong>{compareSet.size}</strong>/3 家对比</span>
          <div>
            <button onClick={() => setCompareSet(new Set())} style={{background: 'transparent', color: '#999'}}>清空</button>
            <Link href={`/compare?ids=${[...compareSet].join(',')}`}>
              <button className="go">⚖️ 查看对比</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
