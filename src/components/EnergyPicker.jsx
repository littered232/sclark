import React from 'react';
import { ENERGY_LEVELS } from '../lib/checkinOptions.js';

export default function EnergyPicker({ value, onChange }) {
  return (
    <div className="nav-row">
      {ENERGY_LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          className={`pill ${value === level ? 'selected' : ''}`}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
