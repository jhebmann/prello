'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    postedBy: {
        type: Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Comment', CommentSchema)