import { findAspectByCode, findHeroByCode, findNameByCode, findPhotoByCode, findURLByCode, getJSON, setLocalStorage } from "./utils.js";

// export async function processHeroDecks(herocode, heroAspect, heroCardsData, heroNamesData, deckListData, cardsData) {
export async function processHeroDecks(herocode, heroAspect, heroNamesData) {

  const heroCardsData = await getJSON('/json/hero_cards_list.json');
  const deckListData = await getJSON('/json/deck_data_sample.json');
  const cardsData = await getJSON('/json/card_data_sample.json');

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

  } else {
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
        const aspectCount = aspectDecks[cardAspect].filter(deck => deck.slots[cardCode] > 0).length;
        const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
        const aspectPercentage = Math.round((aspectCount / aspectDecks[cardAspect].length) * 100);
        const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
        return { code: cardCode, cardName, cardPhoto, percentage: heroAndAspectPercentage, synergyPercentage, cardUrl };
      } else {
        // code: 0 will skip the card during buildCardDiv
        return { code: 0, cardName, cardPhoto, percentage: 0, synergyPercentage: 0 };
      }
    } else {
      const aspectCount = aspectDecks.filter(deck => deck.slots[cardCode] > 0).length;
      const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
      const aspectPercentage = Math.round((aspectCount / aspectDeckCount) * 100);
      const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
      return { code: cardCode, cardName, cardPhoto, percentage: heroAndAspectPercentage, synergyPercentage, cardUrl };
    }
  })
  .filter(({ percentage }) => percentage >= 5) // remove entries whose percentage is less than 5
  .sort((a, b) => b.synergyPercentage - a.synergyPercentage) // sort by percentage from highest to lowest

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
  setLocalStorage("hero/aspect", {herocode, heroAspect});
}


function buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv) {
  const heroHeader = document.createElement('h3');
  heroHeader.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}


export function buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv) {
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'center');
  
  cardInfo.forEach(({ code, cardName, cardPhoto, percentage, synergyPercentage, cardUrl }) => {
    if (code == 0) {
      return;
    }
    const li = document.createElement('li');
    li.setAttribute('class', 'center');
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