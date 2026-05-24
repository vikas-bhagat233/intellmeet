import express from 'express'
import { createMeeting, getMyMeetings, getMeetingById } from '../controllers/meetingController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.post('/create', createMeeting)
router.get('/my-meetings', getMyMeetings)
router.get('/:meetingId', getMeetingById)

export default router