import express from 'express'
import { register, login, getMe, getSecurityQuestion, resetPassword } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password/question', getSecurityQuestion)
router.post('/forgot-password/reset', resetPassword)
router.get('/me', authMiddleware, getMe)

export default router