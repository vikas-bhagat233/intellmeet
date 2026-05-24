import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/response.js'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) return errorResponse(res, 'No token provided', 401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401)
  }
}