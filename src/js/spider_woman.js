import {buildCardDiv} from './process_heroes.js';
import { findAspectByCode, findNameByCode, findPhotoByCode } from "./utils.js";
// "04031a"
export async function processSpiderWomanDecks(heroAspect, heroAspect2, heroCardsData, deckListData, cardsData) {

  console.log(`Here we are with ${heroAspect} and ${heroAspect2}`);

  const chosenDecks = [];

  let aspects = ["aggression", "justice", "leadership", "protection"]

  const aspectDecks = {
    // "aggression": [],
    // "leadership": [],
    // "justice": [],
    // "protection": [],
    "basic": [],
  };

  aspectDecks[heroAspect] = [];
  aspectDecks[heroAspect2] = [];
  // console.log(aspectDecks);

  // this is a nested list now therefore we're going to iterate by sublist (day)

  

  for (const deck of deckListData) {
      if (deck.investigator_code === "04031a" && 
      (deck.meta === `{"aspect":"${heroAspect}","aspect2":"${heroAspect2}"}` || 
      deck.meta === `{"aspect":"${heroAspect2}","aspect2":"${heroAspect}"}`)) {
        chosenDecks.push(deck);
        // aspectDecks["basic"].push(deck);
      } else if (deck.meta == `{"aspect":"${heroAspect}"}`) {
        // console.log(aspectDecks[heroAspect])
        aspectDecks[heroAspect].push(deck);
        aspectDecks["basic"].push(deck);
      } else if (deck.meta == `{"aspect":"${heroAspect2}"}`) {
        aspectDecks[heroAspect2].push(deck);
        aspectDecks["basic"].push(deck);
      }
  }
  // "meta": "{\"aspect\":\"justice\",\"aspect2\":\"leadership\"}"

  const totalChosenDecks = chosenDecks.length;
  // console.log(chosenDecks)

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
    // need to do an if statement because apparently there are naughty people who put leadership cards inside of aggression/justice decks and break my code
    if (aspectDecks[cardAspect]) {
      // console.log(aspectDecks[cardAspect]);
      const aspectCount = aspectDecks[cardAspect].filter(deck => deck.slots[cardCode] > 0).length;
      const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
      const aspectPercentage = Math.round((aspectCount / aspectDecks[cardAspect].length) * 100);
      const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
      return { code: cardCode, cardName, cardPhoto, count, percentage: heroAndAspectPercentage, synergyPercentage };
    } else {
      return { code: 0 }
    }
    // const aspectCount = aspectDecks[cardAspect].filter(deck => deck.slots[cardCode] > 0).length;
    // const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
    // const aspectPercentage = Math.round((aspectCount / aspectDecks[cardAspect].length) * 100);
    // const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
    // return { code: cardCode, cardName, cardPhoto, count, percentage: heroAndAspectPercentage, synergyPercentage };
  });

  //Let's shoot the template literals into two different functions
  //Header and cards
  const heroHeaderDiv = document.getElementById("hero-header");
  //clear it in case it's a resubmit
  heroHeaderDiv.innerHTML = '';
  // const heroName = findNameByCode(cardsData, herocode);
  buildHeroHeader(totalChosenDecks, heroHeaderDiv, heroAspect, heroAspect2);

  const cardResultsDiv = document.getElementById("card-results");
  cardResultsDiv.innerHTML = '';
  buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv);
}

//built original because of lacking aspects
function buildHeroHeader(totalChosenDecks, heroHeaderDiv, heroAspect, heroAspect2) {
  const heroHeader = document.createElement('h2');
  heroHeader.textContent = `Selected Hero: Spider-Woman (${totalChosenDecks} ${heroAspect}/${heroAspect2} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}

// {"id": 26390, "name": "Risk Management", "date_creation": "2023-02-25T21:57:40+00:00", "date_update": "2023-02-25T21:57:40+00:00", "description_md": "[Agent 13](/card/03002) Thwarts for 2. \r\n\r\n[Inspired](/card/01074) increases that to 3. \r\n\r\n[Cloud 9](/card/29014) can exhaust to give our Aerial characters +1 Thwart. \r\n\r\nGet [Honorary Avenger](/card/03025) and [Sky Cycle](/card/04015) on both of them. We can exhaust [Cloud 9](/card/29014) twice a turn, giving us +2 Thwart to [Agent 13](/card/03002), who now has Aerial. Don't ever use [Cloud 9](/card/29014) for anything else.\r\n\r\nGet [Mighty Avengers](/card/21015) out for an additional 1 Thwart.\r\n\r\nThat gets you 12 thwart each turn for no additional resources. \r\n\r\nTo mitigate the consequential damage, we can use [Field Agent](/card/27044), but when we use [Agent 13](/card/03002), we can ready a [Field Agent](/card/27044) and get an extra activation. So each Field Agent gets us an additional 12 Thwart and we keep [Agent 13](/card/03002) from taking damage.\r\n\r\nWe also include [First Aid](/card/01086) to keep [Agent 13](/card/03002) alive at all costs.\r\n\r\n [Inspiring Presence](/card/10030) Heals [Agent 13](/card/03002) for 1 but gives her an extra Thwart activation, so it's 1 resource for 6 more Thwart. \r\n\r\n[Vigilante Training](/card/23033) can help us get to [Homeland Intervention](/card/27042), which can get us 6 more Thwart if we use our [Government Liaison](/card/27054) cards, [Helicarrier](/card/01092), or [Jessica Drew](/card/04031b). You can also use [Field Agent](/card/27044) if you don't have [Agent 13](/card/03002) set up yet.\r\n\r\n[Government Liaison](/card/27054) can also get us a free [Field Agent](/card/27044).", "user_id": 27247, "investigator_code": "04031a", "investigator_name": "Spider-Woman", "slots": {"01074": 1, "01086": 3, "01092": 1, "03025": 2, "04015": 2, "04032": 1, "04033": 2, "04034": 1, "04035": 2, "04036": 2, "04037": 2, "04038": 2, "04039": 3, "10030": 3, "21015": 1, "23033": 2, "27042": 3, "27044": 3, "27046": 1, "27054": 2, "29014": 1}, "ignoreDeckLimitSlots": null, "version": "1.0", "meta": "{\"aspect\":\"justice\",\"aspect2\":\"leadership\"}", "tags": "multiplayer"},