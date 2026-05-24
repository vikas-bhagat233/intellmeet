import React from 'react'

export default function NotesToolbar({ lastEditedBy }) {
  return (
    <div className="notes-toolbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 6px'
    }}>
      <span style={{ fontSize: 13, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        📝 Collaborative Notepad
      </span>
      {lastEditedBy && (
        <span style={{
          fontSize: 11,
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          padding: '2px 8px',
          borderRadius: 4
        }}>
          ✍️ Last edit by: {lastEditedBy}
        </span>
      )}
    </div>
  )
}
