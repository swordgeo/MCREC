import { processHeroDecks } from './process_heroes.js';
import { processAdamWarlockDecks } from './adam_warlock.js';
import { processSpiderWomanDecks } from './spider_woman.js';
import { createHeroSelector, createRadios } from './hero_selector.js';
import { disableRadios, getJSON } from './utils.js';


const heroNamesData = await getJSON('/src/json/hero_names.json');
const heroCardsData = await getJSON('/src/json/hero_cards_list.json');
const deckListData = await getJSON('/src/json/deck_data_sample.json');
const cardsData = await getJSON('/src/json/card_data_sample.json');


// const heroName = "Doctor Strange";
// const heroAspect = "aggression";
// await processHeroDecks(heroName, heroAspect, heroCardsData, deckListData, cardsData);

await createHeroSelector(heroNamesData);

//Add event listeners for the hero and aspect selectors
const heroSelector = document.getElementById('hero-selector');
const radio1 = document.getElementsByName('aspect');
const submitButton = document.getElementById('submitBtn');
const radio2Div = document.getElementById('aspect2');
const radio2 = document.getElementsByName('aspect2');
const allRadios = document.querySelectorAll('input[type="radio"]');

// Add event listeners to selector and radio buttons
heroSelector.addEventListener('change', handleSelectionChange);
for (let i = 0; i < radio1.length; i++) {
  radio1[i].addEventListener('change', handleSelectionChange);
}
for (let i = 0; i < radio2.length; i++) {
  radio2[i].addEventListener('change', handleSelectionChange);
}
submitButton.addEventListener('click', handleSubmit);


//Check for Spider-Woman -> create a second radio button
//Check for Adam Warlock -> disable the first radio button!

//Maybe add a big fat button to SHOW RESULTS or whatever.

//Pass in as heroName and heroAspect for processHeroDecks

// Function to handle selection changes
function handleSelectionChange() {
  
  if (heroSelector.value == "21031a") { // Adam Warlock
    //disable aspect buttons and enable Get Results
    disableRadios(allRadios, true);
    radio2Div.style.display = "none";
    submitButton.disabled = false;
  } else if (heroSelector.value == "04031a") { //Spider-Woman
    //make sure Adam isn't screwing up radios
    disableRadios(allRadios, false);
    radio2Div.style.display = "block";

    //if both aspects as selected and are not the same, activate
    if (getSelectedRadioButtonValue(radio1) && getSelectedRadioButtonValue(radio2) && (getSelectedRadioButtonValue(radio1) !== getSelectedRadioButtonValue(radio2))) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }

  } else if (heroSelector.value && getSelectedRadioButtonValue(radio1) && (heroSelector.value !== "none")) {
    //ordinary hero, proceed
    disableRadios(allRadios, false);
    radio2Div.style.display = "none";
    // Enable submit button
    submitButton.disabled = false;
  } else {
    //Fields are blank, don't proceed
    disableRadios(allRadios, false);
    radio2Div.style.display = "none";
    // Disable submit button
    submitButton.disabled = true;
  }
}

// Function to retrieve the value of the selected radio button
function getSelectedRadioButtonValue(radioSet) {
  for (let i = 0; i < radioSet.length; i++) {
    if (radioSet[i].checked) {
      return radioSet[i].value;
    }
  }
  return null;
}

async function handleSubmit(event) {
  event.preventDefault(); // Prevent page refresh
  const herocode = heroSelector.value;
  const heroAspect = getSelectedRadioButtonValue(radio1);

  if (herocode == "21031a") { //Adam Warlock
    await processAdamWarlockDecks(heroCardsData, deckListData, cardsData);
  } else if (herocode == "04031a") { //Spider-Woman
    const heroAspect2 = getSelectedRadioButtonValue(radio2);
    await processSpiderWomanDecks(heroAspect, heroAspect2, heroCardsData, deckListData, cardsData);
  } else {
    await processHeroDecks(herocode, heroAspect, heroCardsData, deckListData, cardsData);
  }
}