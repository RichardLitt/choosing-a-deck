#!/usr/bin/env node

const data = require('./data.js')
const randomw = require('random-weighted')
const colors = require('colors')

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

function whoGoesFirst() {
  var participants = ['Heather', 'Richard']
  return participants[random(participants)]
}

const first = whoGoesFirst()

function openAllDecks() {
  var arr = data.Open.decks
  arr.push(data.Fellowship.decks, data.Towers.decks, data.Return.decks, data.Shadows.decks)
  return [].concat.apply([], arr);
}

function chooseDeck(block) {
  var Heather, Richard, result
  var decks = (block == 'Open') ? openAllDecks() : data[block].decks

  console.log(`
+-+-+-+-+ +-+-+-+
|L|o|t|R| |T|C|G|
+-+-+-+-+ +-+-+-+`.blue)

  console.log(`
${colors.magenta('Block:')} ${colors.yellow(block)}
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

  console.log('')
}

function printResult(name, deck) {
  if (name === first) {
    console.log(colors.green(`${name}:`), colors.cyan(deck.fellowship), colors.green('and'), colors.grey(deck.shadow))
    if (deck.notes) {
      console.log(`  ${deck.notes}`)
    }
  } else {
    console.log(colors.red(`${name}:`), colors.cyan(deck.fellowship), colors.red('and'), colors.grey(deck.shadow))
    if (deck.notes) {
      console.log(`  ${deck.notes}`)
    }
  }
}

chooseDeck(chooseBlock())