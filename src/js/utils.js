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


export async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}


export function fillHeaderFooter() {

  document.querySelector('header').innerHTML =
  parentElement.insertAdjacentHTML(position, template);
}

export async function loadTemplate(path) {
  const html = await fetch(path);
  const template = await html.text();
  return template;
}

export async function loadHeaderFooter() {
  const header = document.querySelector('header');
  const headerTemplate = await loadTemplate("../snippets/header.html");

  renderWithTemplate(headerTemplate, header);

  const footer = document.querySelector('footer');
  const footerTemplate = await loadTemplate("../snippets/footer.html");
  renderWithTemplate(footerTemplate, footer);
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