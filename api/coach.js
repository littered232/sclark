// POST /api/coach
// Body:     { messages: [{ role, content }], max_tokens }
// Response: { content: [{ type: "text", text }] }
//
// Tries Gemini first, then falls back to Anthropic Claude. Both API keys
// are read from server side environment variables and are never sent to
// the browser. Vercel's Node runtime exposes this file as a serverless
// function automatically because it lives in /api.

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

function splitSystemAndTurns(messages) {
  const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const turns = messages.filter((m) => m.role !== 'system');
  return { system: systemParts.join('\n'), turns };
}

async function callGemini({ messages, maxTokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const { system, turns } = splitSystemAndTurns(messages);
  const contents = turns.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents,
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
    generationConfig: { maxOutputTokens: maxTokens || 300 }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!text) throw new Error('Gemini returned no text');
  return text;
}

async function callAnthropic({ messages, maxTokens }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const { system, turns } = splitSystemAndTurns(messages);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens || 300,
      ...(system ? { system } : {}),
      messages: turns.map((m) => ({ role: m.role, content: m.content }))
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.content?.map((block) => block.text).join('') || '';
  if (!text) throw new Error('Anthropic returned no text');
  return text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages, max_tokens } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const text = await callGemini({ messages, maxTokens: max_tokens });
    res.status(200).json({ content: [{ type: 'text', text }] });
    return;
  } catch (geminiErr) {
    console.warn('Gemini failed, trying Anthropic.', geminiErr.message);
  }

  try {
    const text = await callAnthropic({ messages, maxTokens: max_tokens });
    res.status(200).json({ content: [{ type: 'text', text }] });
    return;
  } catch (anthropicErr) {
    console.error('Anthropic also failed.', anthropicErr.message);
    res.status(502).json({ error: 'Both model providers failed. Configure GEMINI_API_KEY or ANTHROPIC_API_KEY.' });
  }
}
