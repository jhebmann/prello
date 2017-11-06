'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = new Schema({
    name: {
      type: String,
      default: ""
    },
    description: {
        type: String,
        default: ""
    },
    users: {
        type: [Schema.ObjectId],
        ref: 'User'
    },
    admins: {
        type :[Schema.ObjectId] ,
        required : true,
        ref: 'User'
      },
    boards: {
        type: [Schema.ObjectId],
        ref: 'Board',
        default: []
    }
})

module.exports = mongoose.model('Team', TeamSchema)