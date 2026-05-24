import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(req.userId, { name, email }, { new: true }).select('-password')
    if (!user) return errorResponse(res, 'User not found', 404)
    successResponse(res, user, 'Profile updated successfully')
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    successResponse(res, users)
  } catch (error) {
    next(error)
  }
}