#!/usr/bin/env python3
"""
Build the new daily-reports.html from openswarm-redesign.html template +
real reports.json data.

Key features:
  - SSG: archive list, heatmap, stats, track counts, featured cards
    all rendered server-side (visible without JS).
  - JS-only features: search filter, chip filter, terminal typing effect.
  - Responsive: 900px / 760px / 640px / 600px breakpoints.
  - All 215 records inlined (no fetch).

Outputs: public-deploy/daily-reports.html (replaces existing).
"""
import json
import re
import html
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter, defaultdict

ROOT = Path("/Users/zl/patricks-reports")
TEMPLATE = Path("/Users/zl/Downloads/files/openswarm-redesign.html")
REPORTS = ROOT / "public-deploy" / "reports.json"
OUT = ROOT / "public-deploy" / "daily-reports.html"

# ---- Load data ----
records = json.loads(REPORTS.read_text())
# Filter out records without date or with junk dates
records = [r for r in records if r.get("date") and r["date"] not in ("2025", "2025-01-01") and re.match(r"\d{4}-\d{2}-\d{2}", r["date"])]
records.sort(key=lambda r: r["date"], reverse=True)
print(f"[load] {len(records)} records with valid date")

# ---- Track counts (live from data) ----
TRACKS = [
    ("brief",  "投资简报 / Ops",  "◆", "var(--brief)",  "cron 状态、agent 审计、投资人向内容。"),
    ("papers", "论文速览",        "▤", "var(--papers)", "arXiv 论文速读笔记（World Model / VLA 方向为主）。"),
    ("video",  "视频精读",        "▶", "var(--video)",  "YouTube / 播客 / 主题演讲的结构化笔记。"),
    ("quant",  "量化实验室",      "∿", "var(--quant)",  "回测、regime 模型、NQ100 策略仪表板。"),
    ("radar",  "AI 热点雷达",     "◎", "var(--radar)",  "HN + GitHub + arXiv 三源打分，每日自动生成。"),
    ("other",  "硬件 & 生活",     "✺", "var(--other)",  "硬件测评、个人项目、跨界内容。"),
]
counts = Counter(r.get("track", "brief") for r in records)

# ---- Stats ----
total = len(records)
dates = [r["date"] for r in records]
date_counts = Counter(dates)
max_day = max(date_counts.items(), key=lambda x: x[1])
window_days = (datetime.fromisoformat(max(dates)) - datetime.fromisoformat(min(dates))).days + 1
stats = {
    "total": total,
    "tracks": len(TRACKS),
    "maxDay": max_day[1],
    "maxDayDate": max_day[0],
    "windowDays": window_days,
}

# ---- Heatmap data: 71-day window ending today (or last record date) ----
last_date = datetime.fromisoformat(max(dates))
heatmap_start = last_date - timedelta(days=window_days - 1)
# Build cell list: 7 rows × N cols, one cell per day
heat_cells = []
cur = heatmap_start
while cur <= last_date:
    d_str = cur.strftime("%Y-%m-%d")
    heat_cells.append((d_str, date_counts.get(d_str, 0)))
    cur += timedelta(days=1)
max_count = max(c for _, c in heat_cells) or 1

# ---- Featured: hand-picked 4 records for hero digest ----
# Choose representative per track (highest quality signal)

