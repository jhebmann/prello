'use strict'
const mongoose = require('mongoose')
/* Maybe we can use the module below for files
const filePluginLib = require('mongoose-file')*/
const Schema = mongoose.Schema
//const UserSchema = require('mongoose').model('User').schema

/* There is missing things if coming from dropbox */
const AttachmentSchema = new Schema({
    file: {
      type: String
    },
    datePost: {
      type: Date,
      default: Date.now
    },
    postedBy: {
      type : Schema.ObjectId,
       required : true,
       ref: 'User'
    },
    linkedComment: {
      type : Schema.ObjectId,
      ref: 'Comment'
    }
})

module.exports = mongoose.model('Attachment', AttachmentSchema)