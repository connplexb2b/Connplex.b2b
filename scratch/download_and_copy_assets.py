import os
import shutil
import urllib.request

# Directories
dest_dir = r"c:\Users\admin\Downloads\Connplex.b2b-main\Connplex.b2b-main\public\assets\gameplex"
remix_assets_dir = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main\src\assets"

os.makedirs(dest_dir, exist_ok=True)

# 1. Copy local images from remix project if they exist
local_files_to_copy = [
    "experiences.jpg",
    "philosophy-1-clean.jpg",
    "philosophy-2.jpg",
    "gal-1.jpg",
    "gal-2.jpg",
    "gal-3.jpg",
    "gal-4.jpg",
    "gal-5.jpg",
    "gal-6.jpg",
    "gal-7.jpg",
    "gal-8.jpg"
]

print("--- Copying local files from remix project ---")
for filename in local_files_to_copy:
    src_path = os.path.join(remix_assets_dir, filename)
    dest_path = os.path.join(dest_dir, filename)
    if os.path.exists(src_path):
        try:
            shutil.copy2(src_path, dest_path)
            print(f"Copied {filename} successfully ({os.path.getsize(dest_path)} bytes)")
        except Exception as e:
            print(f"Failed to copy {filename}: {e}")
    else:
        print(f"Source file not found: {src_path}")

# 2. Download other assets from S3 URLs
s3_assets = {
    "vid-hero-luxury.mp4": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/eab58c70-263e-4307-9d2f-ed6965597b5c/vid-hero-luxury.mp4",
    "vid-bowling-lux.mp4": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/64ba930f-f3f0-4f2e-b88d-2656aa445c28/vid-bowling-lux.mp4",
    "vid-gokart-race.mp4": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/2fdd14cc-6a33-4e1a-a1ad-e22ff703dbbe/vid-gokart-race.mp4",
    "vid-dining.mp4": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/1a1f6fba-7422-404e-ab08-eed05bc41017/vid-dining.mp4",
    "vid-tomorrow.mp4": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/25965adf-76c7-499a-a898-8d3eeced15e2/vid-tomorrow.mp4",
    "vid-hero-walkthrough.mp4": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/1d96d25f-7eb6-4cec-b088-a66cca2bbb91/vid-hero-walkthrough.mp4",
    "gameplex-logo.png": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png",
    "gameplex-mini.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/26736138-32b1-48e7-b3e6-830070a12bd2/gameplex-mini.jpg",
    "gameplex-standard.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/13a65cc1-1027-425b-837d-88c0e4af81a7/gameplex-standard.jpg",
    "gameplex-grand.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/dc05906d-c4d6-495c-8554-22d56c728ecc/gameplex-grand.jpg",
    "dining-lounge-gameplex.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/a1d8ad6e-869b-4d34-86d5-f0302febbb2b/dining-lounge-gameplex.jpg",
    "banner-midnight-bowling.png": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/cde3f709-0353-4c7e-83a7-4bbaab997272/banner-midnight-bowling.png",
    "pillar-brand.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/8c05d142-acc0-495a-9139-0a261e802576/pillar-brand.jpg",
    "pillar-design.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/58869701-6c69-4571-8ea5-d12a5dc916bd/pillar-design.jpg",
    "pillar-operations.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/6d200547-4209-4f53-b2bb-5134e45ebe52/pillar-operations.jpg",
    "pillar-technology.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/0938a880-a3da-4ff6-ab3c-51eaee06791b/pillar-technology.jpg",
    "pillar-marketing.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/313f2f60-fd04-4464-966b-54764eae5e53/pillar-marketing.jpg",
    "pillar-growth.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/ea11693f-4075-4a55-9052-68ca4b78c051/pillar-growth.jpg",
    "gameplex-luxury-bg.jpg": "https://love-assets-share.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/0454ffbf-177a-4196-8677-e1546f834566/gameplex-luxury-bg.jpg"
}

print("\n--- Downloading files from S3 ---")
for filename, url in s3_assets.items():
    dest_path = os.path.join(dest_dir, filename)
    # Skip if already exists and has a positive size (so we don't redownload)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        print(f"Skipping {filename} - already exists")
        continue
    
    print(f"Downloading {filename}...")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Downloaded {filename} successfully ({os.path.getsize(dest_path)} bytes)")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
