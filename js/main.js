import { processHeroDecks } from './process_heroes.js';
import { createHeroSelector } from './hero_selector.js';
import { getJSON } from './getJSON.js';

const heroCardsData = await getJSON('../json/hero_cards_list.json');
const deckListData = await getJSON('../json/deck_data_sample.json');
const cardsData = await getJSON('../json/card_data_sample.json');

const heroName = "Doctor Strange";
const heroAspect = "aggression";

// heroName, heroAspect, heroCardsData, deckListData
createHeroSelector(heroCardsData);
processHeroDecks(heroName, heroAspect, heroCardsData, deckListData, cardsData);