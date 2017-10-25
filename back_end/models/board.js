'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ListSchema = require('mongoose').model('List').schema

const BoardSchema = new Schema({
    title: {
      type: String
    },
    lists: {
      type: [ListSchema],
      default: []
    },
    admins: {
      type :[Schema.ObjectId] ,
      required : false,
      ref: 'User'
    },
    isPublic: {
      type: Boolean,
      default: false
    }
})

module.exports = mongoose.model('Board', BoardSchema)