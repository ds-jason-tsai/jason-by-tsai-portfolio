import os
from PIL import Image

# 1. Process Images
icon_dir = r"C:\Users\Jason\Desktop\antigravity\reference\element\icon"
output_dir = r"c:\Users\Jason\Desktop\antigravity\public\assets\icons"
os.makedirs(output_dir, exist_ok=True)

def remove_background(img_path, out_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        data = img.getdata()
        new_data = []
        # threshold for white
        for item in data:
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                new_data.append((255, 255, 255, 0)) # transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(out_path, "PNG")
    except BaseException as e:
        print(f"Error {img_path}: {e}")

for fname in os.listdir(icon_dir):
    if fname.endswith(('.png', '.jpg', '.jpeg', '.jfif')):
        out_name = os.path.splitext(fname)[0] + ".png"
        remove_background(os.path.join(icon_dir, fname), os.path.join(output_dir, out_name))

print("Images processed.")
