import React from 'react';

export default function StateMeter({ label, value }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span className="text-muted">{label}</span>
        <span className="text-muted">{clamped}/100</span>
      </div>
      <div className="state-meter-track">
        <div className="state-meter-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
