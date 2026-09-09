import React, { useState } from 'react';
import { DISC_QUESTIONS, scoreDiscAnswers } from '../lib/disc.js';
import { saveDiscProfile } from '../lib/storage.js';

export default function DiscQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const question = DISC_QUESTIONS[step];
  const isLast = step === DISC_QUESTIONS.length - 1;

  function choose(letter) {
    const nextAnswers = { ...answers, [question.id]: letter };
    setAnswers(nextAnswers);

    if (isLast) {
      const scored = scoreDiscAnswers(nextAnswers);
      setResult(scored);
    } else {
      setStep(step + 1);
    }
  }

  async function finish() {
    await saveDiscProfile(result);
    onComplete(result);
  }

  if (result) {
    return (
      <div className="app-shell" style={{ justifyContent: 'center' }}>
        <div className="card">
          <p className="text-muted" style={{ marginBottom: 4 }}>Your style is</p>
          <h1 style={{ marginTop: 0 }}>{result.style}</h1>
          <p>{result.description}</p>
          <button className="btn-primary" onClick={finish} style={{ width: '100%', marginTop: 8 }}>
            Continue to my dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div>
        <p className="text-muted">Question {step + 1} of {DISC_QUESTIONS.length}</p>
        <div className="state-meter-track" style={{ marginBottom: 16 }}>
          <div
            className="state-meter-fill"
            style={{ width: `${((step) / DISC_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{question.prompt}</h2>
        {question.options.map((opt) => (
          <button key={opt.letter} className="option-btn" onClick={() => choose(opt.letter)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
