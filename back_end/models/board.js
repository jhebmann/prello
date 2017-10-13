'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ListSchema = require('mongoose').model('Lists').schema

const BoardSchema = new Schema({
    title_board: {
      type: String
    },
    lists: [ListSchema]
})

module.exports = mongoose.model('Board', BoardSchema)