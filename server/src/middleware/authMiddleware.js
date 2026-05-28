import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { errorResponse } from '../utils/response.js'

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) return errorResponse(res, 'No token provided', 401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    
    const user = await User.findById(decoded.userId).select('-password')
    if (user) {
      req.user = user
    }
    
    next()
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401)
  }
}