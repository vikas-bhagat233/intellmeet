import { commentService } from '../services/commentService.js'
import { successResponse } from '../utils/response.js'

export const addComment = async (req, res, next) => {
  try {
    const { taskId, comment } = req.body
    const userId = req.userId
    const newComment = await commentService.addComment(taskId, userId, comment)
    return successResponse(res, { comment: newComment }, 'Comment added successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getComments = async (req, res, next) => {
  try {
    const { taskId } = req.query
    const comments = await commentService.getCommentsByTask(taskId)
    return successResponse(res, { comments }, 'Comments retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params
    await commentService.deleteComment(id)
    return successResponse(res, null, 'Comment deleted successfully', 200)
  } catch (error) {
    next(error)
  }
}
