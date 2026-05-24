import React from 'react'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

export default function TranscriptDownload({ meetingId }) {
  const { token } = useAuth()

  return (
    <Button
      variant="secondary"
      onClick={() => reportService.downloadPdfReport(meetingId, token)}
      size="small"
    >
      📥 Download Complete Transcript Report
    </Button>
  )
}
