import React from 'react'
import { useNotes } from '../../hooks/useNotes'
import NotesEditor from '../../components/notes/NotesEditor'
import NotesHistory from '../../components/notes/NotesHistory'

export default function NotesSection({ meetingId }) {
  const { noteContent, lastEditedBy, updateNote } = useNotes(meetingId)

  return (
    <div className="notes-section">
      <NotesEditor
        noteContent={noteContent}
        lastEditedBy={lastEditedBy}
        onContentChange={updateNote}
      />
      <NotesHistory />
    </div>
  )
}
