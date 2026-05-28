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
      gap: '14px',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(10, 15, 30, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 28px',
      borderRadius: '40px',
      position: 'fixed',
      left: '50%',
      bottom: '30px',
      transform: 'translateX(-50%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      zIndex: 10000,
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <Button 
        onClick={() => setIsMuted(!isMuted)} 
        variant={isMuted ? "danger" : "secondary"} 
        style={{ 
          minWidth: 'auto',
          boxShadow: isMuted ? '0 4px 15px rgba(255, 74, 107, 0.3)' : 'none',
          padding: '10px 18px',
          borderRadius: '20px'
        }}
      >
        <span>🎙️</span> <span className="btn-label">{isMuted ? "Unmute" : "Mute"}</span>
      </Button>
      
      <Button 
        onClick={() => setIsVideoOff(!isVideoOff)} 
        variant={isVideoOff ? "danger" : "secondary"}
        style={{ 
          minWidth: 'auto',
          boxShadow: isVideoOff ? '0 4px 15px rgba(255, 74, 107, 0.3)' : 'none',
          padding: '10px 18px',
          borderRadius: '20px'
        }}
      >
        <span>📹</span> <span className="btn-label">{isVideoOff ? "Video On" : "Video Off"}</span>
      </Button>
      
      {/* Screen Sharing Toggle (Host Only) */}
      {isHost && (
        <Button 
          onClick={onToggleScreenShare} 
          variant={isScreenSharing ? "primary" : "secondary"}
          style={{ 
            minWidth: 'auto',
            boxShadow: isScreenSharing ? '0 8px 20px var(--accent-glow)' : 'none',
            border: isScreenSharing ? '1px solid var(--accent-2)' : '1px solid rgba(255,255,255,0.1)',
            padding: '10px 18px',
            borderRadius: '20px'
          }}
        >
          <span>🖥️</span> <span className="btn-label">{isScreenSharing ? "Stop Share" : "Share Screen"}</span>
        </Button>
      )}

      {/* Recording Toggle (Host Only) */}
      {isHost && (
        <Button 
          onClick={onToggleRecording} 
          variant={isRecording ? "danger" : "secondary"}
          style={{ 
            minWidth: 'auto',
            boxShadow: isRecording ? '0 8px 20px rgba(255, 74, 107, 0.4)' : 'none',
            padding: '10px 18px',
            borderRadius: '20px',
            animation: isRecording ? 'pulse-glow 1.5s infinite' : 'none'
          }}
        >
          <span>🔴</span> <span className="btn-label">{isRecording ? "Stop Rec" : "Record Call"}</span>
        </Button>
      )}

      <Button 
        onClick={onEndCall} 
        variant="danger"
        style={{ 
          minWidth: 'auto',
          padding: '10px 18px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ff4a6b 0%, #dc2626 100%)',
          boxShadow: '0 8px 20px rgba(220, 38, 38, 0.35)'
        }}
      >
        <span>🛑</span> <span className="btn-label">Leave</span>
      </Button>
    </div>
  )
}