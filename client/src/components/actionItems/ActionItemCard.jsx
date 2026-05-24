import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ActionItemCard({ task }) {
  const { token } = useAuth();
  const [status, setStatus] = useState(task.status || 'pending');
  const isCompleted = status === 'completed';

  const toggleStatus = async () => {
    const newStatus = isCompleted ? 'pending' : 'completed';
    try {
      if (task._id) {
        await axios.patch(`/api/tasks/${task._id}/status`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setStatus(newStatus);
      toast.success(`Task status marked as ${newStatus}!`);
    } catch (e) {
      toast.error('Failed to update task status');
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      transition: 'background 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Interactive Checkbox */}
        <input 
          type="checkbox" 
          checked={isCompleted} 
          onChange={toggleStatus}
          style={{
            cursor: 'pointer',
            width: '18px',
            height: '18px',
            accentColor: 'var(--color-accent-primary)'
          }}
        />
        <div>
          <h4 style={{
            color: isCompleted ? '#64748b' : '#fff',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: isCompleted ? 'line-through' : 'none',
            margin: 0,
            transition: 'color 0.2s, text-decoration 0.2s'
          }}>
            {task.task}
          </h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            {task.assignedTo && (
              <span style={{
                fontSize: 10,
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                padding: '1px 6px',
                borderRadius: 4
              }}>
                👤 {task.assignedTo}
              </span>
            )}
            {task.deadline && (
              <span style={{ fontSize: 9, color: '#64748b' }}>
                📅 Due: {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <span 
        onClick={toggleStatus}
        style={{
          fontSize: 10,
          fontWeight: 600,
          background: isCompleted ? 'rgba(34, 197, 94, 0.12)' : 'rgba(234, 179, 8, 0.12)',
          color: isCompleted ? '#4ade80' : '#facc15',
          padding: '4px 10px',
          borderRadius: '6px',
          textTransform: 'capitalize',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.filter = 'brightness(1.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.filter = 'none';
        }}
      >
        {status}
      </span>
    </div>
  );
}
