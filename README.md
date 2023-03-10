# MCREC

This is a tool inspired by edhrec.com to provide deckbuilding advice for Marvel Champions LCG produced by Fantasy Flight Games.
The decklists and card data for this tool come from the API provided by MarvelCDB
https://marvelcdb.com/api/


## The Proposal

### Overview:

#### What is the problem we are trying to solve?

Some players are simply not very good deckbuilders for this game (like myself!)
A couple of my friends meanwhile are good at finding generic "goodstuff" rather than finding specific cards that pair well with the strengths of individual heroes, and their ability to contribute to a multiplayer game (or prevail against harder villains while playing solo) suffer as a result.
Some players even dismiss earnestly good heroes that they otherwise might have enjoyed for this reason.

#### Why are we doing this?

I want to help myself, my friends, and any new players to the game make informed decisions as they explore the possibilities of this game.

### Who is the audience?

Anyone deckbuilding for Marvel Champions LCG that wants to up their game.

### List of the major functions of the application. What will it do? List these in as much detail as you can.

The main focus of the website is going to be the "hero guide" page. The user will choose from a list each of the heroes in the game, as well as each aspect in the game (this will become trickier for Adam Warlock and Spider-Woman due to the nature of their aspect-cheating).

Once chosen, the site will iterate through each card of each deck containing the chosen hero/aspect combination and determine for each card its "synergy score" - (the popularity of that card for that hero/aspect) minus (other decks of that aspect).

At least one more page will be the "staples" list in which you can choose any aspect/basic cards and it will tell you the most commonly used cards overall.
Maybe for added functionality you can choose staples by card types - we'll see.

### Wireframes of the major views (Mobile and desktop...do the mobile wireframes first!)

You'll find my wireframes in the /images/wireframes/ folder
https://github.com/swordgeo/MCREC/blob/master/images/wireframes/MCREC%20wireframe%20-%20mobile.jpg
https://github.com/swordgeo/MCREC/blob/master/images/wireframes/MCREC%20wireframe%20-%20desktop.jpg


### Data sources (External API, localStorage, local JSON file, etc.)

We will be using MarvelCDB's API to source my data. I'm going to be making an aggressively large amount of calls so it's likely that I'll be making my own backend (or at least some local JSON files) to avoid straining their resources.
https://marvelcdb.com/api/

### Initial Module list

MongoDB, fs-extra, 

### Colors/Typography/specific element styling

Whatever will look good on Coolors. I honestly don't know what I'm going to do here because I will inevitably choose ugly colors and my friends will advise me to change them.

### Schedule to provide yourself mile markers along the way to help you stay on target.

End of week four: Organize skeleton and build Trello board
Week five: Finish adding muscle to hero guide page with 90 or 180 days of data
Week six: Finish adding skin to hero guide and add muscle to staples page
Week seven: Make it purty-like

### Link to a Trello board with all the tasks you can think of at this point defined as cards. Again be as detailed as possible here.

https://trello.com/b/1eX8ZQpz/mcrec

