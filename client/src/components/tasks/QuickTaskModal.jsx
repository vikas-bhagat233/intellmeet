import React, { useState } from 'react'
import Button from '../common/Button'

export default function QuickTaskModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit(title, assignedTo, dueDate || null)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="card" style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        width: 'min(400px, 92vw)',
        padding: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 16, fontFamily: 'Space Grotesk' }}>
          ➕ Add Quick Meeting Task
        </h4>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field__label" style={{ color: '#94a3b8' }}>Task Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Update participants panel CSS contrast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field__input"
              style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
            />
          </div>

          <div className="field">
            <label className="field__label" style={{ color: '#94a3b8' }}>Assign To</label>
            <input
              type="text"
              placeholder="e.g. Vikas"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="field__input"
              style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
            />
          </div>

          <div className="field">
            <label className="field__label" style={{ color: '#94a3b8' }}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="field__input"
              style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <Button type="button" variant="secondary" onClick={onClose} size="small">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="small">
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
