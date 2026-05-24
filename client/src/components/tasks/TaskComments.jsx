import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { taskService } from '../../services/taskService';
import Button from '../common/Button';

export default function TaskComments({ taskId, token }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const list = await taskService.getComments(taskId, token);
      setComments(list);
    } catch (e) {
      console.error('Failed to load comments', e);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const commentObj = await taskService.addComment(taskId, newComment, token);
      if (commentObj) {
        setComments([...comments, commentObj]);
        setNewComment('');
      }
    } catch (e) {
      console.error('Failed to add comment', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await taskService.deleteComment(commentId, token);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (e) {
      console.error('Failed to delete comment', e);
    }
  };

  return (
    <div className="glass" style={{ padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
      <h5 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', fontFamily: 'Space Grotesk', margin: '0 0 12px 0' }}>
        💬 Discussion & Comments ({comments.length})
      </h5>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
        {comments.map(c => (
          <div key={c._id} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            padding: '8px 10px',
            borderRadius: '8px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <img
                src={c.userId?.avatarUrl || '/default-avatar.png'}
                alt={c.userId?.name}
                style={{ width: '16px', height: '16px', borderRadius: '50%' }}
              />
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: '500' }}>
                {c.userId?.name}
              </span>
              <span style={{ color: '#64748b', fontSize: '9px' }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, paddingRight: '20px', lineHeight: '1.4' }}>
              {c.comment}
            </p>
            <button
              onClick={() => handleDelete(c._id)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: '#ef4444',
                fontSize: '11px',
                opacity: 0.7,
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              ✕
            </button>
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>
            No comments yet. Start the conversation!
          </p>
        )}
      </div>

      <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#fff',
            fontSize: '12px',
            outline: 'none'
          }}
        />
        <Button size="small" variant="primary" type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </div>
  );
}

TaskComments.propTypes = {
  taskId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};
