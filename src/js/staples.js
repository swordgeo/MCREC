import { createRadios } from "./hero_selector.js";
import { capitalize, findAspectByCode, findNameByCode, findPhotoByCode, findURLByCode, getJSON, getSelectedRadioButtonValue, hamburger, loadHeaderFooter } from "./utils.js";

const deckListData = await getJSON("/json/deck_data_sample.json");
const cardsData = await getJSON("/json/card_data_sample.json");

loadHeaderFooter().then(header => {
  hamburger(header);
});

const radio = document.getElementById("aspect-select");
const radioMaker = createRadios("staple-radio", true);
radio.appendChild(radioMaker);
const radios = document.getElementsByName("staple-radio");

for (let i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", receiveClick);
}


async function receiveClick() {
  displayStaples(getSelectedRadioButtonValue(radios));
}


async function displayStaples(aspect) {
    //these are the decks of the chosen aspect
    const chosenDecks = [];
    // this is a nested list now therefore we're going to iterate by sublist (day)
    for (const deck of deckListData) {
      //if basic is selected it doesn't matter, otherwise match aspect
      if (aspect == "basic" || deck.meta == `{"aspect":"${aspect}"}`) {
        chosenDecks.push(deck);
      }
    }

    const cardCounts = chosenDecks.reduce((counts, deck) => {
      const cardsInDeck = Object.entries(deck.slots);
      const filteredCards = cardsInDeck.filter(([cardCode, count]) => {
        return count > 0;
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
      const cardUrl = findURLByCode(cardsData, cardCode);
      const aspectCount = chosenDecks.filter(deck => deck.slots[cardCode] > 0).length;
      const percentage = Math.round((aspectCount / totalChosenDecks) * 100);
      return { code: cardCode, cardName, cardPhoto, percentage, cardUrl };
    })
    .filter(({ percentage }) => percentage >= 5) // remove entries whose percentage is less than 5
    .sort((a, b) => b.percentage - a.percentage) // sort by percentage from highest to lowest

    cardInfo.sort((a, b) => b.percentage - a.percentage);

    const heroHeaderDiv = document.getElementById("staple-header");
    const Aspect = capitalize(aspect);
    //clear it in case it's a resubmit
    heroHeaderDiv.innerHTML = `<h2>${Aspect} Staples</h2>`;

    const cardResultsDiv = document.getElementById("staple-results");
    cardResultsDiv.innerHTML = "";
    buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv, aspect);
}


//unfortunately also can't import this because we have no "synergy percentage" now
export function buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv, aspect) {
  const ul = document.createElement("ul");
  ul.setAttribute("class", "center");
  
  cardInfo.forEach(({ code, cardName, cardPhoto, percentage, cardUrl }) => {
    if (code == 0 || (findAspectByCode(cardsData, code) != aspect)) {
      return;
    }
    const li = document.createElement("li");
    li.setAttribute("class", "center");
    li.innerHTML = `<p id="${code}"><a href="${cardUrl}"><strong>${cardName}</strong></a></p>`;
    //in case of bad photo, use placeholder
    if (cardPhoto == null) {
      li.innerHTML += `<img src="/images/not_found.png"><br>`;
    } else {
      li.innerHTML += `<img src="https://marvelcdb.com/${cardPhoto}"><br>`;
    }
    li.innerHTML += `${percentage}% of ${totalChosenDecks} decks<br>`;
    ul.appendChild(li);
  });
  cardResultsDiv.appendChild(ul);
}