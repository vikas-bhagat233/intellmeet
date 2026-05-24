import express from 'express'
import { updateProfile, getAllUsers } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.put('/profile', updateProfile)
router.get('/', getAllUsers)

export default router