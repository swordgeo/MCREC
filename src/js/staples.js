import { createRadios } from "./hero_selector.js";
import { getSelectedRadioButtonValue } from "./main.js";
import { capitalize, getJSON, hamburger, loadHeaderFooter } from "./utils.js";

const deckListData = await getJSON("/json/deck_data_sample.json");
const cardsData = await getJSON("/json/card_data_sample.json");


loadHeaderFooter().then(header => {
  hamburger(header);
});

const radio = document.getElementById("aspect-select");
const radioMaker = createRadios("staple-radio", true);
radio.appendChild(radioMaker);

// createRadios(radioName)
for (let i = 0; i < radio.length; i++) {
  radio[i].addEventListener('change', displayStaples);
}

async function displayStaples() {
  const aspect = getSelectedRadioButtonValue(radio);
    //these are the decks of the chosen aspect
    const chosenDecks = [];
    // this is a nested list now therefore we're going to iterate by sublist (day)
    for (const dayData of deckListData) {
      for (const deck of dayData) {
        //if basic is selected it doesn't matter, otherwise match aspect
        if (aspect == "basic" || deck.meta == `{"aspect":"${aspect}"}`) {
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

    //unfortunately cannot reuse from process_heroes because we're crunching different numbers
    //maybe one day if I care I'll play around with classes and inheritance to make this simpler
    const cardInfo = Object.entries(cardCounts).map(([cardCode, count]) => {
      const cardName = findNameByCode(cardsData, cardCode);
      const cardPhoto = findPhotoByCode(cardsData, cardCode);
      const aspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;
      const percentage = Math.round((aspectCount / totalChosenDecks) * 100);

      return { code: cardCode, cardName, cardPhoto, count, percentage };
    });

    const heroHeaderDiv = document.getElementById("hero-header");
    const Aspect = capitalize(aspect);
    //clear it in case it's a resubmit
    heroHeaderDiv.innerHTML = `<h2>${Aspect} Staples</h2>`;

}

//unfortunately also can't import this because we have no "synergy percentage" now
export function buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv) {
  const ul = document.createElement('ul');
  
  // sort cardInfo by synergyPercentage in descending order
  cardInfo.sort((a, b) => b.synergyPercentage - a.synergyPercentage);
  
  cardInfo.forEach(({ code, cardName, cardPhoto, percentage, synergyPercentage }) => {
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