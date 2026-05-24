import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

/**
 * TranscriptViewer – displays a full transcript with speaker highlights and search.
 * Props:
 *   transcript: string – raw transcript text (lines may include speaker prefix).
 *   onSearch?: function – optional callback when search query changes.
 */
export default function TranscriptViewer({ transcript, onSearch }) {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (onSearch) onSearch(val);
  };

  // Debounce the search input to avoid re‑render on each keystroke
  const debouncedSearch = useMemo(() => debounce(handleSearchChange, 300), []);

  // Split transcript into lines; assume format "Speaker: text"
  const lines = transcript ? transcript.split('\n') : [];

  const highlightedLines = lines.map((line, idx) => {
    const [speaker, ...rest] = line.split(':');
    const text = rest.join(':').trim();
    const match = search && text.toLowerCase().includes(search.toLowerCase());
    const speakerColor = '#60a5fa'; // blue‑accent for speakers
    return (
      <div key={idx} style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
        <span style={{ color: speakerColor, fontWeight: 600, minWidth: 80 }}>{speaker}:</span>
        <span style={{
          color: match ? '#fff' : '#cbd5e1',
          backgroundColor: match ? 'rgba(255,255,255,0.08)' : 'transparent',
          padding: match ? '2px 4px' : 0,
          borderRadius: 4,
        }}>{text}</span>
      </div>
    );
  });

  return (
    <div className="glass" style={{ padding: 20, maxHeight: '70vh', overflowY: 'auto' }}>
      <input
        type="text"
        placeholder="Search transcript..."
        onChange={(e) => debouncedSearch(e)}
        style={{
          width: '100%',
          marginBottom: 12,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
          color: '#fff',
          outline: 'none',
        }}
      />
      <div>{highlightedLines}</div>
    </div>
  );
}

TranscriptViewer.propTypes = {
  transcript: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
};
