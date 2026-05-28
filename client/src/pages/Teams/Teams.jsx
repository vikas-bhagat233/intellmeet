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
          <form onSubmit={handleCreateTeam} className="card" style={{
            padding: '28px',
            marginBottom: '32px',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(10, 15, 30, 0.4)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.5), 0 0 15px rgba(99,102,241,0.1)'
          }}>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: 0, fontFamily: 'Space Grotesk', fontWeight: 700 }}>
              🚀 Create New Workspace
            </h3>
            
            <div className="field">
              <label className="field__label">Workspace Name</label>
              <input
                type="text"
                required
                placeholder="Engineering, Design Sync, etc."
                value={name}
                onChange={e => setName(e.target.value)}
                className="field__input"
              />
            </div>
            
            <div className="field">
              <label className="field__label">Description</label>
              <textarea
                placeholder="What is this workspace for?"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={3}
                className="field__input"
                style={{
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            
            <Button size="small" variant="primary" type="submit" style={{ alignSelf: 'flex-start', marginTop: 4, padding: '10px 20px' }}>
              Create Workspace ✨
            </Button>
          </form>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {teams.map(team => (
            <TeamCard key={team._id} team={team} />
          ))}
          {teams.length === 0 && (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.01)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '15px', fontStyle: 'italic', margin: 0 }}>
                No active workspaces found. Create a team workspace above to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
