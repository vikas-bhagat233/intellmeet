import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import CreateMeetingForm from '../../components/meeting/CreateMeetingForm'

export default function CreateMeeting() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <main className="page page--center">
        <CreateMeetingForm onMeetingCreated={(meeting) => navigate(`/meeting/${meeting.meetingId}`)} />
      </main>
    </div>
  )
}