import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
/**
 * TeamCard – displays basic info about a team.
 * Uses premium glass‑morphism styling.
 */
export default function TeamCard({ team }) {
  const navigate = useNavigate();
  const openTeam = () => {
    navigate(`/team-workspace/${team._id}`);
  };
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
      onClick={openTeam}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = 'var(--accent-2)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(20, 184, 166, 0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--glass-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h3 style={{ color: '#fff', margin: 0, fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700 }}>
            {team.teamName}
          </h3>
          <span style={{ 
            background: 'rgba(20, 184, 166, 0.12)', 
            color: 'var(--accent-2)', 
            padding: '4px 10px', 
            borderRadius: 12, 
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5
          }}>
            WORKSPACE
          </span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: '1.5', margin: '4px 0 16px 0' }}>
          {team.description || 'Collaborative workspace for sharing files, scheduling sprints, and managing Live meetings.'}
        </p>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <span style={{ color: '#cbd5e1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>👥</span> <strong>{team.members?.length || 1}</strong> members
        </span>
        <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>Open Workspace →</span>
      </div>
    </div>
  );
}

TeamCard.propTypes = {
  team: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    teamName: PropTypes.string.isRequired,
    description: PropTypes.string,
    members: PropTypes.array,
  }).isRequired,
};
