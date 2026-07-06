# Rocket-Launch-DB · Auto-Deploy via GH Actions + CF Pages

Pipeline:

```
[GH Actions 03:17 UTC daily]  →  [git push origin main]  →  [CF Pages Git webhook]  →  [live https://2017zyl.xyz/rocket-launch-db/]
       (LL2 detailed + CelesTrak TLE                  (CF Pages "Connected to Git" auto-deploys)
        + pads/crew/agencies aggregation)
```

## One-time setup

### Step 1 — push this commit to main

```bash
cd /Users/zl/patricks-reports
git push origin main
```

If git asks for credentials (token expired), use a PAT:

```bash
git push https://x-access-token:$TOKEN@github.com/polyglotszeng/patrick-reports.git main
```

### Step 2 — verify CF Pages git webhook

1. https://dash.cloudflare.com/ → Workers & Pages → patrick-reports → Settings → Builds
2. Confirm "Connected to GitHub" → `polyglotszeng/patrick-reports` → branch `main`
3. Build command: empty (no Node build needed, `assets.directory: ./public-deploy` in `wrangler.jsonc`)
4. Output dir: `.` (root)
5. Save

### Step 3 — enable auto-update workflow

1. https://github.com/polyglotszeng/patrick-reports/settings/actions
2. "Allow all actions and reusable workflows" checked (default)
3. https://github.com/polyglotszeng/patrick-reports/actions
4. Find "Rocket-Launch-DB auto-update" workflow
5. "Run workflow" → mode `full` → Run
6. Watch the run (~8-12 min: 248 LL2 + Python aggregation + commit + push + CF Pages auto-deploy)

### Step 4 — verify cron scheduled

Yml: `cron: "17 3 * * *"` (03:17 UTC daily = 11:17 Beijing)

GH Actions → "Rocket-Launch-DB auto-update" → header shows "Next scheduled run".

## Files commited in commit `dd00b2c`

- `.github/workflows/rocket-launch-db-update.yml` (12.7KB · cron + workflow_dispatch + 8 steps)
- `public-deploy/rocket-launch-db/index.html` (~84KB single-page SPA, 9 tabs)
- `public-deploy/rocket-launch-db/manifest.json` (PWA manifest)
- `public-deploy/rocket-launch-db/sw.js` (service worker, stale-while-revalidate)
- `public-deploy/rocket-launch-db/data/launches.json` (248 LL2 detailed)
- `public-deploy/rocket-launch-db/data/celestrak-satellites.json` (146 TLE)
- `public-deploy/rocket-launch-db/data/pads.json` (30 rankings + 12 LL2 enriched)
- `public-deploy/rocket-launch-db/data/crew.json` (50 astronauts by flights_count)
- `public-deploy/rocket-launch-db/data/agencies.json` (50 agencies by total_launch_count)
- `public-deploy/rocket-launch-db/data/{timeline,stats,sources,objects}.json`

## Workflow modes (workflow_dispatch input)

- `full` — refresh all 4 data sources (LL2 + CelesTrak + pads/crew/agencies aggregation)
- `data-only` — skip LL2 launches fetch, only refresh derived files (useful when LL2 rate-limited)
- `dry-run` — build but do NOT commit / push

## Troubleshooting

### "GH Actions run failed (LL2 429 rate-limit)"

LL2 free API: 15 req/h. Our workflow uses ~6 LL2 requests per run (4 launches + 2 agencies) plus 42 slow fetched ones. If you hit a 429, the action falls back to "skip" for that endpoint and continues. Result: partial update (one of 4 derived files not refreshed), not a complete failure.

To force re-run: GH Actions → "Rocket-Launch-DB auto-update" → "Run workflow" → mode `full`.

### "Daily commit shows no changes"

That's expected. The Python aggregate step produces new `generated_at` timestamps but no row count change when there's no new launches (only 7-day recent window). The yml detects this via `git diff --staged --quiet` and silently skips the commit. The site still re-renders with the new timestamp.

### "CelesTrak TLE group changed / pulled 0 results"

CelesTrak occasionally renames a group (e.g. `stations` → `crewed-stations`). Run workflow with mode `data-only` to skip LL2 launches fetch and re-pull CelesTrak. Or, edit `data/celestrak-satellites.json` manually to use the new group name.

### "Watchlist empty after browser cache cleared"

Watchlist is localStorage-only. Clearing site data nukes it. That's by design (no PII collected server-side). The site prompts you to add manually each session.

## Local fallback (works without GH Actions)

```bash
bash ~/.hermes/scripts/rocket-launch-db-cron-watchdog.sh probe       # print freshness, exit 2 if stale > 32h
bash ~/.hermes/scripts/rocket-launch-db-cron-watchdog.sh build-local  # rebuild 248 LL2 + commit hint
```

Add to crontab for local daily refresh at 14:00 Beijing (06:00 UTC):

```bash
crontab -e
0 14 * * * bash /Users/zl/.hermes/scripts/rocket-launch-db-cron-watchdog.sh build-local
```

The local watchdog writes to `public-deploy/rocket-launch-db/data/*.json` but does NOT git-push. After local run, push manually:

```bash
cd /Users/zl/patricks-reports
git add public-deploy/rocket-launch-db/data/
git commit -m "data refresh (local)"
git push origin main
```

CF Pages still auto-deploys via git integration.
