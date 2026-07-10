#!/usr/bin/env python3
"""pet_python.py — Cross-platform Python/Tkinter floating pet.
Reads http://127.0.0.1:7799/api/v3/cron every 30s, renders
4 KPI tiles + status color border. Always-on-top, draggable,
click-through when not dragged. stdlib only.

Run:    python3 pet_python.py
Stop:   click the X (or Ctrl+C in terminal)
"""

import json
import time
import urllib.request
import urllib.error
import tkinter as tk
from tkinter import font as tkfont
from threading import Thread

ENDPOINT = "http://127.0.0.1:7799/api/v3/cron"
REFRESH_MS = 30_000

# --- Data fetch (runs on a worker thread so the UI never blocks) ---

def fetch_state():
    """Returns (data_dict, error_str_or_None). 5s hard timeout."""
    try:
        with urllib.request.urlopen(ENDPOINT, timeout=5) as r:
            if r.status != 200:
                return None, f"HTTP {r.status}"
            return json.loads(r.read().decode("utf-8")), None
    except urllib.error.URLError as e:
        return None, f"URLError: {e.reason}"
    except Exception as e:
        return None, f"{type(e).__name__}: {e}"

# --- Pet UI ---

class Pet:
    BG = "#0d0d0d"
    FG = "#ffffff"
    FG_DIM = "#9ca3af"
    FG_FAINT = "#6b7280"
    TILE_BG = "#1a1a1a"

    COLOR_OK    = "#22c55e"
    COLOR_ERR   = "#ef4444"
    COLOR_HUMAN = "#f59e0b"
    COLOR_INBOX = "#60a5fa"
    COLOR_DOWN  = "#6b7280"
    COLOR_BORDER_OK    = "#22c55e"
    COLOR_BORDER_ERR   = "#ef4444"
    COLOR_BORDER_HUMAN = "#f59e0b"
    COLOR_BORDER_DOWN  = "#6b7280"

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Hermes Pet")
        self.root.configure(bg=self.BG)

        # Borderless, always-on-top, no taskbar entry
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        # -toolwindow is Windows-only (hides taskbar); macOS rejects it with TclError.
        # -type=utility works on macOS as the no-Dock-icon equivalent. Use sys.platform
        # to gate the Windows-specific call so cross-platform launch stays clean.
        import sys
        if sys.platform == "win32":
            self.root.attributes("-toolwindow", True)
        try:
            self.root.attributes("-type", "utility")  # macOS: accessory panel
        except tk.TclError:
            pass

        # Geometry: place in top-right
        w, h = 260, 120
        sw = self.root.winfo_screenwidth()
        self.root.geometry(f"{w}x{h}+{sw - w - 24}+24")

        # Fonts
        self.f_title = tkfont.Font(family="Helvetica", size=10, weight="bold")
        self.f_emoji = tkfont.Font(family="Helvetica", size=14)
        self.f_big   = tkfont.Font(family="Menlo", size=18, weight="bold")
        self.f_lbl   = tkfont.Font(family="Helvetica", size=8)
        self.f_foot  = tkfont.Font(family="Helvetica", size=8)

        # Border (drawn as a frame)
        self.border = tk.Frame(self.root, bg=self.COLOR_BORDER_OK, bd=0)
        self.border.pack(fill="both", expand=True, padx=0, pady=0)
        self.inner = tk.Frame(self.border, bg=self.BG, bd=0)
        self.inner.pack(fill="both", expand=True, padx=2, pady=2)

        # Header row
        head = tk.Frame(self.inner, bg=self.BG)
        head.pack(fill="x", padx=10, pady=(8, 4))
        self.lbl_emoji = tk.Label(head, text="😴", font=self.f_emoji, bg=self.BG, fg=self.FG)
        self.lbl_emoji.pack(side="left")
        tk.Label(head, text="Hermes Pet", font=self.f_title, bg=self.BG, fg=self.FG_DIM).pack(side="left", padx=(6, 0))

        # Tiles row
        tiles = tk.Frame(self.inner, bg=self.BG)
        tiles.pack(fill="x", padx=10, pady=(0, 6))
        self.tiles = {}
        for i, (key, color, label) in enumerate([
            ("ok",    self.COLOR_OK,    "ok"),
            ("err",   self.COLOR_ERR,   "err"),
            ("human", self.COLOR_HUMAN, "human"),
            ("inbox", self.COLOR_INBOX, "inbox"),
        ]):
            cell = tk.Frame(tiles, bg=self.TILE_BG, bd=0, highlightthickness=0)
            cell.grid(row=0, column=i, sticky="nsew", padx=2)
            tiles.grid_columnconfigure(i, weight=1)
            v = tk.Label(cell, text="—", font=self.f_big, bg=self.TILE_BG, fg=color)
            v.pack(pady=(4, 0))
            tk.Label(cell, text=label, font=self.f_lbl, bg=self.TILE_BG, fg=self.FG_DIM).pack(pady=(0, 4))
            self.tiles[key] = v

        # Footer (sync label / error reason)
        self.lbl_foot = tk.Label(self.inner, text="starting…", font=self.f_foot, bg=self.BG, fg=self.FG_FAINT, anchor="w")
        self.lbl_foot.pack(fill="x", padx=10, pady=(0, 8))

        # Right-click menu
        self.menu = tk.Menu(self.root, tearoff=0)
        self.menu.add_command(label="Refresh now", command=self.refresh_now)
        self.menu.add_command(label="Hide",        command=self.root.withdraw)
        self.menu.add_command(label="Quit",        command=self.root.destroy)

        # Bindings: drag + right-click
        self._drag = None
        for w in (self.inner, self.border, self.lbl_emoji, head, self.lbl_foot):
            w.bind("<ButtonPress-1>",   self._on_press)
            w.bind("<B1-Motion>",       self._on_drag)
            w.bind("<ButtonRelease-1>", self._on_release)
            w.bind("<Button-3>",        self._on_right_click)   # macOS right-click
            w.bind("<Button-2>",        self._on_right_click)   # Linux middle-click

        # Periodic refresh + label tick
        self._last_sync = None
        self._server_down = True
        self.root.after(500,    self.refresh_now)
        self.root.after(30_000, self._schedule_next)
        self.root.after(1_000,  self._tick_foot)
        # Re-schedule refresh on a loop without recursion
        self._refresh_after_id = None
        self.root.after(30_000, self._loop_refresh)

    # --- Drag handlers ---

    def _on_press(self, e):
        self._drag = {"x": e.x_root, "y": e.y_root, "gx": self.root.winfo_x(), "gy": self.root.winfo_y()}

    def _on_drag(self, e):
        if not self._drag: return
        dx = e.x_root - self._drag["x"]
        dy = e.y_root - self._drag["y"]
        self.root.geometry(f"+{self._drag['gx'] + dx}+{self._drag['gy'] + dy}")

    def _on_release(self, e):
        self._drag = None

    def _on_right_click(self, e):
        # Guard against late events surviving window destruction
        try:
            if not self.root.winfo_exists():
                return
            self.menu.tk_popup(e.x_root, e.y_root)
            self.menu.grab_release()
        except Exception:
            pass  # silently ignore if tk already gone

    # --- Refresh loop ---

    def refresh_now(self):
        Thread(target=self._fetch_and_apply, daemon=True).start()

    def _fetch_and_apply(self):
        data, err = fetch_state()
        # UI updates must happen on the main thread
        self.root.after(0, self._apply, data, err)

    def _apply(self, data, err):
        if err or data is None:
            self._server_down = True
            self.lbl_emoji.config(text="😴")
            for v in self.tiles.values():
                v.config(text="—")
            self.border.config(bg=self.COLOR_BORDER_DOWN)
            self.lbl_foot.config(text=f"server :7799 down ({err})", fg=self.COLOR_ERR)
            return

        self._server_down = False
        self.tiles["ok"].config(text=str(data.get("ok", 0)))
        self.tiles["err"].config(text=str(data.get("error", 0)))
        self.tiles["human"].config(text=str(data.get("needs_human", 0)))
        self.tiles["inbox"].config(text=str(data.get("inbox_unacked", 0)))
        self._last_sync = time.time()
        if data.get("error", 0) > 0:
            self.lbl_emoji.config(text="🚨"); self.border.config(bg=self.COLOR_BORDER_ERR)
        elif data.get("needs_human", 0) > 0:
            self.lbl_emoji.config(text="⚠️"); self.border.config(bg=self.COLOR_BORDER_HUMAN)
        else:
            self.lbl_emoji.config(text="✅"); self.border.config(bg=self.COLOR_BORDER_OK)

    def _loop_refresh(self):
        self.refresh_now()
        self.root.after(REFRESH_MS, self._loop_refresh)

    def _tick_foot(self):
        if self._server_down:
            pass  # foot text already set by _apply
        elif self._last_sync:
            s = int(time.time() - self._last_sync)
            if s < 60:
                label = f"sync {s}s ago"
            else:
                label = f"sync {s // 60}m ago"
            self.lbl_foot.config(text=label, fg=self.FG_FAINT)
        self.root.after(1_000, self._tick_foot)

    def _schedule_next(self):
        # legacy entry — kept so early `after(30_000, ...)` call doesn't error
        pass

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    Pet().run()