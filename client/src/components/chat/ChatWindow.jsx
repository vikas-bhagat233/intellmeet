import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ messages, typingUsers, currentUserId }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUsers])

  const typers = Object.values(typingUsers)

  return (
    <div className="chat-window" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '320px',
      background: 'rgba(15, 23, 42, 0.4)',
      borderRadius: 12,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '12px 14px',
      overflowY: 'auto',
      gap: 10
    }}>
      {messages.length === 0 ? (
        <div style={{
          margin: 'auto',
          color: '#64748b',
          fontSize: 13,
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          No messages yet. Send a hello to get started!
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={msg._id || index}
            msg={msg}
            isSelf={msg.senderId === currentUserId}
          />
        ))
      )}

      {typers.length > 0 && (
        <TypingIndicator typers={typers} />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
