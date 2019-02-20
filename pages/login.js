import Link from 'next/link'
import withData from '../lib/withData'
import LoginForm from '../components/forms/login'

export default withData(() => (
  <div>
    <h1> Login To Continue! </h1>
    <Link href="/">
      <a>Home</a>
    </Link>
    <LoginForm />
  </div>
))
