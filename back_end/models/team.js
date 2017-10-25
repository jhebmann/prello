'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = new Schema({
    name: {
      type: String
    },
    description: {
        type: String
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
        ref: 'Board'
    }
})

module.exports = mongoose.model('Team', TeamSchema)