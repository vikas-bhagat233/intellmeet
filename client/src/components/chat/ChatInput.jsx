import React, { useState } from 'react'

export default function ChatInput({ onSendMessage, onTyping }) {
  const [text, setText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSendMessage(text)
    setText('')
    onTyping(false)
  }

  const handleChange = (e) => {
    setText(e.target.value)
    onTyping(e.target.value.length > 0)
  }

  const addEmoji = (emoji) => {
    setText(prev => prev + emoji)
    setShowEmojis(false)
  }

  const emojis = ['👍', '👏', '🔥', '🎉', '❤️', '💡', '🤔', '🚀', '💯']

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', gap: 8, marginTop: 10 }}>
      {showEmojis && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: 0,
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          padding: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
          zIndex: 10,
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)'
        }}>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                padding: 4,
                borderRadius: 4
              }}
              className="emoji-btn"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowEmojis(!showEmojis)}
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          padding: '0 10px',
          color: '#94a3b8',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        😀
      </button>

      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          padding: '10px 12px',
          color: '#fff',
          fontSize: 14,
          outline: 'none'
        }}
      />

      <button
        type="submit"
        style={{
          background: 'var(--accent)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 13,
          padding: '0 16px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Send
      </button>
    </form>
  )
}
