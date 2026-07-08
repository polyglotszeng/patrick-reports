# Meta-audit Report — fable5-karpathy-llm-wiki-dashboard.html

**Generated:** 2026-07-05 00:07:50  
**Source dashboard:** /Users/zl/patricks-reports/public-deploy/fable5-karpathy-llm-wiki-dashboard.html  
**Heuristic version:** meta_audit.py v1.0.0 (5-rule framing-bias check)  
**Cards audited:** 7

## Aggregate framing-bias score

**7.1 / 10** (healthy ≥ 7.0)

✅ **Aggregate above threshold** — heuristic pass; optional `dual_ai_review.sh` for second-opinion.

## Per-card scores

| # | Title | Score | Verdict | Notes |
|---|---|---|---|---|
| 1 | ✅ research/llm-wiki — 7 hours build 是 best case,不是 median | 8.0 | pass | +2 timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |
| 2 | ✅ media/video-to-knowledge-dashboard — Long-video mode v1.5.24 added (Tier 4 clo | 6.0 | rewrite | 0 no timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |
| 3 | ✅ agentic-os/llm-protocol-router — Meta-router fallback v1.0.0 added (Tier 4 clo | 8.0 | pass | +2 timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |
| 4 | ✅ meta/how-to-sell — Source credibility prerequisite v1.0.0 added (Tier 4 closed | 6.0 | rewrite | 0 no timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |
| 5 | ✅ autonomous-ai-agents/fable-vs-hermes-capability-gap — Fable 5 = "markdown-lock | 8.0 | pass | +2 timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |
| 6 | ✅ knowledge-synthesis/graphify — Edge confidence scoring v1.3.0 added (Tier 4 cl | 8.0 | pass | +2 timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |
| 7 | ✅ media/video-bidirectional-mapping — Meta-audit v1.1.0 added (Tier 4 closed, re | 6.0 | rewrite | 0 no timestamp quote; 0 no neutral phrasing marker; +2 canonical bottom label (→ Insight) |

## Cards needing rewrite (< 7.0)

### Rewrite 1: ✅ media/video-to-knowledge-dashboard — Long-video mode v1.5.24 added (Tier 4 closed)
**Score:** 6.0 / 10
**Notes:**
  - 0 no timestamp quote
  - 0 no neutral phrasing marker
  - +2 canonical bottom label (→ Insight)
  - +2 source anchor present
  - +2 no emotional ALL-CAPS
**Suggested fix:** Rewrite using neutral phrasing; add timestamp quote; include canonical bottom label.

### Rewrite 2: ✅ meta/how-to-sell — Source credibility prerequisite v1.0.0 added (Tier 4 closed)
**Score:** 6.0 / 10
**Notes:**
  - 0 no timestamp quote
  - 0 no neutral phrasing marker
  - +2 canonical bottom label (→ Insight)
  - +2 source anchor present
  - +2 no emotional ALL-CAPS
**Suggested fix:** Rewrite using neutral phrasing; add timestamp quote; include canonical bottom label.

### Rewrite 3: ✅ media/video-bidirectional-mapping — Meta-audit v1.1.0 added (Tier 4 closed, recursive self-critique solved)
**Score:** 6.0 / 10
**Notes:**
  - 0 no timestamp quote
  - 0 no neutral phrasing marker
  - +2 canonical bottom label (→ Insight)
  - +2 source anchor present
  - +2 no emotional ALL-CAPS
**Suggested fix:** Rewrite using neutral phrasing; add timestamp quote; include canonical bottom label.

## How to verify (dual-ai peer review)

Run this on the report to add Gemini's verification:

```bash
~/.hermes/scripts/dual_ai_review.sh fable5-karpathy-llm-wiki-dashboard.meta-audit-report.md
```

Gemini will verify the heuristic scores independently. If aggregate stays ≥ 7.0 after both passes, Tier 4 is publishable.