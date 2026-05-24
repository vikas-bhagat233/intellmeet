import React from 'react'
import toast from 'react-hot-toast'
import Button from '../common/Button'

export default function SummaryCard({ summaryText }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summaryText)
    toast.success('Summary copied to clipboard!')
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 14,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk' }}>
          🧠 AI Summarized Insights
        </h3>
        <Button size="small" variant="secondary" onClick={copyToClipboard}>
          📋 Copy Summary
        </Button>
      </div>

      <div style={{
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap'
      }}>
        {summaryText || 'No summary generated for this meeting.'}
      </div>
    </div>
  )
}
