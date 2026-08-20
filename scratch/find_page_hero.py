import os

remix_dir = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main"

for root, dirs, files in os.walk(remix_dir):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    content = file.read()
                    if 'PageHero' in content:
                        print(f"Found PageHero in {os.path.relpath(path, remix_dir)}")
                        # Print around the word
                        idx = content.find('PageHero')
                        print(content[max(0, idx-100):idx+800])
                        print("-" * 50)
            except Exception as e:
                pass
