// A catch all place for all the random functions that no longer deserve their own file
//We'll pretend to order these alphabetically but I see myself immediately breaking that convention

//does nothing but capitalizes the first letter of the word provided
export function capitalize(string) {
  const firstChar = string.charAt(0).toUpperCase();
  const finalWord = firstChar + string.slice(1);
  return finalWord;
}


export function disableRadios(radioList, bool) {
  for (let i = 0; i < radioList.length; i++) {
    radioList[i].disabled = bool;
  }
}


export function findAspectByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.faction_code : null;
}


export function findNameByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.name : null;
}


export function findPhotoByCode(cardsData, code) {
  const cardObj = cardsData.find(card => card.code === code);
  return cardObj ? cardObj.imagesrc : null;
}


export async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}


export function hamburger(header) {
  const x = header.querySelector('#hamburgerBtn');
  console.log(x); // check if element is found
  x.onclick = toggleMenu;
}



export async function loadHeaderFooter() {
  const header = document.querySelector('header');
  const headerTemplate = await loadTemplate("../snippets/header.html");

  renderWithTemplate(headerTemplate, header);

  const footer = document.querySelector('footer');
  const footerTemplate = await loadTemplate("../snippets/footer.html");
  renderWithTemplate(footerTemplate, footer);

  return header;
}


export async function loadTemplate(path) {
  const html = await fetch(path);
  const template = await html.text();
  return template;
}


export function renderWithTemplate(
  template,
  parentElement,
  position = "afterbegin",
  data,
  callback
) {
  parentElement.insertAdjacentHTML(position, template);
  if (callback) {
    callback(data);
  }
}

function toggleMenu() {
  console.log("toggleMenu called");
  const primaryNav = document.getElementById('primaryNav');
  console.log(primaryNav); // check if element is found
  primaryNav.classList.toggle("open");
  document.getElementById('hamburgerBtn').classList.toggle("open");
}