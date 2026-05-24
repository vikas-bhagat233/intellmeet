import React from 'react'

export default function RecordingList({ size, duration }) {
  const sizeMb = size ? (size / (1024 * 1024)).toFixed(1) : '14.7'
  const durationMin = duration ? (duration / 60).toFixed(0) : '6'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 13,
      color: '#cbd5e1',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
      <span>📁 File Size: <strong>{sizeMb} MB</strong></span>
      <span>⏳ Duration: <strong>{durationMin} minutes</strong></span>
      <span>☁️ Cloud Storage: <strong>Cloudinary Cloud Server</strong></span>
    </div>
  )
}