# Better: use the prototype's featured items verbatim
PROTOTYPE_FEATURED = [
    ("brief",  "SpaceX IPO 解析",         "把 47 页招股书压成 10 分钟决策框架,含 5 类投资人 × 5 价位区间的买入表。", "展示 agent 做<b>严肃金融分析</b>的能力上限,而不是又一篇资讯摘要。"),
    ("brief",  "Cron 快照",                "4 状态色码 + 90 天 stale 检测,实时展示自动化任务是否真的在跑。",           "是\"<b>持续运行</b>\"这句话的可核验证据,而不是一句承诺。"),
    ("radar",  "AI 热门追踪",              "HN + GitHub + arXiv 三源打分聚合,每日 08:00 自动生成。",                    "暴露的是<b>筛选品味</b>,不只是抓取能力——这是能不能持续产生价值的关键。"),
    ("papers", "Mirage",                    "World Model 用 Latent Spatial Memory 让智能体保持长时空间一致性。",          "代表性论文笔记,能看出 agent <b>论文速读的解读深度</b>,而非纯摘要转述。"),
]
# Find these in records: prefer full-phrase match, fall back to startswith
def find_rec(track, phrase):
    # Priority 1: track matches AND full phrase in title
    cand = [r for r in records if r.get("track") == track and phrase.lower() in r.get("title", "").lower()]
    if cand:
        # If multiple, prefer longer title (more detail) or more recent
        cand.sort(key=lambda r: (len(r.get("title","")), r.get("date","")), reverse=True)
        return cand[0]
    # Priority 2: track matches AND title starts with phrase[:8]
    cand = [r for r in records if r.get("track") == track and r.get("title", "").lower().startswith(phrase.lower()[:8])]
    if cand:
        cand.sort(key=lambda r: r.get("date",""), reverse=True)
        return cand[0]
    # Priority 3: any record matching phrase
    cand = [r for r in records if phrase.lower() in r.get("title","").lower()]
    if cand:
        return cand[0]
    return None
featured_cards = []
for track, title_prefix, desc, why in PROTOTYPE_FEATURED:
    rec = find_rec(track, title_prefix)
    if rec:
        featured_cards.append({
            "track": track,
            "title": rec.get("title"),
            "desc": desc,
            "why": why,
            "file": rec.get("file"),
            "date": rec.get("date"),
        })
    else:
        featured_cards.append(None)
# Fallback if any unmatched → pick top recent from that track
for i, fc in enumerate(featured_cards):
    if fc is None:
        track_id = PROTOTYPE_FEATURED[i][0]
        pool = [r for r in records if r.get("track") == track_id]
        if pool:
            r = pool[0]
            featured_cards[i] = {
                "track": track_id, "title": r["title"], "desc": PROTOTYPE_FEATURED[i][2],
                "why": PROTOTYPE_FEATURED[i][3], "file": r["file"], "date": r["date"]
            }
print(f"[featured] built {sum(1 for c in featured_cards if c)} cards")

# ---- Build HTML ----
# Take the prototype CSS exactly, but inject the inline data + full archive list
# Strategy: edit openswarm-redesign.html minimally:
#   - replace hardcoded ARCHIVE/HEAT/DIGEST/COUNTS/TRACKS with __DATA__
#   - replace archive list with pre-rendered rows (so no-JS works)
#   - add a script that rehydrates interactivity
template = TEMPLATE.read_text()

# 1. Replace const ARCHIVE = [...] with JSON of all records
archive_json = json.dumps([[r["date"], r["title"], r.get("track","brief"), r.get("file","")] for r in records], ensure_ascii=False)
template = re.sub(r"const ARCHIVE = \[.*?\n\];", f"const ARCHIVE = {archive_json};", template, count=1, flags=re.DOTALL)

# 2. Replace const HEAT = [...]
heat_json = json.dumps([[d, c] for d, c in heat_cells], ensure_ascii=False)
template = re.sub(r"const HEAT = \[.*?\n\];", f"const HEAT = {heat_json};", template, count=1, flags=re.DOTALL)

# 3. Replace const COUNTS = {...} with live counts
counts_obj = {tid: counts.get(tid, 0) for tid, _, _, _, _ in TRACKS}
template = re.sub(r"const COUNTS = \{[^}]+\};", f"const COUNTS = {json.dumps(counts_obj)};", template, count=1)

# 4. Replace const DIGEST = [...] with featured cards (more useful: real titles + dates)
digest_cards = []
for fc in featured_cards:
    track = next(t for t in TRACKS if t[0] == fc["track"])
    digest_cards.append({
        "k": fc["track"],
        "title": fc["title"],
        "desc": fc["desc"],
        "why": fc["why"],
        "date": fc["date"],
        "file": fc["file"],
    })
template = re.sub(r"const DIGEST = \[.*?\n\];", f"const DIGEST = {json.dumps(digest_cards, ensure_ascii=False)};", template, count=1, flags=re.DOTALL)

# 5. Update TRACKS with current counts (they're already in the HTML structure; we just update render code)
# The prototype's render code uses COUNTS[t.id] which we replaced above. Good.

