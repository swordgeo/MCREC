// Spider-Woman prompt

export async function processSpiderWomanDecks(heroAspect, heroAspect2, heroCardsData, deckListData, cardsData) {
  console.log(`Here we are with ${heroAspect} and ${heroAspect2}`);
}


function calculateSynergyScores(heroName, heroAspect, allDeckData, heroCardsData) {
  const decksWithSameAspect = allDeckData.filter(deck => deck.investigator_name !== heroName && deck.meta.includes(`\"aspect\":\"${heroAspect}\"`));
  
  const cardCountsByAspect = {};
  for (const aspect of ASPECTS) {
    const decksWithSameAspectAndOther = allDeckData.filter(deck => deck.investigator_name !== heroName && deck.meta.includes(`\"aspect\":\"${aspect}\"`));
    
    const cardCounts = decksWithSameAspect.reduce((counts, deck) => {
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

    const totalDecksSameAspect = decksWithSameAspect.length;
    const totalDecksOtherAspect = decksWithSameAspectAndOther.length;
    
    const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
      const percentageSameAspect = Math.round((count / totalDecksSameAspect) * 100);
      const cardCountsOtherAspect = cardCountsByAspect[aspect] || {};
      const countOtherAspect = cardCountsOtherAspect[cardCode] || 0;
      const percentageOtherAspect = Math.round((countOtherAspect / totalDecksOtherAspect) * 100);
      const synergyScore = percentageSameAspect - percentageOtherAspect;
      return { code: cardCode, synergyScore };
    });

    cardInfo.forEach(({ code, synergyScore }) => {
      cardCountsByAspect[aspect] = cardCountsByAspect[aspect] || {};
      cardCountsByAspect[aspect][code] = synergyScore;
    });
  }

  return cardCountsByAspect;
}


// async function processHeroDecks(heroName, heroAspect, heroCardsData, deckListData) {
//   const allDeckData = deckListData.flat();

//   let cardInfo = [];
//   let totalChosenDecks = 0;

//   if (heroName === "Adam Warlock") {
//     cardInfo = await processAdamWarlockDecks(allDeckData, heroCardsData);
//     totalChosenDecks = allDeckData.filter(deck => deck.investigator_name === heroName).length;
//   } else if (heroName === "Spider-Woman") {
//     const heroAspects = heroAspect.split(",");
//     const synergyScoresByAspect = calculateSynergyScores(heroName, heroAspects[0], allDeckData, heroCardsData);

//     for (const aspect of heroAspects) {
//       const aspectSynergyScores = synergyScoresByAspect[aspect];
//       const chosenDecks = allDeckData.filter(deck => deck.investigator_name === heroName && deck.meta.includes(`\"aspect\":\"${aspect}\"\"`));
      
//       const cardCounts = chosenDecks.reduce((counts, deck) => {
//         const cardsInDeck = Object.entries(deck

        
        
//   for (const aspect of heroAspects) {
//     const decksOfAspect = heroDecks.filter(deck => deck.meta.includes(aspect));
//     const cardCounts = decksOfAspect.reduce((counts, deck) => {
//       const cardsInDeck = Object.entries(deck.slots);
//       const filteredCards = cardsInDeck.filter(([cardCode, count]) => {
//         return count > 0 && !heroCardsData.includes(cardCode);
//       });
//       filteredCards.forEach(([cardCode, count]) => {
//         counts[cardCode] = counts[cardCode] || { count: 0, synergy: 0 };
//         counts[cardCode].count++;
//       });
//       return counts;
//     }, {});

//     const totalDecksOfAspect = decksOfAspect.length;

//     const cardInfo = Object.entries(cardCounts).map(([cardCode, countData]) => {
//       const count = countData.count;
//       const percentage = Math.round((count / totalDecksOfAspect) * 100);
//       const synergyPercentage = Math.round((count / totalDecksOfAspectWithoutHero) * 100) - percentage;
//       return { code: cardCode, count, percentage, synergyPercentage };
//     });

//     cardInfo.sort((a, b) => b.count - a.count);

//     const aspectP = document.createElement('p');
//     aspectP.textContent = `${aspect} Aspect: ${totalDecksOfAspect} decks`;
//     allCardsDiv.appendChild(aspectP);

//     const ul = document.createElement('ul');
//     cardInfo.forEach(({ code, count, percentage, synergyPercentage }) => {
//       const li = document.createElement('li');
//       li.textContent = `${percentage}% of ${totalDecksOfAspect} decks (${synergyPercentage}% synergy): ${code}`;
//       ul.appendChild(li);
//     });

//     allCardsDiv.appendChild(ul);
//   }