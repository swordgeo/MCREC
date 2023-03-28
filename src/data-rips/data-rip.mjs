
// const fs = require('fs');
import fs from "fs";
import fetch from 'node-fetch';
import { DateTime } from 'luxon';



const deckListFileName = 'src/json/deck_data_sample.json';
const daysToKeep = 181; 

// function filterOldDecks(decks) {
//   const oldestDateToKeep = DateTime.local().minus({ days: daysToKeep });
//   return decks.filter(dayDecks => {
//     if (!dayDecks || dayDecks.length === 0) {
//       // If this day's decks array is empty or does not exist, discard it
//       return false; 
//     }
//     // Get the date of the first deck in this day's list 
//     // console.log(dayDecks[0]);
//     const dateStr = dayDecks[0].date_creation;
//     const date = DateTime.fromISO(dateStr);
//     // Keep this day's decks if they're newer than the cutoff date
//     return date >= oldestDateToKeep;
//   });
// } 

function filterOldDecks(decks) {
  const oldestDateToKeep = DateTime.local().minus({ days: daysToKeep });
  return decks.filter(deck => {
    const dateStr = deck.date_creation;
    const date = DateTime.fromISO(dateStr);
    return date >= oldestDateToKeep;
  });
}


// async function ripDeckData(outfileName) { 
//   const daysToFetch = 5;// Check if data file exists

//   let start_date;
//   if (fs.existsSync(outfileName)) {
//     const data = JSON.parse(fs.readFileSync(outfileName));
//     if (data[data.length - 1].length > 0) {
//       const lastDate = DateTime.fromISO(data[data.length - 1][0].date_creation);
//       start_date = lastDate.plus({ days: 1 });
//     } else {
//       start_date = DateTime.local().minus({ days: daysToFetch});
//     }
//   }

//   // Define list to store daily data
//   const month_data = [];

//   // Iterate over each day in the range
//   // we're setting things to day = 1 and <= so that it skips the current day
//   // Which we don't want to prematurely pull data for until that day is finished
//   for (let day = 1; day <= daysToFetch; day++) {
//     const current_date = DateTime.local().minus({ days: day });
//     const dateString = current_date.toISODate(); 

//     // Check if data for this day already exists in the file
//     if (fs.existsSync(outfileName)) { 
//       const data = JSON.parse(fs.readFileSync(outfileName));
//       if (data.some(day => day[0].date_creation.startsWith(dateString))) {
//         // console.log(`Data for ${dateString} already exists, skipping...`);
//         continue;
//       } else {
//         console.log(`Data for ${dateString} not found, fetching...`);
//       }
//     }

//     // Fetch data for this day
//     const url = `https://marvelcdb.com/api/public/decklists/by_date/${dateString}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if ('error' in data) {
//       console.log(`Error fetching data for ${dateString}: ${data.error.message}`);
//       continue; // skip this day and move on to the next day
//     }
//     month_data.push(data);
//   }

//   // Reverse the order of the daily data
//   month_data.reverse();



//   return month_data;
// }

async function ripDeckData(outfileName) {
  const daysToFetch = 90;

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

    if ('error' in data) {
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
}

// export async function updateDeckData() {
//   // Read the existing deck data from the file
//   const rawData = fs.readFileSync(deckListFileName);
//   const allDecks = JSON.parse(rawData);

//   // Fetch and add the new decks
//   const newDecks = await ripDeckData(deckListFileName);
//   // console.log(newDecks);
//   for (const day in newDecks) {
//     allDecks.push(newDecks[day]) 
//   }
//   // allDecks.push(newDecks); 

//   // Filter out the old decks
//   // const filteredDecks = filterOldDecks(allDecks);

//   // Overwrite the file with the filtered decks
//   // fs.writeFileSync(deckListFileName, JSON.stringify(filteredDecks));
//   console.log("finished");
//   fs.writeFileSync(deckListFileName, JSON.stringify(allDecks));
// }

// Call this function once per week to update the deck data
setInterval(updateDeckData, 7 * 24 * 60 * 60 * 1000); // once per week











// // Currently 10/13 to 3/13
// const start_date = DateTime.local(2022, 10, 13);
// const end_date = DateTime.local(2022, 11, 13);
// const deckListFileName = 'src/json/deck_data_sample2.json';
// const cardListFileName = 'src/json/card_data_sample.json';









// export async function ripDeckData(outfileName) {
//   // Define list to store daily data
//   const month_data = [];

//   // Iterate over each day in the month
//   for (let day = 0; day <= end_date.diff(start_date, 'days').days; day++) {
//     const current_date = start_date.plus({ days: day });
//     const url = `https://marvelcdb.com/api/public/decklists/by_date/${current_date.toISODate()}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     month_data.push(data);
//   }

//   // Write the month's data to a JSON file
//   fs.writeFileSync(outfileName, JSON.stringify(month_data));
// }

// async function ripCardData(cardFileName) {
//   const url = 'https://marvelcdb.com/api/public/cards/';
//   const response = await fetch(url);
//   const data = await response.json();
//   fs.writeFileSync(cardFileName, JSON.stringify(data));
// }

// ripDeckData(start_date, end_date, deckListFileName);

// // only need to turn this on again when new heroes are added
// // ripCardData(cardListFileName);