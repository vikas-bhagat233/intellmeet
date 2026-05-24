import React from 'react';
import PropTypes from 'prop-types';

export default function ProjectMembers({ members }) {
  return (
    <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
      <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: '0 0 12px 0' }}>
        👥 Project Members
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {members && members.length > 0 ? (
          members.map(member => (
            <div key={member._id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '4px 10px',
              borderRadius: '20px',
            }}>
              <img
                src={member.avatarUrl || '/default-avatar.png'}
                alt={member.name}
                style={{ width: '18px', height: '18px', borderRadius: '50%' }}
              />
              <span style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '500' }}>
                {member.name}
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>
            No members assigned.
          </p>
        )}
      </div>
    </div>
  );
}

ProjectMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
  })).isRequired,
};
