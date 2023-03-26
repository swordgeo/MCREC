import { updateDeckData } from './src/data-rips/data-rip.mjs';
import express from "express";
// const express = require('express');
const app = express();

// insert folder name here
// app.use(express.static('views'));

// app.use(express.static(__dirname));
app.use(express.static('src'));

// const deckListFileName = 'src/json/deck_data_sample2.json';
// const start_date = new Date(2022, 10, 13);
// const end_date = new Date(2022, 11, 13);

// ripDeckData(start_date, end_date, deckListFileName);
updateDeckData();


app.listen(3000, function() {
  console.log('Server listening on port 3000');
}); 