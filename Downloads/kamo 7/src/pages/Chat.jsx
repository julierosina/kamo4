import { IMG } from '../assets/images.js'
// src/pages/Chat.jsx — Kamo chatbot via Anthropic API
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2 } from 'lucide-react'
import { useKamo } from '../context/KamoContext.jsx'

const F = 'var(--font)'
const SYSTEM = `Tu es Kamo, un compagnon de cybersécurité pour les jeunes français (18-25 ans). Réponds en français, de façon directe et bienveillante. Tu es un expert en cybersécurité, vie privée, mots de passe, phishing, VPN, RGPD. Sois concis (3-5 phrases max sauf si nécessaire). Tu es un caméléon numérique qui aide à se camoufler sur internet. Ne révèle jamais que tu es Claude ou basé sur Anthropic.`
const QUICK = ["C'est quoi le phishing ?","Comment créer un bon mot de passe ?","Est-ce que j'ai besoin d'un VPN ?","Comment savoir si mon email a été piraté ?","C'est quoi le RGPD ?","Mes données Instagram sont-elles sécurisées ?"]

async function callAPI(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYSTEM, messages })
  })
  if (!res.ok) throw new Error(`${res.status}`)
  const data = await res.json()
  return data.content?.find(b => b.type === 'text')?.text || ''
}

export default function Chat() {
  const { state, dispatch } = useKamo()
  const history = state.chatHistory || []
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [history, loading])

  const send = async (msg) => {
    const text = (msg || input).trim()
    if (!text || loading) return
    setInput(''); setError(null)
    const userMsg = { role: 'user', content: text }
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg })
    setLoading(true)
    try {
      const msgs = [...history, userMsg].map(m => ({ role: m.role, content: m.content }))
      const reply = await callAPI(msgs)
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: reply } })
    } catch (e) {
      setError("Kamo ne répond pas pour le moment. Vérifie ta connexion et réessaie.")
    } finally { setLoading(false); inputRef.current?.focus() }
  }

  const clear = () => dispatch({ type: 'LOAD_STATE', payload: { ...state, chatHistory: [] } })

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={S.av}>
              <img src={IMG.wave} alt="Kamo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
              <div style={S.dot} />
            </div>
            <div>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: 'var(--kamo-navy)', marginBottom: 1 }}>Kamo</h1>
              <p style={{ fontFamily: F, fontSize: 11, color: loading ? 'var(--kamo-orange)' : 'var(--kamo-green)', fontWeight: 600 }}>
                {loading ? 'En train de répondre…' : 'Disponible'}
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <button style={S.clearBtn} onClick={clear}><Trash2 size={14} /></button>
          )}
        </div>
      </div>

      <div style={S.msgs}>
        {history.length === 0 && (
          <motion.div style={S.welcome} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <img src={IMG.wave} alt="" style={{ width: 76, height: 76, objectFit: 'contain', display: 'block', margin: '0 auto 14px' }} />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: 'var(--kamo-navy)', textAlign: 'center', marginBottom: 6 }}>Bonjour, je suis Kamo</h2>
            <p style={{ fontFamily: F, fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 1.6, marginBottom: 22 }}>
              Pose-moi n'importe quelle question sur ta sécurité numérique et ta vie privée en ligne.
            </p>
            <div style={S.quickGrid}>
              {QUICK.map((q, i) => (
                <motion.button key={i} style={S.quickBtn}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                  whileHover={{ scale: 1.02, background: 'rgba(106,106,244,0.09)' }} whileTap={{ scale: 0.98 }}
                  onClick={() => send(q)}>{q}</motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {history.map((m, i) => (
            <motion.div key={i} style={{ ...S.row, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
              {m.role === 'assistant' && (
                <div style={S.kamoAv}>
                  <img src={IMG.wave} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ ...S.bubble, background: m.role === 'user' ? 'var(--kamo-violet)' : 'white', color: m.role === 'user' ? 'white' : 'var(--kamo-navy)', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', border: m.role === 'user' ? 'none' : '1px solid rgba(106,106,244,0.1)' }}>
                <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{m.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div style={{ ...S.row, justifyContent: 'flex-start' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={S.kamoAv}><img src={IMG.zen} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} /></div>
            <div style={{ ...S.bubble, background: 'white', border: '1px solid rgba(106,106,244,0.1)', borderRadius: '18px 18px 18px 4px' }}>
              <div style={{ display: 'flex', gap: 5, padding: '4px 2px' }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--kamo-violet)' }}
                    animate={{ y: [0,-6,0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.14 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div style={S.errBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <img src={IMG.warning} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            <p style={{ fontFamily: F, fontSize: 13, color: 'var(--kamo-red)' }}>{error}</p>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={S.inputArea}>
        <div style={S.inputInner}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Pose ta question à Kamo…" style={S.input} disabled={loading} />
            <motion.button style={{ ...S.sendBtn, opacity: !input.trim() || loading ? 0.5 : 1 }}
              onClick={() => send()} disabled={!input.trim() || loading}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
              <Send size={17} />
            </motion.button>
          </div>
          <p style={{ fontFamily: F, fontSize: 10, color: '#ccc', textAlign: 'center', marginTop: 6 }}>
            Kamo est un assistant IA — vérifie toujours les informations importantes.
          </p>
        </div>
      </div>
    </div>
  )
}

const S = {
  page: { display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--kamo-bg)' },
  header: { background: 'rgba(245,245,254,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(106,106,244,0.1)', padding: '12px 16px', flexShrink: 0 },
  headerInner: { maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  av: { position: 'relative', width: 46, height: 46, background: 'rgba(106,106,244,0.09)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', bottom: 2, right: 2, width: 9, height: 9, borderRadius: '50%', background: 'var(--kamo-green)', border: '2px solid white' },
  clearBtn: { background: '#f0f0f8', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' },
  msgs: { flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  welcome: { margin: 'auto', maxWidth: 500, padding: '24px 0' },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  quickBtn: { background: 'white', border: '1.5px solid rgba(106,106,244,0.14)', borderRadius: 12, padding: '10px 12px', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--kamo-navy)', cursor: 'pointer', textAlign: 'left', lineHeight: 1.4, transition: 'all 0.15s' },
  row: { display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: 700, margin: '0 auto', width: '100%' },
  kamoAv: { width: 32, height: 32, background: 'rgba(106,106,244,0.09)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { maxWidth: '76%', padding: '12px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  errBox: { display: 'flex', alignItems: 'center', gap: 8, background: '#fff5f5', border: '1px solid rgba(201,25,30,0.2)', borderRadius: 10, padding: '10px 14px', maxWidth: 500 },
  inputArea: { background: 'rgba(245,245,254,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(106,106,244,0.1)', padding: '12px 16px 20px', flexShrink: 0 },
  inputInner: { maxWidth: 700, margin: '0 auto' },
  input: { flex: 1, padding: '13px 18px', border: '1.5px solid rgba(106,106,244,0.2)', borderRadius: 14, fontFamily: 'var(--font)', fontSize: 14, outline: 'none', background: 'white', boxShadow: '0 2px 12px rgba(106,106,244,0.07)', width: '100%' },
  sendBtn: { width: 44, height: 44, background: 'var(--kamo-violet)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(106,106,244,0.28)' },
}
