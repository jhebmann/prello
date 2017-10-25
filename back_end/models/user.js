'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt   = require('bcrypt-nodejs')

const UserSchema = new Schema({
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
})

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
  };
  
  /*
  /**
   * The pre-save hook method.
   *
  UserSchema.pre('save', function saveHook(next) {
    const user = this;
  
    // proceed further only if the password is modified or the user is new
    if (!user.isModified('password')) return next();
  
  
    return bcrypt.genSalt((saltError, salt) => {
      if (saltError) { return next(saltError); }
  
      return bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) { return next(hashError); }
  
        // replace a password string with hash value
        user.password = hash;
  
        return next();
      });
    });
  });*/
  


// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema)