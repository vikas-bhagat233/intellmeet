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
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 className="dashboard__title" style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32, color: '#fff' }}>
              Welcome back, {user?.name}!
            </h1>
            <p className="dashboard__subtitle" style={{ color: '#94a3b8', fontSize: 14 }}>
              Monitor analytics, play recordings, and schedule upcoming sessions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => setShowCreate(!showCreate)} variant="primary">
              {showCreate ? 'Close Form' : '➕ Create Meeting'}
            </Button>
            <Button onClick={handleLogout} variant="secondary" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              🔒 Logout
            </Button>
          </div>
        </div>

        {/* Dynamic Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Create/Join Meeting block */}
        {showCreate && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 20,
            marginBottom: 24
          }}>
            <CreateMeetingForm onMeetingCreated={(meeting) => {
              if (meeting && meeting.meetingId) {
                // Safe clipboard write
                try {
                  navigator.clipboard.writeText(meeting.meetingId)
                    .then(() => toast.success(`Meeting ID copied: ${meeting.meetingId}`))
                    .catch(() => {});
                } catch (err) {
                  // Fallback if clipboard API is blocked in sandbox environments
                }
                // Instantly start/join meeting
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          marginBottom: 30
        }}>
          {/* Workspaces & Kanban Shortcut */}
          <div className="card" style={{ 
            padding: 20,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 28 }}>📋</span>
                <h2 style={{ fontSize: 18, color: '#fff', fontWeight: '700', fontFamily: 'Space Grotesk', margin: 0 }}>
                  Team Workspaces & Kanban Boards
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: '1.6', marginBottom: 16 }}>
                Collaborate with your teammates, manage sprints, and assign real-time tasks on your project's Kanban board.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#94a3b8', fontSize: 12 }}>
                <div>👥 Dynamic Team Workspaces</div>
                <div>📊 Live Kanban Task Boards</div>
                <div>💬 Interactive Comment Feeds</div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/teams')} 
              variant="primary" 
              style={{ marginTop: 24, alignSelf: 'stretch' }}
            >
              🚀 Open Workspaces
            </Button>
          </div>

          {/* Join Form and Upcoming Meetings */}
          <div className="card" style={{ padding: 20 }}>
            <h2 className="form-title" style={{ fontSize: 16, marginBottom: 14, textAlign: 'left', fontFamily: 'Space Grotesk' }}>
              🚀 Quick Join Session
            </h2>
            <JoinMeetingForm onJoin={handleJoinMeeting} />

            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginTop: 24, marginBottom: 12, fontFamily: 'Space Grotesk' }}>
              Scheduled Meetings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {meetings.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
                  No scheduled meetings.
                </p>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting._id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{meeting.title}</h4>
                      <p style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>ID: {meeting.meetingId}</p>
                    </div>
                    <Button onClick={() => handleJoinMeeting(meeting.meetingId)} size="small">
                      Join Room
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Meetings History Overview */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 className="form-title" style={{ fontSize: 16, textAlign: 'left', fontFamily: 'Space Grotesk' }}>
                📅 Recent Completed Sessions
              </h2>
              <button
                onClick={() => navigate('/meeting-history')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
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