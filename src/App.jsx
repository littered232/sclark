import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient.js';
import { getDiscProfile } from './lib/storage.js';
import Auth from './screens/Auth.jsx';
import DiscQuiz from './screens/DiscQuiz.jsx';
import Dashboard from './screens/Dashboard.jsx';
import CheckIn from './screens/CheckIn.jsx';
import Patterns from './screens/Patterns.jsx';
import DailyActivities from './screens/DailyActivities.jsx';
import Exercises from './screens/Exercises.jsx';

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = signed out
  const [discProfile, setDiscProfile] = useState(undefined); // undefined = loading, null = not set
  const [screen, setScreen] = useState('dashboard');
  const [screenParams, setScreenParams] = useState({});

  // Auth bootstrap. If Supabase is not configured, skip straight past the
  // auth gate and rely on localStorage for everything.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load the DISC profile once we know whether someone is signed in (or
  // once we know we are running in localStorage only mode).
  useEffect(() => {
    if (session === undefined) return;
    if (isSupabaseConfigured && !session) {
      setDiscProfile(null);
      return;
    }
    getDiscProfile().then((profile) => setDiscProfile(profile));
  }, [session]);

  function navigate(next, params = {}) {
    setScreen(next);
    setScreenParams(params);
  }

  if (isSupabaseConfigured && session === undefined) {
    return (
      <div className="app-shell">
        <p className="text-muted">Loading.</p>
      </div>
    );
  }

  if (isSupabaseConfigured && !session) {
    return <Auth onSignedIn={setSession} />;
  }

  if (discProfile === undefined) {
    return (
      <div className="app-shell">
        <p className="text-muted">Loading.</p>
      </div>
    );
  }

  if (!discProfile) {
    return <DiscQuiz onComplete={(profile) => { setDiscProfile(profile); navigate('dashboard'); }} />;
  }

  switch (screen) {
    case 'disc-quiz':
      return <DiscQuiz onComplete={(profile) => { setDiscProfile(profile); navigate('dashboard'); }} />;
    case 'checkin':
      return <CheckIn onDone={() => navigate('dashboard')} />;
    case 'patterns':
      return <Patterns onBack={() => navigate('dashboard')} />;
    case 'activity':
      return (
        <DailyActivities
          scenarioId={screenParams.scenarioId}
          discProfile={discProfile}
          onBack={() => navigate('dashboard')}
        />
      );
    case 'exercises':
      return <Exercises discProfile={discProfile} onBack={() => navigate('dashboard')} />;
    case 'dashboard':
    default:
      return <Dashboard discProfile={discProfile} onNavigate={navigate} />;
  }
}
