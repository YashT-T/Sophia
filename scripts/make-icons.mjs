// Usage: npm run icons            (reads public/icon.jpeg)
//        npm run icons -- path/to/logo.png
// Makes every icon the app needs from ONE logo image (square, at least 512x512 is best).
import sharp from 'sharp'
import { existsSync } from 'node:fs'

const SRC = process.argv[2] || 'public/icon.jpeg'
const BG = '#F4EEE3' // only shows if your logo has transparent parts

if (!existsSync(SRC)) {
  console.error(`Logo not found at ${SRC}. Save your logo there, or run: npm run icons -- path/to/logo.png`)
  process.exit(1)
}

const fill = (n) => sharp(SRC).resize(n, n, { fit: 'cover', position: 'centre' }).flatten({ background: BG })
const circle = (n) => Buffer.from(`<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="#fff"/></svg>`)

// 1) Round icons (transparent corners): browser tab, desktop, Android fallback
for (const n of [192, 512]) {
  await fill(n).ensureAlpha().composite([{ input: circle(n), blend: 'dest-in' }]).png().toFile(`public/icon-${n}.png`)
}
// 2) Maskable: logo fills the WHOLE square. Android's launcher cuts it to its own shape (a circle on most phones).
await fill(512).png().toFile('public/icon-maskable-512.png')
// 3) iPhone: a full square. iOS always rounds the corners itself.
await fill(180).png().toFile('public/apple-touch-icon.png')

console.log('Done. Written to /public: icon-192.png, icon-512.png (round), icon-maskable-512.png, apple-touch-icon.png')