import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import { dashboardService } from '../../services/dashboardService'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import CreateMeetingForm from '../../components/meeting/CreateMeetingForm'
import JoinMeetingForm from '../../components/meeting/JoinMeetingForm'
import DashboardStats from '../../components/dashboard/DashboardStats'
import MeetingHistoryTable from '../../components/dashboard/MeetingHistoryTable'
import SearchMeeting from '../../components/dashboard/SearchMeeting'

export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState([])
  const [historyList, setHistoryList] = useState([])
  const [stats, setStats] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  useEffect(() => {
    Promise.all([
      fetchMeetings(),
      fetchHistoryAndStats()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings/my-meetings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMeetings(response.data?.data?.meetings || [])
    } catch (error) {
      console.error('Failed to fetch meetings')
      setMeetings([])
    }
  }

  const fetchHistoryAndStats = async () => {
    try {
      const data = await dashboardService.getStats(token)
      if (data) {
        setStats(data)
        setHistoryList(data.recentCompleted || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard history and stats')
    }
  }

  const handleJoinMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}`)
  }

  if (loading) return <Loader />

  const filteredHistory = historyList.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="page" style={{ padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Welcome Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 className="dashboard__title" style={{ 
              fontFamily: 'Space Grotesk', 
              fontWeight: 700, 
              fontSize: 34, 
              color: '#fff',
              margin: 0,
              background: 'linear-gradient(135deg, #fff 50%, var(--muted) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome back, {user?.name}!
            </h1>
            <p className="dashboard__subtitle" style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
              Monitor workspace analytics, launch real-time conferences, and schedule collaborative tasks.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => setShowCreate(!showCreate)} variant="primary" style={{ boxShadow: '0 8px 24px var(--accent-glow)' }}>
              {showCreate ? 'Close Form' : '➕ Create Meeting'}
            </Button>
            <Button onClick={handleLogout} variant="secondary" style={{ 
              background: 'rgba(255, 74, 107, 0.08)', 
              color: '#ff4a6b', 
              borderColor: 'rgba(255, 74, 107, 0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 74, 107, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(255, 74, 107, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 74, 107, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(255, 74, 107, 0.15)'
            }}
            >
              🔒 Logout
            </Button>
          </div>
        </div>

        {/* Dynamic Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Create/Join Meeting block */}
        {showCreate && (
          <div className="card" style={{
            background: 'rgba(10, 15, 30, 0.5)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(99,102,241,0.1)'
          }}>
            <CreateMeetingForm onMeetingCreated={(meeting) => {
              if (meeting && meeting.meetingId) {
                try {
                  navigator.clipboard.writeText(meeting.meetingId)
                    .then(() => toast.success(`Meeting ID copied: ${meeting.meetingId}`))
                    .catch(() => {});
                } catch (err) {
                  // Fallback
                }
                navigate(`/meeting/${meeting.meetingId}`);
              } else {
                fetchMeetings();
                setShowCreate(false);
              }
            }} />
          </div>
        )}

        {/* Dashboard Panels Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
          marginBottom: 30
        }}>
          {/* Workspaces & Kanban Shortcut */}
          <div className="card" style={{ 
            padding: 24,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)'
            e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
          }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ 
                  fontSize: 26, 
                  background: 'rgba(99, 102, 241, 0.12)', 
                  width: 44, 
                  height: 44, 
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>📋</span>
                <h2 style={{ fontSize: 20, color: '#fff', fontWeight: '700', fontFamily: 'Space Grotesk', margin: 0 }}>
                  Team Workspaces
                </h2>
              </div>
              <p style={{ color: 'var(--muted-light)', fontSize: 13, lineHeight: '1.6', marginBottom: 20 }}>
                Collaborate with teammates, schedule sprints, invite team members, and assign task boards in your specialized workspace environment.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--muted)', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>👥 Dynamic Team Members</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>📊 Interactive Kanban Sprints</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>💬 Real-Time Client Feedback</div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/teams')} 
              variant="primary" 
              style={{ marginTop: 28, alignSelf: 'stretch', boxShadow: '0 8px 24px var(--accent-glow)' }}
            >
              🚀 Open Workspaces
            </Button>
          </div>

          {/* Join Form and Upcoming Meetings */}
          <div className="card" style={{ padding: 24 }}>
            <h2 className="form-title" style={{ fontSize: 18, marginBottom: 18, textAlign: 'left', fontFamily: 'Space Grotesk', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚡ Quick Join Session
            </h2>
            <JoinMeetingForm onJoin={handleJoinMeeting} />

            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginTop: 28, marginBottom: 14, fontFamily: 'Space Grotesk', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
              Upcoming Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {meetings.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 13, fontStyle: 'italic', padding: '10px 0' }}>
                  No scheduled meetings.
                </p>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting._id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                  >
                    <div>
                      <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{meeting.title}</h4>
                      <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 3 }}>ID: {meeting.meetingId}</p>
                    </div>
                    <Button onClick={() => handleJoinMeeting(meeting.meetingId)} size="small" style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12 }}>
                      Join Room
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Meetings History Overview */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className="form-title" style={{ fontSize: 18, textAlign: 'left', fontFamily: 'Space Grotesk', margin: 0 }}>
                📅 Completed Sessions
              </h2>
              <button
                onClick={() => navigate('/meeting-history')}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--accent)', 
                  cursor: 'pointer', 
                  fontSize: 12, 
                  fontWeight: 600,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => e.target.style.color = '#8b5cf6'}
                onMouseLeave={e => e.target.style.color = 'var(--accent)'}
              >
                View All History →
              </button>
            </div>
            
            <SearchMeeting query={searchQuery} setQuery={setSearchQuery} />
            <MeetingHistoryTable history={filteredHistory} />
          </div>
        </div>

      </div>
    </div>
  )
}