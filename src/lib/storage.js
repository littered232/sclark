import { supabase, isSupabaseConfigured } from './supabaseClient.js';

// Generic key/value storage. When a Supabase user is signed in, values are
// stored in the user_data table (one row per user per key). Otherwise
// everything falls back to browser localStorage under a namespaced key.
// This lets the whole app work with zero backend configured.

const LOCAL_PREFIX = 'wright_mentality_';

function localGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(LOCAL_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn('localStorage read failed for', key, err);
    return fallback;
  }
}

function localSet(key, value) {
  try {
    window.localStorage.setItem(LOCAL_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('localStorage write failed for', key, err);
  }
}

async function getCurrentUserId() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id ?? null;
}

export async function getValue(key, fallback) {
  const userId = await getCurrentUserId();
  if (!userId) return localGet(key, fallback);

  const { data, error } = await supabase
    .from('user_data')
    .select('value')
    .eq('user_id', userId)
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.warn('Supabase read failed, falling back to local storage.', error);
    return localGet(key, fallback);
  }
  return data ? data.value : fallback;
}

export async function setValue(key, value) {
  const userId = await getCurrentUserId();
  if (!userId) {
    localSet(key, value);
    return;
  }

  const { error } = await supabase
    .from('user_data')
    .upsert(
      { user_id: userId, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,key' }
    );

  if (error) {
    console.warn('Supabase write failed, saving locally instead.', error);
    localSet(key, value);
  }
}

// ---- Domain specific helpers -------------------------------------------

export async function getDiscProfile() {
  return getValue('disc_profile', null);
}

export async function saveDiscProfile(profile) {
  await setValue('disc_profile', profile);
}

export async function getCheckIns() {
  return getValue('checkins', []);
}

export async function addCheckIn(entry) {
  const existing = await getCheckIns();
  const updated = [{ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...existing];
  await setValue('checkins', updated);
  return updated;
}

export async function getJournalEntries() {
  return getValue('journal_entries', []);
}

export async function addJournalEntry(entry) {
  const existing = await getJournalEntries();
  const updated = [{ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...existing];
  await setValue('journal_entries', updated);
  return updated;
}
