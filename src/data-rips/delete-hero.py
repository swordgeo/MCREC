import json

# Open the JSON file
with open('src/json/card_data_sample.json', 'r') as file:
    data = json.load(file)



# Open the second JSON file with the array of codes to match against
with open('src/json/hero_cards_list.json', 'r') as file:
    codes_data = json.load(file)

# Iterate through each entry in the JSON file
for entry in data:
    # Check if the "code" field matches any of the values in the array
    if entry['code'] in codes_data:
        # If there's a match, remove the entry
        data.remove(entry)

# Write the updated JSON data back to the file
with open('src/json/card_data_sample.json', 'w') as file:
    json.dump(data, file)
