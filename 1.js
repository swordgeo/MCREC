// Load the hero card list
fetch('hero_cards_list.json')
  .then(response => response.json())
  .then(heroCardList => {

    // Load the deck data
    fetch('deck_data_sample.json')
      .then(response => response.json())
      .then(deckData => {

        // Find the decks with investigator_name equal to "Colossus"
        const colossusDecks = deckData.filter(deck => deck.investigator_name === 'Colossus');

        // Compile a list of all cards in the Colossus decks, excluding hero cards
        const allCards = {};
        colossusDecks.forEach(deck => {
          const slots = deck.slots || {};
          Object.keys(slots).forEach(code => {
            if (!heroCardList.includes(code)) {
              if (allCards[code]) {
                allCards[code] += slots[code];
              } else {
                allCards[code] = slots[code];
              }
            }
          });
        });

        // Create an <ul> element to hold the card list
        const cardList = document.createElement('ul');

        // Create an <li> element for each card and append it to the <ul> element
        Object.keys(allCards).forEach(code => {
          const card = { code, quantity: allCards[code] };
          const li = document.createElement('li');
          li.textContent = `${card.quantity} x ${card.code}`;
          cardList.appendChild(li);
        });

        // Insert the <ul> element into the page
        const allCardsDiv = document.getElementById('all-cards');
        allCardsDiv.appendChild(cardList);
      });
  });