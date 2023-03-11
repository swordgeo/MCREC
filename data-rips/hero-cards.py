# Sift out hero cards and put them in the naughty list

import json

# Load the card data from a JSON file
with open('card_data_sample.json') as f:
    card_data = json.load(f)

# Create an empty list to hold the hero cards
hero_cards = []

# Iterate through the card data and find hero cards
for card in card_data:
    if card['faction_code'] == 'hero':
        hero_cards.append(card['code'])

# Convert the hero cards list to JSON format
hero_cards_json = json.dumps(hero_cards)

# Write the hero cards JSON to a file
with open('hero_cards_list.json', 'w') as f:
    f.write(hero_cards_json)
    f.close()