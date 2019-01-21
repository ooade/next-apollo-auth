const passport = require('passport')
const mongoose = require('mongoose')

const User = require('../models/User')

const GitHubStrategy = require('passport-github').Strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GithubClientID,
      clientSecret: process.env.GithubClientSecret,
      callbackURL: process.env.GithubCallbackURL,
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, cb) => {
      const { email, name, id } = profile._json

      // Check if user is auth'd
      if (req.user) {
        let user = req.user

        user.github.id = id
        user.github.email = email
        user.github.name = name

        user
          .save()
          .then(user => cb(null, user, { nextRoute: '/profile' }))
          .catch(err => cb(err))
      } else {
        User.findOne({ $or: [{ 'github.id': id }, { email }] }).then(user => {
          if (!user) {
            // User is not auth, and not found on db? create an account
            let newUser = new User()

            newUser.email = email
            newUser.github.id = id
            newUser.github.email = email
            newUser.github.name = name

            newUser
              .save()
              .then(user => cb(null, user))
              .catch(err => cb(err))
          } else {
            // user not auth'd but provider account found? log 'em in
            // maybe update the profile here?
            return cb(null, user)
          }
        })
      }
    }
  )
)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
