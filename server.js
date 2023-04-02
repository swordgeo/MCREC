import { updateDeckData } from "./src/data-rips/data-rip.mjs";
import express from "express";
const app = express();

app.use(express.static("src"));

// eventually we will either reinstate this or perhaps put it inside a place so it"s called manually, we"ll see.
updateDeckData();

app.listen(3000, function() {
  console.log("Server listening on port 3000");
});