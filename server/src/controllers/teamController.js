import { teamService } from '../services/teamService.js'
import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { getIO } from '../config/socket.js'

export const createTeam = async (req, res, next) => {
  try {
    const { teamName, description } = req.body
    const ownerId = req.userId
    const team = await teamService.createTeam(teamName, description, ownerId)
    return successResponse(res, { team }, 'Team created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getTeams = async (req, res, next) => {
  try {
    const userId = req.userId
    const teams = await teamService.getTeams(userId)
    return successResponse(res, { teams }, 'Teams retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const team = await teamService.updateTeam(id, req.body)
    return successResponse(res, { team }, 'Team updated successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    await teamService.deleteTeam(id)
    return successResponse(res, null, 'Team deleted successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const inviteMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const { email } = req.body

    let user = await User.findOne({ email })
    if (!user) {
      // Auto-create invited teammate so they can be immediately assigned tasks!
      const name = email.split('@')[0]
      user = await User.create({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        password: 'temporaryGuestPassword123!', // Safe guest password placeholder
        avatarUrl: '/default-avatar.png'
      })
    }

    const team = await teamService.inviteMember(id, user._id)

    // Notify via Socket.io
    try {
      const io = getIO()
      io.to(id).emit('member-added', { teamId: id, user })
    } catch (e) {
      console.warn('Socket notification failed:', e.message)
    }

    return successResponse(res, { team }, 'Member invited successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const removeMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const team = await teamService.removeMember(id, userId)
    return successResponse(res, { team }, 'Member removed successfully', 200)
  } catch (error) {
    next(error)
  }
}
