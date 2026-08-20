import os

dest_dir = r"c:\Users\admin\Downloads\Connplex.b2b-main\Connplex.b2b-main\public\assets\gameplex"

if not os.path.exists(dest_dir):
    print("Directory does not exist!")
else:
    print(f"--- Listing files in {dest_dir} ---")
    files = sorted(os.listdir(dest_dir))
    for f in files:
        path = os.path.join(dest_dir, f)
        if os.path.isfile(path):
            print(f"  {f:<35} | {os.path.getsize(path):,d} bytes")
