'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ItemSchema = require('mongoose').model('Item').schema

const ChecklistSchema = new Schema({
    titleChecklist: {
      type: String
    },
    items: [ItemSchema]
})

module.exports = mongoose.model('Checklist', ChecklistSchema)