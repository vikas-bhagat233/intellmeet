import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // If VITE_SOCKET_URL is set at build time use it; otherwise connect to same origin
      const socketUrl = import.meta.env.VITE_SOCKET_URL || undefined
      const newSocket = io(socketUrl)
      setSocket(newSocket)
      return () => newSocket.close()
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}