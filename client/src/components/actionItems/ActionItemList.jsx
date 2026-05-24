import React from 'react'
import ActionItemCard from './ActionItemCard'

export default function ActionItemList({ tasks }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tasks.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
          No action items logged for this session.
        </p>
      ) : (
        tasks.map((task, idx) => (
          <ActionItemCard key={task._id || idx} task={task} />
        ))
      )}
    </div>
  )
}
