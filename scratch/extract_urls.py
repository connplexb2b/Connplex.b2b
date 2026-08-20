import json
import re

log_path = r"C:\Users\admin\.gemini\antigravity\brain\f2b2b363-b5d2-4716-84df-c8378ca48516\.system_generated\logs\transcript_full.jsonl"

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                print(f"Found USER_INPUT in line {idx}, size {len(content)}")
                
                # Write content to a text file to read easily
                with open("scratch/user_request.txt", "w", encoding="utf-8") as out:
                    out.write(content)
                    
                # Search for all URLs
                urls = re.findall(r'https?://[^\s"\'\)\}\],\\t\n]+', content)
                print(f"Found {len(urls)} URLs:")
                for url in sorted(list(set(urls))):
                    print(url)
                
                # Print any markdown links
                links = re.findall(r'\[([^\]]+)\]\((https?://[^\)]+)\)', content)
                print(f"Found {len(links)} markdown links:")
                for text, url in links:
                    print(f"  {text} -> {url}")
                break
except Exception as e:
    print(f"Error: {e}")
