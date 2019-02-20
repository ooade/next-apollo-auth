import React from 'react'
import Link from 'next/link'

import checkLoggedIn from '../lib/checkLoggedIn'
import withData from '../lib/withData'

class Profile extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient)

    return { user: loggedInUser.profile }
  }

  render() {
    const { user } = this.props

    if (user) {
      return (
        <div>
          <Link href="/">
            <a>Home</a>
          </Link>
          <p>My Profile</p>
          {user.github.id ? 'GitHub Connected' : 'GitHub Not Linked'}
          <p> Fullname: {user.fullname || user.github.name}</p>
          <p> Email: {user.email || user.github.email}</p>
        </div>
      )
    }

    return <div>Not found!</div>
  }
}

export default withData(Profile)
