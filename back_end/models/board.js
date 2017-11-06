'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ListSchema = require('mongoose').model('List').schema
const LabelSchema = require('mongoose').model('Label').schema

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
      required : true,
      ref: 'User'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    labels: {
      type: [LabelSchema],
      default: []
    },
    teams: {
      type: [Schema.ObjectId],
      default: [],
      ref: 'Team'
    }
})

module.exports = mongoose.model('Board', BoardSchema)