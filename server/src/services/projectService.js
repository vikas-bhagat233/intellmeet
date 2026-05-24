import Project from '../models/Project.js'
import mongoose from 'mongoose'

export const projectService = {
  createProject: async (projectName, description, teamId, ownerId) => {
    const project = await Project.create({
      projectName,
      description,
      teamId,
      members: [ownerId]
    })
    return project
  },

  getProjectsByTeam: async (teamId) => {
    const projects = await Project.find({ teamId })
    const Team = mongoose.model('Team')
    
    // Sync all projects with parent team members list
    const team = await Team.findById(teamId).populate('members', 'name email avatarUrl')
    
    if (team) {
      projects.forEach(proj => {
        proj.members = team.members
      })
    }
    return projects
  },

  getProjectById: async (projectId) => {
    const project = await Project.findById(projectId)
    if (!project) return null
    
    const team = await mongoose.model('Team').findById(project.teamId).populate('members', 'name email avatarUrl')
    if (team) {
      project.members = team.members
    } else {
      await project.populate('members', 'name email avatarUrl')
    }
    return project
  },

  updateProject: async (projectId, projectData) => {
    const project = await Project.findByIdAndUpdate(projectId, projectData, { new: true })
    if (!project) return null
    
    const team = await mongoose.model('Team').findById(project.teamId).populate('members', 'name email avatarUrl')
    if (team) {
      project.members = team.members
    } else {
      await project.populate('members', 'name email avatarUrl')
    }
    return project
  },

  deleteProject: async (projectId) => {
    return Project.findByIdAndDelete(projectId)
  },

  addProjectMember: async (projectId, memberId) => {
    return Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate('members', 'name email avatarUrl')
  },

  removeProjectMember: async (projectId, memberId) => {
    return Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: memberId } },
      { new: true }
    ).populate('members', 'name email avatarUrl')
  }
}
