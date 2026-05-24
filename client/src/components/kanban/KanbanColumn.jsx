import React from 'react';
import PropTypes from 'prop-types';
import TaskCard from './TaskCard';

export default function KanbanColumn({ title, status, tasks, onTaskClick, onDragOver, onDrop }) {
  const count = tasks.length;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver) onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) onDrop(e, status);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        background: 'rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        minWidth: '260px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '400px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: 0 }}>
          {title}
        </h4>
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--color-text-muted)',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          {count}
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1,
        overflowY: 'auto'
      }}>
        {tasks.map(task => (
          <div
            key={task._id}
            draggable
            onDragStart={(e) => handleDragStart(e, task._id)}
          >
            <TaskCard task={task} onClick={onTaskClick} />
          </div>
        ))}
        {count === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            padding: '20px',
            color: '#64748b',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Drag tasks here
          </div>
        )}
      </div>
    </div>
  );
}

KanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  onTaskClick: PropTypes.func.isRequired,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
};
