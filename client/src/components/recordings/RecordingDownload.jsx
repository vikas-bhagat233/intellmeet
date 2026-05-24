import React from 'react'
import Button from '../common/Button'

export default function RecordingDownload({ url }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        variant="secondary"
        onClick={() => {
          const link = document.createElement('a')
          link.href = url
          link.download = 'IntellMeet_Meeting_Recording.mp4'
          link.target = '_blank'
          link.click()
        }}
        size="small"
      >
        📥 Download Video File
      </Button>
    </div>
  )
}
