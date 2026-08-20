import json
import os

filepath = r"C:\Users\admin\.gemini\antigravity\brain\f3f41ea2-c3bd-4885-a8b3-5fd0f742de88\.system_generated\logs\transcript_full.jsonl"

try:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for idx, line in enumerate(f):
            # Check if line contains downloading words
            if any(word in line.lower() for word in ['curl', 'wget', 'download', 'http', 'fetch', 'client.get']):
                # Find all occurrences of target filenames
                if any(tgt in line for tgt in ['vid-', 'gameplex-', 'pillar-']):
                    print(f"Line {idx} matches downloading/assets:")
                    print(line[:800] + "...\n")
except Exception as e:
    print(f"Error: {e}")
