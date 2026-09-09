import React, { useState } from 'react';
import MoodFaces from '../components/MoodFaces.jsx';
import EnergyPicker from '../components/EnergyPicker.jsx';
import TriggerTags from '../components/TriggerTags.jsx';
import { addCheckIn } from '../lib/storage.js';

export default function CheckIn({ onDone }) {
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [triggers, setTriggers] = useState([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  function toggleTrigger(tag) {
    setTriggers((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function save() {
    setSaving(true);
    await addCheckIn({ mood, energy, triggers, note });
    setSaving(false);
    onDone();
  }

  const canSave = mood !== null && energy !== null;

  return (
    <div className="app-shell">
      <h1>Daily check in</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>How is your mood right now.</h2>
        <MoodFaces value={mood} onChange={setMood} />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>What is your energy like.</h2>
        <EnergyPicker value={energy} onChange={setEnergy} />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Anything triggering today. Pick any that apply.</h2>
        <TriggerTags selected={triggers} onToggle={toggleTrigger} />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Optional note</h2>
        <textarea
          rows={4}
          placeholder="Anything you want to remember about today."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button className="btn-primary" disabled={!canSave || saving} onClick={save}>
        {saving ? 'Saving.' : 'Save check in'}
      </button>
      <button className="btn-ghost" onClick={onDone}>Cancel</button>
    </div>
  );
}
