import os
import glob
import zipfile

downloads_dir = r"C:\Users\admin\Downloads"
search_patterns = ["**/*gameplex*", "**/*Gameplex*", "**/*GamePlex*", "**/*capex*", "**/*Capex*"]

print("--- Searching for folders/files in Downloads matching patterns ---")
matching_paths = []
for pattern in search_patterns:
    for path in glob.glob(os.path.join(downloads_dir, pattern), recursive=True):
        # Avoid our own project directory
        if "Connplex.b2b-main" in path:
            continue
        matching_paths.append(path)
        print(f"Found match: {os.path.relpath(path, downloads_dir)}")

# Check inside the 95MB zip file: Connplex Capex landing page - Copy.zip
zip_path = os.path.join(downloads_dir, "Connplex Capex landing page - Copy.zip")
if os.path.exists(zip_path):
    print("\n--- Inspecting contents of Connplex Capex landing page - Copy.zip ---")
    try:
        with zipfile.ZipFile(zip_path, 'r') as z:
            file_list = z.namelist()
            media_files = [f for f in file_list if any(ext in f.lower() for ext in ['.mp4', '.mov', '.png', '.jpg', '.jpeg', '.webm'])]
            print(f"Zip contains {len(file_list)} files, of which {len(media_files)} are media files.")
            for mf in media_files[:20]: # print first 20
                print(f"  Media: {mf}")
            if len(media_files) > 20:
                print(f"  ... and {len(media_files) - 20} more.")
    except Exception as e:
        print(f"Error reading zip: {e}")
