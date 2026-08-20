with open("scratch/user_request.txt", "r", encoding="utf-8") as f:
    text = f.read()
    
# Let's search for "vid-hero-luxury.mp4"
pos = text.find("vid-hero-luxury.mp4")
if pos != -1:
    print(f"Found 'vid-hero-luxury.mp4' at position {pos}")
    # Print 200 chars around it
    print(text[max(0, pos-50):pos+500])
else:
    print("'vid-hero-luxury.mp4' not found")
    
# Let's search for "gameplex-logo"
pos2 = text.find("gameplex-logo")
if pos2 != -1:
    print(f"Found 'gameplex-logo' at position {pos2}")
    print(text[max(0, pos2-50):pos2+500])

# Let's find all occurrences of 'http'
import re
print("Matches for 'http':")
for m in re.finditer(r'http', text):
    start = m.start()
    print(text[max(0, start-10):start+150])
