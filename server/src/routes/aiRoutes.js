import express from 'express'
import multer from 'multer'
import {
  transcribeAudioController,
  generateSummaryController,
  extractActionItemsController,
  getMeetingInsightsController
} from '../controllers/aiController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const upload = multer()
const router = express.Router()

router.use(authMiddleware)

router.post('/transcribe', upload.single('audio'), transcribeAudioController)
router.post('/summary', generateSummaryController)
router.post('/action-items', extractActionItemsController)
router.get('/insights/:meetingId', getMeetingInsightsController)

export default router
