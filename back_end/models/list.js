'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = require('mongoose').model('Card').schema

const ListSchema = new Schema({
  id: {
    type: String
  },
  titleList: {
    type: String
  },
  cards: [CardSchema],
  date: {
    type: Date,
    default: Date.now
  }
});
  
  
module.exports = mongoose.model('List', ListSchema)