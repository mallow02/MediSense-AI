# MediSense AI 🇧🇩

**Intelligent Health Risk Assessment & Early Warning System for Bangladesh**

A glassmorphism-styled, Bangla-first healthcare web app built with React, Tailwind CSS, Recharts and Claude AI. Includes voice symptom input (Bangla + English), AI risk prediction, emergency detection, maternal health module, analytics dashboards, and a Judge Dashboard for ML explainability.

This guide assumes **zero prior experience**. Follow it top to bottom.

---

## 1. What's in this folder

```
medisense-ai/
├── api/
│   └── claude.js          ← secure backend proxy to Claude AI
├── public/
├── src/
│   ├── App.jsx             ← the entire app (all 8 pages)
│   ├── main.jsx            ← React entry point
│   └── index.css           ← Tailwind styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── .gitignore
```

You only ever need to edit `src/App.jsx` to change features, text, or styling.

---

## 2. Install the tools you need (one-time setup)

| Tool | Why you need it | Link |
|---|---|---|
| **Node.js** (v18 or v20 LTS) | Runs the project and `npm` commands | https://nodejs.org |
| **VS Code** | Code editor | https://code.visualstudio.com |
| **Git** | To push your code to GitHub for hosting | https://git-scm.com |
| **GitHub account** | Free, needed for Vercel hosting | https://github.com |

After installing Node.js, confirm it worked by opening a terminal and running:

```bash
node -v
npm -v
```

Both should print a version number.

---

## 3. Recommended VS Code extensions

Open VS Code → click the **Extensions** icon (left sidebar, looks like 4 squares) → search and install each:

1. **ES7+ React/Redux/React-Native Snippets** (`dsznajder`) — handy React shortcuts.
2. **Tailwind CSS IntelliSense** (`bradlc`) — autocomplete + color previews for Tailwind classes (this app uses Tailwind heavily).
3. **Prettier – Code formatter** (`esbenp`) — auto-formats your code so it stays clean.
4. **ESLint** (`dbaeumer`) — catches small JS mistakes as you type.
5. **Auto Rename Tag** (`formulahendry`) — renames matching JSX tags together.

That's all you need — no special "Vite extension" is required.

---

## 4. Get the project running locally

### Step 1 — Open the project
- Unzip the folder you downloaded.
- Open VS Code → **File → Open Folder** → select `medisense-ai`.

### Step 2 — Open a terminal inside VS Code
- Menu: **Terminal → New Terminal**

### Step 3 — Install dependencies
```bash
npm install
```
This downloads React, Tailwind, Recharts, lucide-react, etc. Takes ~30 seconds.

### Step 4 — Run the app
```bash
npm run dev
```
VS Code will print a local URL, usually:
```
http://localhost:5173
```
Ctrl+click it (or copy-paste into your browser) — your app is now running! 🎉

**Important:** The app works fully right now, even with zero setup, because it has a **built-in offline AI engine** (this is the "Rural Health Mode" feature). Symptom analysis, risk scores, emergency detection, and doctor recommendations all work instantly using local rules.

---

## 5. (Recommended) Turn on Claude AI for smarter answers

The app tries to call Claude AI first for richer, more natural Bangla explanations, and **automatically falls back to the offline engine** if Claude isn't available. To switch Claude on:

### Step 1 — Get a free Anthropic API key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to **Settings → API Keys → Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Add it to your project
- In the project root, copy `.env.example` and rename the copy to `.env`
- Open `.env` and paste your key:
```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```
- `.env` is already in `.gitignore`, so your key will **never** be uploaded to GitHub.

### Step 3 — Test it
The `/api/claude.js` function only runs on Vercel (or with the Vercel CLI), not with plain `npm run dev`. The easiest way to test it is to deploy first (Step 6 below) — once deployed with your key set, Claude AI is live automatically.

If you want to test it on your computer first:
```bash
npm install -g vercel
vercel dev
```
This runs the full app **including** the AI backend at `http://localhost:3000`.

---

## 6. Host it online for free (for your presentation)

We'll use **Vercel** — free, fast, gives you a public HTTPS link (needed for the microphone/voice feature to work).

### Step 1 — Push your code to GitHub
In your VS Code terminal:
```bash
git init
git add .
git commit -m "MediSense AI"
```
Then on https://github.com:
- Click **New repository** → name it `medisense-ai` → Create
- Copy the commands GitHub shows under "...or push an existing repository", e.g.:
```bash
git remote add origin https://github.com/YOUR-USERNAME/medisense-ai.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com → **Sign up with GitHub**
2. Click **Add New → Project**
3. Select your `medisense-ai` repo → **Import**
4. Vercel auto-detects "Vite" — leave settings as default
5. Open **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: *(your key from Step 5)*
6. Click **Deploy**

In about a minute you'll get a live link like:

```
https://medisense-ai-yourname.vercel.app
```

Share this link for your presentation — it has a real domain, HTTPS (so the microphone works), and the AI fully wired up.

> Made a change to `src/App.jsx`? Just `git add . && git commit -m "update" && git push` — Vercel redeploys automatically.

---

## 7. Quick troubleshooting

| Problem | Fix |
|---|---|
| Microphone button doesn't work | Voice input needs Chrome/Edge and HTTPS or `localhost`. Use the deployed Vercel link or `localhost`, not a plain IP address. |
| `npm install` fails | Make sure Node.js version is 18+ (`node -v`). Delete `node_modules` and `package-lock.json`, then retry. |
| Blank white page | Open browser DevTools (F12) → Console tab, and check for a red error — it usually points to a typo in `App.jsx`. |
| AI answers seem generic/rule-based | That's the offline engine — add your `ANTHROPIC_API_KEY` (Section 5) and redeploy for richer Claude responses. |
| Port 5173 already in use | Close other running `npm run dev` terminals, or restart VS Code. |

---

## 8. Tech stack recap

- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts + lucide-react icons
- **AI Layer:** Claude (via secure `/api/claude` serverless function) + custom offline rule-based engine (risk scoring, emergency detection, doctor matching, Bangla NLP symptom extraction)
- **Hosting:** Vercel (free tier) — static frontend + serverless API in one deploy

Everything else — all 8 pages, charts, voice input, emergency alerts, maternal module, and the Judge Dashboard — is untouched from the version you already reviewed. The only edits made were:
1. The footer now reads **"© 2026 All Rights Reserved"** instead of the hackathon label.
2. The Claude API call now goes through `/api/claude` so your key stays private and the app works outside Claude.ai.

Good luck with your presentation! 🏥🇧🇩
