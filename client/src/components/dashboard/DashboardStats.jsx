import React from 'react'

export default function DashboardStats({ stats }) {
  const cards = [
    { title: 'Total Meetings', value: stats?.totalMeetings || 0, icon: '📅', color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
    { title: 'Meeting Hours', value: stats?.totalHours || 0, icon: '⏳', color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
    { title: 'Completed Sessions', value: stats?.completedCount || 0, icon: '✅', color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
    { title: 'Scheduled Upcoming', value: stats?.upcomingCount || 0, icon: '🚀', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 20
    }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease',
          cursor: 'default'
        }}
        className="stat-card"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div>
            <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{card.title}</span>
            <h3 style={{ color: '#fff', fontSize: 26, fontWeight: 700, marginTop: 4, fontFamily: 'Space Grotesk' }}>
              {card.value}
            </h3>
          </div>
          <div style={{
            background: card.color,
            width: 44,
            height: 44,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  )
}
