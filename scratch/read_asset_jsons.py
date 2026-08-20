import os
import json

remix_dir = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main"
asset_jsons = []

for root, dirs, files in os.walk(remix_dir):
    for f in files:
        if f.endswith('.asset.json'):
            asset_jsons.append(os.path.join(root, f))

print(f"Found {len(asset_jsons)} .asset.json files:")
for path in asset_jsons:
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = json.load(file)
            print(f"{os.path.basename(path)} -> {content.get('url')}")
    except Exception as e:
        print(f"Error reading {path}: {e}")
