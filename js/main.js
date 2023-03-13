import { processHeroDecks } from './process_heroes.js';
import { getJSON } from './getJSON.js';

const heroCardsData = await getJSON('../json/hero_cards_list.json');
const deckListData = await getJSON('../json/deck_data_sample.json');

const heroName = "Hulk";
const heroAspect = "aggression";

// heroName, heroAspect, heroCardsData, deckListData
processHeroDecks(heroName, heroAspect, heroCardsData, deckListData);