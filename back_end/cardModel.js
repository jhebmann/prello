'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
  id: {
   type: String
  },
  title_card: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

var ListSchema = new Schema({
    id_list: {
    type: String
    },
    title_list: {
      type: String
    },
    cards: [CardSchema],
    date: {
      type: Date,
      default: Date.now
    }
});


module.exports = mongoose.model('Lists', ListSchema);