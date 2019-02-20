const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const expressValidator = require('express-validator')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const next = require('next')

require('dotenv').config()

const schema = require('./data/schema')
require('./services/passport')

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth', {
  useNewUrlParser: true
})

const port = process.env.PORT || 3000

const dev = process.env.NODE_ENV !== 'production'

const app = next({
  dev
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
  server.use(expressValidator())

  // populates req.cookies with any cookies that came along with the request
  server.use(cookieParser())

  // Sessions allow us to store data on visitors from request to request
  // This keeps users logged in
  server.use(
    session({
      secret: 'keyboard cat',
      key: 'token',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    })
  )

  // Passport JS is what we use to handle our logins
  server.use(passport.initialize())
  server.use(passport.session())

  server.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress((req, res) => {
      let context = {
        login: req.login.bind(req),
        user: req.user
      }

      return {
        schema,
        context
      }
    })
  )

  server.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql'
    })
  )

  require('./routes')(server, passport)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // Start express server
  server.listen(port, () =>
    console.log('> GraphQL Server Listening on Port', port)
  )
})
