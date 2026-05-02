import { IMG } from '../assets/images.js'
// src/components/LeakRepair.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Circle } from 'lucide-react'

const ACTIONS = [
  "Changer le mot de passe du compte concerné",
  "Activer la double authentification sur ce compte",
  "Vérifier si d'autres comptes utilisent le même mot de passe",
  "Surveiller tes emails pour des connexions suspectes",
  "Utiliser l'outil de plainte dans la section Outils",
]

const F = 'var(--font)'

export default function LeakRepair({ leaks, onClose }) {
  const [checked, setChecked] = useState({})
  const toggle = (i) => setChecked(c => ({ ...c, [i]: !c[i] }))
  const done = Object.values(checked).filter(Boolean).length

  return (
    <motion.div style={S.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div style={S.modal} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', damping: 26 }} onClick={e => e.stopPropagation()}>

        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={IMG.warning} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            <div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: 'var(--kamo-navy)' }}>Ta fuite de données</h2>
              <p style={{ fontFamily: F, fontSize: 13, color: '#888' }}>Actions recommandées</p>
            </div>
          </div>
          <button style={S.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {leaks?.length > 0 && (
          <div style={S.section}>
            <p style={S.sectionLabel}>Fuites détectées</p>
            {leaks.map((l, i) => (
              <div key={i} style={S.leakCard}>
                <span style={{ fontFamily: F, fontWeight: 700, color: 'var(--kamo-red)', fontSize: 14 }}>{l.name}</span>
                <span style={{ fontFamily: F, fontSize: 12, color: '#888', marginTop: 2 }}>{l.year} · {l.dataTypes.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        <div style={S.section}>
          <p style={S.sectionLabel}>Actions à effectuer {done > 0 && <span style={{ color: 'var(--kamo-green)' }}>{done}/{ACTIONS.length}</span>}</p>
          {ACTIONS.map((a, i) => (
            <motion.button key={i} style={{ ...S.actionRow, background: checked[i] ? '#f0fdf4' : 'white', borderColor: checked[i] ? 'var(--kamo-green)' : '#e5e5f0' }}
              onClick={() => toggle(i)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <span style={{ color: checked[i] ? 'var(--kamo-green)' : '#ccc', flexShrink: 0 }}>
                {checked[i] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </span>
              <span style={{ fontFamily: F, fontSize: 13, flex: 1, textAlign: 'left', color: checked[i] ? 'var(--kamo-green-dark)' : 'var(--kamo-navy)', textDecoration: checked[i] ? 'line-through' : 'none', opacity: checked[i] ? 0.7 : 1 }}>
                {a}
              </span>
            </motion.button>
          ))}
        </div>

        <button style={S.closeButton} onClick={onClose}>Fermer</button>
      </motion.div>
    </motion.div>
  )
}

const S = {
  overlay: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(33,33,63,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end' },
  modal: { width: '100%', maxWidth: 560, margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '28px 24px 40px', maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  closeBtn: { background: '#f0f0f8', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' },
  section: { marginBottom: 20 },
  sectionLabel: { fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, display: 'flex', gap: 6 },
  leakCard: { background: '#fff5f5', border: '1px solid rgba(201,25,30,0.15)', borderRadius: 10, padding: '10px 12px', marginBottom: 6, display: 'flex', flexDirection: 'column' },
  actionRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: '1.5px solid', borderRadius: 10, padding: '11px 12px', marginBottom: 6, cursor: 'pointer', transition: 'all 0.15s' },
  closeButton: { width: '100%', padding: '13px', background: 'var(--kamo-navy)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, marginTop: 4 },
}
