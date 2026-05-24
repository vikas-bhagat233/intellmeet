import React from 'react'
import Button from '../common/Button'

export default function SummaryPanel({ summary, onGenerate, loading }) {
  return (
    <div className="summary-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>AI Meeting Summary</h4>
        <Button onClick={onGenerate} disabled={loading} size="small" variant="secondary">
          {loading ? 'Generating...' : 'Regenerate Summary'}
        </Button>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 12,
        padding: 16,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        minHeight: '120px'
      }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20 }}>
            <div className="loader__spinner" style={{ width: 28, height: 28 }} />
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Processing transcript using Hugging Face LLM...</p>
          </div>
        ) : summary ? (
          <div style={{
            color: '#e2e8f0',
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: 'pre-line'
          }}>
            {summary.summary}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
            <p style={{ fontSize: 13, marginBottom: 12 }}>No summary generated yet.</p>
            <Button onClick={onGenerate} size="small">Generate Summary</Button>
          </div>
        )}
      </div>
    </div>
  )
}
