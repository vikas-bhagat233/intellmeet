import { useState, useEffect, useRef } from 'react'
import { useSocket } from './useSocket'
import { useAuth } from './useAuth'
import { chatService } from '../services/chatService'

export function useChat(meetingId) {
  const { socket } = useSocket()
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState({})
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    // Load historical chat messages
    chatService.getChatHistory(meetingId, token)
      .then(setMessages)
      .catch(console.error)

    if (!socket) return

    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on('user-typing', ({ userId, username, isTyping }) => {
      if (userId === user?._id) return
      setTypingUsers(prev => {
        const next = { ...prev }
        if (isTyping) {
          next[userId] = username
        } else {
          delete next[userId]
        }
        return next
      })
    })

    return () => {
      socket.off('receive-message')
      socket.off('user-typing')
    }
  }, [meetingId, socket, token, user?._id])

  const sendMessage = (messageText, messageType = 'text') => {
    if (!socket || !messageText.trim()) return
    // Include meetingId so server can associate the message even if socket.meetingId is not set yet
    socket.emit('send-message', { meetingId, message: messageText, messageType })
  }

  const setTyping = (isTyping) => {
    if (!socket) return
    socket.emit('typing', { isTyping })

    // Auto-stop typing indicator after 2.5 seconds of inactivity
    if (isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { isTyping: false })
      }, 2500)
    }
  }

  return { messages, typingUsers, sendMessage, setTyping }
}
