const passport = require('passport')

// Basically for NON-gql routes

module.exports = (server, passport) => {
  server.get('/auth/github', passport.authenticate('github'))

  server.get('/auth/github/callback', (req, res, next) => {
    passport.authenticate('github', (err, user, { nextRoute }) => {
      if (err) {
        return next(err)
      }

      if (nextRoute) {
        // user was authorized with provider?
        // send em back to profile
        return res.redirect(nextRoute)
      } else {
        // give em some cookies
        req.logIn(user, err => {
          if (err) {
            return next(err)
          }
          return res.redirect('/')
        })
      }
    })(req, res, next)
  })

  server.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  server.get('/connect/github', passport.authorize('github'))
}
