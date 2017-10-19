'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt   = require('bcrypt-nodejs')

const UserSchema = new Schema({
    local: {
        mail: {
        type: String,
        required: true,
        unique : true 
        },
        nickname: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        teams: [Schema.ObjectId],
        boards : [Schema.ObjectId]
    },
    ldap:{
        nickname: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
})

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema)