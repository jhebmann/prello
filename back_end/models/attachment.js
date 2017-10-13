'use strict'
const mongoose = require('mongoose')
/* Maybe we can use the module below for files
const filePluginLib = require('mongoose-file')*/
const Schema = mongoose.Schema
const UserSchema = require('mongoose').model('User').schema

/* There is missing things if coming from dropbox */
const AttachmentSchema = new Schema({
    file: {
      type: String
    },
    datePostAttachment: {
      type: Date,
      default: Date.now
    },
    postedBy: UserSchema
})

module.exports = mongoose.model('Attachment', AttachmentSchema)