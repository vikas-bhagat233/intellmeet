import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return errorResponse(res, 'User already exists', 400)

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    successResponse(res, { user: { id: user._id, name: user.name, email: user.email }, token }, 'User registered successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return errorResponse(res, 'Invalid credentials', 401)

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return errorResponse(res, 'Invalid credentials', 401)

    const token = generateToken(user._id)
    successResponse(res, { user: { id: user._id, name: user.name, email: user.email }, token }, 'Login successful')
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) return errorResponse(res, 'User not found', 404)
    successResponse(res, user)
  } catch (error) {
    next(error)
  }
}