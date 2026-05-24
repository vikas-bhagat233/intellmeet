import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * ActionItemTracker – visual timeline of action items for a meeting.
 * Each item displays its task, assignee, deadline and status badge.
 * Uses glass‑morphism cards and a gradient progress bar.
 */
export default function ActionItemTracker({ meetingId, items }) {
  const navigate = useNavigate();

  const statusColors = {
    pending: '#fbbf24',      // amber
    in_progress: '#3b82f6', // blue
    completed: '#10b981',    // green
    overdue: '#ef4444'      // red
  };

  const handleCardClick = (itemId) => {
    // Future: navigate to a detailed task view
    console.log('Clicked action item', itemId);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(12px)',
      borderRadius: 16,
      padding: 20,
      border: '1px solid rgba(255,255,255,0.07)'
    }}>
      <h3 style={{ color: '#fff', marginBottom: 12, fontFamily: 'Space Grotesk' }}>🗂️ Action Items</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items && items.length > 0 ? (
          items.map((it) => (
            <div
              key={it._id}
              onClick={() => handleCardClick(it._id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>{it.task}</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>
                  Assigned to <strong>{it.assignedTo?.name || it.assignedTo}</strong> • Due {new Date(it.deadline).toLocaleDateString()}
                </div>
              </div>
              <div style={{
                background: statusColors[it.status] || '#64748b',
                color: '#fff',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 11,
                textTransform: 'capitalize',
                minWidth: 80,
                textAlign: 'center'
              }}>
                {it.status.replace('_', ' ')}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>No action items for this meeting.</div>
        )}
      </div>
    </div>
  );
}

ActionItemTracker.propTypes = {
  meetingId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    assignedTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    deadline: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['pending', 'in_progress', 'completed', 'overdue']).isRequired,
  })).isRequired,
};
