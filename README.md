# Auth Example with Next.js and Apollo

This example shows how to implement Authentication with Next.js and Apollo GraphQL.

## Main Technologies Used

* Apollo GraphQl
* Express.js
* Express Validator
* Next.js
* Passport.js
* Passport-local-mongoose
* Passport-github

## Contents

* [Project Structure](#project-structure)
* [Mutations](#mutations)
  * [Schema](#schema)
  * [Resolvers](#resolvers)
* [Models](#models)
* [Deploy](#deploy)

### Project Structure

```md
├── components
│   └── forms
│   ├── login.js
│   └── signup.js
├── lib
│   ├── initApollo.js
│   └── withData.js
├── pages
│   ├── index.js
│   ├── login.js
│   └── signup.js
└── server
├── data
│   ├── resolvers.js
│   └── schema.js
├── models
│   └── User.js
├── services
│   └── passport.js
└── index.js
```

### Mutations

#### Schema

Here we have one `User`'s type with three fields (email, fullname and password), one `Query` type with a profile field just to keep GraphQL's mouth shut about having a Query type defined. We have two `Mutation` types (login, and signup).

```ts
type User {
	email: String
	fullname: String
	password: String
}

type Query {
	profile: User
}

type Mutation {
	createUser(email: String!, fullname: String, password: String!): User
	login(email: String!, password: String!): User
}
```

#### Resolvers

The resolvers we care about here are `createUser` and `login`. They both take in `email` and `password` as arguments with `createUser` taking an extra `fullname` argument.

```js
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
		}
	}
```

### Models

Oops! We have only one model (User). It accepts email, validates the email with `express-validator`. Then we have a plugin to tell `passport-local-mongoose` to use our email field as the default `usernameField`.

```js
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
	fullname: String
})

userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email',
	errorMessages: {
		UserExistsError: 'Email Already Exists'
	}
})
```

### Deploy

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/ooade/next-apollo-auth)

### License

MIT
