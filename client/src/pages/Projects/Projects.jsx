import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';
import ProjectCard from '../../components/projects/ProjectCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function Projects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch across standard default team
      const projectList = await projectService.getProjects('all', token);
      setProjects(projectList);
    } catch (e) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '32px', color: '#fff', marginBottom: '8px' }}>
          📁 Projects Board List
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          View and coordinate all projects across team workspaces.
        </p>

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
              No projects found. Open a Team Workspace to create a project first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
