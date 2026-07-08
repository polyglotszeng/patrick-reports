import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Neo Labs Tracker | 私募视角',
  description: '25 家前沿 AI 实验室数据平台 - 估值 / 融资 / 投资图谱 / 风险信号',
  keywords: 'AI, Neo Labs, 估值, 融资, 私募, 投资, OpenAI, Anthropic, DeepMind, 硅谷'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <nav className="navbar">
          <div className="nav-inner">
            <Link href="/" className="brand">🔬 Neo Labs Tracker</Link>
            <div className="nav-links">
              <Link href="/labs">实验室</Link>
              <Link href="/watchlist">Watchlist</Link>
              <Link href="/compare">对比</Link>
              <Link href="/portfolio">投资组合</Link>
              <Link href="/portfolio-heatmap">Heatmap</Link>
              <Link href="/quarterly">季度对比</Link>
              <Link href="/investors">投资人</Link>
              <Link href="/team">团队</Link>
              <Link href="/download">下载</Link>
              <Link href="/v3-snapshot" style={{ fontSize: '12px', opacity: 0.75 }} title="2026-06-13 旧版本快照 (备份)">📜 v3 快照</Link>
              <a href="https://github.com/polyglotszeng/patrick-reports" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </nav>
        <main className="main">{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <p>📊 私募视角 · 25 家前沿 AI 实验室 · 2026 H1 中期更新 (md 研究 · 25 家全量 patch + 2 新追踪)</p>
            <p>数据来源: 公开融资公告 + 公司官网 + TechCrunch + Crunchbase + Sacra</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
