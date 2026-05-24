import React, { useState } from 'react'
import SummaryPanel from './SummaryPanel'
import ActionItemPanel from './ActionItemPanel'
import DecisionPanel from './DecisionPanel'

export default function MeetingInsightPanel({
  insights,
  onGenerateSummary,
  onExtractActionItems,
  loadingSummary,
  loadingActionItems
}) {
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <div className="card meeting-insight-panel" style={{
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      padding: 20
    }}>
      {/* Tabs list */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: 16,
        gap: 6
      }}>
        {['summary', 'actionItems', 'decisions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : '#94a3b8',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: '6px 6px 0 0'
            }}
          >
            {tab === 'summary' && '📝 Summary'}
            {tab === 'actionItems' && '✅ Tasks'}
            {tab === 'decisions' && '💡 Decisions & Tags'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: '180px' }}>
        {activeTab === 'summary' && (
          <SummaryPanel
            summary={insights?.summary}
            onGenerate={onGenerateSummary}
            loading={loadingSummary}
          />
        )}
        {activeTab === 'actionItems' && (
          <ActionItemPanel
            actionItems={insights?.actionItems}
            onExtract={onExtractActionItems}
            loading={loadingActionItems}
          />
        )}
        {activeTab === 'decisions' && (
          <DecisionPanel
            decisions={insights?.decisions}
            keywords={insights?.keywords}
            sentiment={insights?.sentiment}
          />
        )}
      </div>
    </div>
  )
}
