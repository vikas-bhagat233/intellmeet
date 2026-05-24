import { useState, useEffect, useRef } from 'react'
import { useSocket } from './useSocket'
import { useAuth } from './useAuth'
import { notesService } from '../services/notesService'

export function useNotes(meetingId) {
  const { socket } = useSocket()
  const { token } = useAuth()
  const [noteContent, setNoteContent] = useState('')
  const [lastEditedBy, setLastEditedBy] = useState('')
  const isLocalUpdateRef = useRef(false)

  useEffect(() => {
    // Load initial note content
    notesService.getSharedNote(meetingId, token)
      .then(note => {
        if (note) {
          setNoteContent(note.content || '')
          setLastEditedBy(note.lastEditedByName || '')
        }
      })
      .catch(console.error)

    if (!socket) return

    socket.on('note-updated', ({ content, lastEditedByName }) => {
      // Only set content if it didn't originate locally
      if (!isLocalUpdateRef.current) {
        setNoteContent(content)
      }
      setLastEditedBy(lastEditedByName)
      isLocalUpdateRef.current = false
    })

    return () => {
      socket.off('note-updated')
    }
  }, [meetingId, socket, token])

  const updateNote = (newContent) => {
    setNoteContent(newContent)
    if (!socket) return

    isLocalUpdateRef.current = true
    socket.emit('note-update', { content: newContent })
  }

  return { noteContent, lastEditedBy, updateNote }
}
