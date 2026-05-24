import express from 'express'
import { createTeam, getTeams, updateTeam, deleteTeam, inviteMember, removeMember } from '../controllers/teamController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', createTeam)
router.get('/', getTeams)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)
router.post('/:id/invite', inviteMember)
router.post('/:id/remove', removeMember)

export default router
