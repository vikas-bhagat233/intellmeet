import React from 'react'

export default function RecordingPlayer({ recordingUrl }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk' }}>
        🎥 Watch Meeting Session Recording
      </h3>
      <div style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#090d16',
        aspectRatio: '16/9'
      }}>
        <video
          src={recordingUrl}
          controls
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}
