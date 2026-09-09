import React from 'react';
import { MOODS } from '../lib/checkinOptions.js';

export default function MoodFaces({ value, onChange }) {
  return (
    <div className="nav-row">
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          className={`option-btn ${value === mood.value ? 'selected' : ''}`}
          style={{ width: 'auto', flex: '1 1 60px', textAlign: 'center' }}
          onClick={() => onChange(mood.value)}
        >
          <div style={{ fontSize: 24 }}>{mood.emoji}</div>
          <div style={{ fontSize: 11 }} className="text-muted">{mood.label}</div>
        </button>
      ))}
    </div>
  );
}
