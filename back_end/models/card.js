'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CheckListSchema = require('mongoose').model('Checklist').schema
const AttachmentSchema = require('mongoose').model('Attachment').schema
const CommentSchema = require('mongoose').model('Comment').schema

const CardSchema = new Schema({
    title: {
      type: String
    },
    description: {
      type: String,
      default: ""
    },
    dueDate: {
      type: Date
    },
    doneDate: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    users: {
        type: [Schema.ObjectId],
        ref: 'User'
    },
    checklists : {
      type: [CheckListSchema],
      default: []
    },
    attachments : {
      type: [AttachmentSchema],
      default: []
    },
    comments : {
      type: [CommentSchema],
      default: []
    },
    labels : {
      type: [Schema.ObjectId],
      ref: 'Label',
      default: []
    }
  });

  module.exports = mongoose.model('Card', CardSchema);