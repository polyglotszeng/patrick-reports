# Hermes Pet — 3 flavors, same dashboard server

Three tiny floating "pets" that show your Hermes cron health at a glance:
**ok / err / human / inbox** KPIs from the v3 dashboard server, refreshed every
30 seconds. They share a common shape (240×120 floating bubble, dark background,
status-colored border, draggable, always-on-top) so you can pick the one that
fits your machine.

## Server contract (all 3 pets depend on this)

Each pet polls the **v3 dashboard server**:

```
GET http://127.0.0.1:7799/api/v3/cron
```

Expected JSON shape (subset used by the pet UI):

```json
{
  "total":           28,
  "ok":              17,
  "error":           9,
  "needs_human":     2,
  "inbox_unacked":   1,
  "generated_at":    "2026-07-10T05:55:00Z"
}
```

If the server is down or returns non-200, the pet shows `—` in every tile,
turns the border **gray**, and renders `server :7799 down (<reason>)` in the
footer. No crashes, no retries backoff storms — just one fetch every 30s.

## Pick your pet

| Flavor | File | Best on | Launch |
|---|---|---|---|
| **A. Swift** | `pet_swift.swift` | macOS native (Apple Silicon / Intel) | `swiftc -O -parse-as-library pet_swift.swift -o pet_swift -framework SwiftUI -framework AppKit && ./pet_swift` |
| **B. Web**   | `pet_web.html`   | Any browser (Chrome/Safari/Firefox/Edge), works on any OS | Open the file in your browser, or host it from the dashboard server |
| **C. Python**| `pet_python.py`  | Any OS with Python 3.7+ and Tk (preinstalled on macOS; Windows ships Tk; Linux usually has it via `python3-tk`) | `python3 pet_python.py` |

All three read the **same** endpoint and render **the same** KPI tiles, so
cross-testing numbers is straightforward (see "Verify" below).

## Visual contract

```
┌──────────────────────────────────┐  ← 240×~110, dark bubble, 2px status border
│ 🐾 Hermes Pet                  ↻ │
│ ┌────┬────┬────┬────┐             │
│ │ 17 │  9 │  2 │  1 │  ← 4 KPI   │
│ │ ok │err │humn│inbox│   tiles    │
│ └────┴────┴────┴────┘             │
│ sync 12s ago · total 28            │  ← footer (or server-down reason)
└──────────────────────────────────┘
```

Border color rules (all 3 pets):
- **green** — server reachable, no errors, no human-pending
- **red**   — at least one cron in error state
- **orange** — server reachable but ≥1 cron needs human action
- **gray**  — server unreachable

Emoji rules:
- `✅` green / `🚨` red / `⚠️` orange / `😴` gray

## Interactions (all 3 pets)

- **Drag** — click anywhere on the bubble and drag to reposition
- **Right-click** — context menu (Refresh / Hide / Quit)
- **Click ↻** — force an immediate refresh (Web pet)

## Verify (cross-test)

With the dashboard server running on `:7799`:

```bash
# 1. Confirm the endpoint returns what the pets expect
curl -s http://127.0.0.1:7799/api/v3/cron | python3 -m json.tool

# 2. Launch each pet (in separate terminals / windows) and check that all 3
#    display the same 4 numbers.
swiftc -O -parse-as-library pet_swift.swift -o /tmp/pet_swift -framework SwiftUI -framework AppKit && /tmp/pet_swift &
python3 pet_python.py &
open pet_web.html
```

If the numbers diverge, the cause is almost always **timing** (the 30s refresh
windows don't align). Wait one full minute and re-check — they should converge.

## Common pitfalls (read these before filing a bug)

1. **Server not on :7799** — the v3 server defaults to port 7799. If you moved
   it, change `ENDPOINT` / `URL` / `url` at the top of each pet's source file.
2. **macOS Safari blocks `fetch` from `file://`** — open `pet_web.html` over
   HTTP (e.g. `python3 -m http.server` in this dir) or from the dashboard
   server. Chrome and Firefox are more permissive.
3. **Swift compile fails on Linux** — Swift pet is macOS-only (uses SwiftUI +
   AppKit). Use the Python or Web pet on Linux.
4. **Python pet blank on Linux without Tk** — install `python3-tk` (Debian /
   Ubuntu) or `python3-tkinter` (Fedora / RHEL) via your package manager.
5. **Browser DevTools shows CORS errors** — the v3 server allows
   `Access-Control-Allow-Origin: *` on `/api/v3/*` by default. If you added a
   reverse proxy in front, make sure CORS headers pass through.

## Layout

```
pets/
├── README.md       ← you are here
├── pet_swift.swift ← macOS native (SwiftUI floating NSPanel)
├── pet_web.html    ← any browser, transparent draggable bubble
└── pet_python.py   ← any OS with Python 3 + Tk
```