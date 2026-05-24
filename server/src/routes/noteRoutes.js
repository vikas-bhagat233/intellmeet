import express from 'express'
import { getSharedNote, updateSharedNote } from '../controllers/noteController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/:meetingId', getSharedNote)
router.post('/update', updateSharedNote)

export default router