# 6. Replace hero stats (201 / 6 / 32 / 71) with live values
template = template.replace(
    '<div class="stat"><b>201</b><span>累计产出（本抽样）</span></div>',
    f'<div class="stat"><b>{stats["total"]}</b><span>累计产出（真实数据）</span></div>'
)
template = template.replace(
    '<div class="stat"><b>6</b><span>内容产线</span></div>',
    f'<div class="stat"><b>{stats["tracks"]}</b><span>内容产线</span></div>'
)
template = template.replace(
    '<div class="stat"><b>32</b><span>单日最高产出（06-22）</span></div>',
    f'<div class="stat"><b>{stats["maxDay"]}</b><span>单日最高产出（{stats["maxDayDate"]}）</span></div>'
)
template = template.replace(
    '<div class="stat"><b>71</b><span>天窗口 · 真实节奏</span></div>',
    f'<div class="stat"><b>{stats["windowDays"]}</b><span>天窗口 · 真实节奏</span></div>'
)

# 7. Add a noscript + pre-rendered archive fallback for SSG (no-JS users see the list)
# Build pre-rendered archive list HTML
# ---- Resolve real file location (root vs daily-reports/ vs youtube/ etc) ----
# Bugfix 2026-07-03: 原版硬编码 href="reports/{file}" 但 public-deploy/reports/
# 目录不存在,导致所有 215 个 archive 链接全部 404。正确做法:按 file 实际
# 位置定位 (162 在 root, 56 在 daily-reports/, 1 在 worldmonitor/)。
SEARCH_DIRS = [
    ("", OUT.parent),                           # root (parent of public-deploy/daily-reports.html)
    ("daily-reports/", OUT.parent/"daily-reports"),
    ("youtube/", OUT.parent/"youtube"),
    ("ai-trending/", OUT.parent/"ai-trending"),
    ("hardtech/", OUT.parent/"hardtech"),
    ("notebooklm/", OUT.parent/"notebooklm"),
    ("agentic-os/", OUT.parent/"agentic-os"),
    ("papers/", OUT.parent/"papers"),
    ("worldmonitor/", OUT.parent/"worldmonitor"),
    ("world-model/", OUT.parent/"world-model"),
    ("xjb-public/", OUT.parent/"xjb-public"),
]

def resolve_archive_href(filename: str) -> str:
    """Return a root-relative public URL that exists in the deploy bundle."""
    if not filename:
        return "#"
    raw = filename.lstrip("/")
    bases = [raw]
    if raw.startswith("daily-reports/"):
        bases.append(raw[len("daily-reports/"):])

    candidates = []
    for base in bases:
        if not base:
            continue
        candidates.append(base)
        if not base.endswith(".html"):
            candidates.append(base + ".html")
        if base.endswith(".html"):
            candidates.append(base[:-5])
        candidates.append(re.sub(r"/index\.html$", "", base) + "/index.html")

    seen = set()
    candidates = [c for c in candidates if not (c in seen or seen.add(c))]
    for prefix, d in SEARCH_DIRS:
        if d.exists():
            for c in candidates:
                p = d / c
                if p.exists():
                    if p.is_dir() and (p / "index.html").exists():
                        return "/" + (prefix + c).rstrip("/") + "/"
                    return "/" + prefix + c
    return "/" + raw

archive_rows_html = []
for r in records:
    track_id = r.get("track", "brief")
    color_var = f"var(--{track_id})"
    safe_title = html.escape(r.get("title", ""))
    safe_file = html.escape(r.get("file", ""))
    real_href = resolve_archive_href(safe_file)
    archive_rows_html.append(
        f'<div class="arow ssg-row" style="--k:{color_var}" data-track="{track_id}" data-title="{html.escape(r.get("title",""))}">'
        f'<span class="date">{r.get("date","")}</span>'
        f'<span class="dot"></span>'
        f'<span class="ttl"><a href="{html.escape(real_href)}">{safe_title}</a></span>'
        f'<span class="tk">{track_id}</span></div>'
    )
ssg_archive = "\n".join(archive_rows_html)

