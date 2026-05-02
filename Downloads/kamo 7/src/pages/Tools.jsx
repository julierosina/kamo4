import { IMG } from '../assets/images.js'
// src/pages/Tools.jsx — All tools accessible, no locking

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Wand2, MailPlus, FileText, Trash2, AlertTriangle, Eye, EyeOff, Copy, Check, RefreshCw, X } from 'lucide-react'
import { TOOLS } from '../data/tools.js'

const ICON_MAP = { ShieldCheck, Wand2, MailPlus, FileText, Trash2, AlertTriangle }
const F = 'var(--font)'

// ── Pseudonym generator ───────────────────────────────────────────────────────
const ADJ = ['Gecko', 'Ombre', 'Agent', 'Phantom', 'Krypto', 'Furtif', 'Spectre', 'Chromatix', 'Invisible', 'Cipher']
const NOU = ['Lézard', 'Caméléon', 'Shadow', 'Verte', 'Noir', 'Zero', 'Delta', 'X', 'Sigma', 'Blanc']
const W1 = ['rapide','calme','discret','furtif','sage','libre','vif','clair','lent','doux']
const W2 = ['gecko','nuage','forêt','pixel','delta','sigma','alpha','onyx','jade','cobalt']
const DOM = ['proton.me','tutanota.com','pm.me']

const pseudoGen = () => `${ADJ[Math.floor(Math.random()*ADJ.length)]}${NOU[Math.floor(Math.random()*NOU.length)]}${Math.floor(Math.random()*900+100)}`
const emailGen = () => Array.from({length:3}, () => `${W1[Math.floor(Math.random()*W1.length)]}.${W2[Math.floor(Math.random()*W2.length)]}${Math.floor(Math.random()*900+100)}@${DOM[Math.floor(Math.random()*DOM.length)]}`)

const pwdAnalyze = (p) => {
  const c = [
    { label: 'Au moins 12 caractères', ok: p.length >= 12 },
    { label: 'Majuscules (A-Z)', ok: /[A-Z]/.test(p) },
    { label: 'Chiffres (0-9)', ok: /[0-9]/.test(p) },
    { label: 'Caractères spéciaux', ok: /[^a-zA-Z0-9]/.test(p) },
    { label: 'Pas un mot commun', ok: !['password','motdepasse','123456','azerty','qwerty'].includes(p.toLowerCase()) },
  ]
  const ok = c.filter(x => x.ok).length
  const scores = [0, 20, 40, 65, 85, 100]
  const labels = ['Très faible','Faible','Moyen','Fort','Très fort','Excellent']
  const colors = ['var(--kamo-red)','var(--kamo-orange)','#B7A73F','var(--kamo-blue-act)','var(--kamo-green)','var(--kamo-green)']
  const times = ['Instantané','< 1 heure','Quelques jours','Quelques mois','> 1 an','> 100 ans']
  return { criteria: c, score: scores[ok], label: labels[ok], color: colors[ok], time: times[ok] }
}

const TEMPLATES = {
  'email-rgpd-access': {
    subject: "Demande d'accès à mes données personnelles — Article 15 RGPD",
    body: `Madame, Monsieur,

Conformément à l'article 15 du RGPD, je souhaite exercer mon droit d'accès aux données personnelles me concernant que vous détenez.

Je vous remercie de me communiquer :
- La nature des données personnelles détenues à mon sujet
- La finalité de leur traitement
- Les destinataires de ces données
- La durée de conservation prévue

Dans l'attente de votre réponse, je vous adresse mes cordiales salutations.

[Votre nom]
[Votre email]
[Date]`
  },
  'email-rgpd-delete': {
    subject: "Demande de suppression de mes données personnelles — Article 17 RGPD",
    body: `Madame, Monsieur,

Conformément à l'article 17 du RGPD (droit à l'effacement), je vous demande de supprimer l'ensemble des données personnelles me concernant que vous détenez.

Je vous remercie de confirmer la suppression effective dans un délai d'un mois.

Cordialement,
[Votre nom]
[Date]`
  },
  'email-plainte': {
    subject: "Signalement suite à une fuite de données",
    body: `Madame, Monsieur,

J'ai été informé(e) que mes données personnelles ont été compromises dans une fuite de données associée à votre service.

Conformément aux articles 33 et 34 du RGPD, je vous demande :
1. De confirmer si mes données ont été compromises
2. De préciser la nature des données exposées
3. D'indiquer les mesures prises pour remédier à cette fuite

À défaut de réponse satisfaisante, je me réserve le droit de saisir la CNIL.

Cordialement,
[Votre nom]
[Date]`
  },
}

