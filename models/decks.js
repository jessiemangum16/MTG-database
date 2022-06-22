
const mongoose = require('mongoose')

const CardsInDeckSchema = new mongoose.Schema({ cardId: Number });

const DecksSchema = new mongoose.Schema({
  deckName: {
    type: String,
    required: true,
  },
  deckCards: {
    type: [CardsInDeckSchema],
    default: undefined
  }
})

module.exports = mongoose.model('decks', DecksSchema)