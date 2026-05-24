import React from 'react'

export default function FilePreview({ fileName }) {
  const extension = fileName?.split('.').pop()?.toLowerCase() || ''

  const getIcon = () => {
    switch (extension) {
      case 'pdf': return '📕'
      case 'doc':
      case 'docx': return '📘'
      case 'xls':
      case 'xlsx': return '📗'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️'
      default: return '📄'
    }
  }

  return (
    <span style={{ fontSize: 18, marginRight: 6 }}>
      {getIcon()}
    </span>
  )
}
