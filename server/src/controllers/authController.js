import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return errorResponse(res, 'User already exists', 400)

    const user = await User.create({ 
      name, 
      email, 
      password,
      securityQuestion: securityQuestion || "What is your mother's name?",
      securityAnswer: securityAnswer || "mother"
    })
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

export const getSecurityQuestion = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return errorResponse(res, 'Email is required', 400)
    
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return errorResponse(res, 'User not found with this email', 404)

    successResponse(res, {
      question: user.securityQuestion || "What is your mother's name?"
    }, 'Security question retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { email, securityAnswer, newPassword } = req.body
    if (!email || !securityAnswer || !newPassword) {
      return errorResponse(res, 'Email, answer, and new password are required', 400)
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return errorResponse(res, 'User not found with this email', 404)

    const userAnswer = (securityAnswer || '').trim().toLowerCase()
    const dbAnswer = (user.securityAnswer || 'mother').trim().toLowerCase()

    if (userAnswer !== dbAnswer) {
      return errorResponse(res, 'Incorrect security answer', 400)
    }

    user.password = newPassword
    await user.save()

    successResponse(res, null, 'Password reset successfully!')
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