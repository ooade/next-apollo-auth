import Link from 'next/link'
import withData from '../lib/withData'
import SignupForm from '../components/forms/signup'

export default withData(() => (
  <div>
    <h1> Create An Account! </h1>
    <Link href="/">
      <a>Home</a>
    </Link>
    <SignupForm />
  </div>
))
