const mongoose = require('mongoose')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: {
			isAsync: true,
			validator: (v, cb) =>
				cb(validator.isEmail(v), `${v} is not a valid email address`)
		},
		required: 'Please Supply an email address'
	},
	fullname: String,
	github: {
		id: String,
		name: String,
		email: String
	}
})

userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email',
	errorMessages: {
		UserExistsError: 'Email Already Exists'
	}
})

userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)
