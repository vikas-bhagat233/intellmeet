import RegisterForm from '../../components/auth/RegisterForm'
import Navbar from '../../components/common/Navbar'

export default function Register() {
  return (
    <div>
      <Navbar />
      <main className="page page--center">
        <RegisterForm />
      </main>
    </div>
  )
}