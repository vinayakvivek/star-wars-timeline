from PIL import Image
import os


def reduce_size(im, size=256):
    w, h = im.size
    im = im.resize((size, int(size * h / w)), Image.ANTIALIAS)
    return im


base_dir = "../static/images/"
for file_name in os.listdir(base_dir):
    file_path = os.path.join(base_dir, file_name)
    im = Image.open(file_path)
    # im = reduce_size(im)
    im.save(file_path, optimize=True, quality=10)
    im.close()
