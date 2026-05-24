import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

export default function CreateProjectModal({ teamId, onCreate, onClose }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ projectName: name, description: desc, teamId });
      setName('');
      setDesc('');
    }
  };

  return (
    <div className="glass" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: 0 }}>
          🚀 Create New Project
        </h3>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
            Project Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
            }}
            placeholder="e.g. Redesign Landing Page"
          />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
            Description
          </label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
              resize: 'none'
            }}
            placeholder="What is this project about?"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Button size="small" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="primary" type="submit">
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}

CreateProjectModal.propTypes = {
  teamId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
