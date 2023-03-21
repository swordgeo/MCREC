import { processHeroDecks } from './process_heroes.js';
import { processAdamWarlockDecks } from './adam_warlock.js';
import { createHeroSelector, createRadios } from './hero_selector.js';
import { getJSON } from './utils.js';


const heroNamesData = await getJSON('../json/hero_names.json');
const heroCardsData = await getJSON('../json/hero_cards_list.json');
const deckListData = await getJSON('../json/deck_data_sample.json');
const cardsData = await getJSON('../json/card_data_sample.json');

// const heroName = "Doctor Strange";
// const heroAspect = "aggression";
// await processHeroDecks(heroName, heroAspect, heroCardsData, deckListData, cardsData);


await createHeroSelector(heroNamesData);

//Add event listeners for the hero and aspect selectors
const heroSelector = document.getElementById('hero-selector');
const radioButtons = document.getElementsByName('aspect');
const submitButton = document.getElementById('submitBtn');
const resultsContainer = document.getElementById('results-container');

// Add event listeners to selector and radio buttons

console.log('Document is ready');
console.log(heroSelector);
heroSelector.addEventListener('change', handleSelectionChange);
for (let i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener('change', handleSelectionChange);
}
submitButton.addEventListener('click', handleSubmit);


//Check for Spider-Woman -> create a second radio button
//Check for Adam Warlock -> disable the first radio button!

//Maybe add a big fat button to SHOW RESULTS or whatever.

//Pass in as heroName and heroAspect for processHeroDecks

// Function to handle selection changes
function handleSelectionChange() {
  // Check if both items have been selected
  //and heroSelector not default
  if (heroSelector.value && getSelectedRadioButtonValue() && (heroSelector.value !== "none")) {
    // Enable submit button
    submitButton.disabled = false;
  } else {
    // Disable submit button
    submitButton.disabled = true;
  }
}

// Function to retrieve the value of the selected radio button
function getSelectedRadioButtonValue() {
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      return radioButtons[i].value;
    }
  }
  return null;
}

async function handleSubmit(event) {
  event.preventDefault(); // Prevent page refresh
  const herocode = heroSelector.value;
  const heroAspect = getSelectedRadioButtonValue();
  // check for Adam-Warlock
  if (herocode == "21031a") {
    await processAdamWarlockDecks(heroCardsData, deckListData, cardsData);
  }
  await processHeroDecks(herocode, heroAspect, heroCardsData, deckListData, cardsData);
  // resultsContainer.innerHTML = 'Results for ' + selectedOption + ' and ' + selectedRadio;
}