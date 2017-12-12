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
		signup(root, { email, fullname, password }, { login }) {
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
		}
	}
}
