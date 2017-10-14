'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = require('mongoose').model('Card').schema

const ListSchema = new Schema({
    idList: {
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

/*
const CardSchema = new Schema({
  titleCard: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const ListSchema = new Schema({
    idList: {
    type: Number,
    default: 0,
    unique: true,
    required: true
    },
    titleList: {
      type: String
    },
    cards: [CardSchema],
    date: {
      type: Date,
      default: Date.now
    }
})


module.exports = mongoose.model('Lists', ListSchema)
autoIncrement.initialize(mongoose.connection)

ListSchema.plugin(autoIncrement.plugin, {
  model: 'Lists',
  field: 'idList',
  startAt: 0,
  incrementBy: 1
});*/