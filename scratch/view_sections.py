import os

filepath = r"c:\Users\admin\Downloads\remix-of-gameplex-main\remix-of-gameplex-main\src\components\site\Sections.tsx"
outpath = "scratch/sections_content.txt"

try:
    with open(filepath, 'r', encoding='utf-8') as f, open(outpath, 'w', encoding='utf-8') as out:
        out.write(f.read())
    print("Success! Sections content written to scratch/sections_content.txt")
except Exception as e:
    print(f"Error: {e}")
