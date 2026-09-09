// Client side wrapper around POST /api/coach, with a local fallback so the
// app keeps working (with simpler, canned coaching) if the backend or the
// model provider is unreachable.

const STATE_TAG_RE = /\[STATE:([+-]?\d+)\]/i;
const SECOND_STATE_TAG_RE = /\[STATE2:([+-]?\d+)\]/i;

function styleNote(discStyle) {
  switch (discStyle) {
    case 'Driver':
      return 'They respond best to direct, brief coaching that respects their time and gets to the point.';
    case 'Influencer':
      return 'They respond best to warm, encouraging coaching with room for optimism and connection.';
    case 'Supporter':
      return 'They respond best to gentle, patient coaching that validates feelings before suggesting next steps.';
    case 'Analyst':
      return 'They respond best to clear, logical coaching that explains the why behind each suggestion.';
    default:
      return 'Keep the coaching balanced, clear, and kind.';
  }
}

export function buildScenarioSystemPrompt({ discStyle, scenarioTitle, scenarioSetup }) {
  return [
    `You are an emotional intelligence coach inside The Wright Mentality app.`,
    `The user's DISC style is ${discStyle || 'unknown'}. ${styleNote(discStyle)}`,
    `The current practice scenario is "${scenarioTitle}". Setup: ${scenarioSetup}`,
    `Respond in two or three short sentences of coaching that react specifically to what the user just chose or typed.`,
    `Do not use dashes in your reply, use commas or periods instead.`,
    `End your reply with a hidden tag on its own line, [STATE:+N] or [STATE:-N], where N is 5 to 20, showing how much this response should move the emotional state meter (positive for improvement, negative for a setback). If a second person's state is also being tracked in this scenario, add a second tag [STATE2:+N] or [STATE2:-N] for them.`
  ].join(' ');
}

export function buildReframeSystemPrompt({ discStyle }) {
  return [
    `You are an emotional intelligence coach inside The Wright Mentality app helping with cognitive reframing.`,
    `The user's DISC style is ${discStyle || 'unknown'}. ${styleNote(discStyle)}`,
    `Given a negative or unhelpful thought the user shares, offer one balanced, realistic reframe in two to three sentences.`,
    `Do not use dashes in your reply, use commas or periods instead.`
  ].join(' ');
}

function parseStateTags(text) {
  let clean = text;
  let stateDelta = null;
  let secondStateDelta = null;

  const m1 = clean.match(STATE_TAG_RE);
  if (m1) {
    stateDelta = parseInt(m1[1], 10);
    clean = clean.replace(STATE_TAG_RE, '').trim();
  }
  const m2 = clean.match(SECOND_STATE_TAG_RE);
  if (m2) {
    secondStateDelta = parseInt(m2[1], 10);
    clean = clean.replace(SECOND_STATE_TAG_RE, '').trim();
  }
  return { text: clean, stateDelta, secondStateDelta };
}

// Simple deterministic fallback used when /api/coach cannot be reached.
function localFallback({ kind, discStyle }) {
  const fallbackDeltas = { stateDelta: 12, secondStateDelta: 8 };
  if (kind === 'reframe') {
    return {
      text: "That thought makes sense given the moment, and it is also just one interpretation. Try this version. It is hard right now, and I am still capable of handling it one step at a time.",
      usedFallback: true
    };
  }
  const byStyle = {
    Driver: "Good, you made a call and moved forward. Naming the next concrete step will keep the momentum going.",
    Influencer: "Nice, that response keeps the connection with the other person warm. Keep checking in on how they are feeling too.",
    Supporter: "That was a caring choice. It is okay to also protect a little space for yourself while you support others.",
    Analyst: "That is a reasonable, measured response. Noting what worked here will help you repeat it next time."
  };
  return {
    text: byStyle[discStyle] || "That is a solid response. Noticing how your body feels right now is a good next step.",
    usedFallback: true,
    ...fallbackDeltas
  };
}

export async function askCoach({ systemPrompt, messages, kind = 'scenario', discStyle, maxTokens = 300 }) {
  const fullMessages = [{ role: 'system', content: systemPrompt }, ...messages];

  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: fullMessages, max_tokens: maxTokens })
    });

    if (!res.ok) throw new Error(`Coach API responded with ${res.status}`);

    const data = await res.json();
    const rawText = data?.content?.[0]?.text;
    if (!rawText) throw new Error('Coach API returned no text.');

    const { text, stateDelta, secondStateDelta } = parseStateTags(rawText);
    return {
      text: text || rawText,
      stateDelta: stateDelta ?? 10,
      secondStateDelta,
      usedFallback: false
    };
  } catch (err) {
    console.warn('Falling back to local coaching text.', err);
    return localFallback({ kind, discStyle });
  }
}
