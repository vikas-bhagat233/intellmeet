import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
/**
 * TeamMembers – list members of a team with avatars.
 */
export default function TeamMembers({ teamId, members }) {
  const navigate = useNavigate();
  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  return (
    <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
      <h3 style={{ color: '#fff', marginBottom: '12px', fontFamily: 'Space Grotesk' }}>Team Members</h3>
      {members && members.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {members.map((m) => (
            <li key={m._id}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}
                onClick={() => viewProfile(m._id)}>
              <img src={m.avatarUrl || '/default-avatar.png'}
                  alt={m.name}
                  style={{ width: 32, height: 32, borderRadius: '50%', marginRight: '8px' }} />
              <span style={{ color: '#e2e8f0' }}>{m.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#94a3b8' }}>No members yet.</p>
      )}
    </div>
  );
}

TeamMembers.propTypes = {
  teamId: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
  })),
};
