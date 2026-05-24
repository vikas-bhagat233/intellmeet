import React from 'react'
import FilePreview from './FilePreview'

export default function SharedFiles({ files }) {
  return (
    <div className="shared-files" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '8px 0 2px' }}>
        Shared Documents ({files.length})
      </h4>
      <div style={{
        maxHeight: '160px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingRight: 4
      }}>
        {files.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
            No documents shared yet.
          </p>
        ) : (
          files.map((file, idx) => (
            <div key={file._id ? `${file._id}-${idx}` : idx} style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 8,
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <FilePreview fileName={file.fileName} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#60a5fa',
                      fontSize: 13,
                      fontWeight: 500,
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title="Download Shared Asset"
                  >
                    {file.fileName}
                  </a>
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    Uploaded by: {file.uploadedByName || 'User'}
                  </span>
                </div>
              </div>
              <a
                href={file.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  color: '#cbd5e1'
                }}
              >
                💾
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
