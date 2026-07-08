# Rollback Needed — 2026-07-01 YouTube dashboards stuck in local repo

**Date**: 2026-07-01 09:04–09:14 (cron `cron-daily-video-dashboards-batch`)
**Status**: ⚠️ **Manual push required** — PAT scope blocker (NOT a code bug)

## What happened

A scheduled cron (video-dashboard batch push) ran the publish pipeline. It successfully
**built and copied** 2 dashboards to `~/patricks-reports/public-deploy/youtube/`:

| File                                | Source video (yt-dlp)              | Size         |
|-------------------------------------|------------------------------------|--------------|
| 2026-07-01-40ikbH0Ba-g.html         | Hermes Agent + Mixture of Agents — David Ondrej (2026-06-29) | 42.9 KB |
| 2026-07-01-SW3HzRV2Ztg.html         | Google DeepMind CEO: The Scariest Part Yet To Come — Neural Nutshell (2026-06-28) | 44.4 KB |
| youtube/index.html (rebuilt)        | —                                  | 11.2 KB      |

Also synced (carry-over from earlier cron):
- `public-deploy/ai-trending/2026-07-01.html` + index.html
- `public-deploy/daily-reports.html` (158→211 entry meta)

## Blocker

`git push origin main` was rejected with:

```
! [remote rejected] main -> main (refusing to allow a Personal Access Token to create
or update workflow `.github/workflows/cf-pages-deploy.yml` without `workflow` scope)
```

This is a **PAT scope constraint, not a code problem**. The PAT used by git in this
session is missing the `workflow` OAuth scope, so GitHub server-side enforces a
global push-rejection on any commit that changes a tracked workflow file (the
`.github/workflows/cf-pages-deploy.yml` checks for changes at pre-receive). All
branches (incl. fresh `feat/youtube-2026-07-01`) are rejected identically.

Last successful push was 2026-06-29 (commit `2778bb4 feat(youtube): +3 dashboards`).
Repo is now `ahead of 'origin/main' by 15 commits` — all 15 need a manual push.

## What the user needs to do (15-min fix)

1. Open https://github.com/settings/tokens (or wherever the PAT is stored)
2. Regenerate / edit the PAT used by `git push` from this Mac
3. **Add `workflow` scope** (or `repo` + `workflow` scopes together)
4. Run from terminal:
   ```bash
   cd ~/patricks-reports
   git push origin main
   ```
   (15 commits will go through; CF Pages auto-deploys 2026-07-01 dashboards in ~60-90s)

Alternatively, swap to SSH key (`~/.ssh/authorized_keys` exists but the deploy key
isn't installed on the repo):
```bash
# in ~/.gitconfig or remote-level:
[remote "origin"]
  url = git@github.com:polyglotszeng/patrick-reports.git
git remote set-url origin git@github.com:polyglotszeng/patrick-reports.git
```

## Cron-side fixes attempted (worked, kept for next run)

✅ `publish-youtube-dashboards.sh` ran end-to-end through stage 6b
✅ `scripts/sync-public-deploy.sh` ran and rsynced tracked files → public-deploy
✅ `git add public-deploy/youtube/` + `public-deploy/ai-trending/` + `daily-reports.html`
✅ Branch safety: side-branch `feat/youtube-2026-07-01` was deleted after confirming
   the scope rejection is global (no point keeping blocked work on a side branch)

❌ `git push origin main` — blocked by PAT `workflow` scope rejection

## Pipeline leak (SOP improvement)

`publish-youtube-dashboards.sh` previously assumed `git push` always succeeded.
In a host environment where the PAT scope can be limited (e.g. cron run in a
container running as a different user), the script will:
1. Successfully copy files to project root `youtube/`
2. Rebuild `youtube/index.html`
3. Reject at git push — but **leave files staged and rsync'd into public-deploy**

Future hardening (proposed, low-prio):

> ⚠ The script's stage 6 needs a `try / fallback to direct-wrangler deploy`
> branch — if `git push` fails, immediately invoke:
> `npx wrangler pages deploy ./public-deploy --project-name=patrick-reports --branch=main --commit-dirty=true`
>
> Requires either `CLOUDFLARE_API_TOKEN` env or a working `wrangler login`.
> Both are absent from this cron env (checked 2026-07-01 09:13).
> Adding them to the cron profile's env is the proper fix.

Also: the script does NOT call `scripts/sync-public-deploy.sh` between stages
4 and 6. The two dashboards were correctly copied to root `youtube/` but the
deploy bundle `public-deploy/youtube/` was only updated because the cron also
ran the sync manually. A real fix is to add `bash scripts/sync-public-deploy.sh`
inside the publish-youtube-dashboards.sh immediately after the index rebuild.

## Related files (all locally correct, awaiting push)

- `~/patricks-reports/public-deploy/youtube/2026-07-01-40ikbH0Ba-g.html`
- `~/patricks-reports/public-deploy/youtube/2026-07-01-SW3HzRV2Ztg.html`
- `~/patricks-reports/public-deploy/youtube/index.html`
- `~/patricks-reports/public-deploy/ai-trending/2026-07-01.html`
- `~/patricks-reports/public-deploy/ai-trending/index.html`
- `~/patricks-reports/public-deploy/daily-reports.html`

Public URLs (live after manual push):
- https://2017zyl.xyz/youtube/2026-07-01-40ikbH0Ba-g.html
- https://2017zyl.xyz/youtube/2026-07-01-SW3HzRV2Ztg.html
- https://2017zyl.xyz/youtube/  (rebuilt index, 48 entries)
