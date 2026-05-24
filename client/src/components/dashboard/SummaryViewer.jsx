import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SummaryCard from '../summaries/SummaryCard';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

/**
 * SummaryViewer – modal overlay showing the AI summary with copy and download options.
 */
export default function SummaryViewer({ meetingId, summary }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    // You could toast a success message here if toast library is available
  };

  const downloadPdf = async () => {
    setLoading(true);
    try {
      await reportService.downloadPdfReport(meetingId, token);
    } catch (e) {
      console.error('PDF download failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(15,23,42,0.9)',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 720,
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={() => window.history.back()}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >✕</button>
        {/* Summary content */}
        <SummaryCard summaryText={summary} />
        {/* Action buttons */}
        <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button size="small" variant="secondary" onClick={copyToClipboard}>📋 Copy</Button>
          <Button size="small" variant="primary" onClick={downloadPdf} disabled={loading}>
            {loading ? 'Downloading...' : '⬇️ Download PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}

SummaryViewer.propTypes = {
  meetingId: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};
