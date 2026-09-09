import React from 'react';
import { SCENARIOS } from '../lib/scenarios.js';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ discProfile, onNavigate }) {
  return (
    <div className="app-shell">
      <div>
        <p className="text-muted" style={{ marginBottom: 2 }}>{greeting()}.</p>
        <h1 style={{ margin: 0 }}>Your dashboard</h1>
      </div>

      <div className="card">
        <p className="text-muted" style={{ marginBottom: 2 }}>Your style</p>
        <h2 style={{ margin: '0 0 4px' }}>{discProfile?.style || 'Not set'}</h2>
        <p style={{ marginBottom: 12 }}>{discProfile?.description}</p>
        <button className="btn-secondary" onClick={() => onNavigate('disc-quiz')}>Retake the quiz</button>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Daily check in</h2>
        <p className="text-muted">A minute to note your mood, energy, and anything that came up.</p>
        <button className="btn-primary" onClick={() => onNavigate('checkin')}>Start check in</button>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Daily activities</h2>
        <p className="text-muted">Practice real situations with live coaching.</p>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className="option-btn"
            onClick={() => onNavigate('activity', { scenarioId: s.id })}
          >
            <strong>{s.title}</strong>
            <div className="text-muted" style={{ fontSize: 13 }}>{s.tagline}</div>
          </button>
        ))}
      </div>

      <div className="nav-row">
        <button className="btn-secondary" onClick={() => onNavigate('exercises')}>Exercises</button>
        <button className="btn-secondary" onClick={() => onNavigate('patterns')}>Patterns</button>
      </div>
    </div>
  );
}
