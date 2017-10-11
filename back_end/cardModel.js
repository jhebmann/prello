'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
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

const ListSchema = new Schema({
    id_list: {
    type: String,
    default: Date.now
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