const User = require('../models/User')

module.exports = {
	Query: {
		profile(root, args, { user }) {
			return new Promise((resolve, reject) => {
				if (user) {
					return resolve(user)
				}

				return reject('Not Authenticated!')
			})
		}
	},
	Mutation: {
		signup(root, { email, fullname, password }, ctx) {
			const user = new User({ email, fullname })

			return new Promise((resolve, reject) => {
				return User.register(user, password, err => {
					if (err) {
						reject(err)
					} else {
						ctx.login(user, () => resolve(user))
					}
				})
			})
		},
		login(root, { email, password }, ctx) {
			return new Promise((resolve, reject) => {
				return User.authenticate()(email, password, (err, user) => {
					// user returns false if username / email incorrect
					if (user) {
						ctx.login(user, () => resolve(user))
					} else {
						reject('Email / Password Incorrect')
					}
				})
			})
		}
	}
}
