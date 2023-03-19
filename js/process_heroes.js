export async function processHeroDecks(heroName, heroAspect, heroCardsData, deckListData, cardsData) {

  //these are the decks of the chosen hero/aspect
  const chosenDecks = [];
  // this is a nested list now therefore we're going to iterate by sublist (day)
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      //for most heroes we search by hero and aspect combination
      //Adam Warlock and Spider-Woman will complicate this.
      if (deck.investigator_name === heroName && deck.meta == "{\"aspect\":\"" + heroAspect + "\"}") {
        chosenDecks.push(deck);
      }
    }
  }
  
  //these are the decks that match the aspect and NOT the hero
  const aspectDecks = [];
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      if (deck.investigator_name !== heroName && deck.meta === `{"aspect":"${heroAspect}"}`) {
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
  buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv);

  const allCardsDiv = document.getElementById("all-cards");
  buildCardDiv(cardInfo, totalChosenDecks, allCardsDiv);
}

function buildHeroHeader(heroName, heroAspect, totalChosenDecks, heroHeaderDiv) {
  const heroHeader = document.createElement('h2');
  heroHeader.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}

function buildCardDiv(cardInfo, totalChosenDecks, allCardsDiv) {
  const ul = document.createElement('ul');
  
  // sort cardInfo by synergyPercentage in descending order
  cardInfo.sort((a, b) => b.synergyPercentage - a.synergyPercentage);
  
  cardInfo.forEach(({ code, cardName, cardPhoto, count, percentage, synergyPercentage }) => {
    const li = document.createElement('li');
    //two versions based on positive or negative synergy
    if (synergyPercentage > 0) {
      li.innerHTML = `<p id="${code}">${cardName}</p>
      <img src="https://marvelcdb.com/${cardPhoto}"><br>
      ${percentage}% of ${totalChosenDecks} decks<br>
      +${synergyPercentage}% synergy`;
      ul.appendChild(li);
    } else {
      li.innerHTML = `<p id="${code}">${cardName}</p>
      ${percentage}% of ${totalChosenDecks} decks<br>
      ${synergyPercentage}% synergy`;
      ul.appendChild(li);
    }
  });
  allCardsDiv.appendChild(ul);
}

function findNameByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.name : null;
}

function findPhotoByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.imagesrc : null;
}