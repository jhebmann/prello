const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config/database.js');


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'nickname',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, nickname, password, done) => {
  const userData = {
    nickname: nickname.trim().toLowerCase(),
    password: password.trim()
  };

  // find a user by email address
  return User.findOne({ "local.nickname" : userData.nickname }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect nickname');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        const error = new Error('Incorrect password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user._id
      };

      // create a token string
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        name: user.name
      };

      return done(null, token, data);
    });
  });
});