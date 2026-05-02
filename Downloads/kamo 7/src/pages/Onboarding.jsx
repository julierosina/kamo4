import { IMG } from '../assets/images.js'
// src/pages/Onboarding.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS, computeScores } from '../data/questions.js'
import { useKamo } from '../context/KamoContext.jsx'
import { ChevronRight, ChevronLeft, CheckCircle2, Circle, Shield, AlertTriangle, Mail } from 'lucide-react'

const F = 'var(--font)'

// ── HIBP Mock — replace with real API + server proxy ──────────────────────────
// Real API: https://haveibeenpwned.com/API/v3 (requires API key + CORS proxy)
async function checkEmail(email) {
  await new Promise(r => setTimeout(r, 1500))
  const l = email.toLowerCase()
  if (l.includes('test') || l.includes('leak') || l.includes('fuite')) {
    return { leaked: true, leaks: [
      { name: 'DataService Pro', year: 2022, dataTypes: ['Email', 'Mot de passe hashé'] },
      { name: 'SocialConnect', year: 2021, dataTypes: ['Email', 'Prénom', 'Téléphone'] },
      { name: 'ShopMarket', year: 2023, dataTypes: ['Email', 'Adresse', 'Historique d\'achats'] },
    ]}
  }
  return { leaked: false, leaks: [] }
}

