from PIL import Image
import requests

image_url = "https://static.wikia.nocookie.net/starwars/images/c/cb/Jedi_Fallen_Order_Dark_Temple_TPB_final_cover.jpg/revision/latest/scale-to-width-down/1000?cb=20201106104235"
im = Image.open(requests.get(image_url, stream=True).raw)
print(im.size)
