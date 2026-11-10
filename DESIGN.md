# Sophia — Design System

Mood: a quiet paper journal. Warm parchment by day, lamplit espresso by night, one persimmon accent.

## 1. Principles
1. **Quiet, tactile, calm.** Soft copy ("Today, gently."), few things per screen, chunky outlined cards with a hard offset shadow.
2. **Phone first.** Designed for a ~380px screen; desktop is the same layout, wider.
3. **One accent.** Blue in light, cyan in dark. Colour carries meaning: red = overdue, amber = in progress, green = completed.
4. **Nothing cropped.** Card images always show in full at their own shape.

## 2. Colour tokens (`src/styles/index.css`)
Components never use raw hex; they use these tokens, and the theme swaps their values.

| Token | Light "Parchment & Persimmon" | Dark "Espresso & Persimmon" | Used for |
|---|---|---|---|
| `--bg` | `#F4EEE3` parchment | `#16110E` espresso | page background |
| `--card` | `#FFFBF3` | `#211A16` | card surface |
| `--ink` | `#2A1F1A` | `#F4EBDD` | text, strong fills |
| `--line` | `#2A1F1A` | `#CDBBA2` tan | borders |
| `--rule` | `#2A1F1A` | `#CDBBA244` | dividers (nav, week rows) |
| `--blue` (the accent) | `#B84A22` persimmon | `#F28C5B` | accent, primary buttons, selected, links |
| `--on-accent` | `#FFFFFF` | `#16110E` | text on accent |
| `--soft` | `#EDE3D2` | `#2D241E` | inputs, list rows, tracks |
| `--muted` | `#7A6A5C` | `#B3A28F` | secondary text |
| `--shadow` | `#2A1F1A` | `#6B3118` burnt rust | card hard shadow |
| `--red` / `--amber` / `--green` | `#A32D2D` / `#A8691A` / `#3F7D4E` | `#FF8F8A` / `#F2C265` / `#8FD3A0` | status |
| `--fill` | `#B84A22 → #E0A03A` | `#F28C5B → #F2C265` | XP bar gradient |

Soft glows: a warm sun top-right in light, a lamp glow bottom-right in dark.
Chart: muted clay bars with today in the accent gradient (colours in `TrainingChart.jsx`).
Phone status bar and splash: `#F4EEE3` light / `#16110E` dark (`ThemeContext.jsx`, `vite.config.js`).
The token is still named `--blue` for historical reasons; it now holds the persimmon accent.

## 3. Typography
- **PT Serif** (400, 700, italic 400) — everything.
- **Dancing Script** (600/700) — only the brand name "Sophia" and the user's name in the greeting.
- Scale: page title 2.6rem/700 · home headline 3rem (2.3rem on phones) · card heading 1.2–1.35rem/700 · body 1rem · labels `small` .68rem, 700, uppercase, letter-spaced.

## 4. Shape and spacing
- Cards: **1.5px** border, radius **14px**, shadow **4px 4px 0** (hard, no blur), padding 16px.
- Inner controls (buttons, inputs, rows, images): radius **10px**; chips and pills: fully rounded.
- Page: max-width 880px, side padding 16px, gap 18px between blocks; grid gap 16px.
- Breakpoint **720px**: every grid becomes one column, the nav hides page links (the home cards are the navigation), headline shrinks.

## 5. Components
| Component | Spec |
|---|---|
| Navbar | sticky, logo + cursive "Sophia", theme toggle, log out; page links on wide screens |
| Home card | full-width image (natural ratio, never cropped), icon, name, one-line subtitle; one per line on phones |
| Avatar | circle; photo is absolutely positioned so it can't stretch the box; camera badge when editable |
| XP bar | level, XP / next threshold, track; tap opens the level-threshold pop-up |
| Button | uppercase 0.72rem/800; default = soft, `.primary` = accent; `.small` for inline actions |
| Chip | pill filter; selected = ink fill |
| List item | soft row, checkbox, title, status pill, edit and delete icon buttons; left border colour = status |
| Status pill | Completed (green tint), In progress (amber tint), Pending (soft), Overdue (red fill) |
| Modal | centred card on a dimmed overlay; all add/edit forms use it |
| Week plan | one pencil edits all seven days; Save / Cancel appear while editing |
| Chart | rounded gradient bars, today highlighted, dashed 30-minute goal line, themed colours |

## 6. Page specs
- **Login:** one card; log in or create account (name, email, password).
- **Home:** profile card (avatar, greeting, XP bar) → "A life, in orbit." → five image cards → "Today, gently." summary → level pop-up on XP tap.
- **Evolve:** stats (today's activities, completion %, XP) → Today's movement + The week ahead → training chart.
- **Ritual:** stats (pending, completed, overdue) → task list with date + time form, priority sorted.
- **Chronos:** month calendar with reminder dots + reminders for the selected day → habit streaks.
- **Mentis:** category chips (editable) → "On your desk" PDF list with finish-by dates.
- **Celluloid:** watchlist / watched tabs, format filter, cards grouped by month when watched.

## 7. Behaviour rules
- **XP:** on time +2; deadline missed −4 (once per item); late finish earns nothing; never below 0.
- **Levels:** `levelStart(n)` = sum of gaps; first gap 400, each next gap +200.
- **Task status:** done → Completed; past due → Overdue; due within 3 h → In progress; else Pending.
- **Daily plan:** each day the weekday's plan is added to Evolve as a workout (once; hidden if deleted); Rest/Open/empty add nothing.
- **Reminders:** poll every 10 s while the app is open; "ring" loops a beep with vibration until dismissed.

## 8. Accessibility and motion
- Icon-only buttons have `aria-label`s; text uses the `--ink` on `--bg` pairing in both themes for strong contrast.
- Native pickers follow the theme (`color-scheme`).
- Motion is limited to the XP bar fill; no decorative animation.

## 9. Data model (Supabase)
`profiles` (name, avatar, xp) · `tasks` · `workouts` (+ `plan_date`, `hidden`) · `week_plan` (day, label) · `reminders` · `habits` · `categories` · `pdfs` · `titles`.
Every table is row-level-secured to its owner. Buckets: `avatars` (public), `pdfs` (private).
