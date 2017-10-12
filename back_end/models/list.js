'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CardSchema = require('mongoose').model('Cards').schema

  const ListSchema = new Schema({
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

/*
const CardSchema = new Schema({
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
})

const ListSchema = new Schema({
    id_list: {
    type: Number,
    default: 0,
    unique: true,
    required: true
    },
    title_list: {
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
  field: 'id_list',
  startAt: 0,
  incrementBy: 1
});*/