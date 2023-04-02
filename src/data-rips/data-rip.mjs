
import fs from "fs";
import fetch from "node-fetch";
import { DateTime } from "luxon";

const deckListFileName = "src/json/deck_data_sample.json";
//have to keep it 181 since we offset the other function
const daysToKeep = 181; 

function filterOldDecks(decks) {
  const oldestDateToKeep = DateTime.local().minus({ days: daysToKeep });
  return decks.filter(deck => {
    const dateStr = deck.date_creation;
    const date = DateTime.fromISO(dateStr);
    return date >= oldestDateToKeep;
  });
}


async function ripDeckData(outfileName) {
  const daysToFetch = 180;

  let start_date;
  if (fs.existsSync(outfileName)) {
    const data = JSON.parse(fs.readFileSync(outfileName));
    if (data[data.length - 1].length > 0) {
      const lastDate = DateTime.fromISO(data[data.length - 1][0].date_creation);
      start_date = lastDate.plus({ days: 1 });
    } else {
      start_date = DateTime.local().minus({ days: daysToFetch });
    }
  }

  const month_data = [];

  for (let day = 1; day <= daysToFetch; day++) {
    const current_date = DateTime.local().minus({ days: day });
    const dateString = current_date.toISODate();

    if (fs.existsSync(outfileName)) {
      const data = JSON.parse(fs.readFileSync(outfileName));
      if (data.some((deck) => deck.date_creation.startsWith(dateString))) {
        continue;
      } else {
        console.log(`Data for ${dateString} not found, fetching...`);
      }
    }

    const url = `https://marvelcdb.com/api/public/decklists/by_date/${dateString}`;
    const response = await fetch(url);
    const data = await response.json();

    if ("error" in data) {
      console.log(`Error fetching data for ${dateString}: ${data.error.message}`);
      continue;
    }

    const filteredData = data.map((deck) => {
      const filteredDeck = {
        date_creation: deck.date_creation,
        investigator_code: deck.investigator_code,
        slots: deck.slots,
        meta: deck.meta,
      };

      return filteredDeck;
    });

    month_data.push(filteredData);
  }

  return month_data.reverse();
}


async function updateCardbase() {
  const acceptableFactionCodes = ["aggression", "justice", "leadership", "protection", "basic"];

  const url = "https://marvelcdb.com/api/public/cards/";
  const response = await fetch(url);
  const data = await response.json();

  if ("error" in data) {
    console.log(`Error fetching data for ${dateString}: ${data.error.message}`);
  }

  const filteredData = data.filter(entry => {
    return acceptableFactionCodes.includes(entry.faction_code);
  });

  const filteredDataJson = JSON.stringify(filteredData);
  
  fs.writeFile("src/json/card_data_sample.json", filteredDataJson, (err) => {
    if (err) throw err;
    console.log("card_data_sample updated");
  });
}


export async function updateDeckData() {
  // Read the existing deck data from the file
  const rawData = fs.readFileSync(deckListFileName);
  const allDecks = JSON.parse(rawData);

  // Fetch and filter the new decks
  const newDecks = await ripDeckData(deckListFileName);
  const mappedDecks = newDecks
    .flatMap(day => day);

  // Concatenate the old and new decks
  const updatedDecks = allDecks.concat(mappedDecks);
  const filteredDecks = filterOldDecks(updatedDecks);

  // Overwrite the file with the updated decks
  fs.writeFileSync(deckListFileName, JSON.stringify(filteredDecks));
  console.log("Finished updating deck data.");

  // updatecardbase() only wants to be ran each time a new hero is released
  // At that time we will also want to re-run hero-names.js as well
  // And repopulate hero_cards_list

  // updateCardbase();
}

// Call this function once per week to update the deck data
setInterval(updateDeckData, 7 * 24 * 60 * 60 * 1000); // once per week