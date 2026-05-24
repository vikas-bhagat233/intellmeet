import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { meetingService } from '../services/meetingService'

export const useMeeting = () => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const fetchMeetings = async () => {
    try {
      const data = await meetingService.getMyMeetings(token)
      setMeetings(data.meetings)
    } catch (error) {
      console.error('Failed to fetch meetings', error)
    } finally {
      setLoading(false)
    }
  }

  const createMeeting = async (meetingData) => {
    const data = await meetingService.createMeeting(meetingData, token)
    await fetchMeetings()
    return data
  }

  useEffect(() => {
    if (token) fetchMeetings()
  }, [token])

  return { meetings, loading, createMeeting, fetchMeetings }
}