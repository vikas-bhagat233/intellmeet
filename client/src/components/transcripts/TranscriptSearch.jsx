import React from 'react'

export default function TranscriptSearch({ query, setQuery }) {
  return (
    <div style={{ marginBottom: 12, position: 'relative' }}>
      <input
        type="text"
        placeholder="Filter transcript dialogue..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          padding: '8px 12px',
          color: '#fff',
          fontSize: 13,
          outline: 'none'
        }}
      />
    </div>
  )
}
