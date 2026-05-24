import React from 'react'

export default function TranscriptViewer({ transcripts }) {
  return (
    <div style={{
      maxHeight: '380px',
      overflowY: 'auto',
      background: 'rgba(15, 23, 42, 0.45)',
      borderRadius: 14,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      {transcripts.length === 0 ? (
        <div style={{ margin: 'auto', color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
          No dialogues recorded for this meeting.
        </div>
      ) : (
        transcripts.map((t, idx) => (
          <div key={idx} style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            paddingBottom: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}>
                👤 {t.speaker}
              </span>
              <span style={{ color: '#64748b', fontSize: 10 }}>
                {t.timestamp ? new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
              {t.text}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
