# AI Assistant Platform

An AI marketplace-style web app where users create domain-specific assistants, chat with them (Google Gemini via Supabase Edge Functions), and persist assistants and conversations per authenticated user.

## Features
- User authentication with Supabase Auth (email/password)
- Per-user assistants stored in Postgres (`assistants` table) with RLS
- Conversations and messages persisted per user (`conversations`, `messages` tables)
- Domain-restricted behavior per assistant (e.g., Finance, Development)
- Gemini integration through a Supabase Edge Function (keeps API key server-side)
- Modern React UI (Vite + TypeScript + Tailwind + shadcn/ui)

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth + Postgres (RLS policies)
- Supabase Edge Functions (Deno) for Gemini API

## Prerequisites
- Node.js (18+)
- Supabase account and project
- Google Gemini API key

## Local Setup
1) Install dependencies
```bash
npm i
```

2) Environment variables
Create `.env.local` in the project root:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Restart the dev server after adding/updating env vars.

3) Supabase: Auth provider (development)
- Supabase Dashboard → Auth → Providers → Email
  - Enable Email: ON
  - Allow password signups: ON
  - Enable email confirmations: OFF (dev only)
- Supabase Dashboard → Auth → URL Configuration
  - Site URL: http://localhost:5173

4) Database schema and RLS
Open Supabase SQL Editor and run the contents of `supabase/schema.sql`.
This creates:
- `profiles` (optional user profile)
- `assistants` (with `external_id` mapping frontend model id)
- `conversations`
- `messages`
- RLS policies restricting rows to the authenticated owner

5) Edge Function deployment (Gemini)
Install Supabase CLI if you haven’t:
```bash
npm install -g supabase
supabase login
```
Deploy the function:
```bash
supabase functions deploy openai-chat --project-ref your-project-ref
```
Set Gemini API key as a secret:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key --project-ref your-project-ref
```

6) Run the app
```bash
npm run dev
```
Open http://localhost:5173

## Using the App
1) Sign Up or Sign In (header updates to show your email and Sign Out)
2) Create an assistant and wait until it shows Ready
3) Open the assistant and start chatting
- The app will ensure a per-user `assistant` record exists (via `external_id`)
- It creates a `conversation` on first chat
- Each message round inserts rows into `messages`

## Troubleshooting
- “Supabase is NOT configured”: check `.env.local` and restart dev server
- No rows in tables:
  - Make sure you’re signed in (header shows your email)
  - In DevTools → Network, chat requests to `rest/v1/...` must include `Authorization: Bearer <token>`
  - Re-run `supabase/schema.sql` to ensure tables/RLS/GRANTs are applied
- Email confirmations still required:
  - Disable confirmations in Auth → Providers → Email, then delete the test user and sign up again
- Edge Function errors:
  - Ensure it’s deployed and `GEMINI_API_KEY` secret is set

## Project Structure (high level)
- `src/services/authService.ts`: Supabase auth helpers
- `src/services/dbService.ts`: CRUD helpers for assistants, conversations, messages
- `src/services/aiService.ts`: Domain guard + AI request flow via Edge Function
- `supabase/functions/openai-chat/`: Edge Function calling Gemini
- `supabase/schema.sql`: Tables, indices, RLS policies, grants

## License
MIT
