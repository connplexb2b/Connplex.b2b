import json

json_path = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main\src\assets\vid-dining.mp4.asset.json"

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")
