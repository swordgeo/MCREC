import { capitalize } from "./utils.js";

export async function createHeroSelector(heroCardsData) {
  const selectorSection = document.querySelector("#hero-select");
  
  const selectorDiv = document.createElement("div");
  selectorDiv.setAttribute("id", "hero");
  
  

  //Make a selector for all the heroes, id is their hero code, visible is their hero name

  selectorDiv.innerHTML = `<label for="hero-selector">Choose your hero</label>`;

  const heroSelect = document.createElement("select");
  heroSelect.setAttribute("name", "hero-selector");
  heroSelect.setAttribute("id", "hero-selector");
  heroSelect.innerHTML = `<option value="none" selected disabled hidden>Choose your hero</option>`;

  for (const hero of heroCardsData) {
    //heroname, cardcode
    const option = document.createElement("option");
    option.setAttribute("value", hero.cardcode);
    option.textContent = hero.heroname;
    heroSelect.appendChild(option);
  }
  selectorDiv.appendChild(heroSelect);
  selectorSection.appendChild(selectorDiv);

  //Make a radio button for each aspect
  //We're gonna make this an exportable function in anticipation for Spider-Woman shenanigans
  const radio = createRadios("aspect");
  selectorSection.appendChild(radio);
  //Actually I think we're just gonna make it right here, then hide with CSS
  const radio2 = createRadios("aspect2");
  selectorSection.appendChild(radio2);

  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("disabled", "");
  submitBtn.setAttribute("id", "submitBtn");
  submitBtn.textContent = "Get Results";
  selectorSection.appendChild(submitBtn);



}

export function createRadios(radioName, basic = false) {
  const div = document.createElement("div");
  div.setAttribute("id", radioName);
  const aspects = ["aggression", "justice", "leadership", "protection"];
  if (basic) {
    aspects.push("basic");
  }
  aspects.forEach(createRadio);
  function createRadio(aspect) {
    const radioLabel = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.setAttribute("type", "radio");
    radioInput.setAttribute("name", radioName);
    radioInput.setAttribute("value", aspect);
    radioLabel.appendChild(radioInput);
    radioLabel.append(capitalize(aspect));
    div.appendChild(radioLabel);
  }
  return div;
}