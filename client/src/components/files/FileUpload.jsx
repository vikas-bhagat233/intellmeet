import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { useSocket } from '../../hooks/useSocket'
import Button from '../common/Button'

export default function FileUpload({ meetingId, onFileShared }) {
  const { token } = useAuth()
  const { socket } = useSocket()
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('meetingId', meetingId)
    formData.append('file', file)

    try {
      setUploading(true)
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      const sharedFile = response.data?.data?.file
      if (sharedFile) {
        toast.success(`Shared ${file.name} successfully!`)
        // Trigger socket event
        if (socket) {
          socket.emit('file-uploaded', { file: sharedFile })
        }
        onFileShared(sharedFile)
      }
    } catch (err) {
      toast.error('File sharing failed')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-upload" style={{
      border: '2px dashed rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: '16px 20px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.02)',
      cursor: 'pointer',
      position: 'relative'
    }}>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer'
        }}
      />
      <div>
        <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>📤</span>
        <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 600 }}>
          {uploading ? 'Uploading...' : 'Choose a file to share'}
        </span>
        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
          Documents, PDFs, or images up to 10MB
        </p>
      </div>
    </div>
  )
}
