import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function JoinMeetingForm({ onJoin }) {
  const [meetingId, setMeetingId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (meetingId) onJoin(meetingId)
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="form-title" style={{ textAlign: 'left', marginBottom: 12 }}>Join Meeting</h3>
      <Input label="Meeting ID" value={meetingId} onChange={(e) => setMeetingId(e.target.value)} required />
      <Button type="submit">Join Meeting</Button>
    </form>
  )
}