import React, { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';
import TeamCard from '../../components/teams/TeamCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function Teams() {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const list = await teamService.getTeams(token);
      setTeams(list);
    } catch (e) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const newTeam = await teamService.createTeam(name, desc, token);
      if (newTeam) {
        setTeams([...teams, newTeam]);
        setName('');
        setDesc('');
        setShowCreate(false);
        toast.success('Team created successfully!');
      }
    } catch (e) {
      toast.error('Failed to create team');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '32px', color: '#fff', margin: 0 }}>
              👥 Team Workspaces
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
              Manage your teams, invite members, and build projects.
            </p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} variant="primary">
            {showCreate ? 'Close Form' : '➕ Create Team'}
          </Button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreateTeam} className="glass" style={{
            padding: '20px',
            marginBottom: '24px',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h3 style={{ color: '#fff', fontSize: '16px', margin: 0, fontFamily: 'Space Grotesk' }}>
              Create New Team
            </h3>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Team Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
            <Button size="small" variant="primary" type="submit">Create Team</Button>
          </form>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {teams.map(team => (
            <TeamCard key={team._id} team={team} />
          ))}
          {teams.length === 0 && (
            <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
              No team workspaces created yet. Get started by creating one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
