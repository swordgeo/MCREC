export async function processHeroDecks(herocode, heroAspect, heroCardsData, deckListData, cardsData) {

  //these are the decks of the chosen hero/aspect
  const chosenDecks = [];
  // this is a nested list now therefore we're going to iterate by sublist (day)
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      //for most heroes we search by hero and aspect combination
      //Adam Warlock and Spider-Woman will complicate this.
      if (deck.investigator_code === herocode && deck.meta == `{"aspect":"${heroAspect}"}`) {
        chosenDecks.push(deck);
      }
    }
  }
  
  //these are the decks that match the aspect and NOT the hero
  const aspectDecks = [];
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      if (deck.investigator_code !== herocode && deck.meta === `{"aspect":"${heroAspect}"}`) {
      aspectDecks.push(deck);
      }
    }
  }

  const aspectDeckCount = aspectDecks.length;

 
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

  const totalChosenDecks = chosenDecks.length;
  
  const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
    const cardName = findNameByCode(cardsData, cardCode);
    const cardPhoto = findPhotoByCode(cardsData, cardCode);
    const heroAndAspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;
    const aspectCount = aspectDecks.filter(deck => deck.slots[cardCode] > 0).length;
    const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
    const aspectPercentage = Math.round((aspectCount / aspectDeckCount) * 100);
    const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
    return { code: cardCode, cardName, cardPhoto, count, percentage: heroAndAspectPercentage, synergyPercentage };
  });

  //Let's shoot the template literals into two different functions
  //Header and cards
  const heroHeaderDiv = document.getElementById("hero-header");
  //clear it in case it's a resubmit
  heroHeaderDiv.innerHTML = '';
  const heroName = findNameByCode(cardsData, herocode);
  buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv);

  const cardResultsDiv = document.getElementById("card-results");
  cardResultsDiv.innerHTML = '';
  buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv);
}

function buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv) {
  const heroHeader = document.createElement('h2');
  heroHeader.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}

export function buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv) {
  const ul = document.createElement('ul');
  
  // sort cardInfo by synergyPercentage in descending order
  cardInfo.sort((a, b) => b.synergyPercentage - a.synergyPercentage);
  
  cardInfo.forEach(({ code, cardName, cardPhoto, count, percentage, synergyPercentage }) => {
    if (code == 0) {
      return;
    }
    const li = document.createElement('li');
    li.innerHTML = `<p id="${code}">${cardName}</p>`;
    //in case of bad photo, use placeholder
    if (cardPhoto == null) {
      li.innerHTML += `<img src="/images/Trollface_non-free.png"><br>`;
    } else {
      li.innerHTML += `<img src="https://marvelcdb.com/${cardPhoto}"><br>`;
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

//not used in this file but used for Adam Warlock and Spider-Woman
export function findAspectByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.faction_code : null;
}

export function findNameByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.name : null;
}

export function findPhotoByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.imagesrc : null;
}
