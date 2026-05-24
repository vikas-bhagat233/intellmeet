import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { reportService } from '../../services/reportService';
import toast from 'react-hot-toast';

export default function Reports() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportingId, setExportingId] = useState(null);
  const [exportType, setExportType] = useState(''); // 'pdf' or 'excel'

  useEffect(() => {
    fetchCompletedMeetings();
  }, []);

  const fetchCompletedMeetings = async () => {
    try {
      const response = await axios.get('/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(response.data?.data?.history || []);
    } catch (e) {
      toast.error('Failed to load completed meetings list');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async (meetingId) => {
    setExportingId(meetingId);
    setExportType('pdf');
    try {
      await reportService.downloadPdfReport(meetingId, token);
      toast.success('PDF Report downloaded successfully!');
    } catch (e) {
      toast.error('Failed to export PDF Report');
    } finally {
      setExportingId(null);
      setExportType('');
    }
  };

  const handleExportExcel = async (meetingId) => {
    setExportingId(meetingId);
    setExportType('excel');
    try {
      await reportService.downloadExcelReport(meetingId, token);
      toast.success('Excel Report downloaded successfully!');
    } catch (e) {
      toast.error('Failed to export Excel Report');
    } finally {
      setExportingId(null);
      setExportType('');
    }
  };

  if (loading) return <Loader />;

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.meetingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page" style={{ padding: '30px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '32px', color: '#fff', margin: 0 }}>
              📊 Document & Report Portal
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
              Export summaries, attendance lists, actions registries, and full transcripts to PDF or Excel.
            </p>
          </div>
        </div>

        {/* Analytics Statistics Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Available Reports</span>
            <h3 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', fontFamily: 'Space Grotesk' }}>
              {meetings.length}
            </h3>
          </div>
          <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Ready PDF Transcripts</span>
            <h3 style={{ color: 'var(--color-accent-primary)', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', fontFamily: 'Space Grotesk' }}>
              {meetings.length}
            </h3>
          </div>
          <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Excel CSV Spreadsheets</span>
            <h3 style={{ color: '#4ade80', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', fontFamily: 'Space Grotesk' }}>
              {meetings.length}
            </h3>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          
          {/* Search bar */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by meeting title or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: '#fff',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Table list */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>MEETING INFO</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>DATE</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>DURATION</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>PARTICIPANTS</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>EXPORTS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeetings.map(m => (
                  <tr key={m._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{m.title}</div>
                      <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>ID: {m.meetingId}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '13px' }}>
                      {new Date(m.startTime).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '13px' }}>
                      ⏳ {m.duration} mins
                    </td>
                    <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '13px' }}>
                      👥 {m.participants?.length || 0} attendees
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => handleExportPdf(m.meetingId)}
                          disabled={exportingId === m.meetingId}
                        >
                          {exportingId === m.meetingId && exportType === 'pdf' ? 'Exporting...' : '📄 PDF'}
                        </Button>
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => handleExportExcel(m.meetingId)}
                          disabled={exportingId === m.meetingId}
                        >
                          {exportingId === m.meetingId && exportType === 'excel' ? 'Exporting...' : '📊 Excel'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMeetings.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '13px' }}>
                      No completed sessions matching search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
