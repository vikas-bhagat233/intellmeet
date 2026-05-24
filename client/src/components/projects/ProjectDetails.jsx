import React from 'react';
import PropTypes from 'prop-types';

export default function ProjectDetails({ project, onToggleStatus }) {
  const isCompleted = project.status === 'completed';

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', fontFamily: 'Space Grotesk', margin: 0 }}>
          📁 {project.projectName}
        </h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{
            background: isCompleted ? 'rgba(74, 222, 128, 0.12)' : 'rgba(59, 130, 246, 0.12)',
            color: isCompleted ? '#4ade80' : 'var(--color-accent-primary)',
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'capitalize'
          }}>
            {project.status}
          </span>
          {onToggleStatus && (
            <button
              onClick={onToggleStatus}
              style={{
                background: isCompleted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 222, 128, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: isCompleted ? '#cbd5e1' : '#4ade80',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
              }}
            >
              {isCompleted ? '🔄 Mark Active' : '✅ Mark Completed'}
            </button>
          )}
        </div>
      </div>
      <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
        {project.description || 'No description available for this project.'}
      </p>
    </div>
  );
}

ProjectDetails.propTypes = {
  project: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onToggleStatus: PropTypes.func
};
