import React from 'react'

export default function NotesHistory({ onRestoreMock }) {
  return (
    <div className="notes-history" style={{ marginTop: 12 }}>
      <p style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
        Note changes are auto-saved to MongoDB and synced live via WebSockets.
      </p>
    </div>
  )
}
