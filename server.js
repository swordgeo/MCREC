const express = require('express');
const app = express();

// insert folder name here
// app.use(express.static('views'));

// app.use(express.static(__dirname));
app.use(express.static('src'));


app.listen(3000, function() {
  console.log('Server listening on port 3000');
});