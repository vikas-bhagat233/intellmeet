import React from 'react'

export default function MessageBubble({ msg, isSelf }) {
  const formattedTime = msg.createdAt 
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignSelf: isSelf ? 'flex-end' : 'flex-start',
      maxWidth: '80%'
    }}>
      <div style={{
        fontSize: 11,
        color: '#94a3b8',
        marginBottom: 2,
        alignSelf: isSelf ? 'flex-end' : 'flex-start',
        paddingLeft: isSelf ? 0 : 4,
        paddingRight: isSelf ? 4 : 0
      }}>
        {msg.senderName}
      </div>
      
      <div style={{
        background: isSelf ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
        color: isSelf ? '#fff' : '#f1f5f9',
        padding: '8px 12px',
        borderRadius: isSelf ? '12px 12px 0 12px' : '12px 12px 12px 0',
        fontSize: 13,
        lineHeight: 1.4,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        {msg.messageType === 'file' ? (
          <a
            href={msg.message}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isSelf ? '#fff' : '#60a5fa',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            📎 Shared File Attachment
          </a>
        ) : (
          msg.message
        )}
      </div>

      <div style={{
        fontSize: 10,
        color: '#64748b',
        marginTop: 2,
        alignSelf: isSelf ? 'flex-end' : 'flex-start',
        paddingLeft: isSelf ? 0 : 2,
        paddingRight: isSelf ? 2 : 0
      }}>
        {formattedTime}
      </div>
    </div>
  )
}
