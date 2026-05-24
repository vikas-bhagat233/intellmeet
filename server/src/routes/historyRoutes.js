import express from 'express'
import { getMeetingHistoryList, getMeetingHistoryDetails, saveMeetingToHistory } from '../controllers/historyController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/', getMeetingHistoryList)
router.get('/:meetingId', getMeetingHistoryDetails)
router.post('/save', saveMeetingToHistory)

export default router
