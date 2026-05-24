import React from 'react'

export default function SearchMeeting({ query, setQuery }) {
  return (
    <div style={{
      marginBottom: 16,
      position: 'relative',
      maxWidth: '360px'
    }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#64748b' }}>
        🔍
      </span>
      <input
        type="text"
        placeholder="Search past meetings by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          padding: '10px 14px 10px 36px',
          color: '#fff',
          fontSize: 13,
          outline: 'none',
          transition: 'all 0.2s'
        }}
      />
    </div>
  )
}
