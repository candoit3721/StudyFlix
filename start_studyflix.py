#!/usr/bin/env python3
"""
🎬 STUDYFLIX: Kids Learning Hub Launcher
One-click multi-profile web portal launcher for Olivia, Sophia, and Yaya!
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    # Find an available port starting at 8080
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
    print("\n" + "=" * 65)
    print(" 🎬 STUDYFLIX: KIDS LEARNING HUB (MULTI-PROFILE) IS RUNNING! 🌟")
    print("=" * 65)
    print(f"\n👉 Opening in browser: {url}")
    print("\n👧 Olivia (Grade 3 Math)  •  👩‍🔬 Sophia (Grade 5/6 Math & Science)  •  🧑‍🎓 Yaya (Calculus & Stats)")
    print("\n(Press Ctrl + C in this terminal to stop the server anytime)\n")
    
    webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Stopping StudyFlix server. Happy learning! 🌟\n")
        server.server_close()

if __name__ == '__main__':
    main()
