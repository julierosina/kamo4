// src/components/LevelBadge.jsx
import React from 'react'

export const LEVELS = [
  { min: 0,  max: 20,  level: 1, name: 'Novice',   color: 'var(--kamo-red)' },
  { min: 20, max: 40,  level: 2, name: 'Apprenti', color: 'var(--kamo-orange)' },
  { min: 40, max: 60,  level: 3, name: 'Discret',  color: 'var(--kamo-blue-act)' },
  { min: 60, max: 80,  level: 4, name: 'Fantôme',  color: 'var(--kamo-violet)' },
  { min: 80, max: 101, level: 5, name: 'Caméléon', color: 'var(--kamo-green)' },
]

export function getLevel(score) {
  return LEVELS.find(l => score >= l.min && score < l.max) || LEVELS[0]
}

export function getGlobalScore(scores) {
  const v = Object.values(scores)
  return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0
}

export default function LevelBadge({ score, size = 'md' }) {
  const lvl = getLevel(score)
  const pad = size === 'lg' ? '12px 24px' : size === 'sm' ? '3px 10px' : '7px 16px'
  const fs = size === 'lg' ? 18 : size === 'sm' ? 12 : 14

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: `${lvl.color}18`, border: `2px solid ${lvl.color}40`,
      borderRadius: 100, padding: pad,
    }}>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: fs, color: lvl.color }}>
        {lvl.name}
      </span>
    </div>
  )
}
