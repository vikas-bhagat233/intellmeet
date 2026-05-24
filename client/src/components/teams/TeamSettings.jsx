import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
/**
 * TeamSettings – form to edit team name, description and roles.
 * Uses glass‑morphism container.
 */
export default function TeamSettings({ team, onSave }) {
  const [name, setName] = useState(team.teamName);
  const [desc, setDesc] = useState(team.description || '');

  const handleSave = () => {
    onSave({ teamName: name, description: desc });
  };

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '12px', maxWidth: '500px' }}>
      <h3 style={{ color: '#fff', marginBottom: '12px', fontFamily: 'Space Grotesk' }}>Team Settings</h3>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8' }}>Team Name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8' }}>Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
          style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
      </div>
      <Button size="small" variant="primary" onClick={handleSave}>Save Changes</Button>
    </div>
  );
}

TeamSettings.propTypes = {
  team: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};
