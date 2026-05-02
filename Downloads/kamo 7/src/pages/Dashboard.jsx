import { IMG } from '../assets/images.js'
// src/pages/Dashboard.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, RefreshCw, ChevronRight, Zap } from 'lucide-react'
import { useKamo } from '../context/KamoContext.jsx'
import { getLevel, getGlobalScore, LEVELS } from '../components/LevelBadge.jsx'
import { BADGE_DEFS } from '../context/KamoContext.jsx'
import LeakRepair from '../components/LeakRepair.jsx'

const F = 'var(--font)'

const CATEGORIES = [
  { key: 'passwords', label: 'Mots de passe & Accès',         themeId: 'banque' },
  { key: 'networks',  label: 'Réseaux & Connexions',           themeId: 'tour' },
  { key: 'phishing',  label: 'Phishing & Arnaques',            themeId: 'port' },
  { key: 'privacy',   label: 'Vie privée & Réseaux sociaux',   themeId: 'place' },
  { key: 'tools',     label: 'Outils & Bonnes pratiques',      themeId: 'labo' },
]

export default function Dashboard() {
  const { state, dispatch } = useKamo()
  const { scores, emailCheckResult, flies, badges } = state
  const navigate = useNavigate()
  const [showLeakRepair, setShowLeakRepair] = useState(false)

  const globalScore = getGlobalScore(scores)
  const globalLevel = getLevel(globalScore)
  const hasLeaks = emailCheckResult?.leaks?.length > 0
  const suggestions = buildSuggestions(scores)

  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* Leak banner */}
        {hasLeaks && (
          <motion.div style={S.leakBanner} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={IMG.warning} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              <span style={{ fontFamily: F, fontSize: 13, color: 'var(--kamo-navy)' }}>
                Ton email a été détecté dans <strong>{emailCheckResult.leaks.length}</strong> fuite(s) de données.
              </span>
            </div>
            <button style={S.leakBtn} onClick={() => setShowLeakRepair(true)}>
              Réparer <ChevronRight size={13} />
            </button>
          </motion.div>
        )}

        {/* Level hero */}
        <motion.div style={{ ...S.hero, position: 'relative', overflow: 'hidden' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 90% 10%, ${globalLevel.color}20, transparent 60%)`, borderRadius: 20 }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <img src={IMG.wave} alt="Kamo" style={{ width: 70, height: 70, objectFit: 'contain' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                Ton niveau de camouflage
              </p>
              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: globalLevel.color, marginBottom: 2, letterSpacing: '-1px' }}>
                {globalLevel.name}
              </h1>
              <p style={{ fontFamily: F, fontSize: 13, color: '#888' }}>Score global : {globalScore}%</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 20 }}>🪰</span>
                <span style={{ fontFamily: F, fontWeight: 900, fontSize: 28, color: 'var(--kamo-violet)' }}>{flies}</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 11, color: '#aaa' }}>mouches collectées</p>
            </div>
          </div>
          {globalLevel.level < 5 && (
            <div style={{ marginTop: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ height: 7, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: globalLevel.color, borderRadius: 4 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((globalScore - globalLevel.min) / (LEVELS[globalLevel.level]?.min - globalLevel.min || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }} />
              </div>
              <p style={{ fontFamily: F, fontSize: 11, color: '#aaa', marginTop: 4 }}>
                Prochain niveau : {LEVELS[globalLevel.level]?.name} à {LEVELS[globalLevel.level]?.min}%
              </p>
            </div>
          )}
        </motion.div>

        {/* Scores */}
        <section style={S.section}>
          <h2 style={S.sectionTitle}>Scores par catégorie</h2>
          <div style={S.grid}>
            {CATEGORIES.map(({ key, label, themeId }, i) => {
              const v = scores[key] || 0
              const lvl = getLevel(v)
              return (
                <motion.div key={key} style={S.scoreCard}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(106,106,244,0.15)' }}
                  onClick={() => navigate(`/map/${themeId}`)}>
                  <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: 'var(--kamo-navy)', marginBottom: 8 }}>{label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: lvl.color }}>{lvl.name}</span>
                  </div>
                  <div style={{ height: 5, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: lvl.color, borderRadius: 3 }}
                      initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }} />
                  </div>
                  <p style={{ fontFamily: F, fontSize: 11, color: '#aaa', marginTop: 4, textAlign: 'right' }}>{v}%</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Trophies */}
        <section style={S.section}>
          <h2 style={S.sectionTitle}>Trophées</h2>
          <div style={S.badgeGrid}>
            {BADGE_DEFS.map((def, i) => {
              const earned = badges.find(b => b.id === def.id)
              return (
                <motion.div key={def.id}
                  style={{ ...S.badge, opacity: earned ? 1 : 0.4, border: earned ? '2px solid rgba(106,106,244,0.25)' : '2px solid #e5e5e5' }}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: earned ? 1 : 0.4, y: 0 }} transition={{ delay: 0.05 * i }}
                  whileHover={earned ? { scale: 1.04 } : {}}>
                  <img src={def.icon} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                  <p style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: earned ? 'var(--kamo-navy)' : '#bbb', textAlign: 'center', marginTop: 6, lineHeight: 1.3 }}>
                    {def.label}
                  </p>
                  <p style={{ fontFamily: F, fontSize: 11, color: '#bbb', textAlign: 'center', lineHeight: 1.3 }}>{def.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Next steps */}
        {suggestions.length > 0 && (
          <section style={S.section}>
            <h2 style={{ ...S.sectionTitle, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={17} color="var(--kamo-orange)" /> Prochaines étapes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestions.map((s, i) => (
                <motion.div key={i} style={S.suggestion}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  whileHover={{ x: 4 }} onClick={() => navigate(`/map/${s.themeId}`)}>
                  <img src={s.img} alt="" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'var(--kamo-navy)', marginBottom: 2 }}>{s.title}</p>
                    <p style={{ fontFamily: F, fontSize: 12, color: '#888' }}>{s.text}</p>
                  </div>
                  <ChevronRight size={16} color="var(--kamo-violet)" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button style={S.resetBtn} onClick={() => dispatch({ type: 'RESET_ONBOARDING' })}>
            <RefreshCw size={13} /> Refaire le diagnostic
          </button>
        </div>
      </div>

      {showLeakRepair && <LeakRepair leaks={emailCheckResult?.leaks} onClose={() => setShowLeakRepair(false)} />}
    </div>
  )
}

function buildSuggestions(scores) {
  const list = []
  if ((scores.passwords || 0) < 50) list.push({ img: IMG.phone, themeId: 'banque', title: 'Renforce tes mots de passe', text: 'Installe un gestionnaire de mots de passe' })
  if ((scores.networks || 0) < 50) list.push({ img: IMG.umbrella, themeId: 'tour', title: 'Sécurise tes connexions', text: 'Protège-toi sur les réseaux publics' })
  if ((scores.phishing || 0) < 60) list.push({ img: IMG.warning, themeId: 'port', title: 'Entraîne-toi au phishing', text: 'Reconnaître les emails frauduleux' })
  if ((scores.privacy || 0) < 50) list.push({ img: IMG.id, themeId: 'place', title: 'Protège ta vie privée', text: 'Configure tes paramètres de confidentialité' })
  return list.slice(0, 3)
}

const S = {
  page: { minHeight: '100vh', background: 'var(--kamo-bg)', padding: '24px 16px 40px' },
  inner: { maxWidth: 720, margin: '0 auto' },
  leakBanner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: '#fff5f5', border: '1.5px solid rgba(201,25,30,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 },
  leakBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'var(--kamo-red)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 },
  hero: { background: 'white', borderRadius: 20, padding: '24px', marginBottom: 20, boxShadow: '0 4px 24px rgba(106,106,244,0.1)', border: '1px solid rgba(106,106,244,0.1)' },
  section: { marginBottom: 28 },
  sectionTitle: { fontFamily: 'var(--font)', fontWeight: 800, fontSize: 18, color: 'var(--kamo-navy)', marginBottom: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  scoreCard: { background: 'white', borderRadius: 14, padding: '16px', border: '1px solid rgba(106,106,244,0.1)', boxShadow: '0 2px 12px rgba(106,106,244,0.06)', cursor: 'pointer', transition: 'all 0.2s' },
  badgeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 },
  badge: { background: 'white', borderRadius: 14, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  suggestion: { background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(106,106,244,0.1)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 2px 10px rgba(106,106,244,0.06)', transition: 'all 0.18s' },
  resetBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #ddd', borderRadius: 8, padding: '8px 16px', fontFamily: 'var(--font)', fontSize: 12, color: '#aaa', cursor: 'pointer' },
}
