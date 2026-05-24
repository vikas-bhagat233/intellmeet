import React from 'react'
import Button from '../common/Button'

export default function ActionItemPanel({ actionItems, onExtract, loading }) {
  return (
    <div className="action-items-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Extracted Action Items</h4>
        <Button onClick={onExtract} disabled={loading} size="small" variant="secondary">
          {loading ? 'Extracting...' : 'Re-extract Tasks'}
        </Button>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 12,
        padding: 16,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        minHeight: '120px'
      }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20 }}>
            <div className="loader__spinner" style={{ width: 28, height: 28 }} />
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Extracting clear action items using Hugging Face LLM...</p>
          </div>
        ) : actionItems && actionItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {actionItems.map((item, idx) => (
              <div key={item._id || idx} style={{
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: 10,
                padding: 12,
                border: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{ color: '#f8fafc', fontSize: 14, fontWeight: 500 }}>{item.task}</p>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {item.assignedTo && (
                      <span style={{
                        fontSize: 11,
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}>
                        👤 {item.assignedTo}
                      </span>
                    )}
                    {item.deadline && (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        📅 Due: {new Date(item.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  background: item.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: item.status === 'completed' ? '#4ade80' : '#facc15',
                  padding: '2px 8px',
                  borderRadius: 4,
                  textTransform: 'capitalize'
                }}>
                  {item.status || 'pending'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
            <p style={{ fontSize: 13, marginBottom: 12 }}>No action items extracted yet.</p>
            <Button onClick={onExtract} size="small">Extract Action Items</Button>
          </div>
        )}
      </div>
    </div>
  )
}
