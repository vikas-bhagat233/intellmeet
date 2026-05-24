import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div className="glass" style={{
      padding: '20px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onClick={() => navigate(`/project-board/${project._id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: 0 }}>
          📁 {project.projectName}
        </h4>
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: project.status === 'active' ? '#4ade80' : '#94a3b8',
          background: project.status === 'active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(148, 163, 184, 0.1)',
          padding: '2px 8px',
          borderRadius: '4px',
          textTransform: 'capitalize'
        }}>
          {project.status}
        </span>
      </div>
      <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
        {project.description || 'No description provided.'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          Members: {project.members?.length || 0}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-accent-primary)', fontWeight: '500' }}>
          Open Board →
        </span>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    members: PropTypes.array,
  }).isRequired,
};
