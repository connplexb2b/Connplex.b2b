import json
import re
import os

folder = r"C:\Users\admin\.gemini\antigravity\brain\c91a3958-258b-4162-b34e-034fac2e307f\.system_generated\logs"

for fn in ('transcript.jsonl', 'transcript_full.jsonl'):
    filepath = os.path.join(folder, fn)
    if not os.path.exists(filepath):
        print(f"File {filepath} does not exist.")
        continue
    print(f"\n--- Checking {fn} ---")
    urls = set()
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for idx, line in enumerate(f):
                matches = re.findall(r'https?://[^\s"\'\)\}\],\\t\n\>]+', line)
                for m in matches:
                    if any(term in m.lower() for term in ['s3', 'lovable', 'amazonaws', 'cloudfront', 'r2.dev']):
                        urls.add(m)
    except Exception as e:
        print(f"Error: {e}")
    print(f"Found {len(urls)} URLs in {fn}")
    for u in sorted(list(urls)):
        print(f"  {u}")