export default function Onboarding() {
  const { dispatch } = useKamo()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [emailResult, setEmailResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState({})
  const [qIndex, setQIndex] = useState(0)
  const [scores, setScores] = useState(null)
  const [calculating, setCalculating] = useState(false)

  const q = QUESTIONS[qIndex]

  const handleEmailCheck = async () => {
    if (!email.trim()) return
    setLoading(true)
    const r = await checkEmail(email)
    setEmailResult(r)
    setLoading(false)
  }

  const toggleAnswer = (i) => {
    setAnswers(prev => {
      const cur = prev[q.id] || []
      if (q.multi) return { ...prev, [q.id]: cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i] }
      return { ...prev, [q.id]: [i] }
    })
  }

  const nextQ = () => {
    if (qIndex < QUESTIONS.length - 1) setQIndex(x => x + 1)
    else finishDiag()
  }

  const finishDiag = async () => {
    setStep(3); setCalculating(true)
    await new Promise(r => setTimeout(r, 2000))
    setScores(computeScores(answers))
    setCalculating(false)
  }

  const finish = () => {
    dispatch({ type: 'SET_EMAIL_RESULT', payload: emailResult ? { email, leaks: emailResult.leaks } : null })
    dispatch({ type: 'SET_DIAGNOSTIC_ANSWERS', payload: answers })
    dispatch({ type: 'SET_SCORES', payload: scores || {} })
    dispatch({ type: 'COMPLETE_ONBOARDING' })
  }

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <AnimatePresence mode="wait">

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <motion.div key="s0" style={S.card} {...FU}>
            <motion.img src={IMG.wave} alt="Kamo" style={S.bigImg}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 14 }}
              whileHover={{ filter: 'hue-rotate(30deg)', scale: 1.06 }} />
            <motion.h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: 'var(--kamo-navy)', textAlign: 'center', letterSpacing: '-2px', marginBottom: 8 }} {...D(0.25)}>
              Kamo
            </motion.h1>
            <motion.p style={{ fontFamily: F, fontSize: 17, color: 'var(--kamo-violet)', textAlign: 'center', fontWeight: 600, marginBottom: 10 }} {...D(0.35)}>
              Ton compagnon de camouflage numérique.
            </motion.p>
            <motion.p style={{ fontFamily: F, fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 36, lineHeight: 1.6 }} {...D(0.45)}>
              Découvre si tu es visible sur internet — et apprends à disparaître.
            </motion.p>
            <motion.button style={S.primary} onClick={() => setStep(1)} {...D(0.55)} whileHover={WH} whileTap={WT}>
              Commencer le diagnostic <ChevronRight size={17} />
            </motion.button>
          </motion.div>
        )}

        {/* Step 1 — Email */}
        {step === 1 && (
          <motion.div key="s1" style={S.card} {...FU}>
            <div style={S.badge}>Étape 1 / 3</div>
            <img src={IMG.laptop} alt="" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 16 }} />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: 'var(--kamo-navy)', marginBottom: 10 }}>
              Vérifie ton email
            </h2>
            <p style={{ fontFamily: F, fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
              Saisis ton adresse pour vérifier si elle apparaît dans une fuite de données connue.
            </p>

            <input type="email" placeholder="ton@email.fr" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailCheck()}
              style={S.input} />

            <p style={{ fontFamily: F, fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
              <Shield size={13} color="var(--kamo-green)" /> Ton email ne quitte pas ton appareil.
            </p>

            <motion.button style={{ ...S.primary, opacity: loading || !email.trim() ? 0.6 : 1 }}
              onClick={handleEmailCheck} disabled={loading || !email.trim()} whileHover={WH} whileTap={WT}>
              {loading ? 'Vérification…' : 'Vérifier'}
            </motion.button>

            {emailResult && !loading && (
              <motion.div style={{ ...S.resultBox, borderColor: emailResult.leaked ? 'var(--kamo-red)' : 'var(--kamo-green)', background: emailResult.leaked ? '#fff5f5' : '#f0fdf4' }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {emailResult.leaked ? (
                  <>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                      <AlertTriangle size={18} color="var(--kamo-red)" />
                      <strong style={{ fontFamily: F, color: 'var(--kamo-red)', fontSize: 14 }}>{emailResult.leaks.length} fuite(s) détectée(s)</strong>
                    </div>
                    {emailResult.leaks.map((l, i) => (
                      <div key={i} style={{ fontFamily: F, fontSize: 13, paddingBottom: 6, borderBottom: '1px solid #fdd', marginBottom: 6 }}>
                        <strong>{l.name}</strong> — {l.year} · {l.dataTypes.join(', ')}
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <CheckCircle2 size={18} color="var(--kamo-green)" />
                    <strong style={{ fontFamily: F, color: 'var(--kamo-green)', fontSize: 14 }}>Aucune fuite détectée</strong>
                  </div>
                )}
              </motion.div>
            )}

            <div style={S.navRow}>
              <button style={S.ghost} onClick={() => setStep(0)}><ChevronLeft size={15} /> Retour</button>
              {emailResult
                ? <motion.button style={S.primary} onClick={() => setStep(2)} whileHover={WH}>Continuer <ChevronRight size={15} /></motion.button>
                : <button style={S.ghost} onClick={() => setStep(2)}>Passer cette étape</button>}
            </div>
          </motion.div>
        )}

        {/* Step 2 — QCM */}
        {step === 2 && (
          <motion.div key="s2" style={S.card} {...FU}>
            <div style={S.badge}>Étape 2 / 3</div>
            <div style={S.progressBar}>
              <motion.div style={{ ...S.progressFill, width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
            <p style={{ fontFamily: F, fontSize: 11, color: '#aaa', textAlign: 'right', marginBottom: 20 }}>
              {qIndex + 1} / {QUESTIONS.length}
            </p>

            <AnimatePresence mode="wait">
              <motion.div key={qIndex}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: 'var(--kamo-violet)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                  {q.label}
                </p>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: 'var(--kamo-navy)', marginBottom: 8, lineHeight: 1.3 }}>{q.question}</h2>
                {q.multi && <p style={{ fontFamily: F, fontSize: 12, color: '#aaa', marginBottom: 14 }}>Plusieurs réponses possibles</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                  {q.options.map((opt, i) => {
                    const sel = (answers[q.id] || []).includes(i)
                    return (
                      <motion.button key={i}
                        style={{ ...S.option, background: sel ? 'rgba(106,106,244,0.1)' : 'white', borderColor: sel ? 'var(--kamo-violet)' : '#e5e5f0', color: sel ? 'var(--kamo-violet)' : 'var(--kamo-navy)' }}
                        onClick={() => toggleAnswer(i)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <span style={{ color: sel ? 'var(--kamo-violet)' : '#ccc', flexShrink: 0 }}>
                          {sel ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                        </span>
                        <span style={{ fontFamily: F, fontSize: 13, lineHeight: 1.4 }}>{opt.text}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={S.navRow}>
              <button style={S.ghost} onClick={() => qIndex > 0 ? setQIndex(x => x - 1) : setStep(1)} disabled={false}>
                <ChevronLeft size={15} /> Précédent
              </button>
              <motion.button style={{ ...S.primary, opacity: !(answers[q.id]?.length) ? 0.5 : 1 }}
                onClick={nextQ} disabled={!answers[q.id]?.length} whileHover={WH}>
                {qIndex === QUESTIONS.length - 1 ? 'Terminer' : 'Suivant'} <ChevronRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && (
          <motion.div key="s3" style={S.card} {...FU}>
            {calculating ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <motion.img src={IMG.zen} alt="" style={{ width: 90, height: 90, objectFit: 'contain', display: 'block', margin: '0 auto 20px' }}
                  animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} />
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: 'var(--kamo-navy)', marginBottom: 6 }}>Analyse en cours…</h2>
                <p style={{ fontFamily: F, fontSize: 14, color: '#888' }}>Kamo calcule ton profil de sécurité</p>
              </div>
            ) : scores && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <motion.img src={IMG.shield} alt="" style={{ width: 90, height: 90, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} />
                  <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: 'var(--kamo-navy)', marginBottom: 4 }}>Diagnostic terminé</h2>
                  <p style={{ fontFamily: F, fontSize: 14, color: '#888' }}>Voici ton profil de sécurité numérique</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                  {[
                    { key: 'passwords', label: 'Mots de passe' },
                    { key: 'networks',  label: 'Réseaux' },
                    { key: 'phishing',  label: 'Phishing' },
                    { key: 'privacy',   label: 'Vie privée' },
                    { key: 'tools',     label: 'Outils' },
                  ].map(({ key, label }, i) => {
                    const v = scores[key] || 0
                    const col = v < 40 ? 'var(--kamo-red)' : v < 70 ? 'var(--kamo-orange)' : 'var(--kamo-green)'
                    return (
                      <motion.div key={key} style={{ background: 'var(--kamo-blue-light)', borderRadius: 12, padding: 14 }}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                        <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: 'var(--kamo-navy)', marginBottom: 8 }}>{label}</p>
                        <div style={{ height: 5, background: '#ddd', borderRadius: 3, overflow: 'hidden' }}>
                          <motion.div style={{ height: '100%', background: col, borderRadius: 3 }}
                            initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.3 + 0.05 * i, duration: 0.7 }} />
                        </div>
                        <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: col, marginTop: 4, textAlign: 'right' }}>{v}%</p>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.button style={S.primary} onClick={finish} whileHover={WH} whileTap={WT}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  Voir mon tableau de bord <ChevronRight size={16} />
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FU = { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 }, transition: { duration: 0.38 } }
const D = (delay) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.36 } })
const WH = { scale: 1.03, boxShadow: '0 8px 28px rgba(106,106,244,0.3)' }
const WT = { scale: 0.97 }

const S = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', background: 'var(--kamo-bg)' },
  bg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(106,106,244,0.14) 0%, transparent 70%)', pointerEvents: 'none' },
  card: { position: 'relative', zIndex: 1, width: '100%', maxWidth: 500, background: 'white', borderRadius: 24, padding: '40px 36px', boxShadow: '0 4px 40px rgba(106,106,244,0.12)', border: '1px solid rgba(106,106,244,0.1)' },
  badge: { display: 'inline-block', background: 'rgba(106,106,244,0.1)', color: 'var(--kamo-violet)', borderRadius: 100, padding: '3px 12px', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 11, marginBottom: 16, letterSpacing: '0.5px' },
  bigImg: { width: 110, height: 110, objectFit: 'contain', display: 'block', margin: '0 auto 12px' },
  primary: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--kamo-violet)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 24px', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%', boxShadow: '0 4px 20px rgba(106,106,244,0.22)' },
  ghost: { display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: '1.5px solid #e5e5f0', borderRadius: 10, padding: '10px 16px', fontFamily: 'var(--font)', fontSize: 13, color: '#888', cursor: 'pointer' },
  input: { width: '100%', padding: '13px 16px', border: '1.5px solid rgba(106,106,244,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font)', outline: 'none', background: 'var(--kamo-blue-light)', marginBottom: 8 },
  resultBox: { borderRadius: 12, padding: '14px 16px', border: '1.5px solid', marginTop: 14, marginBottom: 16 },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 10 },
  progressBar: { height: 5, background: '#eee', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  progressFill: { height: '100%', background: 'var(--kamo-violet)', borderRadius: 3, transition: 'width 0.4s' },
  option: { display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid', borderRadius: 11, padding: '11px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%', fontFamily: 'var(--font)' },
}
