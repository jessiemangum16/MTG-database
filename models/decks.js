
const mongoose = require('mongoose')

// const CardsInDeckSchema = new mongoose.Schema({ cardId: String });

const DecksSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  deckName: {
    type: String,
    required: true,
  },
  deckCards: {
    type: [String],
    default: []
  }
})

module.exports = mongoose.model('decks', DecksSchema)