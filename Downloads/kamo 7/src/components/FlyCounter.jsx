// src/components/FlyCounter.jsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FlyCounter({ flies, animate, compact }) {
  return (
    <motion.div
      style={{
        display: 'flex', alignItems: 'center', gap: compact ? 4 : 6,
        background: animate ? 'rgba(106,106,244,0.14)' : 'rgba(106,106,244,0.07)',
        borderRadius: 24, padding: compact ? '4px 10px' : '6px 14px',
        border: '1.5px solid rgba(106,106,244,0.18)',
        position: 'relative', overflow: 'visible',
      }}
      animate={animate ? { scale: [1, 1.18, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {animate && (
          <motion.span key="fly-anim" style={{ position: 'absolute', fontSize: 16, left: '50%', top: '50%', pointerEvents: 'none', zIndex: 10 }}
            initial={{ x: -50, y: 30, opacity: 1 }}
            animate={{ x: 0, y: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeIn' }}>
            🪰
          </motion.span>
        )}
      </AnimatePresence>
      <span style={{ fontSize: compact ? 13 : 16 }}>🪰</span>
      <motion.span key={flies}
        style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: compact ? 12 : 14, color: 'var(--kamo-violet)', minWidth: 18, textAlign: 'center' }}
        initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
        {flies}
      </motion.span>
    </motion.div>
  )
}
