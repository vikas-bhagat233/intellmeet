import React from 'react'

export default function TypingIndicator({ typers }) {
  const text = typers.length === 1 
    ? `${typers[0]} is typing...`
    : `${typers.slice(0, 2).join(', ')}${typers.length > 2 ? ' and others' : ''} are typing...`

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      borderRadius: 8,
      alignSelf: 'flex-start',
      background: 'rgba(255, 255, 255, 0.04)'
    }}>
      <div style={{ display: 'flex', gap: 3 }}>
        <span className="dot" style={{ width: 4, height: 4, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out' }}></span>
        <span className="dot" style={{ width: 4, height: 4, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }}></span>
        <span className="dot" style={{ width: 4, height: 4, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }}></span>
      </div>
      <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>{text}</span>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
