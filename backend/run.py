"""
RAG Chatbot - CLI Launcher
This file simply launches the Click CLI application.
"""

import sys

# Ensure emoji + UTF-8 output works on Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    from src.cli import cli
except Exception as e:
    print("❌ Failed to import CLI. Error:")
    print(str(e))
    sys.exit(1)


if __name__ == "__main__":
    try:
        cli()
    except Exception as e:
        print("\n❌ Fatal error while running CLI:")
        print(str(e))
