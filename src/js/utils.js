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


