import urllib.request
import urllib.error

variants = [
    # Variant 0: with a/v1 and project_id and asset_id
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    # Variant 1: with project_id and asset_id directly
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    # Variant 2: with project_id and filename
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f8ce03f0-b475-480a-a910-0d23c56d0199/gameplex-logo.png",
    # Variant 3: with asset_id and filename directly
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    # Variant 4: only filename
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/gameplex-logo.png"
]

for idx, url in enumerate(variants):
    print(f"Testing R2 Variant {idx}: {url}")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as res:
            data = res.read()
            print(f"  SUCCESS! Received {len(data)} bytes")
            break
    except urllib.error.HTTPError as e:
        print(f"  Failed: HTTP Error {e.code}: {e.reason}")
    except Exception as e:
        print(f"  Failed: {e}")
