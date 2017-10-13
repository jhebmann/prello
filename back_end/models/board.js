'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ListSchema = require('mongoose').model('Lists').schema

const BoardSchema = new Schema({
    titleBoard: {
      type: String
    },
    lists: [ListSchema]
})

module.exports = mongoose.model('Board', BoardSchema)