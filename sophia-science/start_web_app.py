#!/usr/bin/env python3
"""
🚀 Sophia's Science Quest Web App Launcher
Starts a local web server and opens the browser automatically!
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    # Find an open port if 8000 is taken
    port = PORT
    server = None
    for p in range(PORT, PORT + 20):
        try:
            server = socketserver.TCPServer(("", p), Handler)
            port = p
            break
        except OSError:
            continue
    
    if not server:
        print(f"❌ Error: Could not find an available port near {PORT}.")
        sys.exit(1)

    url = f"http://localhost:{port}/index.html"
    print("\n" + "=" * 60)
    print(" 🌟 SOPHIA'S SUPER SCIENCE QUEST WEB APP IS RUNNING! 🧪")
    print("=" * 60)
    print(f"\n👉 Opening in browser: {url}")
    print("\n(Press Ctrl + C in this terminal to stop the server anytime)\n")
    
    webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Stopping science web server. Keep exploring, Sophia! 🌟\n")
        server.server_close()

if __name__ == '__main__':
    main()
