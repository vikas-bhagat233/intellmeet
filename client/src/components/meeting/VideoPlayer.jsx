import { useEffect, useRef, useState, useCallback } from 'react'

export default function VideoPlayer({ 
  stream, 
  muted = false, 
  username = 'You', 
  isScreenShare = false, 
  isLocal = false,
  isMuted = false,
  isVideoOff = false 
}) {
  const videoRef = useRef()
  const containerRef = useRef()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const hideTimer = useRef(null)

  // Assign srcObject whenever stream changes OR when it gains/loses tracks
  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    // (Re)assign srcObject when stream OR screen-share status changes
    // This forces the browser to re-read the stream's active tracks,
    // picking up the new screen-share track sent via replaceTrack
    video.srcObject = null
    video.srcObject = stream

    const onTrackChange = () => {
      video.srcObject = null
      video.srcObject = stream
    }

    stream.addEventListener('addtrack', onTrackChange)
    stream.addEventListener('removetrack', onTrackChange)

    return () => {
      stream.removeEventListener('addtrack', onTrackChange)
      stream.removeEventListener('removetrack', onTrackChange)
    }
  }, [stream, isScreenShare])  // ← isScreenShare triggers refresh when host starts sharing


  // Listen for native fullscreen exit (Esc key / browser button)
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const enterFullscreen = useCallback(async () => {
    try {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch (e) {
      console.warn('Fullscreen not supported:', e)
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      setIsFullscreen(false)
    } catch (e) {
      console.warn('Exit fullscreen error:', e)
    }
  }, [])

  const toggleFullscreen = () => {
    if (isFullscreen) exitFullscreen()
    else enterFullscreen()
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 2500)
  }

  if (!stream) return null

  const hasScreenTrack = stream.getVideoTracks().some(track =>
    track.label.toLowerCase().includes('screen') ||
    track.label.toLowerCase().includes('monitor') ||
    track.label.toLowerCase().includes('window') ||
    track.label.toLowerCase().includes('display')
  )
  const isScreen = isScreenShare || hasScreenTrack
  const showCameraDisabled = isVideoOff && !isScreen

  return (
    <div
      ref={containerRef}
      className={`video-card ${isScreen ? 'screen-share' : ''} ${isLocal ? 'video-local' : ''} ${isFullscreen ? 'video-fullscreen' : ''}`}
      style={isFullscreen ? {
        position: 'fixed', inset: 0, zIndex: 9999,
        width: '100vw', height: '100vh',
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 0,
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video stream rendering: always mounted so it never loses track assignment */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={isFullscreen ? { 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          display: showCameraDisabled ? 'none' : 'block'
        } : {
          display: showCameraDisabled ? 'none' : 'block'
        }}
      />

      {/* Show beautiful placeholder overlay if camera disabled and not screen sharing */}
      {showCameraDisabled && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#0b0f19',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          zIndex: 2,
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 12
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 8px 24px var(--accent-glow)',
            animation: 'pulse-glow 2s infinite'
          }}>
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Camera Disabled
          </span>
        </div>
      )}

      {/* Username tag */}
      <div className="video-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {username} {isScreen ? '🖥️' : ''}
        {isMuted && (
          <span 
            style={{ 
              color: '#ef4444', 
              background: 'rgba(239, 68, 68, 0.12)', 
              padding: '1px 5px', 
              borderRadius: '4px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '10px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2
            }} 
            title="Microphone Muted"
          >
            🔇 MUTED
          </span>
        )}
      </div>

      {/* Quick expand button always visible on screen-share tiles */}
      {isScreen && !isFullscreen && (
        <button
          onClick={toggleFullscreen}
          title="Click to expand"
          style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '6px', color: '#fff',
            fontSize: '18px', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 5, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
        >
          ⛶
        </button>
      )}

      {/* Hover controls overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', padding: '12px 16px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        opacity: showControls || isFullscreen ? 1 : 0,
        transition: 'opacity 0.25s ease',
        pointerEvents: showControls || isFullscreen ? 'auto' : 'none',
        zIndex: 10000,
      }}>
        <button
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          onClick={toggleFullscreen}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px', color: '#fff',
            padding: '6px 14px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px',
            backdropFilter: 'blur(6px)', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          {isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
        </button>

        {!isFullscreen && document.pictureInPictureEnabled && (
          <button
            title="Pop Out"
            onClick={async () => {
              try {
                if (document.pictureInPictureElement) await document.exitPictureInPicture()
                else await videoRef.current?.requestPictureInPicture()
              } catch (e) { console.warn('PiP error:', e) }
            }}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px', color: '#fff',
              padding: '6px 14px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
              backdropFilter: 'blur(6px)', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            ⧉ Pop Out
          </button>
        )}
      </div>
    </div>
  )
}