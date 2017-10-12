'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CardSchema = new Schema({
    title_card: {
      type: String
    },
    description: {
      type: String
    },
    dueDate: {
      type: Date
    },
    doneDate: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  });

  module.exports = mongoose.model('Cards', CardSchema);