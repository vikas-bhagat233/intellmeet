import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

export default function TaskModal({ projectId, members, onCreate, onClose }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate({
        title,
        description: desc,
        projectId,
        assignedTo: assignedTo || null,
        priority,
        dueDate: dueDate || null
      });
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
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: 0 }}>
          ➕ Create New Kanban Task
        </h3>

        <div>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
            Task Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
            }}
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
            Description
          </label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
              resize: 'none'
            }}
            placeholder="Add some details..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Assign Member (Email / Name)
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              placeholder="e.g. vikas@gmail.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#fff',
                outline: 'none',
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Button size="small" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="primary" type="submit">
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}

TaskModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