// ── Tool modals ───────────────────────────────────────────────────────────────
function PwdChecker() {
  const [pwd, setPwd] = useState('')
  const [show, setShow] = useState(false)
  const r = pwd ? pwdAnalyze(pwd) : null
  return (
    <div>
      <p style={MS.note}><img src={IMG.shield} alt="" style={{width:22,height:22,objectFit:'contain'}} /> Ton mot de passe ne quitte pas ton appareil.</p>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <input type={show ? 'text' : 'password'} placeholder="Saisis un mot de passe…" value={pwd} onChange={e => setPwd(e.target.value)}
          style={MS.input} />
        <button style={MS.eyeBtn} onClick={() => setShow(s => !s)}>{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
      </div>
      {r && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: F, fontSize: 12, color: '#888' }}>Force</span>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: r.color }}>{r.label}</span>
          </div>
          <div style={{ height: 7, background: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
            <motion.div style={{ height: '100%', background: r.color, borderRadius: 4 }} initial={{ width: 0 }} animate={{ width: `${r.score}%` }} transition={{ duration: 0.5 }} />
          </div>
          {r.criteria.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
              <span style={{ color: c.ok ? 'var(--kamo-green)' : '#ddd', fontSize: 13 }}>{c.ok ? '✓' : '○'}</span>
              <span style={{ fontFamily: F, fontSize: 12, color: c.ok ? 'var(--kamo-navy)' : '#bbb' }}>{c.label}</span>
            </div>
          ))}
          <div style={MS.est}>Temps estimé pour casser ce mot de passe : <strong>{r.time}</strong></div>
        </motion.div>
      )}
    </div>
  )
}

function PseudoGen() {
  const [p, setP] = useState(pseudoGen())
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(p); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div>
      <p style={MS.note}>Utilise un pseudonyme pour protéger ton identité sur les forums et inscriptions non essentielles.</p>
      <motion.div style={MS.pseudoBox} key={p} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <img src={IMG.wave} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: 'var(--kamo-violet)', flex: 1 }}>{p}</span>
      </motion.div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={MS.ghostBtn} onClick={() => setP(pseudoGen())}><RefreshCw size={14}/> Régénérer</button>
        <button style={{ ...MS.ghostBtn, background: copied ? 'var(--kamo-green)' : 'var(--kamo-violet)', color: 'white', border: 'none' }} onClick={copy}>
          {copied ? <><Check size={14}/> Copié</> : <><Copy size={14}/> Copier</>}
        </button>
      </div>
    </div>
  )
}

function EmailGen() {
  const [emails, setEmails] = useState(emailGen())
  const [copied, setCopied] = useState({})
  const copy = (e, i) => { navigator.clipboard.writeText(e); setCopied(c => ({ ...c, [i]: true })); setTimeout(() => setCopied(c => ({ ...c, [i]: false })), 2000) }
  return (
    <div>
      <p style={MS.note}>Un alias email te permet de t'inscrire sans exposer ton vrai email. Utilise <a href="https://simplelogin.io" target="_blank" rel="noreferrer" style={{ color: 'var(--kamo-violet)' }}>SimpleLogin</a> ou <a href="https://anonaddy.com" target="_blank" rel="noreferrer" style={{ color: 'var(--kamo-violet)' }}>AnonAddy</a> pour des alias fonctionnels.</p>
      {emails.map((e, i) => (
        <motion.div key={i} style={MS.emailRow} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
          <code style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: 'var(--kamo-violet)' }}>{e}</code>
          <button style={MS.copyBtn} onClick={() => copy(e, i)}>{copied[i] ? <Check size={13} color="var(--kamo-green)"/> : <Copy size={13}/>}</button>
        </motion.div>
      ))}
      <button style={MS.ghostBtn} onClick={() => setEmails(emailGen())}><RefreshCw size={14}/> Regénérer</button>
    </div>
  )
}

function EmailTpl({ toolId }) {
  const tpl = TEMPLATES[toolId]
  const [body, setBody] = useState(tpl.body)
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f8f8ff', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#888' }}>Objet :</span>
        <span style={{ fontFamily: F, fontSize: 12, flex: 1 }}>{tpl.subject}</span>
      </div>
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={10}
        style={{ width: '100%', padding: '12px', border: '1.5px solid rgba(106,106,244,0.2)', borderRadius: 10, fontFamily: F, fontSize: 12, lineHeight: 1.7, resize: 'vertical', outline: 'none', background: 'var(--kamo-blue-light)', marginBottom: 12 }} />
      <button style={{ ...MS.ghostBtn, background: copied ? 'var(--kamo-green)' : 'var(--kamo-violet)', color: 'white', border: 'none', width: '100%', justifyContent: 'center' }} onClick={copy}>
        {copied ? <><Check size={14}/> Modèle copié</> : <><Copy size={14}/> Copier le modèle</>}
      </button>
    </div>
  )
}

