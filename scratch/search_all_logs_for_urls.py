import os
import json
import re

brain_dir = r"C:\Users\admin\.gemini\antigravity\brain"
s3_pattern = re.compile(r'https?://[^\s"\'\)\}\],\\t\n\>]+(?:lovable|amazonaws|cloudfront|s3)[^\s"\'\)\}\],\\t\n\>]*')

found_urls = {}

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file in ('transcript.jsonl', 'transcript_full.jsonl'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line in f:
                        if not line.strip():
                            continue
                        try:
                            data = json.loads(line)
                            content = data.get('content', '')
                            matches = s3_pattern.findall(content)
                            for match in matches:
                                # Try to identify the file name from the URL or nearby text
                                filename = os.path.basename(match.split('?')[0])
                                found_urls[filename] = match
                        except Exception:
                            pass
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

print(f"Found {len(found_urls)} unique S3/CDN URLs:")
for name, url in found_urls.items():
    print(f"{name} -> {url}")
