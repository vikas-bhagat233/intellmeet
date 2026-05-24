import express from 'express'
import { exportPdfController, exportExcelController } from '../controllers/reportController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/pdf/:meetingId', exportPdfController)
router.get('/excel/:meetingId', exportExcelController)

export default router
