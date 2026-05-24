import express from 'express'
import { createProject, getProjects, updateProject, deleteProject, addProjectMember, removeProjectMember } from '../controllers/projectController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', createProject)
router.get('/', getProjects)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)
router.post('/:id/add-member', addProjectMember)
router.post('/:id/remove-member', removeProjectMember)

export default router
