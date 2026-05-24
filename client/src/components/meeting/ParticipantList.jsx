export default function ParticipantList({ participants }) {
  return (
    <div className="card participants">
      <h3 className="form-title" style={{ textAlign: 'left', marginBottom: 8 }}>Participants ({participants.length})</h3>
      <div className="participants">
        {participants.map((p, idx) => (
          <div key={idx} className="participants__item">
            <div className={`status-dot ${p.online ? 'status-dot--online' : ''}`}></div>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {p.username}
              {p.isHost && (
                <span className="host-badge" style={{ 
                  fontSize: '10px', 
                  color: '#10b981', 
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginLeft: '8px', 
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>HOST</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}