import withData from '../lib/withData'

const Profile = ({ serverState: { user } }) =>
	user ? (
		<div>
			<p>My Profile</p>
			<p> Fullname: {user.fullname || user.github.name}</p>
			<p> Email: {user.email || user.github.email}</p>
		</div>
	) : (
		<div>Not found!</div>
	)

export default withData(Profile)
