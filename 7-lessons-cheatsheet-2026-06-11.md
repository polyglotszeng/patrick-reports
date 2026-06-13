# 7 Lessons · 1-Page Cheat Sheet

> **Patrick Personal Agentic OS · 2026-06-11 GCP-1.1.0 Launch**
> 7 phase · 8 subagent · 24+ 份 artifact · 6 Gold Mine

**TL;DR**: 1 prompt (用 Gene+Capsule 协议结构化 238 skills) 触发 7 phase + 8 subagent + 24 份 artifact。本页 7 条 lesson 是这次 launch 复盘后留下的"肌肉记忆", 未来任何 protocol launch 都可复用。

---

| # | Lesson | 一句话 + 命令 |
|---|--------|--------------|
| 1 | **Cross-Subagent Verification** | 任何 subagent 报数字, 主线程 re-verify。Coverage 5/239 误报被 find 推翻真实 39/240。<br>`find ~/.hermes/skills -name "SKILL.md" -exec grep -l "^gene: " {} \; \| wc -l` |
| 2 | **Pre+Post-Audit Split** | Audit 拆 2 步: Pre-Audit 早发现 + Post-Audit 后校验。1 prompt 双跑拦截 4 大数据纠错。<br>`Step 6 Pre-Audit → Step 7 Launch → Step 8 Post-Audit + Calibrate` |
| 3 | **Self-Referential Consistency** | 全局文件必须满足自己定义的合规。Registry 自己没 author/license 触犯自己规则, 协议不向 registry 妥协。<br>`Pitfall 6: registry 必须自示范, 协议不向 registry 低头` |
| 4 | **YAML 风格铁律** | `gene: <id>` 带空格, YAML processor 解析可靠。18 文件统一, 0 残留无空格。<br>`# 错: gene:agentic-os  # 对: gene: agentic-os` |
| 5 | **Progressive Migration** | 每次新加 1 skill 加 1 字段, 不批量改 238。30 高频分批迁, 14 个半合规留 GCP-1.3.0 收尾。<br>`1 skill + 1 field 节奏, audit_gene_fields.py 扫批次` |
| 6 | **诚实标"未跑"** | 不编数据, subagent 主动报 "实验未跑 + 计划下次"。3 公司调研发现 Cognosys 已关停, Artisan $5M 非 $30M, 诚实标比编强 100 倍。<br>`宁可标 "未跑", 不编 "已成功"; 标 TODO = 真实信号` |
| 7 | **Calibrate 固化为协议第 8 步** | 任何 protocol launch 后必跑 calibrate, 写进协议作为最后一步。4-phase root cause 找 5 个 gap。<br>`Step 8 = Post-Audit + Calibrate 强制固化, 不可跳过` |

---

**何时复用**: 下次任何 protocol launch (GCP-1.2.0 / 新 Gene domain / 7 phase 之外的节奏) 都用这 7 条做 checklist。

**何时不要复用**: 简单单步操作 (1 subagent + 1 tool call) 不用这 7 条, 杀鸡用牛刀。

**Patrick 4 大 TELOS 对齐**: 1 (给家人更好生活) → 2 (持续被动收入) → 3 (极简主义) → 4 (好产品帮助更多人) — 7 条 lesson 都服务于这 4 个目标。

---

_Generated 2026-06-11 · Patrick Personal Agentic OS · source: 6-phase GCP-1.1.0 launch_
