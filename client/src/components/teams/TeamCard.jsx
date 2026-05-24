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
    <div className="glass" style={{
      padding: '16px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    }}
      onClick={openTeam}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <h3 style={{ color: '#fff', margin: 0, fontFamily: 'Space Grotesk' }}>{team.teamName}</h3>
      <p style={{ color: '#94a3b8', marginTop: 4 }}>{team.description}</p>
      <p style={{ color: '#cbd5e1', marginTop: 4, fontSize: 12 }}>Members: {team.members?.length || 0}</p>
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
