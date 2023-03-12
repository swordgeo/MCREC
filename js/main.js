import { processHeroDecks } from './deck_processor.js';
import { getJSON } from './getJSON.js';

const heroCardsData = await getJSON('../json/hero_cards_list.json');
const deckListData = await getJSON('../json/deck_data_sample.json');

const heroName = "Groot";
const heroAspect = "aggression";

// heroName, heroAspect, heroCardsData, deckListData
processHeroDecks(heroName, heroAspect, heroCardsData, deckListData);