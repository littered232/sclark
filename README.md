# The Wright Mentality

An emotional intelligence practice app. Users take a short DISC style check, then practice real situations where they pick or type a response and get live AI coaching that adapts to their DISC style. Daily check ins build a picture of triggers and patterns over time.

Brand site, [www.thewrightmentality.com](https://www.thewrightmentality.com)

## Stack

* Frontend, Vite and React, single page, no external router.
* Backend, one serverless function at `/api/coach` (Vercel style). It holds the AI key server side and returns coaching text. The browser never sees a key.
* Data and auth, Supabase (email and password auth, plus a small key value table). The app works with Supabase left unconfigured, everything just falls back to the browser's localStorage.
* Hosting, Vercel, though any host that runs Vite plus serverless functions works.

## Getting started

```
npm install
cp .env.example .env.local   # fill in whichever keys you have
npm run dev
```

Without any environment variables set, the app runs entirely on localStorage with locally generated fallback coaching text. This is intentional, it means you can develop the UI without any backend configured.

To get real AI coaching locally, run the Vite dev server alongside `vercel dev` (which serves the `/api` folder), or deploy to Vercel directly.

## Environment variables

See `.env.example`. Summary,

* `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, safe for the browser, enable Supabase auth and storage.
* `GEMINI_API_KEY`, backend only, tried first.
* `ANTHROPIC_API_KEY`, backend only, used if Gemini fails or is not configured.
* `GEMINI_MODEL` and `ANTHROPIC_MODEL`, optional overrides.

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. In Authentication, Providers, make sure email is enabled.
4. Copy the project URL and anon key into `.env.local`.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it in Vercel.
3. Add the environment variables above in the Vercel project settings.
4. Deploy. The `/api/coach` folder is picked up automatically as a serverless function.

## What is scaffolded here

1. DISC quiz, eight questions, tallies to Driver, Influencer, Supporter, or Analyst.
2. Home dashboard, greeting, DISC style, daily check in button, Daily Activities module, links to exercises and patterns.
3. Daily check in, mood, energy, trigger tags, optional note.
4. Patterns, a simple mood trend and most common triggers.
5. Daily Activities, three interactive scenarios with live coaching and an emotional state meter (a second meter for the winding down scenario).
6. Exercises, grounding, cognitive reframing, guided journaling.

Brand color lives in one place, `src/brand.js`, swap it for the exact logo color whenever you have it. User facing copy avoids dashes throughout, by design.
