'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChecklistSchema = new Schema({
    title_checklist: {
      type: String
    }
})

module.exports = mongoose.model('Checklist', ChecklistSchema)