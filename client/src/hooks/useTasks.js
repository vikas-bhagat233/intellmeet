import { useState, useEffect } from 'react'
import { useSocket } from './useSocket'
import { useAuth } from './useAuth'
import { taskService } from '../services/taskService'

export function useTasks(meetingId) {
  const { socket } = useSocket()
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // Load initial meeting task list
    taskService.getTasks(meetingId, token)
      .then(setTasks)
      .catch(console.error)

    if (!socket) return

    socket.on('task-added', (task) => {
      setTasks(prev => [task, ...prev])
    })

    return () => {
      socket.off('task-added')
    }
  }, [meetingId, socket, token])

  const addTask = (title, assignedTo = '', dueDate = null) => {
    if (!socket || !title.trim()) return
    socket.emit('task-created', { title, assignedTo, dueDate })
  }

  const markTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    try {
      const updated = await taskService.updateTaskStatus(taskId, nextStatus, token)
      if (updated) {
        setTasks(prev => prev.map(t => t._id === taskId ? updated : t))
      }
    } catch (err) {
      console.error('Failed to update task status:', err)
    }
  }

  return { tasks, addTask, markTaskStatus }
}
