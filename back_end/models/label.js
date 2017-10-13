'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

listColor = ["blue", "red"]

const LabelSchema = new Schema({
    title: {
      type: String
    },
    Color: {
        type: String,
        required: true,
        enum: listColor
    }
})

module.exports = mongoose.model('Label', LabelSchema)