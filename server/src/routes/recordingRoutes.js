import express from 'express'
import multer from 'multer'
import { getRecording, deleteRecordingController, saveRecordingController, uploadRecordingController } from '../controllers/recordingController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const upload = multer()
const router = express.Router()

router.use(authMiddleware)
router.get('/:meetingId', getRecording)
router.delete('/:meetingId', deleteRecordingController)
router.post('/save', saveRecordingController)
router.post('/upload', upload.single('recording'), uploadRecordingController)

export default router
