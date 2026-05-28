import React from 'react'

export default function DashboardStats({ stats }) {
  const cards = [
    { 
      title: 'TOTAL MEETINGS', 
      value: stats?.totalMeetings || 0, 
      icon: '📅', 
      gradient: 'var(--accent-gradient)',
      glow: 'var(--accent-glow)' 
    },
    { 
      title: 'MEETING HOURS', 
      value: stats?.totalHours || 0, 
      icon: '⏳', 
      gradient: 'var(--accent-2-gradient)',
      glow: 'var(--accent-2-glow)' 
    },
    { 
      title: 'COMPLETED SESSIONS', 
      value: stats?.completedCount || 0, 
      icon: '✅', 
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      glow: 'rgba(139, 92, 246, 0.3)' 
    },
    { 
      title: 'SCHEDULED UPCOMING', 
      value: stats?.upcomingCount || 0, 
      icon: '🚀', 
      gradient: 'var(--warning-gradient)',
      glow: 'rgba(245, 158, 11, 0.25)' 
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 20,
      marginBottom: 32
    }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'default',
          boxShadow: 'var(--shadow-soft)'
        }}
        className="stat-card"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.4), 0 0 18px ${card.glow}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'var(--glass-border)'
          e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
        }}
        >
          <div>
            <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>{card.title}</span>
            <h3 style={{ color: '#fff', fontSize: 32, fontWeight: 700, marginTop: 6, fontFamily: 'Space Grotesk' }}>
              {card.value}
            </h3>
          </div>
          <div style={{
            background: card.gradient,
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: `0 8px 20px ${card.glow}`
          }}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  )
}

