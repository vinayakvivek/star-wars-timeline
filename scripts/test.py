import json


with open("../src/data/data2.json", "r") as f:
    data = json.load(f)


def round_params(params):
    for key in params:
        params[key] = round(params[key], 2)


for item in data:
    round_params(item["params"])
    if "yearOffset" not in item["params"]:
        item["params"]["yearOffset"] = 0

data.reverse()
yearOffsets = [item["params"]["yearOffset"] for item in data]
print(yearOffsets)
