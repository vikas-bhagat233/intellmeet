import React from 'react'

export default function TaskCard({ task, onToggleStatus }) {
  const isCompleted = task.status === 'completed'

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 8,
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleStatus(task._id, task.status)}
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            cursor: 'pointer',
            accentColor: 'var(--accent)'
          }}
        />

        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            color: isCompleted ? '#64748b' : '#f8fafc',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: isCompleted ? 'line-through' : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {task.title}
          </p>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
            {task.assignedTo && (
              <span style={{
                fontSize: 10,
                color: '#60a5fa',
                background: 'rgba(59, 130, 246, 0.12)',
                padding: '1px 6px',
                borderRadius: 4
              }}>
                👤 {task.assignedTo}
              </span>
            )}
            {task.dueDate && (
              <span style={{ fontSize: 9, color: '#64748b' }}>
                📅 {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <span style={{
        fontSize: 10,
        fontWeight: 600,
        background: isCompleted ? 'rgba(34, 197, 94, 0.12)' : 'rgba(234, 179, 8, 0.12)',
        color: isCompleted ? '#4ade80' : '#facc15',
        padding: '2px 6px',
        borderRadius: 4,
        textTransform: 'capitalize'
      }}>
        {task.status || 'pending'}
      </span>
    </div>
  )
}
