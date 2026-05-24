import { dashboardService } from '../services/dashboardService.js'
import { successResponse } from '../utils/response.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats(req.userId)
    return successResponse(res, { stats }, 'Dashboard statistics retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}
