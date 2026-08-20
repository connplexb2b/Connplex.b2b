import urllib.request
import urllib.error

variants = [
    # Variant 0: lovable-uploads virtual-hosted style with assets-v1
    "https://lovable-uploads.s3.amazonaws.com/assets-v1/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    # Variant 1: love-assets-share virtual-hosted style with assets-v1
    "https://love-assets-share.s3.eu-west-1.amazonaws.com/assets-v1/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    # Variant 2: path style lovable-uploads with assets-v1
    "https://s3.amazonaws.com/lovable-uploads/assets-v1/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    # Variant 3: path style love-assets-share with assets-v1
    "https://s3.eu-west-1.amazonaws.com/love-assets-share/assets-v1/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
]

for idx, url in enumerate(variants):
    print(f"Testing Variant {idx}: {url}")
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
