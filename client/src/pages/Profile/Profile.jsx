import Navbar from '../../components/common/Navbar'
import ProfileCard from '../../components/auth/ProfileCard'

export default function Profile() {
  return (
    <div>
      <Navbar />
      <main className="page page--center">
        <ProfileCard />
      </main>
    </div>
  )
}