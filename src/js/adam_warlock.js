//We may roll this back into the main file
//Then again it's probably better if we don't
import {buildCardDiv, findAspectByCode, findNameByCode, findPhotoByCode} from './process_heroes.js';

// "cardcode":"21031a"
export async function processAdamWarlockDecks(heroCardsData, deckListData, cardsData) {
  // console.log("Here we are at Adam Warlock");

  const chosenDecks = [];

  let aspects = ["aggression", "justice", "leadership", "protection"]

  const aspectDecks = {
    "aggression": [],
    "leadership": [],
    "justice": [],
    "protection": [],
    "basic": [],
  };

  // this is a nested list now therefore we're going to iterate by sublist (day)
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      if (deck.investigator_code === "21031a") {
        chosenDecks.push(deck);
      } else {
        innerLoop: for (const aspect of aspects) {
          if(deck.meta === `{"aspect":"${aspect}"}`) {
            aspectDecks[aspect].push(deck);
            aspectDecks["basic"].push(deck);
            break innerLoop;
          }
        }
      }
    }
  }

  const totalChosenDecks = chosenDecks.length;

  const cardCounts = chosenDecks.reduce((counts, deck) => {
    const cardsInDeck = Object.entries(deck.slots);
    const filteredCards = cardsInDeck.filter(([cardCode, count]) => {
      return count > 0 && !heroCardsData.includes(cardCode);
    });
    filteredCards.forEach(([cardCode, count]) => {
      counts[cardCode] = counts[cardCode] || 0;
      counts[cardCode]++;
    });
    return counts;
  }, {});




  const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
    const cardName = findNameByCode(cardsData, cardCode);
    const cardPhoto = findPhotoByCode(cardsData, cardCode);
    const heroAndAspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;
    const cardAspect = findAspectByCode(cardsData, cardCode);
    // console.log(cardAspect);
    // console.log(aspectDecks[cardAspect]);
    const aspectCount = aspectDecks[cardAspect].filter(deck => deck.slots[cardCode] > 0).length;
    const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
    const aspectPercentage = Math.round((aspectCount / aspectDecks[cardAspect].length) * 100);
    const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
    return { code: cardCode, cardName, cardPhoto, count, percentage: heroAndAspectPercentage, synergyPercentage };
  });

  //Let's shoot the template literals into two different functions
  //Header and cards
  const heroHeaderDiv = document.getElementById("hero-header");
  //clear it in case it's a resubmit
  heroHeaderDiv.innerHTML = '';
  // const heroName = findNameByCode(cardsData, herocode);
  buildHeroHeader(totalChosenDecks, heroHeaderDiv);

  const cardResultsDiv = document.getElementById("card-results");
  cardResultsDiv.innerHTML = '';
  buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv);
}

//built original because of lacking aspects
function buildHeroHeader(totalChosenDecks, heroHeaderDiv) {
  const heroHeader = document.createElement('h2');
  heroHeader.textContent = `Selected Hero: Adam Warlock (${totalChosenDecks} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}