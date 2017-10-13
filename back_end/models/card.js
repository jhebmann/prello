'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CheckListSchema = require('mongoose').model('Checklist').schema
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
    },
    checklists : [CheckListSchema]
  });

  module.exports = mongoose.model('Cards', CardSchema);