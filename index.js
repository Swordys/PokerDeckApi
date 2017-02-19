var express = require('express');
var bodyParser = require('body-parser');
const app = express();
// const cards = require('./card.js');
const Deck = require('./Deck.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

Deck(app);

const server = app.listen(3000, () => {
  console.log('Server is running on port :3000')
});