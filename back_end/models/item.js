'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    title: {
      type: String
    },
    isDone: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Item', ItemSchema)