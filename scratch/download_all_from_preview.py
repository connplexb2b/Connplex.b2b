import urllib.request
import urllib.error
import os

dest_dir = r"c:\Users\admin\Downloads\Connplex.b2b-main\Connplex.b2b-main\public\assets\gameplex"
os.makedirs(dest_dir, exist_ok=True)

assets = {
    # Videos
    "vid-hero-luxury.mp4": "eab58c70-263e-4307-9d2f-ed6965597b5c",
    "vid-bowling-lux.mp4": "64ba930f-f3f0-4f2e-b88d-2656aa445c28",
    "vid-gokart-race.mp4": "2fdd14cc-6a33-4e1a-a1ad-e22ff703dbbe",
    "vid-dining.mp4": "1a1f6fba-7422-404e-ab08-eed05bc41017",
    "vid-tomorrow.mp4": "25965adf-76c7-499a-a898-8d3eeced15e2",
    "vid-hero-walkthrough.mp4": "1d96d25f-7eb6-4cec-b088-a66cca2bbb91",
    
    # Images
    "gameplex-logo.png": "d3011f6c-b63a-4df5-b697-f38d6b50215c",
    "gameplex-mini.jpg": "26736138-32b1-48e7-b3e6-830070a12bd2",
    "gameplex-standard.jpg": "13a65cc1-1027-425b-837d-88c0e4af81a7",
    "gameplex-grand.jpg": "dc05906d-c4d6-495c-8554-22d56c728ecc",
    "dining-lounge-gameplex.jpg": "a1d8ad6e-869b-4d34-86d5-f0302febbb2b",
    "banner-midnight-bowling.png": "cde3f709-0353-4c7e-83a7-4bbaab997272",
    "pillar-brand.jpg": "8c05d142-acc0-495a-9139-0a261e802576",
    "pillar-design.jpg": "58869701-6c69-4571-8ea5-d12a5dc916bd",
    "pillar-operations.jpg": "6d200547-4209-4f53-b2bb-5134e45ebe52",
    "pillar-technology.jpg": "0938a880-a3da-4ff6-ab3c-51eaee06791b",
    "pillar-marketing.jpg": "313f2f60-fd04-4464-966b-54764eae5e53",
    "pillar-growth.jpg": "ea11693f-4075-4a55-9052-68ca4b78c051",
    "gameplex-luxury-bg.jpg": "0454ffbf-177a-4196-8677-e1546f834566",
    
    # Extra banners
    "banner-2-wide.jpg": "55f54c66-5816-430e-b765-40fe9d4b95ab",
    "banner-future.png": "302cd999-d22e-4141-bd28-b079bd7ca06f",
    "banner-gameplex.png": "809852d7-4d9f-44bc-b19a-f9bd9b5c8317",
    "philosophy-center.jpg": "7efd019c-c4d9-42ee-bc10-190a75a3e3bf"
}

preview_domain = "https://ee852bb1-76d7-4358-a81c-1f90582f2e78.lovableproject.com"

print("--- Starting Downloads ---")
for filename, asset_id in assets.items():
    dest_path = os.path.join(dest_dir, filename)
    url = f"{preview_domain}/__l5e/assets-v1/{asset_id}/{filename}"
    
    # Skip if file already exists and is large enough
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        print(f"Skipping {filename} - already downloaded.")
        continue
        
    print(f"Downloading {filename} from {url}...")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Downloaded {filename} successfully ({os.path.getsize(dest_path)} bytes)")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error downloading {filename}: {e.code} {e.reason}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
print("--- Downloads Finished ---")
