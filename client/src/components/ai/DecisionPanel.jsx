import React from 'react'

export default function DecisionPanel({ decisions, keywords, sentiment }) {
  const getSentimentColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'positive':
      case 'collaborative':
        return '#4ade80'
      case 'tense':
      case 'negative':
        return '#f87171'
      default:
        return '#60a5fa'
    }
  }

  const getSentimentBg = (s) => {
    switch (s?.toLowerCase()) {
      case 'positive':
      case 'collaborative':
        return 'rgba(74, 222, 128, 0.15)'
      case 'tense':
      case 'negative':
        return 'rgba(248, 113, 113, 0.15)'
      default:
        return 'rgba(96, 165, 250, 0.15)'
    }
  }

  return (
    <div className="decision-panel" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Sentiment and Keywords top layer */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Overall Sentiment:</span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            background: getSentimentBg(sentiment),
            color: getSentimentColor(sentiment),
            padding: '4px 10px',
            borderRadius: 6
          }}>
            {sentiment || 'Neutral'}
          </span>
        </div>

        {keywords && keywords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Keywords:</span>
            {keywords.map((kw, idx) => (
              <span key={idx} style={{
                fontSize: 11,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                padding: '2px 8px',
                borderRadius: 4
              }}>
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Decisions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Key Decisions Log</h4>
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: 12,
          padding: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          minHeight: '100px'
        }}>
          {decisions && decisions.length > 0 ? (
            <ul style={{ paddingLeft: 18, color: '#e2e8f0', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {decisions.map((dec, idx) => (
                <li key={idx} style={{ lineHeight: 1.5 }}>
                  {dec}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#64748b', fontSize: 13 }}>
              No decisions extracted yet. Generate meeting insights to populate.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
