import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function ProfileCard() {
  const { user, token } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put('/users/profile', { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Update failed')
    }
  }

  return (
    <div className="card profile-card">
      <h2 className="form-title" style={{ textAlign: 'left', marginBottom: 12 }}>Profile Information</h2>
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <div className="profile-actions">
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="profile-actions">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  )
}