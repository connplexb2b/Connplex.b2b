import json
import re
import os

filepath = r"C:\Users\admin\.gemini\antigravity\brain\f3f41ea2-c3bd-4885-a8b3-5fd0f742de88\.system_generated\logs\transcript_full.jsonl"

domains = set()

try:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            # Let's search for domains containing lovable or connplex
            matches = re.findall(r'[a-zA-Z0-9\.\-]+\.(?:lovable\.app|lovableproject\.com|theconnplex\.com|amazonaws\.com)', line)
            for m in matches:
                domains.add(m)
except Exception as e:
    print(f"Error: {e}")

print("Found domains:")
for d in domains:
    print(d)
