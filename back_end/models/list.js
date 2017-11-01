'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = require('mongoose').model('Card').schema

const ListSchema = new Schema({
  title: {
    type: String
  },
  pos: {
    type: Number
  },
  cards: {
    type: [{_id: Schema.ObjectId, pos: Number}],
    ref: 'Card',
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});
  
  
module.exports = mongoose.model('List', ListSchema)