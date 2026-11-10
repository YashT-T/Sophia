# Sophia — "A life, in orbit."

A personal life dashboard built with **React + Vite + Supabase**, installable on your phone as an app (PWA).
Five currents: **Evolve** (workouts), **Ritual** (daily tasks), **Chronos** (calendar, reminders, habits),
**Mentis** (PDF reading), **Celluloid** (watchlist). Light and dark themes. Design details live in [DESIGN.md](DESIGN.md).

---

## 1. First-time setup

### A. Supabase (database + login + file storage)
1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor** → paste the whole of `supabase/schema.sql` → **Run**.
3. **Authentication → Providers → Email**: turn **off** "Confirm email" while testing (turn it back on later).
4. **Project Settings → API**: copy the *Project URL* and the *anon public* key.

> Already ran an older `schema.sql`? Run `supabase/migration-daily-plan.sql` once as well (safe to run even if unsure).

### B. Run it on your computer
```bash
cp .env.example .env        # Windows: copy .env.example .env
# open .env and paste your Supabase URL + anon key
npm install
npm run dev                 # opens http://localhost:5173
```
Sign up on the login page and you're in.

---

## 2. Make it yours

| What | Where |
|---|---|
| Home-page card images | `src/config/currents.js` (any link, or a file in `public/images/`) |
| Navbar logo | `src/config/brand.js` (default `/icon.jpeg` in `public/`) |
| XP difficulty (level gaps) | top of `src/lib/xp.js` — `BASE_GAP`, `GAP_GROWTH` |
| XP reward / penalty (+2 / −4) | top of `src/lib/xp.js` — `REWARD`, `PENALTY` |
| Weekdays that add no workout (Rest, Open) | `src/lib/plan.js` — `SKIP_LABELS` |
| Default minutes for plan workouts | `src/hooks/useDailyPlanTask.js` — `DEFAULT_MINUTES` |
| Colours (light + dark) | `src/styles/index.css` (tokens at the top), chart colours in `src/components/evolve/TrainingChart.jsx` |
| Font | `index.html` (Google Fonts link) + `font-family` in `src/styles/index.css` |
| Start in dark by default | `src/context/ThemeContext.jsx` (see the comment in `initial()`) |

The **theme button** (sun/moon, top bar) switches light/dark and remembers your choice.

---

## 3. Put it online (Vercel)
1. Push the project to GitHub (`.env` is git-ignored, so your keys stay private).
2. <https://vercel.com> → **Add New → Project** → import the repo (Vite is detected automatically).
3. **Environment Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` → **Deploy**.
4. Supabase → **Authentication → URL Configuration**: add your Vercel URL to *Site URL* / *Redirect URLs*.
5. Vercel → **Project Settings → Deployment Protection**: turn it **off** (it blocks the manifest the phone needs).

Always share and install from the **production** URL (`yourapp.vercel.app`), never a preview URL.

---

## 4. Install on your phone (with YOUR icon, no Chrome icon)

### Step 1 — build the icons from your logo (one time, on your computer)
Save your logo as `public/icon.jpeg` (a square image, at least 512×512, works best), then:
```bash
npm run icons
```
This writes `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and `apple-touch-icon.png` into `public/`.
Other file? `npm run icons -- path/to/logo.png`. Then **redeploy** (commit + push).

### Step 2 — remove the old install, then install again
The phone keeps the old icon until the old install is gone.
- **Android (Chrome):** long-press the old icon → Uninstall/Remove. Chrome → ⋮ → Settings → Site settings → your site → *Clear & reset*. Open the production URL → ⋮ → **Install app**.
- **iPhone (Safari only):** delete the old home-screen icon. Open the production URL in **Safari** → Share → **Add to Home Screen**.

### Why the Chrome icon appears
- **Android:** if the menu says **"Add to Home screen"** (a shortcut) instead of **"Install app"**, you get a shortcut with a small Chrome badge, and it opens with the browser bar. Chrome only offers *Install app* when the manifest and icons are valid and reachable. The usual blockers: Vercel Deployment Protection (manifest returns a login page), no valid PNG icons, or a stale cached install. Steps 1–2 above fix all three.
- **iPhone:** iOS ignores the manifest icons and uses `apple-touch-icon.png`. A missing one gives a blank or screenshot icon.
- **Check it:** open `https://YOUR-SITE/manifest.webmanifest` — you must see JSON, not a login page or 404. On desktop Chrome: DevTools → **Application → Manifest** lists any icon or installability errors.

---

## 5. How the rules work
- **XP:** finish an item on time = **+2 XP**. Miss its deadline = **−4 XP**, charged once. Finishing late gives no reward. XP never goes below 0.
- **Levels:** Level 2 at 400 XP, then the gaps grow by 200 (L3 1000, L4 1800, L5 2800…). Tap the XP bar on Home to see them.
- **Ritual:** tasks have a date and time. Status is *Completed*, *In progress* (due within 3 hours), *Pending* or *Overdue*. Sorted overdue → in progress → pending → completed.
- **Evolve:** "The week ahead" is editable (pencil → Save). Each day, that weekday's plan is added to Today's movement as a workout. Workouts have no deadline, so no penalty.
- **Chronos:** reminders can pop up a notification or ring (sound + vibration). They fire **while the app is open**; a website cannot ring when fully closed without push notifications.
- **Mentis:** upload PDFs from your device into editable categories; marking one read gives +2 XP, missing its date costs −4.
- **Celluloid:** watchlist → mark watched (+2 XP), grouped by month.

---

## 6. Troubleshooting
| Problem | Fix |
|---|---|
| Blank page after deploy | Add the two env vars on Vercel, then redeploy |
| Login works locally, not on Vercel | Add the Vercel URL in Supabase → Authentication → URL Configuration |
| "relation … does not exist" | `schema.sql` wasn't run in full |
| Week plan or daily workout won't save | Run `supabase/migration-daily-plan.sql`; check the browser console for the exact error |
| Old UI after redeploy | Hard refresh (Ctrl+Shift+R); or DevTools → Application → Service Workers → Unregister |
| Logo missing in the top bar | The file must be in `public/` and match `src/config/brand.js` exactly (case and extension) |
| Reminders silent on phone | Allow notifications for the installed app; keep the app open |

## 7. Project structure
```
src/
  pages/        Login, Dashboard, Evolve, Ritual, Chronos, Mentis, Celluloid
  components/   shared (Modal, Navbar, Avatar, XpBar…) + evolve/ ritual/ chronos/ mentis/ celluloid/
  context/      AuthContext, ProfileContext (XP), ThemeContext
  hooks/        useTable, useCompletion, useOverduePenalty, useDailyPlanTask, useTick
  config/       currents.js (card images), brand.js (logo)
  lib/          supabase.js, xp.js, time.js, plan.js
  styles/       index.css (all tokens + styles)
supabase/       schema.sql, migration-daily-plan.sql
scripts/        make-icons.mjs
public/         icons, your logo
```
