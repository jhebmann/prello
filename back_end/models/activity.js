'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ActivitySchema = new Schema({
    dateActivity: {
      type: Date,
      default: Date.now
    }
  })

module.exports = mongoose.model('Activity', ActivitySchema)
