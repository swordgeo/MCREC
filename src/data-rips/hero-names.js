// Pull just the hero card codes and names to use in the selector

const fs = require("fs");

// Load the nested deck data from the JSON file
const nestedDecks = require("../../json/deck_data_sample.json");

// Create an object to store the distinct investigator data
const distinctInvestigators = {};

// Loop through each day's worth of data
nestedDecks.forEach((decks) => {

  // Loop through each deck in the day's data
  decks.forEach((deck) => {

    // Get the investigator code and name from the deck
    const { investigator_code, investigator_name } = deck;

    // Check if this investigator code has already been added to the distinctInvestigators object
    if (!distinctInvestigators[investigator_code]) {
      // If not, add a new entry to the object
      distinctInvestigators[investigator_code] = {
        code: investigator_code,
        heroname: investigator_name
      };
    }
  });
});

// Convert the object to an array and sort by investigator name
const sortedInvestigators = Object.values(distinctInvestigators)
  .sort((a, b) => a.heroname.localeCompare(b.heroname));

// Write the array of distinct investigators to a JSON file
fs.writeFileSync("hero_names.json", JSON.stringify(sortedInvestigators));