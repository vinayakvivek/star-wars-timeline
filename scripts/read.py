from google.oauth2 import service_account
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SERVICE_ACCOUNT_FILE = "key.json"

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)

SHEET_ID = "1KaB4ti8NissgX45bOuRpnoE07qknv7VQk_ECJ1zpJt0"
RANGE = "Star Wars Universe!A2:E155"

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
print(result["values"])
