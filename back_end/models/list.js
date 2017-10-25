'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = require('mongoose').model('Card').schema

const ListSchema = new Schema({
  _id: {
    type: Schema.ObjectId
  },
  title: {
    type: String
  },
  pos: {
    type: Number
  },
  cards: {
    type: [Schema.ObjectId],
    ref: 'Card'
  },
  date: {
    type: Date,
    default: Date.now
  }
});
  
  
module.exports = mongoose.model('List', ListSchema)