const passport = require('passport')
const mongoose = require('mongoose')

const User = require('../models/User')

const GitHubStrategy = require('passport-github').Strategy

passport.use(
	new GitHubStrategy(
		{
			clientID: 'e18a059ecc33ba681d0f',
			clientSecret: '7860723013424dccc22c85f4c8f6f3d367c26029',
			callbackURL: 'http://localhost:3000/auth/github/callback'
		},
		function(accessToken, refreshToken, profile, cb) {
			// console.log(profile)
			User.find({ email: profile.emails[0].value }, function(err, u) {
				let data = {
					fullname: profile.displayName,
					email: profile.emails[0].value
				}

				if (!u.length) {
					User.create(data).then(user => cb(err, user))
				}
			})
		}
	)
)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