# Inject SSG archive + count note right after <div id="archiveList">
ssg_block = (
    f'\n<noscript><style>#archiveList:empty{{display:none}}.ssg-fallback{{display:block !important}}</style></noscript>\n'
    f'<div class="ssg-fallback" id="ssgArchive">{ssg_archive}</div>'
)
template = template.replace(
    '<div id="archiveList"></div>',
    f'<div id="archiveList">{ssg_archive}</div>'
)

# 8. Update the count-note initial text (it'll be overwritten by JS, but visible without JS)
template = template.replace(
    '<p class="count-note" id="countNote"></p>',
    f'<p class="count-note" id="countNote">显示 {total} / {total} 篇（按日期倒序 · 按产线分组）</p>'
)

# 9. Update the hero subtitle and review note: clarify this is the LIVE page, not proposal
template = template.replace(
    '<div class="review-note">这是一份设计提案 / 演示原型 · 数据来自 2017zyl.xyz 真实 reports.json 抽样重组 · 非官方页面</div>',
    '<div class="review-note">OpenSwarm · Daily Reports · ' + str(total) + ' 篇真实报告 · 按 6 条产线归档 · 每日更新</div>'
)

# 10. Update hero copy slightly (less "proposal", more "this is the live site")
template = template.replace(
    '<div class="eyebrow">REDESIGN PROPOSAL · INFORMATION ARCHITECTURE</div>',
    '<div class="eyebrow">DAILY REPORTS · INFORMATION ARCHITECTURE</div>'
)
template = template.replace(
    '<h1>201 篇产出不是一张列表，<br>是 <span>六条正在跑的产线</span>。</h1>',
    f'<h1>{total} 篇产出不是一张列表，<br>是 <span>六条正在跑的产线</span>。</h1>'
)
template = template.replace(
    '<button class="btn btn-ghost" onclick="document.getElementById(\'archive\').scrollIntoView()">浏览全部 201 篇</button>',
    f'<button class="btn btn-ghost" onclick="document.getElementById(\'archive\').scrollIntoView()">浏览全部 {total} 篇</button>'
)

# 11. Patch terminal lines to use real recent 10 records (instead of ARCHIVE.slice(0,10))
# The prototype's terminal effect uses ARCHIVE.slice(0,10) which IS our real data now → already works.

# 12. Add a no-JS fallback: when JS is disabled, archive list is already rendered.
# The count-note is also pre-filled.
# Hero terminal stays static (no animation without JS) — wrap the dynamic JS in a <script>.

# 13. Patch ARCHIVE list rendering to merge with SSG (so search/filter can hide pre-rendered rows)
# Add data-track to each row so search can filter without re-rendering
# Already added in step 7.

# 14. Replace ARCHIVE rendering JS to hide SSG rows on filter instead of rebuilding
# Simpler: keep prototype JS but ALSO hide SSG rows when filter/search is active
# Actually the prototype's renderArchive clears innerHTML → wipes SSG. Need to instead
# toggle visibility of pre-rendered rows.

js_patch = '''
// ---- SSG-aware filter (uses pre-rendered rows, no full re-render) ----
function applyFilter(){
  const q = document.getElementById('searchBox').value.trim().toLowerCase();
  const rows = document.querySelectorAll('#archiveList .arow');
  let visible = 0;
  rows.forEach(row => {
    const tk = row.dataset.track;
    const title = (row.dataset.title || '').toLowerCase();
    const matchFilter = currentFilter === 'all' || tk === currentFilter;
    const matchQuery = !q || title.includes(q);
    if (matchFilter && matchQuery) { row.style.display = ''; visible++; }
    else { row.style.display = 'none'; }
  });
  document.getElementById('countNote').textContent = `显示 ${visible} / ${rows.length} 篇（按日期倒序 · 按产线分组）`;
}
function setFilter(k){
  currentFilter = k;
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active', c.dataset.k===k));
  applyFilter();
}
document.querySelectorAll('.chip').forEach(c=> c.onclick = ()=> setFilter(c.dataset.k));
document.getElementById('searchBox').addEventListener('input', applyFilter);
document.addEventListener('keydown', e=>{
  if(e.key==='/' && document.activeElement.id!=='searchBox'){ e.preventDefault(); document.getElementById('searchBox').focus(); }
});
// Honor prefers-reduced-motion: skip terminal typing
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) typeLine();
else {
  // Static fallback: dump first 10 lines without animation
  termBody.innerHTML = '';
  ARCHIVE.slice(0,10).forEach(([date,title,k])=>{
    const t = trackOf(k);
    const div = document.createElement('div');
    div.className = 'ln';
    div.innerHTML = `[${date}] <span class="tag">${t.label}</span> ${title}`;
    termBody.appendChild(div);
  });
}
'''

