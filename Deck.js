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
      const retCards = getRandomCard(count);
      res.send(retCards);
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
        if (!numberArr.includes(randomCard)) {
          numberArr.push(randomCard);
          numberOf--;
        }
      }
      if (numberArr.length === 2) {
        calcPair(numberArr);
      }
      if (numberArr.length > 2 && numberArr.length < 8) {
        const Pair = numberArr.slice(0, 2);
        const Table = numberArr.slice(2, numberArr.length);
        calcTable(Pair, Table);
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


  // ----------- Clalculations ------------
  const calcPair = (cardPair) => {

    let isPair = false;
    let isHighRank = false;
    let isSameSuit = false;
    let isAce = false;
    let isHighCard = false;

    let confidenceIndex = 1;

    const cardOne = cardPair[0];
    const cardTwo = cardPair[1];

    if (cardOne.rank === cardTwo.rank) {
      isPair = true;
      confidenceIndex = cardOne.rank * 2;
    }
    if (cardOne.rank + cardTwo.rank > 21) {
      isHighRank = true;
      if (isPair) {
        confidenceIndex *= 1.4;
      } else {
        const roundRank = Math.floor((cardOne.rank + cardTwo.rank) / 2);
        confidenceIndex = roundRank * 1.3;
      }
    } else {
      confidenceIndex = Math.floor((cardOne.rank + cardTwo.rank) / 2);
    }

    if (cardOne.rank === 14 || cardTwo.rank === 14) {
      isAce = true;
      confidenceIndex *= 1.3;
    }

    if (cardOne.rank > 11 || cardTwo.rank > 11) {
      if (!isAce) {
        confidenceIndex *= 1.2;
        isHighCard = true;
      };
    }

    if (cardOne.cardSuit === cardTwo.cardSuit) {
      isSameSuit = true;
      confidenceIndex *= 1.1;
    }

    console.log(' Pair ' + isPair + '\n', 'Strong Rank ' + isHighRank + '\n', 'Ace ' + isAce + '\n', 'Same Suit ' + isSameSuit + '\n', 'High Card ' + isHighCard + '\n');
    console.log('Confidence Index - ' + confidenceIndex + '\n\n');
  }

  const calcTable = (cardPair, table) => {
    // ROYAL FLASH
    // checkRoyalFlash(cardPair, table);
    // checkStraightFlush(cardPair, table);
    console.log(checkFour(cardPair, table));
    // checkFullHouse(cardPair, table);
    // console.log(checkThree(cardPair, table));
  }

  const checkRoyalFlash = (cardPair, table) => {
    const cardOne = cardPair[0];
    const cardTwo = cardPair[1];

    if (cardOne.rank > 9 || cardTwo.rank > 9) {
      if (checkFlush(cardPair, table)) {
        const straightObj = checkStraight(cardPair, table);
        if (straightObj.straight && straightObj.rank === 14) {
          console.log('ROYAL!');
          return true;
        }
      }
    }

    return false;
  }

  const checkStraightFlush = (cardPair, table) => {

    if (checkFlush(cardPair, table)) {
      const straightObj = checkStraight(cardPair, table);
      if (straightObj.straight) {
        console.log('STRAIGHT FLUSH!');
        return true;
      }
    }
    return false;
  }

  const checkFour = (cardPair, table) => {
    const cardOne = cardPair[0];
    const cardTwo = cardPair[1];
    let retCard = null;
    let count = 0;
    if (cardOne.rank === cardTwo.rank) {
      table.forEach(tableCard => {
        if (cardOne.rank === tableCard.rank) {
          count++;
          if (count === 2) {
            retCard = cardOne.rank;
          }
        }
      }, this);

      if (retCard) {
        return {
          fourOfKind: true,
          rank: retCard.rank,
        }
      } else {
        return {
          fourOfKind: false,
          rank: 0
        }
      }
    }

    cardPair.forEach(card => {
      let quadCount = 0;
      table.forEach(tableCard => {
        if (tableCard.rank === card.rank) {
          quadCount++;
          if (quadCount === 3) {
            console.log('FOUR OF A KIND!');
            retCard = card;
          }
        }
      }, this);
    }, this);

    if (retCard) {
      return {
        fourOfKind: true,
        rank: retCard.rank,
      }
    } else {
      return {
        fourOfKind: false,
        rank: 0
      }
    }
  }

  const checkFullHouse = (cardPair, table) => {
    const cardOne = cardPair[0];
    const cardTwo = cardPair[1];
    let triple = false;
    let double = false;
    let uniqCounter = 0;
    const handArr = [...cardPair, ...table];
    const uniqueArr = [...new Set(table.map(card => card.rank))];

    if (cardOne.rank === cardTwo.rank) {
      table.forEach(card => {
        if (cardOne.rank === card.rank) {
          triple = true;
        }
      }, this);
      if (triple) {
        uniqueArr.forEach(uniqCard => {
          table.forEach(card => {
            if (uniqCard !== cardOne.rank && uniqCard === card.rank) {
              uniqCounter++;
              if (uniqCounter == 2) {
                double = true;
              }
            }
          }, this);
        }, this);
      }
      if (double) {
        console.log('FULL HOUSE!');
        return {
          fullHouse: true,
          rank: cardOne.rank,
        }
      }
      return {
        fullHouse: false,
        rank: 0
      }
    }

    let count = 0;
    let count2 = 0;
    handArr.forEach(card => {
      if (cardOne.rank === card.rank) {
        count++;
      }
      if (cardTwo.rank === card.rank) {
        count2++;
      }
    }, this);

    if (count + count2 === 5) {
      console.log('FULL HOUSE!');
      let rank = 0;
      if (count < 3) {
        rank = cardOne.rank;
      } else {
        rank = cardTwo.rank;
      }
      return {
        fullHouse: true,
        rank
      }
    } else {
      return {
        fullHouse: false,
        rank: 0,
      }
    }
  }

  const checkFlush = (cardPair, table) => {

    let heartSuit = 0;
    let clubtSuit = 0;
    let diamondSuit = 0;
    let spadeSuit = 0;

    cardPair.forEach(card => {
      card.cardSuit === 'Heart' ? heartSuit++ : heartSuit;
      card.cardSuit === 'Club' ? clubtSuit++ : clubtSuit;
      card.cardSuit === 'Diamond' ? diamondSuit++ : diamondSuit;
      card.cardSuit === 'Spade' ? spadeSuit++ : spadeSuit;
    }, this);

    table.forEach(card => {
      card.cardSuit === 'Heart' ? heartSuit++ : heartSuit;
      card.cardSuit === 'Club' ? clubtSuit++ : clubtSuit;
      card.cardSuit === 'Diamond' ? diamondSuit++ : diamondSuit;
      card.cardSuit === 'Spade' ? spadeSuit++ : spadeSuit;
    }, this);


    // console.log(heartSuit, clubtSuit, diamondSuit, spadeSuit);

    const suitArr = [heartSuit, clubtSuit, diamondSuit, spadeSuit];
    suitArr.forEach(suit => {
      if (suit === 5) {
        console.log('FLUSH!')
        return true;
      }
    }, this);
  }

  const checkStraight = (cardPair, table) => {

    const handArr = [...cardPair, ...table];
    const uniqueArr = [...new Set(handArr.map(card => card.rank))];

    let length = uniqueArr.length;
    const sortHand = uniqueArr.sort((a, b) => {
      return a < b;
    });

    // console.log('\n\n-------------')
    // sortHand.forEach(card => {
    //   console.log(card);
    // }, this);

    let count = 1;
    let countComp = 0;
    let condition = 0;

    while (length) {

      if (count + 1 < length) {
        count++;
        countComp++;
      } else {
        return {
          straight: false,
          rank: 0,
        }
      }

      if (sortHand[countComp] - 1 === sortHand[count]) {
        condition++;
        if (condition === 4) {
          console.log('STRAIGHT!');
          return {
            straight: true,
            rank: sortHand[count - 4],
          }
        }
      } else {
        condition = 0;
      }

    }
  }

  const checkThree = (cardPair, table) => {
    const cardOne = cardPair[0];
    const cardTwo = cardPair[1];
    let retCard = null;
    if (cardOne.rank === cardTwo.rank) {
      table.forEach(tableCard => {
        if (cardOne.rank === tableCard.rank) {
          retCard = cardOne.rank;
        }
      }, this);

      if (retCard) {
        return {
          threeOfKind: true,
          rank: retCard.rank,
        }
      } else {
        return {
          threeOfKind: false,
          rank: 0
        }
      }
    }

    cardPair.forEach(card => {
      let trippleCount = 0;
      table.forEach(tableCard => {
        if (tableCard.rank === card.rank) {
          trippleCount++;
          if (trippleCount === 2) {
            console.log('TREE OF A KIND!');
            retCard = card;
          }
        }
      }, this);
    }, this);

    if (retCard) {
      return {
        threeOfKind: true,
        rank: retCard.rank,
      }
    } else {
      return {
        threeOfKind: false,
        rank: 0
      }
    }
  }
}