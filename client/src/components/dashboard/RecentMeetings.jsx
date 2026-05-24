import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'

export default function RecentMeetings({ meetings }) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk' }}>
        📅 Completed Sessions List
      </h3>

      {meetings.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
          No recently completed meetings.
        </p>
      ) : (
        meetings.map((m) => (
          <div key={m.meetingId} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12
          }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{m.title}</h4>
              <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
                👤 {m.hostName} • ⏳ {m.duration} mins • 📅 {new Date(m.startTime).toLocaleDateString()}
              </p>
            </div>

            <Button
              size="small"
              variant="secondary"
              onClick={() => navigate(`/meeting-details/${m.meetingId}`)}
            >
              Analyze
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
