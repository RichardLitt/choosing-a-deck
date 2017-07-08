#!/usr/bin/env node

const data = require('./data.js')
const randomw = require('random-weighted')
const colors = require('colors')
const _ = require('lodash')

const participants = ['Heather', 'Richard']

// Weighted chance of choosing for your own decks
const ownDeckWeight = 0.9

function random (arr) {
  return Math.floor(Math.random() * arr.length)
}

const first = whoGoesFirst()
function whoGoesFirst () {
  return participants[random(participants)]
}

// Automatically choose a block using weights
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

// Used for Open matches
function allDecks () {
  var arr = data.Open.decks
  arr.push(data.Fellowship.decks, data.Towers.decks, data.Return.decks, data.Shadows.decks)
  return [].concat.apply([], arr)
}

function chooseDeck (block) {
  var result
  var decks = (block === 'Open') ? allDecks() : data[block].decks

  console.log(`
+-+-+-+-+ +-+-+-+
|L|o|t|R| |T|C|G|
+-+-+-+-+ +-+-+-+`.blue)

  console.log(`
${colors.magenta('Block:')} ${colors.yellow(block)}
  `)

  // Weight based on ownership
  _.forEach(participants, (participant) => {
    var ownDecks = _.filter(decks, {'owner': participant})
    if (randomw([1 - ownDeckWeight, ownDeckWeight]) !== 0 && ownDecks.length !== 0) {
      result = ownDecks[random(ownDecks)]
      printResult(participant, result)
      decks.splice(_.findIndex(decks, result), 1)
    } else {
      result = random(decks)
      printResult(participant, decks[result])
      decks.splice(result, 1)
    }
  })

  console.log('')
}

function printResult (name, deck) {
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
