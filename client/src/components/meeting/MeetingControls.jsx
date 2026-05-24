import React from 'react'
import Button from '../common/Button'

export default function MeetingControls({
  isMuted,
  setIsMuted,
  isVideoOff,
  setIsVideoOff,
  isHost,
  isRecording,
  onToggleRecording,
  isScreenSharing,
  onToggleScreenShare,
  onEndCall
}) {
  return (
    <div className="controls" style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 24px',
      borderRadius: '16px',
      marginTop: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <Button onClick={() => setIsMuted(!isMuted)} variant={isMuted ? "danger" : "secondary"} size="small">
        {isMuted ? "🎤 Unmute" : "🎤 Mute"}
      </Button>
      <Button onClick={() => setIsVideoOff(!isVideoOff)} variant={isVideoOff ? "danger" : "secondary"} size="small">
        {isVideoOff ? "📹 Start Video" : "📹 Stop Video"}
      </Button>
      
      {/* Screen Sharing Toggle (Host Only) */}
      {isHost && (
        <Button onClick={onToggleScreenShare} variant={isScreenSharing ? "primary" : "secondary"} size="small">
          {isScreenSharing ? "🖥️ Stop Share" : "🖥️ Share Screen"}
        </Button>
      )}

      {/* Recording Toggle (Host Only) */}
      {isHost && (
        <Button onClick={onToggleRecording} variant={isRecording ? "danger" : "secondary"} size="small">
          {isRecording ? "🔴 Stop Rec" : "🔴 Record Call"}
        </Button>
      )}

      <Button onClick={onEndCall} variant="danger" size="small">
        🛑 End Call
      </Button>
    </div>
  )
}