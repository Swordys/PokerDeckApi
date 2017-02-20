var express = require('express');

module.exports = (app) => {
  function constructor() {
    // Dynamic deck creating
    const cards = ['Ace', 'King', 'Queen', 'Jack', 10, 9, 8, 7, 6, 5, 4, 3, 2];
    const suits = ['Club', 'Diamond', 'Spade', 'Heart'];
    this.suits = [];
    this.deck = [];

    suits.forEach(suit => {
      const suitObj = {
        color: suit === 'Club' || suit === 'Spade' ? 'Black' : 'Red',
        suitValue: suit,
        suitUnicode: unicodeValue(suit),
      }
      this.suits.push(suitObj);
    }, this);

    this.suits.forEach(suitObj => {
      let rankCount = 14;
      const suitVal = suitObj.suitValue;

      cards.forEach(card => {
        if (Number.isInteger(card)) {
          // Claculate Card unicode
          const unicodeLetter = suitVal === 'Heart' ? 'B' : suitVal === 'Spade' ? 'A' : suitVal === 'Diamond' ? 'C' : suitVal === 'Club' ? 'D' : null;
          const unicodeNumber = card === 10 ? 'A' : card;
          const cardUnicode = `1F0${unicodeLetter}${unicodeNumber}`;
          const cardSvg = `https://raw.githubusercontent.com/Swordys/pokerApi/master/cardFold/${cardUnicode}.svg`;
          const cardOjb = {
            rank: rankCount,
            faceCard: false,
            cardValue: card.toString(),
            name: numberValue(card),
            cardName: `${card.toString()} of ${suitVal}s`,
            cardColor: `${suitObj.color}`,
            cardSuit: `${suitVal}`,
            cardUnicode,
            cardSvg
          }
          this.deck.push(cardOjb);

        } else {
          // Claculate Card unicode
          const unicodeLetter = suitVal === 'Heart' ? 'B' : suitVal === 'Spade' ? 'A' : suitVal === 'Diamond' ? 'C' : suitVal === 'Club' ? 'D' : null;
          const unicodeNumber = card === 'Ace' ? 1 : card === 'King' ? 'E' : card === 'Queen' ? 'D' : card === 'Jack' ? 'C' : null;
          const cardUnicode = `1F0${unicodeLetter}${unicodeNumber}`;
          const cardSvg = `https://raw.githubusercontent.com/Swordys/pokerApi/master/cardFold/${cardUnicode}.svg`;

          const cardOjb = {
            rank: rankCount,
            faceCard: card === 'King' || card === 'Queen' || card === 'Jack' ? true : false,
            cardValue: card.charAt(0),
            name: card,
            cardName: `${card} of ${suitVal}s`,
            cardColor: `${suitObj.color}`,
            cardSuit: `${suitVal}`,
            cardUnicode,
            cardSvg,
          }
          this.deck.push(cardOjb);
        }
        rankCount--;
      }, this);
    }, this);
    return this.deck;
  }

  function unicodeValue(item) {
    if (item === 'Club') {
      return '2663';
    }
    if (item === 'Diamond') {
      return '2666';
    }
    if (item === 'Heart') {
      return '2665';
    }
    if (item === 'Spade') {
      return '2664';
    }
  }

  function numberValue(num) {
    if (num === 10) {
      return 'Ten';
    }
    if (num === 9) {
      return 'Nine';
    }
    if (num === 8) {
      return 'Eight';
    }
    if (num === 7) {
      return 'Seven';
    }
    if (num === 6) {
      return 'Six';
    }
    if (num === 5) {
      return 'Five';
    }
    if (num === 4) {
      return 'Four';
    }
    if (num === 3) {
      return 'Three';
    }
    if (num === 2) {
      return 'Two';
    }
  }


  // Get deck
  app.get('/cards', (req, res) => {
    res.send(constructor());
  });

  app.get('/cards/:id', (req, res) => {
    const reqSt = req.params.id;

    if (/^(random)\{\d+\}$/.test(reqSt)) {
      const count = parseInt(reqSt.match(/(\d+)/));
      res.send(getRandomCard(count));
    } else if (/^(name)({\D\w{1,3}\D})/.test(reqSt)) {
      const word = reqSt.match(/[a-z]+/g)[1].toString();
      res.send(getNameValue(word));
    }

    switch (reqSt) {
      case 'shuffle':
        res.send(shuffleCards());
        break;
      case 'random':
        res.send(getRandomCard());
        break;
      case 'red':
        res.send(getFilterColorCards('red'));
        break;
      case 'black':
        res.send(getFilterColorCards('black'));
        break;
    }
  });

  // Get shuffled deck
  function shuffleCards() {
    const array = constructor();
    let count = array.length,
      num,
      obj;
    while (count) {
      num = Math.random() * count-- | 0;
      obj = array[count];
      array[count] = array[num];
      array[num] = obj
    }
    return array;
  }

  // Get random card
  function getRandomCard(numberOf) {
    const array = constructor();
    let count = array.length;
    const numberArr = [];
    if (!numberOf) {
      const randomCard = array[Math.floor(Math.random() * count)];
      return randomCard;
    } else {
      while (numberOf) {
        const randomCard = array[Math.floor(Math.random() * count)];
        numberArr.push(randomCard);
        numberOf--;
      }
      return numberArr;
    }
  }

  // Get filtered card
  function getFilterColorCards(inputColor) {
    const array = constructor();
    const filteredArr = [];
    if (inputColor) {
      array.forEach(card => {
        if (card.cardColor.toLowerCase() === inputColor.toLowerCase()) {
          filteredArr.push(card);
        }
      }, this);
      return filteredArr;
    } else {
      throw ('Please enter color')
    }
  }

  // Get card by name
  function getNameValue(cardName) {
    const array = constructor();
    let resArr = [];
    array.forEach(card => {
      if (card.name.toLowerCase() === cardName.toLowerCase()) {
        resArr.push(card);
      }
    }, this);
    return resArr;
  }


  function getFilterSuiteCards(inputSuite, inputSuite2, inputSuite3) {
    const array = this.deck;
    const filteredSuitArr = [];
    if (inputSuite && inputSuite2 && inputSuite3) {
      array.forEach(card => {
        if (card.cardSuit.toLowerCase() === inputSuite.toLowerCase() ||
          card.cardSuit.toLowerCase() === inputSuite2.toLowerCase() ||
          card.cardSuit.toLowerCase() === inputSuite3.toLowerCase()) {
          filteredSuitArr.push(card);
        }
      }, this);
      this.getDeck(filteredSuitArr);
    } else if (inputSuite && inputSuite2) {
      array.forEach(card => {
        if (card.cardSuit.toLowerCase() === inputSuite.toLowerCase() ||
          card.cardSuit.toLowerCase() === inputSuite2.toLowerCase()) {
          filteredSuitArr.push(card);
        }
      }, this);
      this.getDeck(filteredSuitArr);
    } else if (inputSuite) {
      array.forEach(card => {
        if (card.cardSuit.toLowerCase() === inputSuite.toLowerCase()) {
          filteredSuitArr.push(card);
        }
      }, this);
      this.getDeck(filteredSuitArr);
    } else {
      throw ('Invalid input')
    }
  }

  function sortCards(sortValue) {
    const array = this.deck;
    array.sort((a, b) => {
      if (sortValue) {
        if (sortValue === 'descending') {
          return b.rank - a.rank;
        } else {
          return a.rank - b.rank;
        }
      } else {
        return a.rank - b.rank;
      }
    });
    this.getDeck(array);
  }

  function getFaceCards() {
    const array = this.deck;
    array.forEach(card => {
      if (card.faceCard) {
        this.getDeck(card);
      }
    }, this);
  }

  function getSuites() {
    const array = this.suits;
    const root = document.querySelector('.cards-container');
    array.forEach(suit => {
      const cardDOM =
        `<div class='card-wrap'>
        <h1 style = color:${suit.cardColor} class='card-face'>&#x${suit.suitUnicode}</h1>
      </div>`;
      root.innerHTML += cardDOM;
    }, this);
  }
}