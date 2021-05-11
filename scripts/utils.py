from PIL import Image
import requests
import os


def parse_date(date_str):
    if date_str == "":
        return
    parts = date_str.split("-")
    parts = [p.strip() for p in parts]
    if len(parts) == 1:
        [year, label] = parts[0].split(" ")
        year = float(year)
        if label == "BBY":
            year *= -1
        return [year]
    elif len(parts) == 2:
        [p1, p2] = parts
        p1_parts = p1.split(" ")
        y1 = float(p1_parts[0])
        if len(p1_parts) == 2 and p1_parts[1] == "BBY":
            y1 *= -1
        p2_parts = p2.split(" ")
        y2 = float(p2_parts[0])
        if p2_parts[1] == "BBY":
            y2 *= -1
            if y1 > 0:
                y1 *= -1
        return [y1, y2]
    return None


def parse_rdate(date_str):
    if date_str == "":
        return
    parts = date_str.split("-")
    parts = [p.strip() for p in parts]
    if len(parts) == 1:
        return [int(parts[0].split(" ")[0].strip())]
    else:
        return [int(parts[0]), int(parts[1])]


def crop_image(im, aspect_ratio=1.6):
    (w, h) = im.size
    if h > w * aspect_ratio:
        # use max width, crop height
        th = w * aspect_ratio
        top = (h - th) / 2
        bottom = (h + th) / 2
        return im.crop((0, top, w, bottom))
    else:
        tw = h / aspect_ratio
        left = (w - tw) / 2
        right = (w + tw) / 2
        return im.crop((left, 0, right, h))


def fetch_image(url, type, save_path, size=512):
    if os.path.exists(save_path):
        # print(f"Image already exists: {save_path}")
        return

    try:
        im = Image.open(requests.get(url, stream=True).raw)
        if type in ["Novel", "Comic", "Junior Novel", "Short Story"]:
            im = crop_image(im, 1.6)
            im = im.resize((size, int(size * 1.6)), Image.ANTIALIAS)
        else:
            im = crop_image(im, 1.0)
            im = im.resize((size, size), Image.ANTIALIAS)

        rgb_im = im.convert("RGB")
        rgb_im.save(save_path, optimize=True, quality=50)
        print(f"Saved image: {save_path}")
    except:
        print(f"Error fetching image: {save_path}, url: {url}")
