import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { BRAND_NAME } from '../brand.js';

export default function Auth({ onSignedIn }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const action =
        mode === 'signin'
          ? supabase.auth.signInWithPassword({ email, password })
          : supabase.auth.signUp({ email, password });
      const { data, error: authError } = await action;
      if (authError) throw authError;

      if (mode === 'signup' && !data.session) {
        setError('Check your email to confirm your account, then sign in.');
        setMode('signin');
        return;
      }
      onSignedIn(data.session);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell" style={{ justifyContent: 'center' }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>{BRAND_NAME}</h1>
        <p className="text-muted">
          {mode === 'signin' ? 'Sign in to continue your practice.' : 'Create an account to start practicing.'}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              inputMode="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait.' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <button
          className="btn-ghost"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={{ marginTop: 10 }}
        >
          {mode === 'signin' ? 'Need an account. Sign up' : 'Already have an account. Sign in'}
        </button>
      </div>
    </div>
  );
}
