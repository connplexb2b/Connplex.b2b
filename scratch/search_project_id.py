import json
import re

filepath = r"C:\Users\admin\.gemini\antigravity\brain\f3f41ea2-c3bd-4885-a8b3-5fd0f742de88\.system_generated\logs\transcript_full.jsonl"

try:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for idx, line in enumerate(f):
            if '/a/v1/' in line or 'eu-west-1.amazonaws.com' in line:
                print(f"Line {idx} contains S3 URL:")
                # Print around the S3 match
                pos = line.find('/a/v1/')
                if pos != -1:
                    print(line[max(0, pos-150):pos+350] + "\n")
                else:
                    pos2 = line.find('eu-west-1.amazonaws.com')
                    print(line[max(0, pos2-150):pos2+350] + "\n")
except Exception as e:
    print(f"Error: {e}")
