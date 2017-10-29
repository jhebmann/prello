'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ItemSchema = require('mongoose').model('Item').schema

const ChecklistSchema = new Schema({
    title: {
      type: String
    },
    items: {
      type: [ItemSchema],
      default: []
    }
})

module.exports = mongoose.model('Checklist', ChecklistSchema)