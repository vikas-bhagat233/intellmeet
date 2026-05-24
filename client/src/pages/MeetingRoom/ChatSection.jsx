import React from 'react'
import { useChat } from '../../hooks/useChat'
import { useAuth } from '../../hooks/useAuth'
import ChatWindow from '../../components/chat/ChatWindow'
import ChatInput from '../../components/chat/ChatInput'

export default function ChatSection({ meetingId }) {
  const { user } = useAuth()
  const { messages, typingUsers, sendMessage, setTyping } = useChat(meetingId)

  return (
    <div className="chat-section" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ChatWindow
        messages={messages}
        typingUsers={typingUsers}
        currentUserId={user?._id}
      />
      <ChatInput
        onSendMessage={sendMessage}
        onTyping={setTyping}
      />
    </div>
  )
}
