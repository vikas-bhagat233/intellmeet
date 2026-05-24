import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function CreateMeetingForm({ onMeetingCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/meetings/create', { title, description }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Meeting created!')
      onMeetingCreated(response.data?.data?.meeting)
    } catch (error) {
      toast.error('Failed to create meeting')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="form-title" style={{ textAlign: 'left', marginBottom: 12 }}>Create New Meeting</h3>
      <Input label="Meeting Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button type="submit">Create Meeting</Button>
    </form>
  )
}