# Replace the existing render logic block with the SSG-aware version
old_block_pattern = re.compile(
    r"// ---------- render archive ----------.*?if\(li >= termLines\.length\)\{ li = 0; termBody\.innerHTML=''; \}",
    re.DOTALL
)
# Find the old block and replace the filter wiring portion
# Bug fix 2026-07-03: previous regex used [^}]+ which fails on nested braces in
# the keydown listener (e.key==='/' body has its own {}). Silent failure led to
# the setFilter() referencing undefined applyFilter().
# Fix: use simple substring anchors + replace the whole block by literal text.
# Marker starts AT the OLD setFilter definition (so it's replaced, not duplicated).
old_listener_block_marker_start = "function setFilter(k){\n  currentFilter = k;"
old_listener_block_marker_end = "renderArchive();\n\n// ---------- terminal typing effect ----------"
start_idx = template.find(old_listener_block_marker_start)
end_idx = template.find(old_listener_block_marker_end, start_idx)
if start_idx != -1 and end_idx != -1:
    # Replace from start_idx to end_idx (inclusive of trailing \n) with the new JS
    template = template[:start_idx] + js_patch.strip() + "\n\n// ---------- terminal typing effect ----------" + template[end_idx + len(old_listener_block_marker_end):]
    print(f"[fix] Replaced prototype filter wiring at offset {start_idx}-{end_idx} ({end_idx - start_idx} chars)")
else:
    print(f"[warn] Could not find filter wiring block (start={start_idx}, end={end_idx})")
    print(f"  start_idx in template: {start_idx}")
    print(f"  end_idx in template: {end_idx}")

# Honor prefers-reduced-motion: also gate the .dot pulse animation
template = template.replace(
    "<style>",
    "<style>\n@media (prefers-reduced-motion: reduce) { .logo .dot, .cursor { animation: none !important; } }\n",
    1
)

template = re.sub(
    r"countNote\.textContent = `显示 \$\{rows\.length\} / \$\{ARCHIVE\.length\} 篇[^`]*`;",
    "countNote.textContent = `显示 ${rows.length} / ${ARCHIVE.length} 篇（按日期倒序 · 按产线分组 · 实时同步 reports.json）`;",
    template, count=1
)

