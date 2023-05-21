import { findAspectByCode, findHeroByCode, findNameByCode, findPhotoByCode, findURLByCode, getJSON } from "./utils.js";

export async function processHeroDecks(herocode, heroAspect, heroNamesData, percentageType) {

  const heroCardsData = await getJSON("/json/hero_cards_list.json");
  const deckListData = await getJSON("/json/deck_data_sample.json");
  const cardsData = await getJSON("/json/card_data_sample.json");

  const chosenDecks = [];
  //these two need to be lets because we don;'t know what they'll be yet before we determine if Cyclops and Gamora are in here causing trouble
  let aspectDecks;
  let aspectDeckCount;

  if (herocode == "33001a" || herocode == "18001a") {//Cyclops or Gamora respectively
    //we basically have to go through the process of Adam Warlock except we stick basic cards with its parent aspect
    let aspects = ["aggression", "justice", "leadership", "protection"]

    aspectDecks = {
      "aggression": [],
      "leadership": [],
      "justice": [],
      "protection": [],
      "basic": [],
    };

    for (const deck of deckListData) {
      //for most heroes we search by hero and aspect combination
      if (deck.investigator_code === herocode && deck.meta == `{"aspect":"${heroAspect}"}`) {
        chosenDecks.push(deck);
      } else {
        innerLoop: for (const aspect of aspects) {
          if(deck.meta === `{"aspect":"${aspect}"}`) {
            aspectDecks[aspect].push(deck);
            break innerLoop;
          }
        }
      }
    }

  } else { //for ordinary heroes that play nice
    aspectDecks = [];

    for (const deck of deckListData) {
      //for most heroes we search by hero and aspect combination
      if (deck.investigator_code === herocode && deck.meta == `{"aspect":"${heroAspect}"}`) {
        chosenDecks.push(deck);
      } else if (deck.meta == `{"aspect":"${heroAspect}"}`) {
        //these are the decks that match the aspect and NOT the hero
        aspectDecks.push(deck);
      }
    }
    aspectDeckCount = aspectDecks.length;
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

  //I'd love to make a function out of this but our four rascals each need very different things from this chunk
  const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
    const cardName = findNameByCode(cardsData, cardCode);
    const cardPhoto = findPhotoByCode(cardsData, cardCode);
    const cardUrl = findURLByCode(cardsData, cardCode);
    const heroAndAspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;

    // This is where things get hinky if we have Cyclops or Gamora
    if (herocode == "33001a" || herocode == "18001a") {//Cyclops or Gamora respectively
      const cardAspect = findAspectByCode(cardsData, cardCode);
      // need to do an if statement because apparently there are naughty people who put leadership cards inside of aggression decks and break my code
      if (aspectDecks[cardAspect]) {
        const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);

        // one extra hoop to jump through if it is a basic card is to point it at its parent aspect
        let aspectCount;
        let aspectPercentage;
        if (cardAspect == "basic") {
          aspectCount = aspectDecks[heroAspect].filter(deck => deck.slots[cardCode] > 0).length;
          aspectPercentage = Math.round((aspectCount / aspectDecks[heroAspect].length) * 100);
        } else {
          aspectCount = aspectDecks[cardAspect].filter(deck => deck.slots[cardCode] > 0).length;
          aspectPercentage = Math.round((aspectCount / aspectDecks[cardAspect].length) * 100);
        }
        
        const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
        return { code: cardCode, cardName, cardPhoto, percentage: heroAndAspectPercentage, synergyPercentage, cardUrl };
      } else {
        // code: 0 will skip the card during buildCardDiv
        return { code: 0, cardName, cardPhoto, percentage: 0, synergyPercentage: 0 };
      }
      
    } else { //ordinary hero that's not giving us problems
      const aspectCount = aspectDecks.filter(deck => deck.slots[cardCode] > 0).length;
      const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
      const aspectPercentage = Math.round((aspectCount / aspectDeckCount) * 100);
      const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
      return { code: cardCode, cardName, cardPhoto, percentage: heroAndAspectPercentage, synergyPercentage, cardUrl };
    }
  })
  .filter(({ percentage }) => percentage >= 5) // remove entries whose percentage is less than 5
 
  //now abide by selected percentage preference
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
  const heroName = findHeroByCode(heroNamesData, herocode);
  buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv);

  const cardResultsDiv = document.getElementById("card-results");
  cardResultsDiv.innerHTML = "";
  buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv);
}


function buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv) {
  const heroHeader = document.createElement("h3");
  heroHeader.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}


export function buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv) {
  const ul = document.createElement("ul");
  ul.setAttribute("class", "center");
  
  cardInfo.forEach(({ code, cardName, cardPhoto, percentage, synergyPercentage, cardUrl }) => {
    if (code == 0) {
      return;
    }
    const li = document.createElement("li");
    li.setAttribute("class", "center");
    li.innerHTML = `<p id="${code}"><a href="${cardUrl}"><strong>${cardName}</strong></a></p>`;
    //in case of bad photo, use placeholder
    if (cardPhoto == null) {
      li.innerHTML += `<img src="/images/not_found.png" alt="Image of ${cardName}"><br>`;
    } else {
      li.innerHTML += `<img src="https://marvelcdb.com/${cardPhoto}" alt="Image of ${cardName}"><br>`;
    }
    li.innerHTML += `${percentage}% of ${totalChosenDecks} decks<br>`;
    //positive vs negative synergy
    if (synergyPercentage > 0) {
    li.innerHTML += `+${synergyPercentage}% synergy`;
    } else {
    li.innerHTML += `${synergyPercentage}% synergy`;
    }
    ul.appendChild(li);
  });
  cardResultsDiv.appendChild(ul);
}