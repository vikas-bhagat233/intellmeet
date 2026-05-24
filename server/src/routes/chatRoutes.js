import express from 'express'
import { getChatHistory } from '../controllers/chatController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/:meetingId', getChatHistory)

export default router
