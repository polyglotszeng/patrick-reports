// 客户端可用的纯函数（无 fs/node 依赖）
export function fmtUsd(n: number | null): string {
  if (n === null || n === undefined) return '—';
  return `$${n.toFixed(1)}亿`;
}

export function fmtPct(n: number | null): string {
  if (n === null || n === undefined) return '—';
  return `${n.toFixed(0)}%`;
}
