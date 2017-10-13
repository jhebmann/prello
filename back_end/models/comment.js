'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = require('mongoose').model('User').schema

const CommentSchema = new Schema({
    content: {
      type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date
    },
    postedBy: UserSchema
})

module.exports = mongoose.model('Comment', CommentSchema)