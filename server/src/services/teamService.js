import Team from '../models/Team.js'

export const teamService = {
  createTeam: async (teamName, description, ownerId) => {
    const team = await Team.create({
      teamName,
      description,
      owner: ownerId,
      members: [ownerId]
    })
    return team
  },

  getTeams: async (userId) => {
    return Team.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).populate('owner members', 'name email avatarUrl')
  },

  getTeamById: async (teamId) => {
    return Team.findById(teamId).populate('owner members', 'name email avatarUrl')
  },

  updateTeam: async (teamId, teamData) => {
    return Team.findByIdAndUpdate(teamId, teamData, { new: true }).populate('owner members', 'name email avatarUrl')
  },

  deleteTeam: async (teamId) => {
    return Team.findByIdAndDelete(teamId)
  },

  inviteMember: async (teamId, memberId) => {
    return Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate('owner members', 'name email avatarUrl')
  },

  removeMember: async (teamId, memberId) => {
    return Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: memberId } },
      { new: true }
    ).populate('owner members', 'name email avatarUrl')
  }
}
