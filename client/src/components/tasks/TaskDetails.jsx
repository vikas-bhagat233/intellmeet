import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

export default function TaskDetails({ task, onClose, onDelete }) {
  const priorityColors = {
    Low: { text: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    Medium: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    High: { text: '#fb7185', bg: 'rgba(251, 113, 133, 0.1)' },
    Critical: { text: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' }
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.Medium;

  return (
    <div className="glass" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            color: priorityStyle.text,
            background: priorityStyle.bg,
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            {task.priority} Priority
          </span>
          <span style={{
            fontSize: '11px',
            color: '#cbd5e1',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            Status: {task.status}
          </span>
        </div>

        <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', fontFamily: 'Space Grotesk', margin: 0 }}>
          {task.title}
        </h3>

        {task.description && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600' }}>DESCRIPTION</span>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
              {task.description}
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>ASSIGNED TO</span>
            {task.assignedTo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px' }}>👤</span>
                <span style={{ color: '#fff', fontSize: '13px' }}>{task.assignedTo}</span>
              </div>
            ) : (
              <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Unassigned</span>
            )}
          </div>

          <div>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>DUE DATE</span>
            <span style={{ color: '#fff', fontSize: '13px' }}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
          <Button size="small" variant="secondary" onClick={() => onDelete(task._id)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            🗑️ Delete Task
          </Button>
          <Button size="small" variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

TaskDetails.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
    status: PropTypes.string,
    assignedTo: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
