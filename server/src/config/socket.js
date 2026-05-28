import { Server } from 'socket.io'
import { chatService } from '../services/chatService.js'
import { noteService } from '../services/noteService.js'
import { taskService } from '../services/taskService.js'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id)

    socket.on('join-meeting', ({ meetingId, userId, username }) => {
      socket.meetingId = meetingId
      socket.userId = userId
      socket.username = username
      socket.join(meetingId)
      socket.to(meetingId).emit('user-joined', { userId, username, socketId: socket.id })
      console.log(`User ${username} joined meeting ${meetingId}`)

      // Debug: log all sockets in this meeting room
      const room = io.sockets.adapter.rooms.get(meetingId);
      if (room) {
        console.log(`[Room ${meetingId}] Connected sockets:`, Array.from(room));
      } else {
        console.log(`[Room ${meetingId}] No sockets found.`);
      }
    })

    socket.on('sending-signal', ({ userId, signal, callerId }) => {
      io.to(userId).emit('receiving-signal', { signal, callerId, username: socket.username, callerDbId: socket.userId })
    })

    socket.on('returning-signal', ({ signal, callerId }) => {
      io.to(callerId).emit('received-returned-signal', { signal, id: socket.id })
    })

    // Relay host screen-share state to all participants in the meeting
    socket.on('host-screen-share', ({ meetingId, isSharing }) => {
      socket.to(meetingId).emit('host-screen-share', { isSharing })
    })

    // Relay direct unmute requests to specific participant socket
    socket.on('request-unmute', ({ targetSocketId, requesterName }) => {
      io.to(targetSocketId).emit('request-unmute', { requesterName })
    })

    // Relay participant mute/video state toggles to everyone in the room
    socket.on('toggle-media', ({ meetingId, isMuted, isVideoOff }) => {
      socket.to(meetingId).emit('participant-media-toggled', {
        socketId: socket.id,
        userId: socket.userId,
        isMuted,
        isVideoOff
      })
    })

    socket.on('leave-meeting', ({ meetingId, userId }) => {
      socket.leave(meetingId)
      socket.to(meetingId).emit('user-left', { userId, socketId: socket.id })
    })

    socket.on('send-message', async ({ message, messageType }) => {
      if (socket.meetingId && socket.userId) {
        try {
          const savedMsg = await chatService.saveMessage(
            socket.meetingId,
            socket.userId,
            socket.username || 'User',
            message,
            messageType || 'text'
          )
          io.to(socket.meetingId).emit('receive-message', savedMsg)
        } catch (err) {
          console.error('Failed to save chat message:', err)
        }
      }
    })

    socket.on('typing', ({ isTyping }) => {
      if (socket.meetingId && socket.userId) {
        socket.to(socket.meetingId).emit('user-typing', {
          userId: socket.userId,
          username: socket.username || 'User',
          isTyping
        })
      }
    })

    socket.on('note-update', async ({ content }) => {
      if (socket.meetingId && socket.userId) {
        try {
          const savedNote = await noteService.saveNoteContent(
            socket.meetingId,
            content || '',
            socket.userId,
            socket.username || 'User'
          )
          socket.to(socket.meetingId).emit('note-updated', {
            content: savedNote.content,
            lastEditedByName: socket.username || 'User'
          })
        } catch (err) {
          console.error('Failed to save collaborative note update:', err)
        }
      }
    })

    socket.on('task-created', async ({ title, assignedTo, dueDate }) => {
      if (socket.meetingId) {
        try {
          const savedTask = await taskService.createTask(
            socket.meetingId,
            title,
            assignedTo,
            dueDate
          )
          io.to(socket.meetingId).emit('task-added', savedTask)
        } catch (err) {
          console.error('Failed to create meeting task:', err)
        }
      }
    })

    socket.on('file-uploaded', ({ file }) => {
      if (socket.meetingId) {
        io.to(socket.meetingId).emit('new-file', file)
      }
    })

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id)
      if (socket.meetingId && socket.userId) {
        socket.to(socket.meetingId).emit('user-left', { userId: socket.userId, socketId: socket.id })
      }
    })
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}