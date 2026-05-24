import Meeting from '../models/Meeting.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { generateMeetingId } from '../utils/helpers.js'

export const createMeeting = async (req, res, next) => {
  try {
    const { title, description } = req.body
    const meeting = await Meeting.create({
      meetingId: generateMeetingId(),
      title,
      description,
      host: req.userId,
      participants: [req.userId]
    })
    successResponse(res, { meeting }, 'Meeting created successfully', 201)
  } catch (error) {
    next(error)
  }
}

import MeetingHistory from '../models/MeetingHistory.js'

export const getMyMeetings = async (req, res, next) => {
  try {
    // Dynamic self-healing: find active/scheduled meetings that already have completed history records and mark them ended
    const activeMeetings = await Meeting.find({ 
      participants: req.userId,
      status: { $ne: 'ended' }
    })
    const activeIds = activeMeetings.map(m => m.meetingId)
    
    if (activeIds.length > 0) {
      const completedHistories = await MeetingHistory.find({ meetingId: { $in: activeIds } })
      const completedIds = completedHistories.map(h => h.meetingId)
      if (completedIds.length > 0) {
        await Meeting.updateMany(
          { meetingId: { $in: completedIds } },
          { status: 'ended', endTime: new Date() }
        )
      }
    }

    const meetings = await Meeting.find({ 
      participants: req.userId,
      status: { $ne: 'ended' }
    }).populate('host', 'name email').sort('-createdAt')
    successResponse(res, { meetings })
  } catch (error) {
    next(error)
  }
}

export const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.meetingId }).populate('host participants', 'name email')
    if (!meeting) return errorResponse(res, 'Meeting not found', 404)
    successResponse(res, { meeting })
  } catch (error) {
    next(error)
  }
}