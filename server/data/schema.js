const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = `
	type User {
		email: String
		fullname: String
		password: String
	}
	type Query {
		profile: User
	}
	type Mutation {
		signup(email: String!, fullname: String, password: String!): User
		login(email: String!, password: String!): User
		authGithub: User
	}
`

module.exports = makeExecutableSchema({ typeDefs, resolvers })
