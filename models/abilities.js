
const mongoose = require('mongoose')

const AbilitiesSchema = new mongoose.Schema({
  abilityId: {
    type: String,
    required: true,
  },
  abilityName: {
    type: String,
    required: true,
  },
  abilityDescription: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('abilities', AbilitiesSchema)