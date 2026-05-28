import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamService } from '../../services/teamService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import TeamMembers from '../../components/teams/TeamMembers';
import TeamSettings from '../../components/teams/TeamSettings';
import InviteMemberModal from '../../components/teams/InviteMemberModal';
import ProjectCard from '../../components/projects/ProjectCard';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function TeamWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { socket } = useSocket();

  const [team, setTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    fetchTeamAndProjects();

    // Listen to real-time socket updates for team membership
    if (socket) {
      socket.emit('join-meeting', { meetingId: id }); // Join room for the team id
      socket.on('member-added', ({ teamId, user }) => {
        if (teamId === id) {
          setTeam(prev => prev ? { ...prev, members: [...prev.members, user] } : null);
          toast.success(`${user.name} joined the team!`);
        }
      });
      socket.on('project-updated', ({ project }) => {
        setProjects(prev => prev.map(p => p._id === project._id ? project : p));
      });
    }

    return () => {
      if (socket) {
        socket.off('member-added');
        socket.off('project-updated');
      }
    };
  }, [id, socket]);

  const fetchTeamAndProjects = async () => {
    try {
      const teamData = await teamService.updateTeam(id, {}, token); // Fetch latest team details
      setTeam(teamData);
      const projectList = await projectService.getProjects(id, token);
      setProjects(projectList);
    } catch (e) {
      toast.error('Failed to load team workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (teamId, email) => {
    try {
      await teamService.inviteMember(teamId, email, token);
      toast.success('Invitation sent!');
      setShowInvite(false);
      fetchTeamAndProjects();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to invite member');
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProj = await projectService.createProject(projectData.projectName, projectData.description, id, token);
      if (newProj) {
        setProjects([...projects, newProj]);
        setShowCreateProject(false);
        toast.success('Project created successfully!');
      }
    } catch (e) {
      toast.error('Failed to create project');
    }
  };

  const handleSaveSettings = async (teamData) => {
    try {
      const updated = await teamService.updateTeam(id, teamData, token);
      if (updated) {
        setTeam(updated);
        toast.success('Team settings updated!');
      }
    } catch (e) {
      toast.error('Failed to update team settings');
    }
  };

  if (loading) return <Loader />;
  if (!team) return <p style={{ color: '#fff' }}>Team not found.</p>;

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Workspace Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '28px', color: '#fff', margin: 0 }}>
              🏢 Workspace: {team.teamName}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
              {team.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button size="small" variant="secondary" onClick={() => setShowInvite(true)}>
              ➕ Invite Member
            </Button>
            <Button size="small" variant="primary" onClick={() => setShowCreateProject(true)}>
              📁 Create Project
            </Button>
          </div>
        </div>

        {/* Tab selectors */}
        <div className="tab-wrapper" style={{ 
          display: 'flex', 
          gap: '24px', 
          borderBottom: '1px solid rgba(255,255,255,0.08)', 
          paddingBottom: '4px', 
          marginBottom: '32px' 
        }}>
          {['projects', 'members', 'settings'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  color: isActive ? '#fff' : 'var(--muted)',
                  fontWeight: '600',
                  fontSize: '15px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  padding: '10px 16px',
                  borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  textTransform: 'capitalize',
                  background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                  borderRadius: '10px 10px 0 0',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {tab === 'projects' ? '📁 Projects' : tab === 'members' ? '👥 Team Members' : '⚙️ Workspace Settings'}
              </button>
            );
          })}
        </div>

        {/* Dynamic content */}
        {activeTab === 'projects' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {projects.map(proj => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
            {projects.length === 0 && (
              <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                No projects added to this workspace. Get started by creating one!
              </p>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div style={{ maxWidth: '400px' }}>
            <TeamMembers teamId={id} members={team.members} />
          </div>
        )}

        {activeTab === 'settings' && (
          <TeamSettings team={team} onSave={handleSaveSettings} />
        )}

        {/* Modals */}
        {showInvite && (
          <InviteMemberModal
            teamId={id}
            onInvite={handleInvite}
            onClose={() => setShowInvite(false)}
          />
        )}

        {showCreateProject && (
          <CreateProjectModal
            teamId={id}
            onCreate={handleCreateProject}
            onClose={() => setShowCreateProject(false)}
          />
        )}

      </div>
    </div>
  );
}
