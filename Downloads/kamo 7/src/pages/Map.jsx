import { IMG } from '../assets/images.js'
// src/pages/Map.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useKamo } from '../context/KamoContext.jsx'
import { THEMES, getThemeProgress } from '../data/themes.js'

const F = 'var(--font)'

// Isometric SVG background map
function IsoMapBackground() {
  return (
    <svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gnd" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8fc" />
          <stop offset="100%" stopColor="#d8d8f5" />
        </linearGradient>
      </defs>

      {/* Ground plane */}
      <polygon points="450,20 900,230 450,400 0,230" fill="url(#gnd)" />

      {/* Grid lines */}
      {[1,2,3,4,5,6,7,8].map(i => (
        <g key={i} opacity="0.18">
          <line x1={i * 100} y1={230 - i * 26} x2={i * 100} y2={400 - i * 26}
            stroke="#6a6af4" strokeWidth="1" />
          <line x1={0 + i * 56} y1={230 - i * 0} x2={900 - i * 56} y2={400 - i * 0}
            stroke="#6a6af4" strokeWidth="1" />
        </g>
      ))}

      {/* Isometric blocks - city buildings */}
      {/* Block 1 - La Banque */}
      <g opacity="0.7">
        <polygon points="160,155 220,122 280,155 220,188" fill="#b8d4f8" />
        <polygon points="160,155 160,210 220,243 220,188" fill="#6b9ed4" />
        <polygon points="280,155 280,210 220,243 220,188" fill="#5080b8" />
      </g>
      {/* Block 2 - La Tour */}
      <g opacity="0.7">
        <polygon points="370,100 430,67 490,100 430,133" fill="#aef5f0" />
        <polygon points="370,100 370,200 430,233 430,133" fill="#34BAB5" />
        <polygon points="490,100 490,200 430,233 430,133" fill="#009099" />
      </g>
      {/* Block 3 - Le Port */}
      <g opacity="0.7">
        <polygon points="550,160 610,127 670,160 610,193" fill="#ffd3b0" />
        <polygon points="550,160 550,200 610,233 610,193" fill="#fc8c40" />
        <polygon points="670,160 670,200 610,233 610,193" fill="#d64d00" />
      </g>
      {/* Block 4 - La Place */}
      <g opacity="0.7">
        <polygon points="260,240 320,207 380,240 320,273" fill="#e8c8f0" />
        <polygon points="260,240 260,280 320,313 320,273" fill="#c070d0" />
        <polygon points="380,240 380,280 320,313 320,273" fill="#a558a0" />
      </g>
      {/* Block 5 - Laboratoire */}
      <g opacity="0.7">
        <polygon points="490,220 550,187 610,220 550,253" fill="#b8f0d0" />
        <polygon points="490,220 490,260 550,293 550,253" fill="#40c070" />
        <polygon points="610,220 610,260 550,293 550,253" fill="#1f8d49" />
      </g>

      {/* Roads / paths */}
      <g opacity="0.3" stroke="#6a6af4" strokeWidth="2" fill="none">
        <line x1="220" y1="188" x2="320" y2="273" />
        <line x1="430" y1="133" x2="320" y2="273" />
        <line x1="610" y1="193" x2="550" y2="253" />
        <line x1="430" y1="233" x2="550" y2="253" />
        <line x1="320" y1="273" x2="550" y2="253" />
      </g>

      {/* Trees / decoration */}
      {[[120, 280], [700, 200], [800, 280], [80, 200]].map(([x, y], i) => (
        <g key={i} opacity="0.5">
          <ellipse cx={x} cy={y - 18} rx={14} ry={10} fill="#1f8d49" />
          <line x1={x} y1={y - 10} x2={x} y2={y + 5} stroke="#18753c" strokeWidth="3" />
        </g>
      ))}
    </svg>
  )
}

