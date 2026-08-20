import os

remix_dir = r"c:\Users\admin\Downloads\remix-of-gameplex-main"

if os.path.exists(remix_dir):
    print(f"Directory {remix_dir} exists!")
    # List contents
    for root, dirs, files in os.walk(remix_dir):
        # Limit recursion depth for display
        depth = root[len(remix_dir):].count(os.sep)
        if depth > 2:
            continue
        indent = "  " * depth
        print(f"{indent}[Dir] {os.path.basename(root)}")
        for f in files[:10]:
            print(f"{indent}  - {f}")
        if len(files) > 10:
            print(f"{indent}  - ... and {len(files)-10} more files")
else:
    print(f"Directory {remix_dir} does not exist.")
