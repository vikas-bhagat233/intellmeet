import LoginForm from '../../components/auth/LoginForm'
import Navbar from '../../components/common/Navbar'

export default function Login() {
  return (
    <div>
      <Navbar />
      <main className="page page--center">
        <LoginForm />
      </main>
    </div>
  )
}