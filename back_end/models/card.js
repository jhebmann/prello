'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

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

  module.exports = mongoose.model('Cards', CardSchema);