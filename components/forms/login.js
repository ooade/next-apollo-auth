import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class login extends React.Component {
	state = {
		email: null,
		password: null,
		error: null
	}

	onFormSubmit = e => {
		e.preventDefault()
		let { email, password } = this.state

		// Check non null email && password
		if (typeof email === 'string' && typeof password === 'string') {
			// trim fields
			email = email.trim()
			password = password.trim()

			// Check for email && password length
			if (email.length > 0 && password.length > 0) {
				this.props
					.mutate({
						variables: {
							email,
							password
						}
					})
					.then(() => {
						this.setState({ error: null })
						window.location = '/'
					})
					.catch(({ graphQLErrors: err }) =>
						this.setState({ error: err[0].message })
					)
			} else {
				this.setState({ error: "Email & Password Field shouldn't be empty" })
			}
		} else {
			this.setState({ error: 'Email & Password Field Required!' })
		}
	}

	render() {
		return [
			<form onSubmit={this.onFormSubmit} key="form">
				<div>
					<span className="error">{this.state.error}</span>
					<label> Email Address </label>
					<input
						type="email"
						onInput={e => this.setState({ email: e.target.value })}
						placeholder="john@doe.com"
					/>
				</div>
				<div>
					<label> Password </label>
					<input
						type="password"
						onInput={e => this.setState({ password: e.target.value })}
						placeholder="******"
					/>
				</div>
				<div>
					<button type="submit"> Log In </button>
				</div>
				<style jsx>
					{`
						* {
							box-sizing: border-box;
							margin: 0;
						}

						h1 {
							margin: 2rem 0;
						}

						label {
							display: block;
						}

						form > div {
							margin-top: 1rem;
						}

						input,
						button {
							padding: 0.5rem;
						}

						button {
							width: 12rem;
							border: none;
							cursor: pointer;
						}

						.error {
							color: red;
							display: block;
							margin: 1rem 0;
						}
					`}
				</style>
			</form>,
			<a key="btn" href="/auth/github">
				{' '}
				Auth With GitHub{' '}
			</a>
		]
	}
}

const mutator = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email
		}
	}
`
export default graphql(mutator)(login)
