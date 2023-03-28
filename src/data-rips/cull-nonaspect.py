import json

# Open the card data JSON file
with open('src/json/card_data_sample.json', 'r') as file:
    data = json.load(file)

# Define the list of allowed faction codes
allowed_factions = ['aggression', 'justice', 'leadership', 'protection', 'basic']

# Filter out cards whose faction code is not in the allowed list
data = [card for card in data if card['faction_code'] in allowed_factions]

# Write the updated JSON data back to the file
with open('src/json/card_data_sample.json', 'w') as file:
    json.dump(data, file)