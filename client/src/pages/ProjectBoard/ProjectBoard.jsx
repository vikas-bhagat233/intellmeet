import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import ProjectDetails from '../../components/projects/ProjectDetails';
import ProjectMembers from '../../components/projects/ProjectMembers';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import TaskModal from '../../components/kanban/TaskModal';
import TaskDetails from '../../components/tasks/TaskDetails';
import TaskComments from '../../components/tasks/TaskComments';
import TaskAttachments from '../../components/tasks/TaskAttachments';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ProjectBoard() {
  const { id } = useParams();
  const { token } = useAuth();
  const { socket } = useSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchBoardData();

    // Listen to real-time socket events for project tasks
    if (socket) {
      socket.on('task-created', (newTask) => {
        if (newTask.projectId === id) {
          setTasks(prev => [...prev, newTask]);
          toast.success(`Task "${newTask.title}" added to board!`);
        }
      });

      socket.on('task-updated', (updatedTask) => {
        if (updatedTask.projectId === id) {
          setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('task-created');
        socket.off('task-updated');
      }
    };
  }, [id, socket]);

  const fetchBoardData = async () => {
    try {
      const projObj = await projectService.updateProject(id, {}, token);
      setProject(projObj);
      const list = await taskService.getProjectTasks(id, token);
      setTasks(list);
    } catch (e) {
      toast.error('Failed to load project board');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const created = await taskService.createProjectTask(taskData, token);
      if (created) {
        setTasks([...tasks, created]);
        setShowCreateTask(false);
        toast.success('Task created!');
      }
    } catch (e) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      const updated = await taskService.updateProjectTask(taskId, { status: newStatus }, token);
      if (updated) {
        setTasks(prev => prev.map(t => t._id === taskId ? updated : t));
      }
    } catch (e) {
      toast.error('Failed to update task status');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.deleteProjectTask(taskId, token);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setSelectedTask(null);
      toast.success('Task deleted successfully');
    } catch (e) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleProjectStatus = async () => {
    const nextStatus = project.status === 'completed' ? 'active' : 'completed';
    try {
      const updated = await projectService.updateProject(id, { status: nextStatus }, token);
      if (updated) {
        setProject(updated);
        toast.success(`Project successfully marked as ${nextStatus}!`);
      }
    } catch (e) {
      toast.error('Failed to update project status');
    }
  };

  if (loading) return <Loader />;
  if (!project) return <p style={{ color: '#fff' }}>Project not found.</p>;

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Project Header Info */}
        <ProjectDetails project={project} onToggleStatus={handleToggleProjectStatus} />

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', marginBottom: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '18px', color: '#fff', margin: 0 }}>
                📋 Kanban Board
              </h3>
              <Button size="small" variant="primary" onClick={() => setShowCreateTask(true)}>
                ➕ Create Task
              </Button>
            </div>

            {/* Kanban columns view */}
            <KanbanBoard
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onTaskMove={handleTaskMove}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ProjectMembers members={project.members || []} />
          </div>
        </div>

        {/* Modals & Popups */}
        {showCreateTask && (
          <TaskModal
            projectId={id}
            members={project.members || []}
            onCreate={handleCreateTask}
            onClose={() => setShowCreateTask(false)}
          />
        )}

        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDelete={handleTaskDelete}
          />
        )}

        {/* Render comments and attachments within a details drawer if a task is focused */}
        {selectedTask && (
          <div style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '400px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px',
            zIndex: 1001,
            overflowY: 'auto',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h4 style={{ color: '#fff', margin: 0, fontFamily: 'Space Grotesk' }}>Task Panel</h4>
              <button onClick={() => setSelectedTask(null)} style={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }}>✕ Close</button>
            </div>
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>{selectedTask.title}</h3>
            
            <TaskComments taskId={selectedTask._id} token={token} />
            <TaskAttachments 
              task={selectedTask} 
              token={token} 
              onUpdateTask={(updatedTask) => {
                setSelectedTask(updatedTask);
                setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
              }} 
            />
          </div>
        )}

      </div>
    </div>
  );
}
