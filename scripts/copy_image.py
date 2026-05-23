import shutil
import os

src = "/Users/vivek/.gemini/antigravity/brain/0aed1734-2603-4675-85cf-633d3adb4626/wedding_bundle_box_1768758334993.png"
dst = "/Users/vivek/Desktop/final nimantran studio /public/assets/bundle-box.png"

try:
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy(src, dst)
        print("Success")
    else:
        print(f"Source not found: {src}")
except Exception as e:
    print(f"Error: {e}")
