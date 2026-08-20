import urllib.request
import os

test_url = "https://love-assets-share.s3.eu-west-1.amazonaws.com/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png"
dest = "scratch/test-logo.png"

try:
    print(f"Downloading {test_url}...")
    # Add a user-agent header to avoid blocked requests
    req = urllib.request.Request(
        test_url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as response:
        with open(dest, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Saved to {dest}, size: {os.path.getsize(dest)} bytes")
except Exception as e:
    print(f"Failed: {e}")
