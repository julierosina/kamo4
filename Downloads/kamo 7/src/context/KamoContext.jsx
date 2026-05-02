// src/context/KamoContext.jsx
// Contexte global — état, localStorage, gamification, visites

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { IMG } from '../assets/images.js'

const F = 'var(--font)'

const initialState = {
  hasCompletedOnboarding: false,
  emailCheckResult: null,
  diagnosticAnswers: {},
  scores: { passwords: 0, networks: 0, phishing: 0, privacy: 0, tools: 0 },
  completedTasks: {},
  flies: 0,
  unlockedTools: [],   // all tools unlocked by default now
  badges: [],
  flyAnimation: false,
  visitDates: [],      // ISO date strings of each app visit
  chatHistory: [],     // { role, content }[]
}

// ── Badges ────────────────────────────────────────────────────────────────────
export const BADGE_DEFS = [
  {
    id: 'first5',
    label: 'Premier vol',
    desc: 'Collecter 5 mouches',
    icon: IMG.wave,
    check: (s) => s.flies >= 5,
  },
  {
    id: 'twenty',
    label: 'Chasseur confirmé',
    desc: 'Collecter 20 mouches',
    icon: IMG.shield,
    check: (s) => s.flies >= 20,
  },
  {
    id: 'comeback',
    label: 'Fidèle',
    desc: 'Revenir dans le mois',
    icon: IMG.umbrella,
    check: (s) => {
      if (!s.visitDates || s.visitDates.length < 2) return false
      const now = new Date()
      const thisMonth = s.visitDates.filter(d => {
        const dt = new Date(d)
        return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear()
      })
      return thisMonth.length >= 2
    },
  },
  {
    id: 'allthemes',
    label: 'Caméléon',
    desc: 'Compléter tous les thèmes',
    icon: IMG.zen,
    check: (s) => {
      const needed = 45
      return s.flies >= needed
    },
  },
  {
    id: 'scholar',
    label: 'Érudit',
    desc: 'Compléter 10 tâches',
    icon: IMG.book,
    check: (s) => Object.keys(s.completedTasks).length >= 10,
  },
]

function computeBadges(state) {
  const earned = [...(state.badges || [])]
  for (const def of BADGE_DEFS) {
    if (!earned.find(b => b.id === def.id) && def.check(state)) {
      earned.push({ id: def.id, earnedAt: new Date().toISOString() })
    }
  }
  return earned
}

const TOOLS_BY_THEME = {
  banque: ['password-checker', 'email-plainte'],
  tour:   [],
  port:   [],
  place:  ['pseudo-gen', 'email-rgpd-access', 'email-rgpd-delete'],
  labo:   ['email-gen'],
}

export const TASKS_BY_THEME = {
  banque: ['banque-A-0','banque-A-1','banque-A-2','banque-B-0','banque-B-1','banque-B-2','banque-C-0','banque-C-1','banque-C-2'],
  tour:   ['tour-A-0','tour-A-1','tour-A-2','tour-B-0','tour-B-1','tour-B-2','tour-C-0','tour-C-1','tour-C-2'],
  port:   ['port-A-0','port-A-1','port-A-2','port-B-0','port-B-1','port-B-2','port-C-0','port-C-1','port-C-2'],
  place:  ['place-A-0','place-A-1','place-A-2','place-B-0','place-B-1','place-B-2','place-C-0','place-C-1','place-C-2'],
  labo:   ['labo-A-0','labo-A-1','labo-A-2','labo-B-0','labo-B-1','labo-B-2','labo-C-0','labo-C-1','labo-C-2'],
}

function kamoReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload }

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true }

    case 'SET_EMAIL_RESULT':
      return { ...state, emailCheckResult: action.payload }

    case 'SET_DIAGNOSTIC_ANSWERS':
      return { ...state, diagnosticAnswers: action.payload }

    case 'SET_SCORES':
      return { ...state, scores: action.payload }

    case 'COMPLETE_TASK': {
      const key = action.payload
      if (state.completedTasks[key]) return state
      const next = { ...state, completedTasks: { ...state.completedTasks, [key]: true }, flies: state.flies + 1, flyAnimation: true }
      next.badges = computeBadges(next)
      return next
    }

    case 'UNCOMPLETE_TASK': {
      const key = action.payload
      if (!state.completedTasks[key]) return state
      const newCompleted = { ...state.completedTasks }
      delete newCompleted[key]
      const next = { ...state, completedTasks: newCompleted, flies: Math.max(0, state.flies - 1) }
      return next
    }

    case 'STOP_FLY_ANIMATION':
      return { ...state, flyAnimation: false }

    case 'RECORD_VISIT': {
      const today = new Date().toISOString().slice(0, 10)
      const visits = state.visitDates || []
      if (visits.includes(today)) return state
      const next = { ...state, visitDates: [...visits, today] }
      next.badges = computeBadges(next)
      return next
    }

    case 'ADD_CHAT_MESSAGE': {
      return { ...state, chatHistory: [...(state.chatHistory || []), action.payload] }
    }

    case 'RESET_ONBOARDING':
      return {
        ...initialState,
        completedTasks: state.completedTasks,
        flies: state.flies,
        badges: state.badges,
        unlockedTools: state.unlockedTools,
        visitDates: state.visitDates || [],
      }

    default:
      return state
  }
}

const KamoContext = createContext(null)

export function KamoProvider({ children }) {
  const [state, dispatch] = useReducer(kamoReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kamo_state')
      if (saved) dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) })
    } catch (e) {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('kamo_state', JSON.stringify(state)) } catch (e) {}
  }, [state])

  // Record today's visit on mount
  useEffect(() => {
    dispatch({ type: 'RECORD_VISIT' })
  }, [])

  return <KamoContext.Provider value={{ state, dispatch }}>{children}</KamoContext.Provider>
}

export function useKamo() {
  const ctx = useContext(KamoContext)
  if (!ctx) throw new Error('useKamo must be used within KamoProvider')
  return ctx
}
