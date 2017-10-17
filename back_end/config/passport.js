const LocalStrategy = require('passport-local').Strategy;

const models = require('../models/index')
const User = models.users

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		nicknameField: 'nickname',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, nickname, password, done){
		process.nextTick(function(){
			User.findOne({'local.nickname': nickname}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				} else {
					const newUser = new User();
					newUser.local.nickname = nickname;
					newUser.local.password = password;

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})
		});
	}));
}