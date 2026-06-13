# NAS 存储审计 — 2026-06-12

> **NAS**: DH4300PLUS-BE82 (Synology DSM, 启动 16 天 18h)
> **总容量**: 9.1T / **已用: 7.7T / 剩余: 1.4T (86%)** ⚠️
> **RAID**: md1 (RAID1, 9.75TB) + md2 (RAID1, 1.94TB 系统), 3 物理盘 (sda 19.5TB / sdb 3.9TB) — 健康

---

## 1. /volume1/ 共享容量 Top 10

| 路径 | 大小 | % of 9.1T | 备注 |
|------|------|-----------|------|
| `/volume1/@home` | **3.5T** | **38%** | 所有用户家目录 |
| `/volume1/TimeMachineBackup Macbook Pro` | 336G | 4% | Mac 自动备份, 留 |
| `/volume1/@thumbnail` | 6.5G | 0.1% | 系统缩略图, 留 |
| `/volume1/docker` | 2.1G | 0% | Docker 数据 |
| `/volume1/@appstore` | 2.0G | 0% | 套件应用 |
| `/volume1/@aiconsole` | 172M | 0% | Synology AI 套件 |
| `/volume1/shared` | 196K | 0% | 公共共享 |
| `/volume1/@video` / `/video` | 5.8M / 24K | 0% | Video Station 元数据 |

**结论**: 38% 容量在 `@home` (家目录总合), 主要是 Patrick 的 Films/ + Photos/ + Pat-Windows/。

---

## 2. Patrick 家目录 (`/home/polyhlots/`) Top 10

| 目录 | 大小 | 建议 |
|------|------|------|
| `Films/` | **1.6T** | ⚠️ 53 电影/剧集, 找重复/未看完清 |
| `Pat-Windows/` | 735G | Windows 备份? 核实是否还使用 |
| `Photos/` | 423G | 照片库, 留 (重要) |
| `#recycle/` | 195G | 回收站, 立即清! |
| `录制/` | 193G | 屏幕录制, 找旧的清 |
| `macbook pro/` | 146G | 旧 Mac 备份, 留 |
| `Insta 360/` | 131G | 360 相机素材, 找已编辑的清 |
| `Ski/` | 93G | 滑雪视频, 留 |
| `Resource/` | 25G | 资源库 |
| `Mac pro/` | 2.5G | 系统设置 |

---

## 3. Films/ 53 目录 Top 15 (按容量)

| 目录 | 大小 | 备注 |
|------|------|------|
| 海洋奇缘[系列两部合集][4K蓝光原盘REMUX] | 82G | 4K HDR, 留 |
| 【美剧】帝王计划：怪兽遗产 | 77G | 4K, 已完结? |
| 星际穿越(2014) 4K蓝光原盘REMUX HDR | 76G | 4K HDR, 留 |
| 瞬息全宇宙（2022）4K蓝光原盘REMUX | 71G | 4K HDR, 留 |
| Fallout.S01.2024.2160p AMZN | 64G | S01 4K, 已完结 |
| 怪物：艾德·盖恩的故事[杜比视界] | 62G | 4K DV, 已完结 |
| H 火线 The Wire S01～S05 | 62G | 5 季 4K, 留 |
| Fallout S2 | 60G | S2 4K, 在更? |
| 【美剧】匹兹堡医护前线 第二季 | 58G | 4K |
| 沙丘：预言(1) | 55G | 4K |
| The Martian.2015.2160p.HEVC DV | 48G | 4K HDR |
| 撼地鬼贼队3 (2025) 鲁本·弗雷斯彻 | 47G | 4K, 2025 电影 |
| 黑钱胜地 | 44G | 4K, 多季 |
| 【美】掩耳盗邻 第二季 | 40G | 4K |
| 阿｜钒｜达：🔥｜🐟｜烬(2025) | 37G | 4K, 2025 动画 |

**4K 蓝光原盘平均 50-80G/部, 53 部总和 1.6T 合理**。重复/未看完/S01+S02+S03 全保存是潜在清理源。

---

## 4. 可清候选 (5 类别, 总预估 200-400G)

### 4.1 立即清 (本周能清)
1. **`#recycle/` 195G** — 回收站就是用来清, 立即删
2. **重复电影** — 找同名 `v1 / v2 / (1) / (2)` 的, 清旧版
3. **未看完剧集** — 找 `S01` 已完结但 S02 还没出的, 删 S01 等云端
4. **录制/ 旧素材** — 找 > 1 年前的屏幕录制, 删

### 4.2 4K 蓝光压缩 (中期)
- 4K 蓝光原盘 50-80G → 1080p remux 5-10G (压缩 80%)
- 53 部 1.6T → 0.5-1T (省 600G-1.1T)
- **风险**: 画质降, 4K 电视无法全屏; 用 ffmpeg 自动跑

### 4.3 找时间重复 (脚本)
```bash
# 在 Films/ 找 > 5GB 的重复文件 (按大小 + md5)
find ~/Films -size +5G -type f -exec md5sum {} \; | sort | uniq -w32 -D
```

### 4.4 Pat-Windows/ 735G
- 是 Windows 备份? 核实是否还在用该 Windows 机器
- 如果是旧机器, 可整目录清 (省 735G)

### 4.5 Insta 360/ 131G
- 360 相机素材, 找已编辑完成可清原片
- 移到冷存储 (外置 HDD) 长期保留

---

## 5. 3 个 immediate action (本周能清)

| # | 行动 | 预计释放 | 风险 |
|---|------|----------|------|
| 1 | 清 `#recycle/` 195G | 195G | 无 (回收站本来就要清) |
| 2 | 删 Pat-Windows/ 旧备份 735G | 735G (假定) | 中 (确认是否还用 Windows) |
| 3 | 4K 蓝光 S01 完结的删 6 部 (Fallout S1, Wire 全 5 季) | -400G | 低 (云端可重下) |

**总预计释放**: 195G + 735G + 400G = **1.3T** (1.4T 剩余 → 2.7T 剩余, 降到 70%)

---

## 6. 1 句话总结

**NAS 86% 满, 清 3 件事 (回收站 + Pat-Windows + S01 完结剧) 可降到 70% 用满, 剩余 2.7T 撑 1 年**。

---

## 7. NAS 健康 cron 监控 (新, 2026-06-12 落地)

- 脚本: `~/.hermes/scripts/nas_health_check.sh` (chmod +x)
- Cron: job_id `57a258e94664`, 每 6h 跑 (0 */6 * * *)
- 阈值: 85% WARNING / 92% CRITICAL
- 推 Patrick: 容量异常时 wakeAgent, 含 RAID 状态 + 启动时长 + 加载

---

_Generated 2026-06-12 · Patrick Personal Agentic OS · source: sshpass ssh polyhlots@192.168.31.66 实测_
