import pandas as pd

sheet_id = "1KaB4ti8NissgX45bOuRpnoE07qknv7VQk_ECJ1zpJt0"
sheet_name = "Star\ Wars\ Universe"
url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv"

df = pd.read_csv(url)
print(df)
