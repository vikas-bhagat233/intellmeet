import MeetingHistory from '../models/MeetingHistory.js'
import Meeting from '../models/Meeting.js'

export const dashboardService = {
  getStats: async (userId, userName) => {
    // Fetch all completed meetings where user was host or participant
    const completed = await MeetingHistory.find({
      $or: [{ hostId: userId }, { participants: { $in: [userName] } }]
    }).sort('-startTime')

    // Fetch all active/upcoming scheduled meetings
    const upcoming = await Meeting.find({
      $or: [{ host: userId }, { participants: { $in: [userId] } }],
      status: 'scheduled'
    }).sort('-createdAt')

    const totalMeetings = completed.length
    const totalDuration = completed.reduce((acc, curr) => acc + (curr.duration || 0), 0)
    const totalHours = parseFloat((totalDuration / 60).toFixed(1))

    return {
      totalMeetings,
      totalHours,
      completedCount: totalMeetings,
      upcomingCount: upcoming.length,
      recentCompleted: completed.slice(0, 5),
      upcomingList: upcoming.slice(0, 5)
    }
  }
}
