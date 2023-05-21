import {buildCardDiv} from "./process_heroes.js";
import { findAspectByCode, findNameByCode, findPhotoByCode, findURLByCode, getJSON } from "./utils.js";
// "04031a"
export async function processSpiderWomanDecks(heroAspect, heroAspect2, percentageType) {


  const heroCardsData = await getJSON("/json/hero_cards_list.json");
  const deckListData = await getJSON("/json/deck_data_sample.json");
  const cardsData = await getJSON("/json/card_data_sample.json");

  const chosenDecks = [];

  //preload it with basic before pumping in the others
  const aspectDecks = {
    "basic": [],
  };

  aspectDecks[heroAspect] = [];
  aspectDecks[heroAspect2] = [];


  for (const deck of deckListData) {
    if (deck.investigator_code === "04031a" && 
    (deck.meta === `{"aspect":"${heroAspect}","aspect2":"${heroAspect2}"}` || 
    deck.meta === `{"aspect":"${heroAspect2}","aspect2":"${heroAspect}"}`)) {
      chosenDecks.push(deck);
      //make sure if either aspect matches we push to basic twice
    } else if (deck.meta == `{"aspect":"${heroAspect}"}`) {
      aspectDecks[heroAspect].push(deck);
      aspectDecks["basic"].push(deck);
    } else if (deck.meta == `{"aspect":"${heroAspect2}"}`) {
      aspectDecks[heroAspect2].push(deck);
      aspectDecks["basic"].push(deck);
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
    const cardAspect = findAspectByCode(cardsData, cardCode);
    const cardName = findNameByCode(cardsData, cardCode);
    const cardPhoto = findPhotoByCode(cardsData, cardCode);
    const cardUrl = findURLByCode(cardsData, cardCode);
    const heroAndAspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;
    // need to do an if statement because apparently there are naughty people who put leadership cards inside of aggression/justice decks and break my code
    if (aspectDecks[cardAspect]) {
      const aspectCount = aspectDecks[cardAspect].filter(deck => deck.slots[cardCode] > 0).length;
      const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
      const aspectPercentage = Math.round((aspectCount / aspectDecks[cardAspect].length) * 100);
      const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
      return { code: cardCode, cardName, cardPhoto, percentage: heroAndAspectPercentage, synergyPercentage, cardUrl };
    } else {
      return { code: 0, percentage: 0 }
    }
  })
  .filter(({ percentage }) => percentage >= 5) // remove entries whose percentage is less than 5

  if (percentageType == "synergy") {
    cardInfo.sort((a, b) => b.synergyPercentage - a.synergyPercentage) // sort by percentage from highest to lowest
  } else {
    cardInfo.sort((a, b) => b.percentage - a.percentage) // sort by percentage from highest to lowest
  }
  //Let's shoot the template literals into two different functions
  //Header and cards
  const heroHeaderDiv = document.getElementById("hero-header");
  //clear it in case it's a resubmit
  heroHeaderDiv.innerHTML = "";
  // const heroName = findNameByCode(cardsData, herocode);
  buildHeroHeader(totalChosenDecks, heroHeaderDiv, heroAspect, heroAspect2);

  const cardResultsDiv = document.getElementById("card-results");
  cardResultsDiv.innerHTML = "";
  buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv);
}


//built original because of lacking aspects
function buildHeroHeader(totalChosenDecks, heroHeaderDiv, heroAspect, heroAspect2) {
  const heroHeader = document.createElement("h2");
  heroHeader.textContent = `Selected Hero: Spider-Woman (${totalChosenDecks} ${heroAspect}/${heroAspect2} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}