const passport = require('passport')
const mongoose = require('mongoose')

const User = require('../models/User')

const GitHubStrategy = require('passport-github').Strategy

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GithubClientID,
			clientSecret: process.env.GithubClientSecret,
			callbackURL: process.env.GithubCallbackURL
		},
		(accessToken, refreshToken, profile, cb) => {
			const { email, name } = profile._json

			// Auto-link account

			User.findOne({ email })
				.then(user => {
					if (!user) {
						let data = {
							email,
							fullname: name,
							providers: ['github']
						}

						User.create(data).then(user => cb(null, user))
					} else {
						// Update Provider to DB if not added

						User.findOneAndUpdate(
							{ email, providers: { $ne: 'github' } },
							{ $push: { providers: 'github' } }
						).exec()

						return cb(null, user)
					}
				})
				.catch(err => cb(err))
		}
	)
)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
