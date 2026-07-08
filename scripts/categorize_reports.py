#!/usr/bin/env python3
"""
Apply category-remap-rules.json to reports.json, adding `track` field.
Output:
  - reports.json (updated with track/summary/featured)
  - track-spotcheck.txt (verification vs known_answers_for_spotcheck)
  - track-manual-review.txt (records matching rule 9 = MANUAL_REVIEW_QUEUE)
  - track-summary.json (track counts + breakdown)
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path("/Users/zl/patricks-reports")
RULES_PATH = Path("/Users/zl/Downloads/files/category-remap-rules.json")
REPORTS_PATH = ROOT / "public-deploy" / "reports.json"

def load_rules():
    raw = json.loads(RULES_PATH.read_text())
    rules = []
    for r in raw["rules"]:
        compiled = []
        for m in r["match_any"]:
            entry = dict(m)
            if "regex" in entry:
                entry["_re"] = re.compile(entry["regex"], re.IGNORECASE)
            compiled.append(entry)
        rules.append({"id": r["id"], "track": r["track"], "match_any": compiled})
    return rules, raw.get("fallback_track", "brief")

def field_value(field, rec):
    if field == "category":
        return rec.get("category", "")
    if field == "file":
        return rec.get("file", "")
    if field == "title_or_file":
        return (rec.get("title", "") or "") + " " + (rec.get("file", "") or "")
    if field == "title":
        return rec.get("title", "")
    return ""

def match_entry(entry, rec):
    f = entry["field"]
    val = field_value(f, rec) or ""
    if "equals" in entry:
        return val.strip().lower() == entry["equals"].strip().lower()
    if "regex" in entry:
        return bool(entry["_re"].search(val))
    return False

def classify(rec, rules):
    for r in rules:
        for entry in r["match_any"]:
            if match_entry(entry, rec):
                return r["track"], r["id"]
    return None, None  # caller handles fallback

def short_summary(title, existing_desc=""):
    """Truncate title for card preview; prefer existing desc if available."""
    t = title.strip()
    if len(t) > 60:
        return t[:57] + "..."
    return t

def main():
    rules, fallback = load_rules()
    reports = json.loads(REPORTS_PATH.read_text())
    print(f"[load] {len(reports)} records, {len(rules)} rules")

    out = []
    manual_queue = []
    rule_hits = Counter()
    track_counts = Counter()
    for rec in reports:
        track, rule_id = classify(rec, rules)
        if track is None:
            # Fallback rule: if category == 'papers' → MANUAL_REVIEW_QUEUE, else brief
            if (rec.get("category") or "").lower() == "papers":
                track = "MANUAL_REVIEW_QUEUE"
                manual_queue.append(rec)
            else:
                track = fallback
                rule_id = -1
        # Promote summary if missing
        new_rec = dict(rec)
        new_rec["track"] = track
        if not new_rec.get("summary"):
            new_rec["summary"] = short_summary(rec.get("title", ""))
        if "featured" not in new_rec:
            new_rec["featured"] = False
        out.append(new_rec)
        rule_hits[rule_id] += 1
        track_counts[track] += 1

    print("\n[rule hits]")
    for rid, n in sorted(rule_hits.items(), key=lambda x: (x[0] == -1, x[0])):
        print(f"  rule {rid}: {n}")

    print("\n[track counts]")
    for t, n in track_counts.most_common():
        print(f"  {t:25s} {n}")

    print(f"\n[manual review queue] {len(manual_queue)} records (category=='papers' but no papers/hardware/video rule matched)")

    # ---- Spot-check ----
    raw_rules = json.loads(RULES_PATH.read_text())
    spotcheck = raw_rules["known_answers_for_spotcheck"]
    by_file = {r.get("file", ""): r for r in out}
    spot_results = []
    print("\n[spotcheck]")
    all_pass = True
    for sp in spotcheck:
        f = sp["file"]
        expected = sp["expected_track"]
        got = by_file.get(f, {}).get("track", "MISSING")
        ok = got == expected
        all_pass = all_pass and ok
        mark = "✓" if ok else "✗"
        print(f"  {mark} {f:60s} expected={expected:20s} got={got}")
        spot_results.append({"file": f, "expected": expected, "got": got, "ok": ok})

    # ---- Write outputs ----
    # 1. Updated reports.json (preserve field order: title,file,date,category,track,...)
    field_order = ["title", "file", "date", "category", "track", "summary", "featured",
                   "tags", "added_at", "url", "source_url"]
    def reorder(r):
        return {k: r[k] for k in field_order if k in r}
    out_ordered = [reorder(r) for r in out]
    REPORTS_PATH.write_text(json.dumps(out_ordered, ensure_ascii=False, indent=2))
    print(f"\n[write] {REPORTS_PATH} ({len(out_ordered)} records)")

    # 2. Spotcheck results
    spot_path = ROOT / "track-spotcheck.txt"
    spot_path.write_text(
        f"Spotcheck {'PASS' if all_pass else 'FAIL'} — {sum(1 for s in spot_results if s['ok'])}/{len(spot_results)}\n\n" +
        "\n".join(f"{'✓' if s['ok'] else '✗'} {s['file']} expected={s['expected']} got={s['got']}" for s in spot_results)
    )
    print(f"[write] {spot_path}")

    # 3. Manual review queue
    mq_path = ROOT / "track-manual-review.txt"
    mq_path.write_text(
        f"# MANUAL_REVIEW_QUEUE — {len(manual_queue)} records\n"
        f"# category=='papers' but no arxiv/hardware/video regex matched.\n"
        f"# Per brief 3.2 rule 9, these need human eyeball.\n\n" +
        "\n".join(f"- {r.get('date','????-??-??')} | {r.get('title','')[:80]} | file={r.get('file','')}" for r in manual_queue)
    )
    print(f"[write] {mq_path}")

    # 4. Track summary
    sum_path = ROOT / "track-summary.json"
    sum_path.write_text(json.dumps({
        "total": len(out),
        "by_track": dict(track_counts),
        "by_rule": {str(k): v for k, v in rule_hits.items()},
        "spotcheck_pass": all_pass,
        "spotcheck_results": spot_results,
    }, ensure_ascii=False, indent=2))
    print(f"[write] {sum_path}")

    print("\n[DONE]" + (" ✓ all spotcheck pass" if all_pass else " ✗ spotcheck FAIL"))

if __name__ == "__main__":
    main()