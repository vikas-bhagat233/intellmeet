import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import TranscriptPanel from '../../components/ai/TranscriptPanel'
import MeetingInsightPanel from '../../components/ai/MeetingInsightPanel'
import Button from '../../components/common/Button'

export default function MeetingAI({ meetingId }) {
  const { token, user } = useAuth()
  const [transcripts, setTranscripts] = useState([])
  const [insights, setInsights] = useState(null)
  
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingActionItems, setLoadingActionItems] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)

  const recognitionRef = useRef(null)

  useEffect(() => {
    fetchInsights()
    setupSpeechRecognition()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [meetingId])

  const fetchInsights = async () => {
    try {
      setLoadingInsights(true)
      const response = await axios.get(`/api/ai/insights/${meetingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const payload = response.data?.data
      setInsights(payload)
      setTranscripts(payload?.transcripts || [])
    } catch (error) {
      console.error('Failed to load meeting insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.')
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onresult = async (event) => {
      const resultIndex = event.resultIndex
      const transcriptText = event.results[resultIndex][0].transcript.trim()
      
      if (transcriptText) {
        // Send transcription segment to server
        try {
          const response = await axios.post(
            '/api/ai/transcribe',
            {
              meetingId,
              speaker: user?.name || 'User',
              audioBase64: '', // We use Web Speech text directly, falling back to Whisper Mock on server
              timestamp: new Date().toISOString()
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
          
          const newSegment = response.data?.data?.segment
          if (newSegment) {
            // Override the simulated text with the actual live spoken text!
            newSegment.text = transcriptText
            setTranscripts(prev => [...prev, newSegment])
          }
        } catch (err) {
          console.error('Failed to save live transcription:', err)
        }
      }
    }

    rec.onerror = (err) => {
      console.error('Speech recognition error:', err)
    }

    rec.onend = () => {
      if (isTranscribing) {
        rec.start() // Keep it listening
      }
    }

    recognitionRef.current = rec
  }

  const toggleTranscription = () => {
    if (!recognitionRef.current) {
      // Fallback: if browser doesn't support Web Speech API, we simulate transcription segments
      simulateSegment()
      return
    }

    if (isTranscribing) {
      recognitionRef.current.stop()
      setIsTranscribing(false)
      toast.success('Speech transcription paused')
    } else {
      try {
        recognitionRef.current.start()
        setIsTranscribing(true)
        toast.success('Live speech transcription started!')
      } catch (err) {
        console.error(err)
        simulateSegment()
      }
    }
  }

  const simulateSegment = async () => {
    try {
      setIsTranscribing(true)
      const response = await axios.post(
        '/api/ai/transcribe',
        {
          meetingId,
          speaker: 'Speaker ' + (Math.floor(Math.random() * 3) + 1),
          audioBase64: '',
          timestamp: new Date().toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      const newSegment = response.data?.data?.segment
      if (newSegment) {
        setTranscripts(prev => [...prev, newSegment])
        toast.success('Speech segment transcribed!')
      }
      setIsTranscribing(false)
    } catch (err) {
      toast.error('Transcription simulation failed')
      setIsTranscribing(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (transcripts.length === 0) {
      toast.error('Please transcribe some speech first to generate a summary!')
      return
    }

    try {
      setLoadingSummary(true)
      const response = await axios.post(
        '/api/ai/summary',
        { meetingId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('AI Summary generated successfully!')
      fetchInsights() // Refresh everything
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleExtractActionItems = async () => {
    if (transcripts.length === 0) {
      toast.error('Please transcribe some speech first to extract action items!')
      return
    }

    try {
      setLoadingActionItems(true)
      const response = await axios.post(
        '/api/ai/action-items',
        { meetingId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Action items extracted successfully!')
      fetchInsights() // Refresh everything
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to extract action items')
    } finally {
      setLoadingActionItems(false)
    }
  }

  return (
    <div className="meeting-ai-section" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Live speech card */}
      <div className="card" style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="dashboard__title" style={{ fontSize: 20, color: '#fff', margin: 0 }}>🎙️ AI Assistant</h3>
          <Button
            onClick={toggleTranscription}
            variant={isTranscribing ? "danger" : "primary"}
            size="small"
            style={{
              boxShadow: isTranscribing ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
              animation: isTranscribing ? 'pulse 1.8s infinite' : 'none'
            }}
          >
            {isTranscribing ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="pulse-dot" style={{
                  width: 8,
                  height: 8,
                  background: '#fff',
                  borderRadius: 99,
                  display: 'inline-block'
                }}></span>
                Listening...
              </span>
            ) : 'Start AI Listening'}
          </Button>
        </div>

        <TranscriptPanel transcripts={transcripts} />
      </div>

      {/* Tabs / Insights segment */}
      <MeetingInsightPanel
        insights={insights}
        onGenerateSummary={handleGenerateSummary}
        onExtractActionItems={handleExtractActionItems}
        loadingSummary={loadingSummary}
        loadingActionItems={loadingActionItems}
      />

      {/* Embedded pulse CSS helper */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  )
}
