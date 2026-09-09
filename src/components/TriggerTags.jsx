import React from 'react';
import { TRIGGER_TAGS } from '../lib/checkinOptions.js';

export default function TriggerTags({ selected, onToggle }) {
  return (
    <div>
      {TRIGGER_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          className={`pill ${selected.includes(tag) ? 'selected' : ''}`}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