# 14b. Restore the "精选项目" project showcase section (Patrick's "must keep" - 7 fcards)
FEATURED_PROJECTS_HTML = '''
<section class="projects-section">
  <div class="wrap">
    <div class="sec-label">⭐ FEATURED PROJECTS / 精选项目</div>
    <div class="featured">
      <a class="fcard" style="--c1:#c8714e;--c2:#d9a441" href="/xjb-public" title="新疆伊犁+北疆自驾 PWA · 6/30 上线 · 35 个 HTML 视频库 · 独库公路预警 · web push · 微信小程序 QR">
        <div class="ico">🏔️</div>
        <h4>新疆伊犁+北疆自驾 · 行程分享</h4>
        <p>PWA · 35 个 HTML 视频库 + 6 段路线族谱 · 独库预警 / 坦克300 / B 站 50 片 / 实时天气 · 14 个迭代版本 v8→v14</p>
        <span class="go">launch →</span>
      </a>
      <a class="fcard" style="--c1:#ff7a45;--c2:#ffb86c" href="/bench-dashboard-2026-06-12.html">
        <div class="ico">🔬</div>
        <h4>Router Bench 漂移检测</h4>
        <p>每周日 7:00 自动跑 · 4 task × 4 provider · 漂移检测 + 公网 HTML · Skill 跨过 253-skill top 10</p>
        <span class="go">launch →</span>
      </a>
      <a class="fcard" style="--c1:#4dd0e1;--c2:#5eead4" href="/spacex-ipo-investor-guide-2026-06-12.html">
        <div class="ico">🚀</div>
        <h4>SpaceX IPO 投资人指南</h4>
        <p>$135 价格贵不贵？5 类投资人 × 5 价位区间 · 何时买入 · 10 大漏洞 · 投资人 10 分钟决策</p>
        <span class="go">launch →</span>
      </a>
      <a class="fcard" style="--c1:#a78bfa;--c2:#4dd0e1" href="/cron-snapshot-2026-06-12.html">
        <div class="ico">📋</div>
        <h4>Cron 快照 — 41 个任务全状态</h4>
        <p>4 状态色码 (OK / 微信限流 / 真错 / 超时) · 实时搜索 · 按 schedule 分组 · 90+ 天 stale 检测</p>
        <span class="go">launch →</span>
      </a>
      <a class="fcard fcard-china" style="--c1:#8b5cf6;--c2:#4dd0e1" href="/worldmonitor/" title="世界监视器中文版 · 静态预览部署在 /worldmonitor/ 子路径 · 由于 Cloudflare Pages 不支持 Vercel Edge Functions, 实时数据面板显示加载中骨架, UI + 中文化 + 设计系统完整">
        <div class="ico">🌏</div>
        <h4>世界监视器 (中文版)</h4>
        <p>实时全球情报看板 · 中文版 · 35 个数据源 · 18 个中文 RSS · 20 个面板 · Pro 功能预览</p>
        <span class="go">launch →</span>
      </a>
      <a class="fcard" style="--c1:#5b8def;--c2:#b48cff" href="https://2017zyl.xyz/ai-trending/2026-06-30">
        <div class="ico">🤖</div>
        <h4>AI 热门追踪 · 2026-06-30</h4>
        <p>每日 08:00 cron · HN + GitHub + arXiv cs.AI · AI 关键词过滤 · dark theme · 5 维数据</p>
        <span class="go">launch →</span>
      </a>
    </div>
  </div>
</section>
'''

FCARD_CSS = '''
  /* FEATURED PROJECTS (re-added from prior version) */
  .sec-label{font-family:var(--mono); font-size:11px; color:var(--orange); letter-spacing:.15em; margin:0 0 14px; padding-bottom:8px; border-bottom:1px dashed var(--border);}
  .featured{display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:14px; margin-bottom:32px;}
  .fcard{position:relative;background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:18px;color:var(--txt);transition:all .25s ease;text-decoration:none;overflow:hidden;}
  .fcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c1,#666),var(--c2,#999));}
  .fcard:hover{transform:translateY(-3px);border-color:var(--border2);box-shadow:0 10px 30px #00000066;}
  .fcard .ico{font-size:26px;}
  .fcard h4{margin-top:10px;font-size:16px;}
  .fcard p{font-size:13px;color:var(--txt2);margin-top:6px;line-height:1.55;}
  .fcard .go{font-family:var(--mono);font-size:12px;color:var(--orange);margin-top:12px;display:inline-block;}
  .fcard:hover .go{text-decoration:underline;}
  .fcard-china::after{content:'静态预览版';position:absolute;top:10px;right:10px;font-family:var(--mono);font-size:10px;color:#a78bfa;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.4);border-radius:4px;padding:2px 8px;letter-spacing:.1em;}
  .fcard-china:hover::after{background:rgba(139,92,246,.28);color:#ddd6fe;}
'''

# Insert CSS right before </style>
template = template.replace("</style>", FCARD_CSS + "\n</style>", 1)

# Insert HTML right before <section id="digest">
template = template.replace('<section id="digest">', FEATURED_PROJECTS_HTML + '\n<section id="digest">', 1)

# 15. Write output
OUT.write_text(template)
print(f"[write] {OUT} ({OUT.stat().st_size} bytes)")

# Final summary
print(f"\nFinal stats:")
print(f"  Total records: {total}")
print(f"  Track counts: {dict(counts)}")
print(f"  Date range: {min(dates)} → {max(dates)} ({window_days} days)")
print(f"  Max single-day: {stats['maxDay']} on {stats['maxDayDate']}")
print(f"  Featured cards: {len(featured_cards)}")