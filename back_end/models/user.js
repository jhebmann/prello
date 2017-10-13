'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TeamSchema = require('mongoose').model('Team').schema
const BoardSchema = require('mongoose').model('Board').schema


const UserSchema = new Schema({
    mail: {
      type: String,
      default: false,
      unique : true 
    },
    nickname: {
        type: String,
        default: false,
        unique: true
      
    },
    password: {
        type: String,
        default : false,
        unique: true
      
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    teams: [TeamSchema],
    boards : [BoardSchema]

})

module.exports = mongoose.model('Users', TeamSchema)