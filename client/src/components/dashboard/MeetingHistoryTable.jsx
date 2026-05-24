import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'

export default function MeetingHistoryTable({ history }) {
  const navigate = useNavigate()

  return (
    <div style={{
      overflowX: 'auto',
      background: 'rgba(15, 23, 42, 0.4)',
      borderRadius: 12,
      border: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: 13
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Meeting Title</th>
            <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Host</th>
            <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Date</th>
            <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Duration</th>
            <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Participants</th>
            <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '30px 18px', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
                No completed meetings found.
              </td>
            </tr>
          ) : (
            history.map((m) => (
              <tr key={m.meetingId} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'background 0.2s'
              }}
              className="table-row"
              >
                <td style={{ padding: '14px 18px', color: '#f8fafc', fontWeight: 600 }}>{m.title}</td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{m.hostName}</td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                  {new Date(m.startTime).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{m.duration} mins</td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                  {m.participants ? m.participants.length : 1} present
                </td>
                <td style={{ padding: '10px 18px', textAlign: 'right' }}>
                  <Button
                    size="small"
                    variant="primary"
                    onClick={() => navigate(`/meeting-details/${m.meetingId}`)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
