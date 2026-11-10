import { BookOpen, CalendarClock, Clapperboard, Dumbbell, ListChecks } from 'lucide-react'

// Replace any `image` with your own link, or put a file in /public/images
// and use a path like '/images/evolve.jpg'. These are random placeholders.
// Images are shown in full, never cropped, so any shape works (16:9 looks tidiest).
export const CURRENTS = [
  { to: '/evolve', name: 'Evolve', sub: 'Movement & strength', Icon: Dumbbell, image: '/Evolve.jpeg' },
  { to: '/ritual', name: 'Ritual', sub: 'Daily planning', Icon: ListChecks, image: '/Ritual.jpeg' },
  { to: '/chronos', name: 'Chronos', sub: 'Time & habits', Icon: CalendarClock, image: '/CHRONOS.jpeg' },
  { to: '/mentis', name: 'Mentis', sub: 'Reading & knowledge', Icon: BookOpen, image: '/Mentis.jpeg' },
  { to: '/celluloid', name: 'Celluloid', sub: 'Stories & watchlist', Icon: Clapperboard, image: 'Celluloid.jpeg' }
]
