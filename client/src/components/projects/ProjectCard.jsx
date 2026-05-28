import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div 
      className="card" 
      style={{
        padding: '24px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 180,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={() => navigate(`/project-board/${project._id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--glass-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk', margin: 0 }}>
            📁 {project.projectName}
          </h4>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            color: project.status === 'active' ? 'var(--success)' : 'var(--muted)',
            background: project.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)',
            padding: '3px 10px',
            borderRadius: '12px',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            {project.status || 'Active'}
          </span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0 16px 0', lineHeight: '1.5' }}>
          {project.description || 'Collaborative project board. Plan tasks, complete sprints, and track milestones.'}
        </p>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>👥</span> Members: <strong>{project.members?.length || 1}</strong>
        </span>
        <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>
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
