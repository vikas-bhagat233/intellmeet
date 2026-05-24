import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import JoinMeetingForm from '../../components/meeting/JoinMeetingForm'

export default function JoinMeeting() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <main className="page page--center">
        <JoinMeetingForm onJoin={(meetingId) => navigate(`/meeting/${meetingId}`)} />
      </main>
    </div>
  )
}