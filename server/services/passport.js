const passport = require('passport')
const mongoose = require('mongoose')

const User = require('../models/User')
const { promisify } = require('util')

const findOneAsync = promisify(User.findOne.bind(User))
const findOneAndUpdateAsync = promisify(User.findOneAndUpdate.bind(User))

const GitHubStrategy = require('passport-github').Strategy

console.log(process.env)

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
			findOneAsync({ email })
				.then(u => {
					if (!u) {
						let data = {
							email,
							fullname: name,
							providers: ['github']
						}

						User.create(data).then(user => cb(null, user))
					} else {
						// Update Provider to DB if not added
						findOneAndUpdateAsync(
							{ email, providers: { $ne: 'github' } },
							{ $push: { providers: 'github' } }
						)

						return cb(null, u)
					}
				})
				.catch(err => cb(err))
		}
	)
)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
