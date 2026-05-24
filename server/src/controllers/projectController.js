import { projectService } from '../services/projectService.js'
import { successResponse } from '../utils/response.js'
import { getIO } from '../config/socket.js'

export const createProject = async (req, res, next) => {
  try {
    const { projectName, description, teamId } = req.body
    const ownerId = req.userId
    const project = await projectService.createProject(projectName, description, teamId, ownerId)
    return successResponse(res, { project }, 'Project created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getProjects = async (req, res, next) => {
  try {
    const { teamId } = req.query
    const projects = await projectService.getProjectsByTeam(teamId)
    return successResponse(res, { projects }, 'Projects retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await projectService.updateProject(id, req.body)

    // Notify via Socket.io
    try {
      const io = getIO()
      io.to(project.teamId.toString()).emit('project-updated', { project })
    } catch (e) {
      console.warn('Socket notification failed:', e.message)
    }

    return successResponse(res, { project }, 'Project updated successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params
    await projectService.deleteProject(id)
    return successResponse(res, null, 'Project deleted successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const project = await projectService.addProjectMember(id, userId)
    return successResponse(res, { project }, 'Project member added successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const removeProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const project = await projectService.removeProjectMember(id, userId)
    return successResponse(res, { project }, 'Project member removed successfully', 200)
  } catch (error) {
    next(error)
  }
}
