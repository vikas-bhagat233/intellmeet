import React from 'react'

export default function TranscriptPanel({ transcripts }) {
  return (
    <div className="transcript-panel">
      <h3 className="dashboard__subtitle" style={{ color: '#fff', marginBottom: 12 }}>Live Transcripts</h3>
      <div className="transcript-list" style={{
        maxHeight: '260px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingRight: 6
      }}>
        {transcripts.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 14, fontStyle: 'italic' }}>
            No speech transcribed yet. Start speaking or click transcribe!
          </p>
        ) : (
          transcripts.map((t, idx) => (
            <div key={t._id || idx} style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 10,
              padding: 10,
              borderLeft: '4px solid var(--accent)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{t.speaker}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.4 }}>{t.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
