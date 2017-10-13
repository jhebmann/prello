'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ListSchema = require('mongoose').model('List').schema

const BoardSchema = new Schema({
    titleBoard: {
      type: String
    },
    lists: [ListSchema],
    admins: {
      type :[Schema.ObjectId] ,
      required : true
    },
    isPublic: Boolean
})

module.exports = mongoose.model('Board', BoardSchema)