'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = require('mongoose').model('Users').schema
const BoardSchema = require('mongoose').model('Board').schema

const TeamSchema = new Schema({
    nameTeam: {
      type: String
    },
    descriptionTeam: {
        type: String
    },
    users: [UserSchema],
    boards: [BoardSchema]
})

module.exports = mongoose.model('Team', TeamSchema)