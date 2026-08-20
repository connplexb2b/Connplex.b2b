import os
import json

brain_dir = r"C:\Users\admin\.gemini\antigravity\brain"
targets = ["vid-hero-luxury.mp4", "vid-bowling-lux.mp4", "vid-gokart-race.mp4", "vid-dining.mp4", "vid-tomorrow.mp4", "gameplex-mini.jpg", "gameplex-standard.jpg", "gameplex-grand.jpg", "pillar-brand.jpg", "pillar-design.jpg", "pillar-operations.jpg", "pillar-technology.jpg", "pillar-marketing.jpg", "pillar-growth.jpg"]

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file in ('transcript.jsonl', 'transcript_full.jsonl'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f):
                        for target in targets:
                            if target in line:
                                print(f"Found {target} in {filepath} line {line_num}")
                                # Print 300 characters around the target word in this line
                                pos = line.find(target)
                                start = max(0, pos - 100)
                                end = min(len(line), pos + 400)
                                print(f"Context: {line[start:end]}\n")
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
