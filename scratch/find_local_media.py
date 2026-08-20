import os

remix_dir = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main"
media_files = []

for root, dirs, files in os.walk(remix_dir):
    for f in files:
        if f.lower().endswith(('.mp4', '.jpg', '.jpeg', '.png', '.gif')):
            media_files.append(os.path.join(root, f))

print(f"Found {len(media_files)} local media files:")
for path in media_files:
    print(f"  {os.path.relpath(path, remix_dir)} ({os.path.getsize(path)} bytes)")
