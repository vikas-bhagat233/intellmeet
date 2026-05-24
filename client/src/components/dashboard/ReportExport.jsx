import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Loader from '../common/Loader';

/**
 * ReportExport – renders two buttons to download PDF and Excel reports for a meeting.
 * Shows a small loader while the download request is in progress.
 */
export default function ReportExport({ meetingId }) {
  const { token } = useAuth();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const downloadPdf = async () => {
    setLoadingPdf(true);
    try {
      await reportService.downloadPdfReport(meetingId, token);
    } catch (e) {
      console.error('PDF download failed', e);
    } finally {
      setLoadingPdf(false);
    }
  };

  const downloadExcel = async () => {
    setLoadingExcel(true);
    try {
      await reportService.downloadExcelReport(meetingId, token);
    } catch (e) {
      console.error('Excel download failed', e);
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button
        size="small"
        variant="primary"
        onClick={downloadPdf}
        disabled={loadingPdf}
      >
        {loadingPdf ? <Loader size={16} /> : '📄 Download PDF'}
      </Button>
      <Button
        size="small"
        variant="secondary"
        onClick={downloadExcel}
        disabled={loadingExcel}
      >
        {loadingExcel ? <Loader size={16} /> : '📊 Download Excel'}
      </Button>
    </div>
  );
}

ReportExport.propTypes = {
  meetingId: PropTypes.string.isRequired,
};
