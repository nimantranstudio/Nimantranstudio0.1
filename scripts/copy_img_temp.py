import shutil
import os

# Source is the generated artifact path
src = "/Users/vivek/.gemini/antigravity/brain/0aed1734-2603-4675-85cf-633d3adb4626/wedding_bundle_box_1768758334993.png"

# Destination is the project's public assets folder
dst = "/Users/vivek/Desktop/final nimantran studio /public/assets/bundle-box.png"

try:
    # Ensure directory exists
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    
    # Copy file
    shutil.copy(src, dst)
    print(f"Successfully copied image to: {dst}")
except Exception as e:
    print(f"Error copying file: {e}")
