// export async function processHeroDecks(heroName, heroAspect, heroCardsData, deckListData) {

//   const chosenDecks = [];
//   for (const dayData of deckListData) {
//     for (const deck of dayData) {
//       if (deck.investigator_name === heroName && deck.meta == "{\"aspect\":\"" + heroAspect + "\"}") {
//         chosenDecks.push(deck);
//       }
//     }
//   }
 
//   const cardCounts = chosenDecks.reduce((counts, deck) => {
//     const cardsInDeck = Object.entries(deck.slots);
//     const filteredCards = cardsInDeck.filter(([cardCode, count]) => {
//       return count > 0 && !heroCardsData.includes(cardCode);
//     });
//     filteredCards.forEach(([cardCode, count]) => {
//       counts[cardCode] = counts[cardCode] || 0;
//       counts[cardCode]++;
//     });
//     return counts;
//   }, {});

//   const totalChosenDecks = chosenDecks.length;

//   const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
//     const percentage = Math.round((count / totalChosenDecks) * 100);
//     return { code: cardCode, count, percentage };
//   });

//   cardInfo.sort((a, b) => b.count - a.count);


//   const selectedHeroP = document.createElement('p');
//   selectedHeroP.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
//   const allCardsDiv = document.getElementById('all-cards');
//   allCardsDiv.appendChild(selectedHeroP);

//   const ul = document.createElement('ul');
//   cardInfo.forEach(({ code, count, percentage }) => {
//     const li = document.createElement('li');
//     li.textContent = `${percentage}% of ${totalChosenDecks} decks: ${code}`;
//     ul.appendChild(li);
//   });

//   allCardsDiv.appendChild(ul);
// }

export async function processHeroDecks(heroName, heroAspect, heroCardsData, deckListData) {

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

  /*
  const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
    const percentage = Math.round((count / totalChosenDecks) * 100);
    return { code: cardCode, count, percentage };
  });

  cardInfo.sort((a, b) => b.count - a.count);
*/
  
  const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
  const heroAndAspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;
  const aspectCount = aspectDecks.filter(deck => deck.slots[cardCode] > 0).length;
  const heroAndAspectPercentage = Math.round((heroAndAspectCount / totalChosenDecks) * 100);
  const aspectPercentage = Math.round((aspectCount / aspectDeckCount) * 100);
  const synergyPercentage = heroAndAspectPercentage - aspectPercentage;
  return { code: cardCode, count, percentage: heroAndAspectPercentage, synergyPercentage };
});


  const selectedHeroP = document.createElement('p');
  selectedHeroP.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
  const allCardsDiv = document.getElementById('all-cards');
  allCardsDiv.appendChild(selectedHeroP);

  const ul = document.createElement('ul');
  cardInfo.forEach(({ code, count, percentage, synergyPercentage }) => {
    const li = document.createElement('li');
    li.innerHTML = `${code}<br>
    ${percentage}% of ${totalChosenDecks} decks<br>
    ${synergyPercentage}% synergy`;
    ul.appendChild(li);
  });

  allCardsDiv.appendChild(ul);
}