from google.oauth2 import service_account
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from utils import parse_date, parse_rdate, fetch_image
import json
from random import random

curr_data_path = "../src/data/data4.json"
data_path = "../src/data/data4.json"
static_dir = "../static"
last_row = 181  # ! UPDATE IF NEW ITEMS ARE ADDED

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SERVICE_ACCOUNT_FILE = "key.json"

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)

SHEET_ID = "1KaB4ti8NissgX45bOuRpnoE07qknv7VQk_ECJ1zpJt0"
RANGE = f"Star Wars Universe!A2:G{last_row}"

service = build("sheets", "v4", credentials=credentials)
sheet = service.spreadsheets()
result = (
    sheet.values()
    .get(
        spreadsheetId=SHEET_ID,
        range=RANGE,
        # valueRenderOption="FORMULA",
    )
    .execute()
)
values = result["values"]


data = []
values.reverse()
print(len(values))
for row in values:
    # name = re.sub('[]+', '', row[0])
    name = row[0].encode("ascii", "ignore").decode().strip()
    fname = "".join(x for x in name if x.isalnum())
    item = {
        "name": name,
        "releaseDate": parse_rdate(row[4]),
        "type": row[3],
        "thumbnail": f"/images/{fname}.jpg",
        "link": row[5],
        "imageUrl": row[6] if len(row) > 6 else "",
        "yearOffset": float(row[2]),
        "params": {},
    }
    date = parse_date(row[1])
    if date is None:
        continue
    item["year"] = date[0]
    item["duration"] = (date[1] - date[0]) if len(date) > 1 else 0
    data.append(item)


with open(curr_data_path, "r") as f:
    curr_data = json.load(f)


def fetch_curr_params(name):
    for item in curr_data:
        if item["name"] == name:
            return item["params"]
    return None


def round_params(params):
    for key in params:
        params[key] = round(params[key], 2)


default_params = {
    "labelSize": 0.08,
    "tileOffset": 0,
    "tileScale": 0.5,
}


def set_default_params(params):
    if "labelPos" in params:
        del params["labelPos"]
    for key in default_params:
        if key not in params or params[key] is None:
            params[key] = default_params[key]


for item in data:
    name = item["name"]

    # fetch image
    if item["imageUrl"] != "":
        save_path = static_dir + item["thumbnail"]
        fetch_image(item["imageUrl"], item["type"], save_path)
        del item["imageUrl"]

    curr_params = fetch_curr_params(name)
    if curr_params is None:
        print(f"[{name}] is new. Assigning random position")
        item["params"] = {"height": 1.0, "pos": (random() - 0.5) * 5}
    else:
        item["params"] = curr_params

    item["params"]["yearOffset"] = item["yearOffset"]
    del item["yearOffset"]
    set_default_params(item["params"])
    round_params(item["params"])

with open(data_path, "w") as f:
    json.dump(data, f, indent=2, separators=(",", ": "), sort_keys=True)
    print(f"Saved data: {data_path}")
