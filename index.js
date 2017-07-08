const data = require('./data.js')
const randomw = require('random-weighted')

function random (arr) {
  return Math.floor(Math.random() * arr.length)
}

// Automatically choose a block, weighting for fellowship

function chooseBlock () {
  var weights = []
  for (var key in data) {
    weights.push(data[key].weight)
  }
  switch (randomw(weights)) {
    case 0:
      return 'Fellowship'
      break
    case 1:
      return 'Towers'
      break
    case 2:
      return 'Return'
      break
    case 3:
      return 'Shadows'
      break
    case 4:
      return 'Open'
      break
  }
}

function chooseDeck(block) {
  var Heather, Richard, result
  var decks = (block == 'Open') ? data['Open'].decks() : data[block].decks

  console.log(`Block: ${block}
  `)

  // Weight based on ownership
  decks.forEach(function (d,i) {
    if (d.owner == 'Heather') {
      // Possibility of you getting your own deck
      // TODO Change for multiple decks
      if (randomw([0.1, 0.9]) != 0) {
        Heather = d
        printResult('Heather', d)
        decks.splice(i, 1)
      }
    }
  })

  if (!Heather) {
    result = random(decks)
    printResult('Heather', decks[result])
    decks.splice(result, 1)
  }

  result = random(decks)
  printResult('Richard', decks[result])
}

function printResult(name, deck) {
  console.log(`${name}: ${deck.fellowship} and ${deck.shadow}`)
}

chooseDeck(chooseBlock())