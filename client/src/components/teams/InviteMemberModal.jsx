import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
/**
 * InviteMemberModal – modal dialog to invite a user to a team.
 * Uses glass‑morphism with fade‑in animation.
 */
export default function InviteMemberModal({ teamId, onInvite, onClose }) {
  const [email, setEmail] = useState('');
  const handleInvite = () => {
    if (email) {
      onInvite(teamId, email);
      setEmail('');
    }
  };
  return (
    <div className="glass" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(15,23,42,0.9)',
        padding: 24,
        borderRadius: 12,
        maxWidth: 400,
        width: '100%',
      }}>
        <h3 style={{ color: '#fff', marginBottom: 12, fontFamily: 'Space Grotesk' }}>Invite Member</h3>
        <input type="email"
          placeholder="User email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#fff',
            marginBottom: 12,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button size="small" variant="primary" onClick={handleInvite}>Invite</Button>
        </div>
      </div>
    </div>
  );
}

InviteMemberModal.propTypes = {
  teamId: PropTypes.string.isRequired,
  onInvite: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
