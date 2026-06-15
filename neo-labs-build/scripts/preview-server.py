#!/usr/bin/env python3
"""
Neo Labs 本地预览服务器
支持 /neo-labs/<path> → /<path> 或 /neo-labs/<path> 重写
"""
import http.server
import socketserver
import os

PORT = 8080
ROOT = "/Users/zl/Documents/neo-labs-nextjs/out"

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # /neo-labs/_next/X → /_next/X (静态资源)
        if path.startswith("/neo-labs/_next/"):
            return super().translate_path("/" + path[len("/neo-labs/"):])
        # /neo-labs/neo-labs/labs.json → /neo-labs/labs.json (JSON 数据)
        if path.startswith("/neo-labs/neo-labs/"):
            return super().translate_path(path[len("/neo-labs"):])
        # /neo-labs/X → /X (其他路由如 labs/, compare/ 等)
        if path.startswith("/neo-labs/"):
            return super().translate_path("/" + path[len("/neo-labs/"):])
        if path == "/neo-labs":
            return super().translate_path("/")
        return super().translate_path(path)

os.chdir(ROOT)
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"✅ Neo Labs preview: http://localhost:{PORT}/neo-labs/")
    httpd.serve_forever()
