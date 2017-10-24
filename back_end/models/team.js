'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = new Schema({
    name: {
      type: String
    },
    description: {
        type: String
    },
    users: [Schema.ObjectId],
    admins: {
        type :[Schema.ObjectId] ,
        required : true
      },
    boards: [Schema.ObjectId]
})

module.exports = mongoose.model('Team', TeamSchema)