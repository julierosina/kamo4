import { IMG } from '../assets/images.js'
// src/components/Navbar.jsx
import React, { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Map, Wrench, MessageCircle } from 'lucide-react'
import { useKamo } from '../context/KamoContext.jsx'
import FlyCounter from './FlyCounter.jsx'

const NAV = [
  { to: '/dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
  { to: '/map',       label: 'Carte',           Icon: Map },
  { to: '/tools',     label: 'Outils',          Icon: Wrench },
  { to: '/chat',      label: 'Kamo',            Icon: MessageCircle },
]

const F = 'var(--font)'

export default function Navbar() {
  const { state, dispatch } = useKamo()
  const location = useLocation()

  useEffect(() => {
    if (state.flyAnimation) {
      const t = setTimeout(() => dispatch({ type: 'STOP_FLY_ANIMATION' }), 1200)
      return () => clearTimeout(t)
    }
  }, [state.flyAnimation])

  return (
    <>
      {/* Desktop top nav */}
      <nav style={S.desktop} className="kamo-desktop-nav">
        <div style={S.inner}>
          <NavLink to="/dashboard" style={S.logoWrap}>
            <motion.img
              src={IMG.wave}
              alt="Kamo"
              style={S.logo}
              whileHover={{ scale: 1.12, filter: 'hue-rotate(30deg)' }}
              transition={{ duration: 0.3 }}
            />
            <span style={{ ...S.logoText, fontFamily: F }}>Kamo</span>
          </NavLink>

          <div style={S.links}>
            {NAV.map(({ to, label, Icon }) => {
              const active = location.pathname.startsWith(to)
              return (
                <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
                  <motion.div style={{ ...S.link, color: active ? 'var(--kamo-violet)' : '#666', fontWeight: active ? 700 : 400, fontFamily: F }}
                    whileHover={{ y: -1 }}>
                    <Icon size={16} />
                    <span>{label}</span>
                    {active && <motion.div layoutId="nav-line" style={S.activeLine} />}
                  </motion.div>
                </NavLink>
              )
            })}
          </div>

          <FlyCounter flies={state.flies} animate={state.flyAnimation} />
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav style={S.mobile} className="kamo-mobile-nav">
        {NAV.map(({ to, label, Icon }) => {
          const active = location.pathname.startsWith(to)
          return (
            <NavLink key={to} to={to} style={{ textDecoration: 'none', flex: 1 }}>
              <motion.div style={{ ...S.mobileTab, color: active ? 'var(--kamo-violet)' : '#999' }}
                whileTap={{ scale: 0.88 }}>
                {active && <motion.div layoutId="tab-bg" style={S.tabBg} />}
                {to === '/chat'
                  ? <img src={IMG.wave} alt="Kamo" style={{ width: 26, height: 26, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                  : <Icon size={22} strokeWidth={active ? 2.5 : 1.8} style={{ position: 'relative', zIndex: 1 }} />
                }
                <span style={{ ...S.mobileLabel, fontFamily: F, fontWeight: active ? 700 : 400, position: 'relative', zIndex: 1 }}>{label}</span>
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      <style>{`
        @media (min-width: 768px) { .kamo-desktop-nav { display: flex !important; } .kamo-mobile-nav { display: none !important; } }
        @media (max-width: 767px) { .kamo-desktop-nav { display: none !important; } .kamo-mobile-nav { display: flex !important; } }
      `}</style>
    </>
  )
}

const S = {
  desktop: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(245,245,254,0.92)', backdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(106,106,244,0.1)', height: 68, display: 'none',
  },
  inner: { maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: '100%', display: 'flex', alignItems: 'center', gap: 32 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginRight: 16 },
  logo: { width: 38, height: 38, objectFit: 'contain' },
  logoText: { fontSize: 20, fontWeight: 800, color: 'var(--kamo-navy)', letterSpacing: '-0.5px' },
  links: { display: 'flex', gap: 2, flex: 1 },
  link: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
    fontSize: 14, position: 'relative', transition: 'background 0.15s',
  },
  activeLine: {
    position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
    width: 18, height: 3, borderRadius: 2, background: 'var(--kamo-violet)',
  },
  mobile: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(245,245,254,0.97)', backdropFilter: 'blur(14px)',
    borderTop: '1px solid rgba(106,106,244,0.1)',
    display: 'none', paddingBottom: 'env(safe-area-inset-bottom)',
  },
  mobileTab: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    padding: '9px 4px 7px', position: 'relative', width: '100%',
  },
  tabBg: {
    position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
    width: 40, height: 32, borderRadius: 10, background: 'rgba(106,106,244,0.1)',
  },
  mobileLabel: { fontSize: 10 },
}
