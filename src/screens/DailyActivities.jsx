import React, { useState } from 'react';
import { getScenario } from '../lib/scenarios.js';
import { askCoach, buildScenarioSystemPrompt } from '../lib/coach.js';
import StateMeter from '../components/StateMeter.jsx';

export default function DailyActivities({ scenarioId, discProfile, onBack }) {
  const scenario = getScenario(scenarioId);
  const [turnIndex, setTurnIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [history, setHistory] = useState([]); // { role, content }
  const [meState, setMeState] = useState(50);
  const [otherState, setOtherState] = useState(50);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [coachLines, setCoachLines] = useState([]);

  if (!scenario) {
    return (
      <div className="app-shell">
        <p>That scenario could not be found.</p>
        <button className="btn-ghost" onClick={onBack}>Back</button>
      </div>
    );
  }

  const currentTurn = scenario.turns[turnIndex];
  const isLastTurn = turnIndex === scenario.turns.length - 1;

  async function respond(choiceText) {
    setLoading(true);
    const nextHistory = [...history, { role: 'user', content: choiceText }];

    const systemPrompt = buildScenarioSystemPrompt({
      discStyle: discProfile?.style,
      scenarioTitle: scenario.title,
      scenarioSetup: scenario.situation
    });

    const result = await askCoach({
      systemPrompt,
      messages: nextHistory,
      kind: 'scenario',
      discStyle: discProfile?.style
    });

    const updatedMe = Math.max(0, Math.min(100, meState + (result.stateDelta ?? 10)));
    setMeState(updatedMe);
    if (scenario.hasSecondPerson) {
      const delta = result.secondStateDelta ?? 8;
      setOtherState((prev) => Math.max(0, Math.min(100, prev + delta)));
    }

    setCoachLines((prev) => [...prev, result.text]);
    setHistory([...nextHistory, { role: 'assistant', content: result.text }]);
    setCustomText('');
    setLoading(false);

    if (isLastTurn) {
      setDone(true);
    } else {
      setTurnIndex(turnIndex + 1);
    }
  }

  if (done) {
    return (
      <div className="app-shell">
        <h1>{scenario.title}</h1>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Debrief</h2>
          <p>{scenario.debrief}</p>
        </div>
        <button className="btn-primary" onClick={onBack}>Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <h1>{scenario.title}</h1>

      <div className="card">
        <p className="text-muted">{scenario.situation}</p>
      </div>

      <div className="card">
        <StateMeter label="Your state" value={meState} />
        {scenario.hasSecondPerson && (
          <StateMeter label={`${scenario.secondPersonName}'s state`} value={otherState} />
        )}
      </div>

      {coachLines.length > 0 && (
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: 15 }}>Coaching</h2>
          {coachLines.map((line, i) => (
            <p key={i} className="text-muted" style={{ fontSize: 14 }}>{line}</p>
          ))}
        </div>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>{currentTurn.prompt}</h2>
        {currentTurn.suggestions.map((s) => (
          <button key={s} className="option-btn" disabled={loading} onClick={() => respond(s)}>
            {s}
          </button>
        ))}
        <textarea
          rows={2}
          placeholder="Or type your own response."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <button
          className="btn-secondary"
          style={{ marginTop: 8 }}
          disabled={loading || !customText.trim()}
          onClick={() => respond(customText.trim())}
        >
          {loading ? 'Thinking.' : 'Send my own response'}
        </button>
      </div>

      <button className="btn-ghost" onClick={onBack}>Exit practice</button>
    </div>
  );
}
