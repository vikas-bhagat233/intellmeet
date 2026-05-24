import express from 'express'
import multer from 'multer'
import { getSharedFiles, uploadSharedFile } from '../controllers/fileController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const upload = multer()
const router = express.Router()

router.use(authMiddleware)
router.get('/:meetingId', getSharedFiles)
router.post('/upload', upload.single('file'), uploadSharedFile)

export default router
