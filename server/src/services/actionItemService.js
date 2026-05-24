import ActionItem from '../models/ActionItem.js'

export const actionItemService = {
  saveActionItems: async (meetingId, actionItemsList) => {
    // First clear existing action items for the meeting to prevent duplicates on regeneration
    await ActionItem.deleteMany({ meetingId })
    
    const formattedItems = actionItemsList.map(item => ({
      meetingId,
      task: item.task,
      assignedTo: item.assignedTo || '',
      deadline: item.deadline ? new Date(item.deadline) : null,
      status: 'pending'
    }))

    const items = await ActionItem.insertMany(formattedItems)
    return items
  },

  getActionItemsByMeetingId: async (meetingId) => {
    return ActionItem.find({ meetingId })
  }
}
