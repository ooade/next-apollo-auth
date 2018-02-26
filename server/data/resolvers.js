const User = require('../models/User')
const passport = require('passport')

module.exports = {
	Query: {
		profile(root, args, req) {
			return new Promise((resolve, reject) => {
				if (req.user) {
					return resolve(req.user)
				}

				return reject('Not Authenticated!')
			})
		}
	},
	Mutation: {
		createUser(root, { email, fullname, password }, { login }) {
			const user = new User({ email, fullname })

			return new Promise((resolve, reject) => {
				return User.register(user, password, err => {
					if (err) {
						reject(err)
					} else {
						login(user, () => resolve(user))
					}
				})
			})
		},
		login(root, { email, password }, { login }) {
			return new Promise((resolve, reject) => {
				return User.authenticate()(email, password, (err, user) => {
					// user returns false if username / email incorrect
					if (user) {
						login(user, () => resolve(user))
					} else {
						reject('Email / Password Incorrect')
					}
				})
			})
		},
		authGithub(root, args, { statusCode, setHeader, res }) {
			return new Promise((resolve, reject) => {
				return passport.authenticate('github', (err, user) => {
					if (user) {
						resolve(user)
					} else {
						reject(err)
					}
				})({}, { statusCode, setHeader, end })
			})
		}
	}
}
