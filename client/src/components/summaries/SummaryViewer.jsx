import React from 'react'
import SummaryCard from './SummaryCard'

export default function SummaryViewer({ summary }) {
  return (
    <div className="summary-viewer">
      <SummaryCard summaryText={summary} />
    </div>
  )
}
