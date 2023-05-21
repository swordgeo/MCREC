import { processHeroDecks } from "./process_heroes.js";
import { processAdamWarlockDecks } from "./adam_warlock.js";
import { processSpiderWomanDecks } from "./spider_woman.js";
import { createHeroSelector } from "./hero_selector.js";
import { disableRadios, getJSON, getSelectedRadioButtonValue, hamburger, loadHeaderFooter } from "./utils.js";


const heroNamesData = await getJSON("/json/hero_names.json");
loadHeaderFooter().then(header => {
  hamburger(header);
});

await createHeroSelector(heroNamesData);

//Add event listeners for the hero and aspect selectors
const heroSelector = document.getElementById("hero-selector");
const radio1 = document.getElementsByName("aspect");
const submitButton = document.getElementById("submitBtn");
const radio2Div = document.getElementById("aspect2");
const radio2 = document.getElementsByName("aspect2");

// Add event listeners to selector and radio buttons
heroSelector.addEventListener("change", handleSelectionChange);
for (let i = 0; i < radio1.length; i++) {
  radio1[i].addEventListener("change", handleSelectionChange);
}
for (let i = 0; i < radio2.length; i++) {
  radio2[i].addEventListener("change", handleSelectionChange);
}
submitButton.addEventListener("click", handleSubmit);


// Function to handle selection changes
function handleSelectionChange() {
  
  if (heroSelector.value == "21031a") { // Adam Warlock
    //disable aspect buttons and enable Get Results
    disableRadios(radio1, true);
    disableRadios(radio2, true);
    radio2Div.style.display = "none";
    submitButton.disabled = false;
  } else if (heroSelector.value == "04031a") { //Spider-Woman
    //make sure Adam isn't screwing up radios
    disableRadios(radio1, false);
    disableRadios(radio2, false);
    radio2Div.style.display = "block";

    //if both aspects as selected and are not the same, activate
    if (getSelectedRadioButtonValue(radio1) && getSelectedRadioButtonValue(radio2) && (getSelectedRadioButtonValue(radio1) !== getSelectedRadioButtonValue(radio2))) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }

  } else if (heroSelector.value && getSelectedRadioButtonValue(radio1) && (heroSelector.value !== "none")) {
    //ordinary hero, proceed
    disableRadios(radio1, false);
    disableRadios(radio2, false);
    radio2Div.style.display = "none";
    // Enable submit button
    submitButton.disabled = false;
  } else {
    //Fields are blank, don't proceed
    disableRadios(radio1, false);
    disableRadios(radio2, false);
    radio2Div.style.display = "none";
    // Disable submit button
    submitButton.disabled = true;
  }
}


async function handleSubmit(event) {
  event.preventDefault(); // Prevent page refresh
  const herocode = heroSelector.value;
  const heroAspect = getSelectedRadioButtonValue(radio1);
  const percentageType = getSelectedRadioButtonValue(document.getElementsByName("percentage-selector"));

  if (herocode == "21031a") { //Adam Warlock
    await processAdamWarlockDecks(percentageType);
  } else if (herocode == "04031a") { //Spider-Woman
    const heroAspect2 = getSelectedRadioButtonValue(radio2);
    await processSpiderWomanDecks(heroAspect, heroAspect2, percentageType);
  } else {
    await processHeroDecks(herocode, heroAspect, heroNamesData, percentageType);
  }
}