import React from 'react'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

export default function SummaryDownload({ meetingId }) {
  const { token } = useAuth()

  return (
    <Button
      variant="secondary"
      onClick={() => reportService.downloadPdfReport(meetingId, token)}
      size="small"
    >
      📄 Download Summary PDF (Txt)
    </Button>
  )
}
