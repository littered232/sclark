import React, { useEffect, useState } from 'react';
import { getCheckIns } from '../lib/storage.js';
import { MOODS } from '../lib/checkinOptions.js';

function topTriggers(checkIns, limit = 5) {
  const counts = {};
  checkIns.forEach((c) => {
    (c.triggers || []).forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export default function Patterns({ onBack }) {
  const [checkIns, setCheckIns] = useState(null);

  useEffect(() => {
    getCheckIns().then((data) => setCheckIns(data));
  }, []);

  if (!checkIns) {
    return (
      <div className="app-shell">
        <p className="text-muted">Loading your patterns.</p>
      </div>
    );
  }

  const recent = [...checkIns].slice(0, 14).reverse();
  const triggers = topTriggers(checkIns);

  return (
    <div className="app-shell">
      <h1>Patterns</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Mood trend</h2>
        {recent.length === 0 ? (
          <p className="text-muted">No check ins yet. Your trend will show up here.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
            {recent.map((c) => (
              <div
                key={c.id}
                title={new Date(c.createdAt).toLocaleDateString()}
                style={{
                  flex: 1,
                  background: 'var(--brand)',
                  opacity: 0.4 + c.mood * 0.12,
                  height: `${(c.mood / 5) * 100}%`,
                  borderRadius: 4,
                  minHeight: 6
                }}
              />
            ))}
          </div>
        )}
        <div className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>
          {MOODS.map((m) => `${m.emoji} ${m.label}`).join('   ')}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Most common triggers</h2>
        {triggers.length === 0 ? (
          <p className="text-muted">No triggers logged yet.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {triggers.map(([tag, count]) => (
              <li key={tag}>{tag} ({count})</li>
            ))}
          </ul>
        )}
      </div>

      <button className="btn-ghost" onClick={onBack}>Back to dashboard</button>
    </div>
  );
}
