import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'
import RecordingPlayer from '../../components/recordings/RecordingPlayer'
import RecordingList from '../../components/recordings/RecordingList'
import RecordingDownload from '../../components/recordings/RecordingDownload'
import SummaryCard from '../../components/summaries/SummaryCard'
import SummaryDownload from '../../components/summaries/SummaryDownload'
import TranscriptViewer from '../../components/transcripts/TranscriptViewer'
import TranscriptSearch from '../../components/transcripts/TranscriptSearch'
import TranscriptDownload from '../../components/transcripts/TranscriptDownload'
import ActionItemList from '../../components/actionItems/ActionItemList'

export default function MeetingDetails() {
  const { meetingId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [history, setHistory] = useState(null)
  const [recording, setRecording] = useState(null)
  const [insights, setInsights] = useState(null)
  const [transcriptFilter, setTranscriptFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      // Load Completed Meeting Details
      axios.get(`/api/history/${meetingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => setHistory(r.data?.data?.details || null)),

      // Load Recording Details
      axios.get(`/api/recordings/${meetingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => setRecording(r.data?.data?.recording || null)),

      // Load AI Insights (Summary, Tasks, Transcript)
      axios.get(`/api/ai/insights/${meetingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => setInsights(r.data?.data || null))
    ])
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [meetingId, token])

  if (loading) return <Loader />

  // Filter transcript list
  const filteredTranscripts = (insights?.transcripts || []).filter(t =>
    t.text.toLowerCase().includes(transcriptFilter.toLowerCase()) ||
    t.speaker.toLowerCase().includes(transcriptFilter.toLowerCase())
  )

  const dateStr = history ? new Date(history.startTime).toLocaleDateString() : new Date().toLocaleDateString()

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        
        {/* Header Breadcrumbs */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}
          >
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
                📊 Meeting Insights: {history?.title || 'Session Analytics'}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
                Held on {dateStr} • Duration: {history?.duration || 0} mins • Host: {history?.hostName || 'Host'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SummaryDownload meetingId={meetingId} />
              <TranscriptDownload meetingId={meetingId} />
            </div>
          </div>
        </div>

        {/* Analytics Workspace Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
          alignItems: 'start'
        }}>
          
          {/* Column 1: Video recording & details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎥 Session Recording
              </h3>
              {recording ? (
                <>
                  <RecordingPlayer recordingUrl={recording.recordingUrl} />
                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <RecordingList size={recording.size} duration={recording.duration} />
                    <RecordingDownload url={recording.recordingUrl} />
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 12
                }}>
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>🚫</span>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: 14, display: 'block' }}>No Video Recording Available</span>
                  <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4, marginBottom: 16 }}>
                    This meeting session was not recorded.
                  </p>
                  <button
                    disabled
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'var(--muted)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'not-allowed',
                      width: '100%'
                    }}
                  >
                    🔒 Watch Session Recording (Disabled)
                  </button>
                </div>
              )}
            </div>

            {/* AI Summary Card */}
            <SummaryCard summaryText={insights?.summary?.summary} />
          </div>

          {/* Column 2: Transcript Search and Action Tracker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Transcript Viewer Card */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk', marginBottom: 12 }}>
                🎙️ Discussion Transcript
              </h3>
              <TranscriptSearch query={transcriptFilter} setQuery={setTranscriptFilter} />
              <TranscriptViewer transcripts={filteredTranscripts} />
            </div>

            {/* Action Item Tracker Card */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk', marginBottom: 12 }}>
                ✅ AI Extracted Action Registry
              </h3>
              <ActionItemList tasks={insights?.actionItems || []} />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
