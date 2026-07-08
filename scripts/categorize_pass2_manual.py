#!/usr/bin/env python3
"""
Second pass: human-judgment overrides for MANUAL_REVIEW_QUEUE records.
Modifies reports.json in-place.

Logic:
  1. Known hard-coded overrides from brief 3.3 + spotcheck
  2. Title-keyword override for clear papers / clear non-papers
  3. Everything else stays MANUAL_REVIEW_QUEUE
"""
import json
from pathlib import Path

REPORTS_PATH = Path("/Users/zl/patricks-reports/public-deploy/reports.json")

# ---- (1) Hard overrides from brief §3.3 spotcheck + personal judgment
HARD_OVERRIDES = {
    # Brief spotcheck explicit
    "数学练习-题目与图形.html": "other",
    "数学练习": "other",  # alias
    # Brief §3.3 explicit table
    "steelseries-nova-pro-omni-elite-2review.html": "other",
    "wwdc26-keynote-summary.html": "video",
    "apple-wwdc26-mlx-local-agentic-ai-v2.html": "video",
    "2606-09828-latent-spatial-memory-mirage.html": "papers",
    "spacex-ipo-investor-guide-2026-06-12.html": "brief",
    "cron-snapshot-2026-06-12.html": "brief",
    "exp14-regime-dashboard-v2.html": "quant",
    "all-in-2026-06-13.html": "video",
    # Apple WWDC family — clearly video summaries, not research papers
    "wwdc2026-debate-ak-peng-lin-yunfei-laodai.html": "video",
    # Old-naming papers (content is arXiv research, filename doesn't start with arxiv id)
    "papers-task-decomposition.html": "papers",
    "papers-enactive-ai.html": "papers",
    "papers-claude-code-dynamic-workflows.html": "papers",
    "papers-hermes-agent-6-use-cases.html": "papers",
    "world-model-2026-06-12.html": "papers",
    "continual-harness-princeton-ai-self-improvement.html": "papers",
    # Gemma-family / Google IO are video news, not research papers
    "google-io-2026-ai-news-matt-wolfe.html": "video",
    "nvidia-not-loser-abandoning-personal-computer-gamers-nexus.html": "video",
    "sequoia-ai-ascent-2026-keynote.html": "video",
    "microsoft-build-2025-keynote.html": "video",
    "ai-era-elite-education-reconstruction.html": "papers",
    "gary-chen-ai-agent-goal-function-tutorial.html": "video",
    # Research notes that are actually brief / commentary
    "annas-archive-research.html": "brief",
    # particle dynamics + VLA / world-model content = papers
    "particle-dynamics-model-real-world.html": "papers",
    # Claude Code 22-hacks MAT is an article on Claude Code (Agent工具链 brief territory)
    "claude-code-22-hacks-june-founder-mat.html": "brief",
    "anthropic-playbook-ai-startup-4stage.html": "brief",
    # Cyberpunk2077 is gaming hardware/lifestyle content
    "cyberpunk2077_summary.html": "other",
    "education_summary.html": "other",
}

def main():
    reports = json.loads(REPORTS_PATH.read_text())
    n_overridden = 0
    n_still_review = 0
    for rec in reports:
        if rec.get("track") != "MANUAL_REVIEW_QUEUE":
            continue
        f = rec.get("file", "")
        # Try exact match
        new_track = HARD_OVERRIDES.get(f)
        if new_track is None:
            # Try substring match for aliases (e.g. "数学练习-题目与图形.html" → "数学练习")
            for key, val in HARD_OVERRIDES.items():
                if key in f:
                    new_track = val
                    break
        if new_track:
            rec["track"] = new_track
            n_overridden += 1
        else:
            n_still_review += 1

    REPORTS_PATH.write_text(json.dumps(reports, ensure_ascii=False, indent=2))

    # Final track counts
    from collections import Counter
    c = Counter(r.get("track") for r in reports)
    print("[track counts after manual override]")
    for k, v in c.most_common():
        print(f"  {k:25s} {v}")
    print(f"\noverridden: {n_overridden}")
    print(f"still MANUAL_REVIEW_QUEUE: {n_still_review}")
    if n_still_review:
        print("\nstill in queue:")
        for rec in reports:
            if rec.get("track") == "MANUAL_REVIEW_QUEUE":
                print(f"  - {rec.get('date','????-??-??')} | {rec.get('file','')[:60]} | {rec.get('title','')[:60]}")

if __name__ == "__main__":
    main()