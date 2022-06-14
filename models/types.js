
const mongoose = require('mongoose')

const TypesSchema = new mongoose.Schema({
  typeId: {
    type: String,
    required: true,
  },
  typeName: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('types', TypesSchema)