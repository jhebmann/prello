'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
//const TeamSchema = require('mongoose').model('Team').schema
const BoardSchema = require('mongoose').model('Board').schema


const UserSchema = new Schema({
    mail: {
      type: String,
      required: true,
      unique : true 
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    teams: [Schema.ObjectId],
    boards : [Schema.ObjectId]
})

module.exports = mongoose.model('User', UserSchema)