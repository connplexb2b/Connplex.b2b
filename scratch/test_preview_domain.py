import urllib.request
import urllib.error
import os

url = "https://ee852bb1-76d7-4358-a81c-1f90582f2e78.lovableproject.com/__l5e/assets-v1/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png"
dest = "scratch/test-logo.png"

try:
    print(f"Downloading from preview domain: {url}...")
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as response:
        with open(dest, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Saved to {dest}, size: {os.path.getsize(dest)} bytes")
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
except Exception as e:
    print(f"Failed: {e}")
