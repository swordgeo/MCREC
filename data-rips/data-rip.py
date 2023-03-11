# Ripping card data and decklists out to so many days and saving them to json for our tests

import requests
import json
from datetime import date, timedelta

# Define start and end dates
start_date = date(2023, 3, 1)
end_date = date(2023, 3, 8)
deckListFileName = 'deck_data_sample.json'
cardListFileName = 'card_data_sample.json'

def ripDeckData (start_date, end_date, outfileName):
  # Define list to store daily data
  month_data = []

  # Iterate over each day in the month
  for day in range((end_date - start_date).days + 1):
      current_date = start_date + timedelta(days=day)
      # print(current_date)
      url = f"https://marvelcdb.com/api/public/decklists/by_date/{current_date}"
      response = requests.get(url)
      # print(response)
      data = json.loads(response.text)
      # print(data)
      month_data.append(data)
      # print(month_data)


  # Write the month's data to a JSON file
  with open(outfileName, 'w') as outfile:
      json.dump(month_data, outfile)
      outfile.close()

def ripCardData(cardFileName):
   url = f"https://marvelcdb.com/api/public/cards/"
   response = requests.get(url)
   data = json.loads(response.text)
   
   with open(cardFileName, 'w') as outfile:
      json.dump(data, outfile)
      outfile.close()
   

ripDeckData(start_date, end_date, deckListFileName)

# only need to turn this on again when new heroes are added
# ripCardData(cardListFileName)