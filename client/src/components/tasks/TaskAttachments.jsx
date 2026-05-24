import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { taskService } from '../../services/taskService';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function TaskAttachments({ task, token, onUpdateTask }) {
  const [uploading, setUploading] = useState(false);
  if (!task) return null;
  const fileInputRef = useRef(null);
  const attachments = task.attachments || [];

  const getDownloadUrl = (url) => {
    return url || '#';
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload actual file binary to Express server static uploads directory
      const uploadRes = await axios.post(`/api/project-tasks/${task._id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      const { url, name, size } = uploadRes.data;

      const newAttachment = { name, size, url };
      const updatedAttachments = [...attachments, newAttachment];

      // Save attachment directly into Task attachments array in MongoDB
      const updatedTask = await taskService.updateProjectTask(task._id, {
        attachments: updatedAttachments
      }, token);

      if (updatedTask && onUpdateTask) {
        onUpdateTask(updatedTask);
        toast.success(`"${file.name}" uploaded successfully!`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attIndex) => {
    try {
      const updatedAttachments = attachments.filter((_, idx) => idx !== attIndex);
      
      const updatedTask = await taskService.updateProjectTask(task._id, {
        attachments: updatedAttachments
      }, token);

      if (updatedTask && onUpdateTask) {
        onUpdateTask(updatedTask);
        toast.success('Attachment deleted');
      }
    } catch (e) {
      toast.error('Failed to delete attachment');
    }
  };

  return (
    <div className="glass" style={{ padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
      <h5 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: '0 0 12px 0' }}>
        📎 Attachments & Deliverables ({attachments.length})
      </h5>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {attachments.map((att, idx) => (
          <div key={att._id || idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            padding: '8px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={att.name}>
                {att.name}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                {att.size || '0.5 MB'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <a 
                href={getDownloadUrl(att.url)} 
                download={att.name}
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: 'var(--color-accent-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Download
              </a>
              <button
                onClick={() => handleDelete(idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title="Remove Deliverable"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {attachments.length === 0 && (
          <p style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>
            No attachments added to this task.
          </p>
        )}
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <Button 
          size="small" 
          variant="secondary" 
          onClick={() => fileInputRef.current?.click()} 
          style={{ cursor: 'pointer' }}
          disabled={uploading}
        >
          {uploading ? 'Uploading to Cloudinary...' : '📤 Upload File'}
        </Button>
      </div>
    </div>
  );
}

TaskAttachments.propTypes = {
  task: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  onUpdateTask: PropTypes.func.isRequired
};