export default function Map() {
  const { state } = useKamo()
  const navigate = useNavigate()

  return (
    <div style={S.page}>
      {/* Isometric map background */}
      <div style={S.mapBg}>
        <IsoMapBackground />
      </div>

      <div style={S.inner}>
        <motion.div style={S.header} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: 'var(--kamo-navy)', marginBottom: 4, letterSpacing: '-1px' }}>
            La Carte
          </h1>
          <p style={{ fontFamily: F, fontSize: 14, color: '#666' }}>
            Explore chaque lieu pour progresser et collecter des mouches
          </p>
        </motion.div>

        <div style={S.grid}>
          {THEMES.map((theme, i) => {
            const prog = getThemeProgress(theme.id, state.completedTasks)
            const isDone = prog === 1
            const total = theme.sections.reduce((a, s) => a + s.tasks.length, 0)
            const done = Math.round(prog * total)

            return (
              <motion.div key={theme.id} style={{ ...S.card, '--border': theme.color }}
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -7, boxShadow: `0 20px 48px ${theme.color}28` }}
                onClick={() => navigate(`/map/${theme.id}`)}>

                {/* Top color strip */}
                <div style={{ height: 5, background: theme.color, borderRadius: '16px 16px 0 0', margin: '-20px -20px 16px' }} />

                {isDone && (
                  <motion.div style={S.donePill} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 size={12} color="var(--kamo-green)" />
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: 'var(--kamo-green)' }}>Complété</span>
                  </motion.div>
                )}

                <div style={{ ...S.iconCircle, background: `${theme.color}18`, border: `2px solid ${theme.color}35` }}>
                  <img
                    src={THEME_IMAGES[theme.id] || IMG.wave}
                    alt={theme.name}
                    style={{ width: 52, height: 52, objectFit: 'contain' }}
                  />
                </div>

                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--kamo-navy)', marginBottom: 3 }}>
                  {theme.name}
                </h3>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                  {theme.subtitle}
                </p>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: F, fontSize: 11, color: '#aaa' }}>{done}/{total} tâches</span>
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: theme.color }}>{Math.round(prog * 100)}%</span>
                  </div>
                  <div style={{ height: 5, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: theme.color, borderRadius: 3 }}
                      initial={{ width: 0 }} animate={{ width: `${prog * 100}%` }} transition={{ duration: 0.7, delay: i * 0.07 }} />
                  </div>
                </div>

                <div style={{ ...S.ctaBtn, background: isDone ? `${theme.color}15` : theme.color, color: isDone ? theme.color : 'white' }}>
                  {isDone ? 'Revoir' : prog > 0 ? 'Continuer' : 'Explorer'}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div style={S.legend} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <img src={IMG.wave} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <p style={{ fontFamily: F, fontSize: 13, color: '#888' }}>
            Chaque tâche complétée = +1 mouche · Complète tous les thèmes pour devenir Caméléon
          </p>
        </motion.div>
      </div>
    </div>
  )
}

const THEME_IMAGES = {
  banque: IMG.phone,
  tour:   IMG.umbrella,
  port:   IMG.warning,
  place:  IMG.id,
  labo:   IMG.idea,
}

const S = {
  page: { minHeight: '100vh', background: 'var(--kamo-bg)', padding: '24px 16px 40px', position: 'relative' },
  mapBg: { position: 'fixed', top: 68, left: 0, right: 0, height: 260, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' },
  inner: { maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { marginBottom: 24, paddingTop: 8 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18, marginBottom: 28 },
  card: {
    background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)',
    borderRadius: 16, padding: '20px',
    cursor: 'pointer', boxShadow: '0 4px 20px rgba(106,106,244,0.1)',
    border: '1px solid rgba(106,106,244,0.1)', transition: 'all 0.2s',
  },
  donePill: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid rgba(31,141,73,0.2)', borderRadius: 20, padding: '3px 10px', marginBottom: 10 },
  iconCircle: { width: 70, height: 70, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  ctaBtn: { display: 'block', textAlign: 'center', borderRadius: 10, padding: '10px', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 13, transition: 'all 0.2s' },
  legend: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 20px' },
}
