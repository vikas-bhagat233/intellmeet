import React from 'react'
import NotesToolbar from './NotesToolbar'

export default function NotesEditor({ noteContent, lastEditedBy, onContentChange }) {
  return (
    <div className="notes-editor" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
      <NotesToolbar lastEditedBy={lastEditedBy} />

      <textarea
        value={noteContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Start writing notes collaboratively with other meeting participants..."
        style={{
          width: '100%',
          height: '240px',
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: 14,
          color: '#f8fafc',
          fontSize: 14,
          lineHeight: 1.6,
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit'
        }}
      />
    </div>
  )
}
