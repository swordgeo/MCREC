//We may roll this back into the main file
//Then again it's probably better if we don't

export async function processAdamWarlockDecks(heroCardsData, deckListData) {

  console.log("Here we are");
  const chosenDecksByAspect = {
    Aggression: [],
    Justice: [],
    Leadership: [],
    Protection: []
  };

  // Divide each deck into aspect piles
  for (const dayData of deckListData) {
    for (const deck of dayData) {
      if (deck.investigator_name === 'Adam Warlock') {
        const aspect = deck.meta.aspect;
        chosenDecksByAspect[aspect].push(deck);
      }
    }
  }

  // Calculate card counts and percentages for each aspect separately
  const cardCountsByAspect = {};
  const totalChosenDecksByAspect = {};
  for (const [aspect, decks] of Object.entries(chosenDecksByAspect)) {
    const cardCounts = decks.reduce((counts, deck) => {
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

    const totalChosenDecks = decks.length;

    const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
      const percentage = Math.round((count / totalChosenDecks) * 100);
      return { code: cardCode, count, percentage };
    });

    cardCountsByAspect[aspect] = cardCounts;
    totalChosenDecksByAspect[aspect] = totalChosenDecks;
  }

  // Calculate the synergy score for each card
  const cardInfoWithSynergy = Object.entries(cardCountsByAspect).flatMap(([aspect, cardCounts]) => {
    const totalChosenDecks = totalChosenDecksByAspect[aspect];
    return Object.entries(cardCounts).map(([cardCode, count]) => {
      const synergyCounts = Object.values(cardCountsByAspect).filter(otherCardCounts => otherCardCounts.hasOwnProperty(cardCode));
      const synergyTotalDecks = Object.values(totalChosenDecksByAspect).reduce((sum, decks) => sum + (decks - totalChosenDecks), 0);
      const synergyPercentage = Math.round((synergyCounts.reduce((sum, counts) => sum + (counts[cardCode] || 0), 0) / synergyTotalDecks) * 100);
      const percentage = Math.round((count / totalChosenDecks) * 100);
      const synergyScore = synergyPercentage - percentage;
      return { code: cardCode, count, percentage, synergyScore };
    });
  });

  cardInfoWithSynergy.sort((a, b) => b.count - a.count);

  // Display the results
  const selectedHeroP = document.createElement('p');
  selectedHeroP.textContent = 'Selected Hero: Adam Warlock (all aspect decks)';
  const allCardsDiv = document.getElementById('all-cards');
  allCardsDiv.appendChild(selectedHeroP);

  const ul = document.createElement('ul');
  cardInfoWithSynergy.forEach(({ code, count, percentage, synergyScore }) => {
    const li = document.createElement('li');
    li.textContent = `${percentage}% of ${totalChosenDecks} decks, ${synergyScore}% synergy score: ${code}`;
    ul.appendChild(li);
  });
  allCardsDiv.appendChild(ul);
}