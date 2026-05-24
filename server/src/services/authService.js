import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    return user
  } catch (error) {
    return null
  }
}