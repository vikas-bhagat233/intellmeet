import React from 'react'

export default function OnlineUsers({ users }) {
  return (
    <div className="online-users" style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      margin: '10px 0'
    }}>
      {users.map((user, idx) => (
        <div key={user.userId || idx} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: 12,
          color: '#cbd5e1'
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: user.online ? '#22c55e' : '#94a3b8',
            boxShadow: user.online ? '0 0 6px #22c55e' : 'none'
          }} />
          {user.username || 'Participant'}
        </div>
      ))}
    </div>
  )
}
