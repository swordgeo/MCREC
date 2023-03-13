export async function processHeroDecks(heroName, heroAspect, heroCardsData, deckListData) {

  const chosenDecks = [];
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      if (deck.investigator_name === heroName && deck.meta == "{\"aspect\":\"" + heroAspect + "\"}") {
        chosenDecks.push(deck);
      }
    }
  }
 
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
    const percentage = Math.round((count / totalChosenDecks) * 100);
    return { code: cardCode, count, percentage };
  });

  cardInfo.sort((a, b) => b.count - a.count);


  const selectedHeroP = document.createElement('p');
  selectedHeroP.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${heroAspect} decks)`;
  const allCardsDiv = document.getElementById('all-cards');
  allCardsDiv.appendChild(selectedHeroP);

  const ul = document.createElement('ul');
  cardInfo.forEach(({ code, count, percentage }) => {
    const li = document.createElement('li');
    li.textContent = `${percentage}% of ${totalChosenDecks} decks: ${code}`;
    ul.appendChild(li);
  });

  allCardsDiv.appendChild(ul);
}