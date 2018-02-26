import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withData from '../lib/withData'

class Test extends React.Component {
	render() {
		if (this.props.data.loading) {
			return <div>loading...</div>
		}
		console.log(this.props.data.profile)
		return <div> This is a simple test! </div>
	}
}

const mutator = gql`
	query profile {
		profile {
			email
			fullname
			password
			github {
				id
				email
				name
			}
		}
	}
`
export default withData(graphql(mutator)(Test))
