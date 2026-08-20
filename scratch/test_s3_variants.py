import urllib.request
import urllib.error

# Variations of S3 URL for gameplex-logo.png
variants = [
    "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    "https://love-assets-share.s3.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    "https://s3.eu-west-1.amazonaws.com/love-assets-share/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    "https://love-assets-share.s3-eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    "https://love-assets-share.s3.eu-west-1.amazonaws.com/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    "https://love-assets-share.s3.amazonaws.com/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
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
