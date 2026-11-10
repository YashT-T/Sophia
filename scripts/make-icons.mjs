// Usage: npm run icons            (reads public/icon.jpeg)
//        npm run icons -- path/to/logo.png
import sharp from 'sharp'
import { existsSync } from 'node:fs'

const SRC = process.argv[2] || 'public/icon.jpeg'
const BG = '#F4EEE3' // background behind the logo on the maskable icon

if (!existsSync(SRC)) {
  console.error(`Logo not found at ${SRC}. Save your logo there, or run: npm run icons -- path/to/logo.png`)
  process.exit(1)
}
const square = (n) => sharp(SRC).resize(n, n, { fit: 'cover', position: 'centre' }).png()

await square(192).toFile('public/icon-192.png')
await square(512).toFile('public/icon-512.png')
await square(180).toFile('public/apple-touch-icon.png') // iPhone home screen

// Maskable: logo at ~66% on a solid square, so Android's round/squircle mask never cuts it off
const inner = await sharp(SRC).resize(338, 338, { fit: 'cover' }).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
  .composite([{ input: inner, gravity: 'centre' }]).png().toFile('public/icon-maskable-512.png')

console.log('Done: icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png written to /public')
