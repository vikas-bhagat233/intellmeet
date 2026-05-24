import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { useSocket } from '../../hooks/useSocket'
import FileUpload from '../../components/files/FileUpload'
import SharedFiles from '../../components/files/SharedFiles'

export default function FilesSection({ meetingId }) {
  const { token } = useAuth()
  const { socket } = useSocket()
  const [files, setFiles] = useState([])

  useEffect(() => {
    // Load historical shared files
    axios.get(`/api/files/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setFiles(response.data?.data?.files || [])
      })
      .catch(console.error)

    if (!socket) return

    socket.on('new-file', (file) => {
      setFiles(prev => [file, ...prev])
    })

    return () => {
      socket.off('new-file')
    }
  }, [meetingId, socket, token])

  const handleNewFile = (file) => {
    setFiles(prev => [file, ...prev])
  }

  return (
    <div className="files-section" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <FileUpload meetingId={meetingId} onFileShared={handleNewFile} />
      <SharedFiles files={files} />
    </div>
  )
}
