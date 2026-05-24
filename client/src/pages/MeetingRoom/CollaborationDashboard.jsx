import React, { useState } from 'react'
import ChatSection from './ChatSection'
import NotesSection from './NotesSection'
import FilesSection from './FilesSection'
import TaskList from '../../components/tasks/TaskList'
import QuickTaskModal from '../../components/tasks/QuickTaskModal'
import Button from '../../components/common/Button'
import { useTasks } from '../../hooks/useTasks'

export default function CollaborationDashboard({ meetingId, participants }) {
  const [activeTab, setActiveTab] = useState('chat')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const { tasks, addTask, markTaskStatus } = useTasks(meetingId)

  return (
    <div className="card collaboration-dashboard" style={{
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      padding: 20
    }}>
      {/* Tabs list */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: 16,
        gap: 4,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingBottom: 2
      }}>
        {['chat', 'notes', 'tasks', 'files'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 14px',
              background: activeTab === tab ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : '#94a3b8',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: '6px 6px 0 0'
            }}
          >
            {tab === 'chat' && '💬 Chat'}
            {tab === 'notes' && '📝 Notes'}
            {tab === 'tasks' && '✅ Tasks'}
            {tab === 'files' && '📁 Files'}
          </button>
        ))}
      </div>

      {/* Tab Content window */}
      <div style={{ minHeight: '340px' }}>
        {activeTab === 'chat' && (
          <ChatSection meetingId={meetingId} />
        )}

        {activeTab === 'notes' && (
          <NotesSection meetingId={meetingId} />
        )}

        {activeTab === 'files' && (
          <FilesSection meetingId={meetingId} />
        )}

        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Meeting Action Registry</h4>
              <Button onClick={() => setShowTaskModal(true)} size="small" variant="secondary">
                ➕ Add Task
              </Button>
            </div>

            <TaskList tasks={tasks} onToggleStatus={markTaskStatus} />
          </div>
        )}
      </div>

      {/* Modals overlay */}
      {showTaskModal && (
        <QuickTaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={addTask}
        />
      )}
    </div>
  )
}
