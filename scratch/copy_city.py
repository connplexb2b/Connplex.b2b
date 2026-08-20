import os
import shutil

src = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main\src\assets\city.jpg"
dest = r"c:\Users\admin\Downloads\Connplex.b2b-main\Connplex.b2b-main\public\assets\gameplex\city.jpg"

if os.path.exists(src):
    try:
        shutil.copy2(src, dest)
        print(f"Success! Copied city.jpg, size: {os.path.getsize(dest)} bytes")
    except Exception as e:
        print(f"Error copying: {e}")
else:
    print(f"Source file does not exist: {src}")
