import Link from 'next/link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withData from '../lib/withData'

const Index = ({ serverState: { user } }) => {
	if (user) {
		return (
			<div>
				<h1> Hello {user.email}! </h1>
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</div>
			</div>
		)
	}

	return (
		<p>
			<h1> Auth Example with Next.js and Apollo </h1>
			<Link href="/login">
				<a>Login</a>
			</Link>{' '}
			or{' '}
			<Link href="/signup">
				<a>Signup</a>
			</Link>{' '}
			to view hidden resources
		</p>
	)
}

export default withData(Index)
