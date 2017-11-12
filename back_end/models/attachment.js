'use strict'
const mongoose = require('mongoose')
/* Maybe we can use the module below for files
const filePluginLib = require('mongoose-file')*/
const Schema = mongoose.Schema

/* There is missing things if coming from dropbox */
const AttachmentSchema = new Schema({
    data: Buffer, 
    contentType: String 
})

module.exports = mongoose.model('Attachment', AttachmentSchema)