
const mongoose = require('mongoose')

const CardsSchema = new mongoose.Schema({
  cardName: {
    type: String,
    required: true,
  },
  manaCost: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    required: true,
  },
  typeId: {
    type: String,
  },
  creatureId: {
    type: String,
  },
  abilityId: {
    type: String,
  },
  description: {
    type: String,
  },
  power: {
    type: String,
  },
  toughness: {
    type: String,
  },
})

module.exports = mongoose.model('cards', CardsSchema)