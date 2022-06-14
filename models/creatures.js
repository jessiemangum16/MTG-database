
const mongoose = require('mongoose')

const CreaturesSchema = new mongoose.Schema({
  creatureId: {
    type: String,
    required: true,
  },
  creatureName: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('creatures', CreaturesSchema)