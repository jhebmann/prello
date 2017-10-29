'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt   = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
        mail: {
            type: String,
            required: true,
            unique:true
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
        }
    })

    UserSchema.pre('save', function(next) {
        var user = this;
    
        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) return next();
    
        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);
    
            // hash the password using our new salt
            bcrypt.hash(user.password, salt,null, function(err, hash) {
                if (err) return next(err);
    
                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });

    UserSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };
// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema)
/*
local: {
        mail: {
            type: String,
            required: true,
            unique : true ,
            lowercase: true
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
        }
    },
    ldap:{
        nickname: {
            type: String
        },
        password: {
            type: String
        }
    },
    teams: {
        type: [Schema.ObjectId],
        ref: 'Team',
        default: []
    }
    */