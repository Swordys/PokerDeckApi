var express = require('express');

module.exports = (app) => {

  const cards = [{
    value: 'ace'
  }, {
    value: 'king'
  }, {
    value: 'queen'
  }, {
    value: 'jack'
  }];


  // Add cards
  app.post('/cards', (req, res) => {
    cards.push(req.body);
    res.json({
      info: 'card added successfully'
    });
  });

  // Get all cards
  app.get('/cards', (req, res) => {
    res.send(cards);
  });

  // Get face cards
  app.get('/face', (req, res) => {
    const faceCards = [...cards];
    faceCards.splice(0, 1);
    res.send(faceCards);
  });

  // Get certan card
  app.get('/cards/:id', (req, res) => {
    res.send(cards.find(c => c.value === req.params.id));
  });

  // Delete card
  app.delete('/cards/:id', (req, res) => {
    const item = cards.findIndex(c => c.value === req.params.id);
    cards.splice(item, 1);
    res.send(cards);
  });
}