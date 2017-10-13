'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LabelSchema = new Schema({
    title: {
      type: String
    },
    Color: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Label', LabelSchema)