import React, { useState } from 'react';

export default function ParticipantList({ participants, isHost, onRequestUnmute }) {
  const [showRoster, setShowRoster] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter participants by name search query
  const filteredParticipants = participants.filter(p =>
    (p.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card participants" style={{ padding: '16px 20px', position: 'relative' }}>
      {/* Header and Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <h3 style={{ 
          fontFamily: 'Space Grotesk, sans-serif', 
          fontWeight: 700, 
          fontSize: '16px', 
          color: '#fff',
          margin: 0 
        }}>
          👥 Attendees ({participants.length}/100)
        </h3>
        
        <button
          onClick={() => {
            setShowRoster(!showRoster);
            setSearchQuery(''); // reset search on toggle
          }}
          style={{
            background: showRoster ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: showRoster ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
            color: showRoster ? 'var(--accent)' : '#fff',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={e => {
            if (!showRoster) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }
          }}
          onMouseLeave={e => {
            if (!showRoster) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }
          }}
        >
          {showRoster ? 'Close List ▴' : 'View Roster ▾'}
        </button>
      </div>

      {/* Expandable Roster List */}
      {showRoster && (
        <div style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Dynamic Search Box for 100 Capacity */}
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="🔍 Search by attendee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(10, 15, 30, 0.4)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
            />
          </div>

          {/* Scrollable list window */}
          <div style={{
            maxHeight: '260px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingRight: 4
          }} className="scrollable-content">
            {filteredParticipants.map((p, idx) => {
              const isLocalUser = p.username === 'You';
              return (
                <div 
                  key={idx} 
                  className="participants__item" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className={`status-dot ${p.online ? 'status-dot--online' : ''}`} style={{ width: 8, height: 8 }}></div>
                    <span style={{ 
                      color: '#fff', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      {p.username}
                      {p.isHost && (
                        <span style={{ 
                          fontSize: '9px', 
                          color: 'var(--accent-2)', 
                          background: 'rgba(20, 184, 166, 0.12)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: '700',
                          border: '1px solid rgba(20, 184, 166, 0.2)'
                        }}>HOST</span>
                      )}
                      {p.isMuted && (
                        <span style={{ color: '#ef4444', fontSize: '11px', cursor: 'help' }} title="Microphone Muted">🔇</span>
                      )}
                      {p.isVideoOff && (
                        <span style={{ color: '#f59e0b', fontSize: '11px', cursor: 'help' }} title="Camera Off">🚫📹</span>
                      )}
                    </span>
                  </div>

                  {/* Ask to Unmute button - only shown to Host and next to OTHER members */}
                  {isHost && !isLocalUser && !p.isHost && (
                    <button
                      onClick={() => onRequestUnmute(p)}
                      style={{
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        color: 'var(--accent)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.18)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
                      }}
                    >
                      🎙️ Request Unmute
                    </button>
                  )}
                </div>
              );
            })}

            {filteredParticipants.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '12px', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                No active users match search query.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}