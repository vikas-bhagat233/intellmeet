import React from 'react';
import PropTypes from 'prop-types';

export default function TaskCard({ task, onClick }) {
  const priorityColors = {
    Low: { text: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    Medium: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    High: { text: '#fb7185', bg: 'rgba(251, 113, 133, 0.1)' },
    Critical: { text: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' }
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.Medium;

  return (
    <div className="glass" style={{
      padding: '12px 14px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      transition: 'transform 0.15s, border-color 0.15s',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}
      onClick={() => onClick(task)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.015)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '9px',
          fontWeight: '700',
          color: priorityStyle.text,
          background: priorityStyle.bg,
          padding: '2px 6px',
          borderRadius: '4px',
          textTransform: 'uppercase'
        }}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <h5 style={{ color: '#fff', fontSize: '13px', fontWeight: '600', margin: 0, lineHeight: '1.4' }}>
        {task.title}
      </h5>

      {task.description && (
        <p style={{
          color: '#cbd5e1',
          fontSize: '11px',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {task.description}
        </p>
      )}

      {task.assignedTo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px' }}>👤</span>
          <span style={{ color: '#94a3b8', fontSize: '11px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={task.assignedTo}>
            {task.assignedTo}
          </span>
        </div>
      )}
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
    assignedTo: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
