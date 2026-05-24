import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'
import MeetingHistoryTable from '../../components/dashboard/MeetingHistoryTable'
import SearchMeeting from '../../components/dashboard/SearchMeeting'

export default function MeetingHistory() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [historyList, setHistoryList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setHistoryList(response.data?.data?.history || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <Loader />

  const filteredHistory = historyList.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
              📅 Meeting History Archives
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
              Explore transcripts, play meeting recordings, and audit action items.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <SearchMeeting query={searchQuery} setQuery={setSearchQuery} />
          <MeetingHistoryTable history={filteredHistory} />
        </div>

      </div>
    </div>
  )
}