function ToolModal({ toolId, onClose }) {
  const tool = TOOLS.find(t => t.id === toolId)
  const Icon = ICON_MAP[tool.icon] || ShieldCheck
  const TOOL_IMG = {
    'password-checker': IMG.shield,
    'pseudo-gen': IMG.wave,
    'email-gen': IMG.laptop,
    'email-rgpd-access': IMG.id,
    'email-rgpd-delete': IMG.id,
    'email-plainte': IMG.warning,
  }
  return (
    <motion.div style={MS.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div style={MS.modal} initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 70, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: tool.colorLight, border: `2px solid ${tool.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={TOOL_IMG[toolId] || IMG.wave} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: tool.color, marginBottom: 2 }}>{tool.name}</h2>
              <p style={{ fontFamily: F, fontSize: 12, color: '#888' }}>{tool.description}</p>
            </div>
          </div>
          <button style={{ background: '#f0f0f8', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
            <X size={16} color="#666" />
          </button>
        </div>
        {toolId === 'password-checker' && <PwdChecker />}
        {toolId === 'pseudo-gen' && <PseudoGen />}
        {toolId === 'email-gen' && <EmailGen />}
        {['email-rgpd-access','email-rgpd-delete','email-plainte'].includes(toolId) && <EmailTpl toolId={toolId} />}
      </motion.div>
    </motion.div>
  )
}

export default function Tools() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <motion.div style={{ marginBottom: 28 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <img src={IMG.laptop} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            <div>
              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 30, color: 'var(--kamo-navy)', letterSpacing: '-1px' }}>Outils</h1>
              <p style={{ fontFamily: F, fontSize: 14, color: '#888' }}>Des outils pratiques pour ta sécurité numérique</p>
            </div>
          </div>
        </motion.div>

        <div style={S.grid}>
          {TOOLS.map((tool, i) => {
            const Icon = ICON_MAP[tool.icon] || ShieldCheck
            return (
              <motion.div key={tool.id} style={S.card}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5, boxShadow: `0 14px 36px ${tool.color}22` }}
                onClick={() => setSelected(tool.id)}>
                <div style={{ ...S.iconWrap, background: tool.colorLight, border: `2px solid ${tool.color}30` }}>
                  <Icon size={26} color={tool.color} />
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: 'var(--kamo-navy)', marginBottom: 4 }}>{tool.name}</h3>
                <p style={{ fontFamily: F, fontSize: 12, color: '#888', lineHeight: 1.5, flex: 1 }}>{tool.description}</p>
                <div style={{ ...S.openBtn, background: `${tool.color}15`, color: tool.color }}>Ouvrir</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ToolModal toolId={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}

const S = {
  page: { minHeight: '100vh', background: 'var(--kamo-bg)', padding: '24px 16px 40px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { background: 'white', borderRadius: 16, padding: '20px', border: '1px solid rgba(106,106,244,0.1)', boxShadow: '0 3px 16px rgba(106,106,244,0.07)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.2s' },
  iconWrap: { width: 54, height: 54, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  openBtn: { display: 'block', textAlign: 'center', borderRadius: 10, padding: '9px', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 13, marginTop: 4 },
}
const MS = {
  overlay: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(33,33,63,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  modal: { width: '100%', maxWidth: 580, background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 24px 44px', maxHeight: '90vh', overflowY: 'auto' },
  note: { fontFamily: 'var(--font)', fontSize: 12, color: '#888', background: 'rgba(106,106,244,0.06)', borderRadius: 8, padding: '9px 12px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7, lineHeight: 1.5 },
  input: { width: '100%', padding: '12px 42px 12px 14px', border: '1.5px solid rgba(106,106,244,0.2)', borderRadius: 10, fontFamily: 'var(--font)', fontSize: 14, background: 'var(--kamo-blue-light)', outline: 'none' },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa' },
  est: { fontFamily: 'var(--font)', fontSize: 12, color: 'var(--kamo-navy)', background: 'rgba(106,106,244,0.07)', borderRadius: 8, padding: '10px 12px', marginTop: 12 },
  pseudoBox: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--kamo-blue-light)', borderRadius: 12, padding: '16px', marginBottom: 14, border: '1.5px solid rgba(106,106,244,0.15)' },
  ghostBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid rgba(106,106,244,0.2)', borderRadius: 10, padding: '9px 16px', background: 'white', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, color: 'var(--kamo-navy)' },
  emailRow: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--kamo-blue-light)', borderRadius: 10, padding: '11px 13px', border: '1px solid rgba(106,106,244,0.15)', marginBottom: 8 },
  copyBtn: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center', padding: 4 },
}
