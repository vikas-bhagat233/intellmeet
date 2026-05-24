import express from 'express'
import { getMeetingTasks, createMeetingTask, updateMeetingTaskStatus } from '../controllers/taskController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/:meetingId', getMeetingTasks)
router.post('/create', createMeetingTask)
router.patch('/:taskId/status', updateMeetingTaskStatus)

export default router
