import React, { useState } from 'react';
import { askCoach, buildReframeSystemPrompt } from '../lib/coach.js';
import { addJournalEntry } from '../lib/storage.js';
import { JOURNAL_PROMPTS } from '../lib/checkinOptions.js';

const SENSES = [
  { label: 'Sight', prompt: 'Name five things you can see right now.' },
  { label: 'Sound', prompt: 'Name four things you can hear right now.' },
  { label: 'Touch', prompt: 'Name three things you can feel touching your skin right now.' },
  { label: 'Smell', prompt: 'Name two things you can smell right now, or two smells you like.' },
  { label: 'Taste', prompt: 'Name one thing you can taste right now, or a taste you enjoy.' }
];

function Grounding({ onBack }) {
  const [step, setStep] = useState(0);
  const done = step >= SENSES.length;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Grounding, a five senses walk through</h2>
      {done ? (
        <>
          <p>Notice how you feel now compared to when you started.</p>
          <button className="btn-secondary" onClick={() => setStep(0)}>Do it again</button>
        </>
      ) : (
        <>
          <p className="text-muted">{SENSES[step].label}</p>
          <p>{SENSES[step].prompt}</p>
          <button className="btn-primary" onClick={() => setStep(step + 1)}>Next</button>
        </>
      )}
    </div>
  );
}

function Reframing({ discProfile }) {
  const [thought, setThought] = useState('');
  const [reframe, setReframe] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!thought.trim()) return;
    setLoading(true);
    const systemPrompt = buildReframeSystemPrompt({ discStyle: discProfile?.style });
    const result = await askCoach({
      systemPrompt,
      messages: [{ role: 'user', content: thought.trim() }],
      kind: 'reframe',
      discStyle: discProfile?.style
    });
    setReframe(result.text);
    setLoading(false);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Cognitive reframing</h2>
      <p className="text-muted">Write down a thought that is bothering you.</p>
      <textarea rows={3} value={thought} onChange={(e) => setThought(e.target.value)} />
      <button className="btn-primary" style={{ marginTop: 8 }} disabled={loading} onClick={submit}>
        {loading ? 'Thinking.' : 'Reframe this thought'}
      </button>
      {reframe && (
        <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 10 }}>
          <p style={{ margin: 0 }}>{reframe}</p>
        </div>
      )}
    </div>
  );
}

function Journaling() {
  const [promptIndex] = useState(() => Math.floor(Math.random() * JOURNAL_PROMPTS.length));
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

  async function save() {
    if (!entry.trim()) return;
    await addJournalEntry({ prompt: JOURNAL_PROMPTS[promptIndex], text: entry.trim() });
    setSaved(true);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Guided journaling</h2>
      <p className="text-muted">{JOURNAL_PROMPTS[promptIndex]}</p>
      <textarea rows={5} value={entry} onChange={(e) => setEntry(e.target.value)} />
      <button className="btn-primary" style={{ marginTop: 8 }} onClick={save}>
        {saved ? 'Saved' : 'Save entry'}
      </button>
    </div>
  );
}

export default function Exercises({ discProfile, onBack }) {
  return (
    <div className="app-shell">
      <h1>Exercises</h1>
      <Grounding />
      <Reframing discProfile={discProfile} />
      <Journaling />
      <button className="btn-ghost" onClick={onBack}>Back to dashboard</button>
    </div>
  );
}
