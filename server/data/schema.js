const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = `
	type User {
		email: String
		fullname: String
		github: GitHub
	}
	type GitHub {
		id: Int,
		name: String,
		email: String
	}
	type Query {
		profile: User
	}
	type Mutation {
		createUser(email: String!, fullname: String, password: String!): User
		login(email: String!, password: String!): User
		authGithub: User
	}
`

module.exports = makeExecutableSchema({ typeDefs, resolvers })
