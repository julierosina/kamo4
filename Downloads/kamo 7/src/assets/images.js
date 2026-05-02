// src/assets/images.js
// Centralised image paths — uses Vite BASE_URL so paths work on GitHub Pages
// Usage: import { IMG } from '../assets/images.js'  →  <img src={IMG.wave} />

const base = import.meta.env.BASE_URL  // '/' in dev, './' or '/repo/' on GH Pages

const img = (name) => `${base}${name}`

export const IMG = {
  wave:     img('kamo-wave.png'),
  laptop:   img('kamo-laptop.png'),
  phone:    img('kamo-phone.png'),
  shield:   img('kamo-shield.png'),
  id:       img('kamo-id.png'),
  warning:  img('kamo-warning.png'),
  zen:      img('kamo-zen.png'),
  idea:     img('kamo-idea.png'),
  umbrella: img('kamo-umbrella.png'),
  book:     img('kamo-book.png'),
}
