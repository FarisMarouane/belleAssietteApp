
var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
  name: String,
  number: Number,
  exist: Boolean,
  photoName: String,
  dateCreatedAt: {type: Date, default: Date.now()},

  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    username: String
  }

});

module.exports = mongoose.model('Ingredient', IngredientSchema);
