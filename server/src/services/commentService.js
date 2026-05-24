import Comment from '../models/Comment.js'

export const commentService = {
  addComment: async (taskId, userId, commentText) => {
    const comment = await Comment.create({
      taskId,
      userId,
      comment: commentText
    })
    return await comment.populate('userId', 'name email avatarUrl')
  },

  getCommentsByTask: async (taskId) => {
    return Comment.find({ taskId }).populate('userId', 'name email avatarUrl').sort('createdAt')
  },

  deleteComment: async (commentId) => {
    return Comment.findByIdAndDelete(commentId)
  }
}
