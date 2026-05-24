import React from 'react'
import TaskCard from './TaskCard'

export default function TaskList({ tasks, onToggleStatus }) {
  return (
    <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tasks.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: '10px 0' }}>
          No collaborative tasks logged during this meeting yet.
        </p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggleStatus={onToggleStatus}
          />
        ))
      )}
    </div>
  )
}
