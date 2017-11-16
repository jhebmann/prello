const User = require('mongoose').model('User')
const PassportLocalStrategy = require('passport-local').Strategy


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
      const userData = {
        local:{
          mail: email.trim().toLowerCase(),
          password: password.trim(),
          nickname: req.body.name.trim().toLowerCase()
        }
}

  const newUser = new User(userData)
  newUser.save((err) => {
    if (err) {
      console.log('Error creating user',userData, err)
      return done(err)
    }

    return done(null)
  })
})