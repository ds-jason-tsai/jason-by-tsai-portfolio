import os
import gdown
from PyPDF2 import PdfReader
from PIL import Image

# 1. Process Images
icon_dir = r"C:\Users\Jason\Desktop\antigravity\reference\element\icon"
output_dir = r"c:\Users\Jason\Desktop\antigravity\public\assets\icons"
os.makedirs(output_dir, exist_ok=True)

def remove_background(img_path, out_path):
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

for fname in os.listdir(icon_dir):
    if fname.endswith(('.png', '.jpg', '.jpeg', '.jfif')):
        out_name = os.path.splitext(fname)[0] + ".png"
        remove_background(os.path.join(icon_dir, fname), os.path.join(output_dir, out_name))

print("Images processed.")

# 2. Extract PDF Text using gdown
urls = [
    "https://drive.google.com/file/d/1cGR32HLVWr6BvoH2qHlXOpzP6tsFF5Gw/view?usp=sharing",
    "https://drive.google.com/file/d/1D21Q1mPeowc0JAJsPZl9PGdTLxqxN_XD/view?usp=sharing"
]

for i, url in enumerate(urls, 1):
    file_id = url.split("/")[5]
    output_pdf = f"doc_{i}.pdf"
    output_txt = f"doc_{i}.txt"
    try:
        gdown.download(id=file_id, output=output_pdf, quiet=False)
        reader = PdfReader(output_pdf)
        text = ""
        # Extract first 5 pages to get the gist
        for page in reader.pages[:8]:
            text += page.extract_text() + "\n"
        with open(output_txt, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extracted document {i}")
    except Exception as e:
        print(f"Failed to process {url}: {e}")
