import { IMG } from '../assets/images.js'
// src/pages/LocationDetail.jsx
// Location detail — slides + tasks with toggle (check/uncheck) + popups

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, X, ExternalLink } from 'lucide-react'
import { useKamo } from '../context/KamoContext.jsx'
import { getTheme, getThemeProgress } from '../data/themes.js'

const F = 'var(--font)'

// Task popups — explanations + links for relevant tasks
const TASK_POPUPS = {
  'banque-A-1': { title: 'Vérifier la force de ton mot de passe', body: 'Un mot de passe fort contient au moins 12 caractères, des majuscules, des minuscules, des chiffres et des symboles. Utilise l\'outil de vérification dans l\'onglet Outils.', link: { label: 'Aller à l\'outil', path: '/tools' } },
  'banque-B-0': { title: 'Bitwarden vs 1Password vs Dashlane', body: 'Bitwarden est open-source et gratuit. 1Password est payant mais très complet. Dashlane propose un VPN intégré. Pour débuter, Bitwarden est recommandé.', link: { label: 'Bitwarden (gratuit)', url: 'https://bitwarden.com' } },
  'banque-B-1': { title: 'Installer un gestionnaire de mots de passe', body: 'Bitwarden est disponible sur toutes les plateformes. Installe l\'extension navigateur + l\'app mobile pour une protection complète.', link: { label: 'Télécharger Bitwarden', url: 'https://bitwarden.com/download/' } },
  'banque-C-0': { title: 'Activer le 2FA sur ton email', body: 'Va dans les paramètres de ton compte email. Cherche "sécurité" ou "authentification à deux facteurs". Active avec une app comme Authy.', link: { label: 'Guide Gmail 2FA', url: 'https://myaccount.google.com/security' } },
  'tour-B-0':   { title: 'Comprendre un VPN', body: 'Un VPN (Réseau Privé Virtuel) chiffre ton trafic internet et masque ton adresse IP. Indispensable sur les Wi-Fi publics.', link: { label: 'ProtonVPN (gratuit)', url: 'https://protonvpn.com' } },
  'tour-B-1':   { title: 'Comparatif VPN', body: 'Mullvad : anonyme, accepte le cash. ProtonVPN : niveau gratuit disponible. Windscribe : 10Go/mois gratuits. Tous basés en pays respectueux de la vie privée.', link: { label: 'Comparer sur PrivacyGuides', url: 'https://www.privacyguides.org/vpn/' } },
  'port-A-0':   { title: 'Les 5 signes d\'un phishing', body: '1. Urgence artificielle. 2. Fautes d\'orthographe. 3. Lien douteux (survole pour voir l\'URL). 4. Expéditeur inconnu. 5. Demande d\'infos personnelles.', link: { label: 'Guide ANSSI', url: 'https://www.cybermalveillance.gouv.fr' } },
  'port-B-1':   { title: 'Signaler un phishing', body: 'En France : signal-spam.fr ou reportez sur cybermalveillance.gouv.fr. Gmail et Outlook ont un bouton "Signaler comme phishing" intégré.', link: { label: 'signal-spam.fr', url: 'https://www.signal-spam.fr' } },
  'port-B-2':   { title: 'Vérifier un lien suspect', body: 'Avant de cliquer : copie le lien et colle-le sur VirusTotal ou URLScan.io pour vérifier s\'il est malveillant.', link: { label: 'VirusTotal', url: 'https://www.virustotal.com' } },
  'place-A-0':  { title: 'Paramètres Instagram', body: 'Compte → Confidentialité → Compte privé. Désactive aussi "Statut d\'activité" et "Contenu similaire". Révoque les apps tierces inutilisées.', link: { label: 'Ouvrir Instagram Settings', url: 'https://www.instagram.com/accounts/privacy_and_security/' } },
  'place-B-1':  { title: 'Ton droit d\'accès (RGPD)', body: 'En Europe, tu peux demander à n\'importe quelle entreprise quelles données elle détient sur toi. Utilise les modèles d\'email dans l\'onglet Outils.', link: { label: 'Guide CNIL', url: 'https://www.cnil.fr/fr/le-droit-dacces' } },
  'labo-A-0':   { title: 'Alias email — SimpleLogin & AnonAddy', body: 'Un alias email transfère les messages vers ta vraie adresse. Si tu reçois du spam, tu désactives l\'alias. Zéro exposition de ton vrai email.', link: { label: 'SimpleLogin (gratuit)', url: 'https://simplelogin.io' } },
  'labo-C-0':   { title: 'Guide ANSSI pour les jeunes', body: 'L\'ANSSI (Agence Nationale de la Sécurité des Systèmes d\'Information) publie des guides gratuits pour apprendre les bonnes pratiques numériques.', link: { label: 'Télécharger le guide', url: 'https://www.ssi.gouv.fr/particulier/' } },
}

function TaskPopup({ popup, onClose, navigate }) {
  return (
    <motion.div style={PS.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div style={PS.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 22 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--kamo-navy)', lineHeight: 1.3, flex: 1, marginRight: 12 }}>{popup.title}</h3>
          <button onClick={onClose} style={{ background: '#f0f0f8', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} color="#666" />
          </button>
        </div>
        <p style={{ fontFamily: F, fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>{popup.body}</p>
        {popup.link && (
          popup.link.url
            ? <a href={popup.link.url} target="_blank" rel="noreferrer" style={{ ...PS.linkBtn, display: 'inline-flex' }}>
                {popup.link.label} <ExternalLink size={13} />
              </a>
            : <button onClick={() => { onClose(); navigate(popup.link.path) }} style={{ ...PS.linkBtn, border: 'none', cursor: 'pointer' }}>
                {popup.link.label} <ChevronRight size={13} />
              </button>
        )}
      </motion.div>
    </motion.div>
  )
}

const PS = {
  overlay: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(33,33,63,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { background: 'white', borderRadius: 16, padding: '22px', maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  linkBtn: { alignItems: 'center', gap: 6, background: 'var(--kamo-violet)', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 13 },
}

function slideTypeName(type) {
  return { intro: 'Introduction', concept: 'Concept clé', threat: 'Menace réelle', practices: 'Bonnes pratiques', recap: 'Récapitulatif' }[type] || type
}

export default function LocationDetail() {
  const { themeId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useKamo()
  const theme = getTheme(themeId)
  const [view, setView] = useState('slides')
  const [slideIndex, setSlideIndex] = useState(0)
  const [popup, setPopup] = useState(null) // task key string

  if (!theme) { navigate('/map'); return null }

  const progress = getThemeProgress(themeId, state.completedTasks)
  const totalTasks = theme.sections.reduce((a, s) => a + s.tasks.length, 0)
  const doneTasks = Math.round(progress * totalTasks)

  const isTaskDone = (sId, ti) => !!state.completedTasks[`${themeId}-${sId}-${ti}`]

  const toggleTask = (sId, ti) => {
    const key = `${themeId}-${sId}-${ti}`
    if (state.completedTasks[key]) {
      dispatch({ type: 'UNCOMPLETE_TASK', payload: key })
    } else {
      dispatch({ type: 'COMPLETE_TASK', payload: key })
    }
  }

  const slide = theme.slides[slideIndex]

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ ...S.headerBg, background: theme.colorLight }}>
        <div style={S.headerInner}>
          <button style={S.back} onClick={() => navigate('/map')}>
            <ChevronLeft size={17} /> Carte
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={THEME_IMAGES[themeId] || IMG.wave} alt="" style={{ width: 56, height: 56, objectFit: 'contain' }} />
            <div>
              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 24, color: 'var(--kamo-navy)', marginBottom: 1 }}>{theme.name}</h1>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{theme.subtitle}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 5, background: '#ddd', borderRadius: 3, overflow: 'hidden', width: 120 }}>
              <div style={{ height: '100%', background: theme.color, borderRadius: 3, width: `${progress * 100}%`, transition: 'width 0.4s' }} />
            </div>
            <span style={{ fontFamily: F, fontSize: 12, color: '#888' }}>{doneTasks}/{totalTasks}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        <div style={S.tabsInner}>
          {[{ id: 'slides', label: 'Cours' }, { id: 'tasks', label: 'Tâches' }].map(tab => (
            <button key={tab.id} style={{ ...S.tab, color: view === tab.id ? theme.color : '#999', borderBottom: view === tab.id ? `2px solid ${theme.color}` : '2px solid transparent', fontWeight: view === tab.id ? 700 : 400, fontFamily: F }}
              onClick={() => { setView(tab.id); if (tab.id === 'slides') setSlideIndex(0) }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={S.content}>
        <AnimatePresence mode="wait">

          {/* Slides */}
          {view === 'slides' && (
            <motion.div key="slides" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              {/* Progress dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                {theme.slides.map((_, i) => (
                  <button key={i} onClick={() => setSlideIndex(i)}
                    style={{ height: 7, width: i === slideIndex ? 22 : 7, borderRadius: 4, background: i === slideIndex ? theme.color : i < slideIndex ? `${theme.color}55` : '#ddd', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
                <span style={{ marginLeft: 6, fontFamily: F, fontSize: 11, color: '#aaa' }}>{slideIndex + 1}/{theme.slides.length}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={slideIndex} style={S.slideCard}
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                  <div style={{ display: 'inline-block', background: `${theme.color}18`, color: theme.color, borderRadius: 20, padding: '3px 12px', fontFamily: F, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                    {slideTypeName(slide.type)}
                  </div>
                  <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: 'var(--kamo-navy)', marginBottom: 10, lineHeight: 1.3 }}>{slide.title}</h2>
                  <p style={{ fontFamily: F, fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: slide.knowThat || slide.example || slide.practices ? 16 : 0 }}>{slide.content}</p>

                  {slide.knowThat && (
                    <div style={{ background: 'rgba(106,106,244,0.07)', border: '1px solid rgba(106,106,244,0.15)', borderRadius: 10, padding: '14px', marginBottom: 14 }}>
                      <p style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: theme.color, marginBottom: 6 }}>Le saviez-vous ?</p>
                      <p style={{ fontFamily: F, fontSize: 13, color: '#555', lineHeight: 1.6 }}>{slide.knowThat}</p>
                    </div>
                  )}
                  {slide.example && (
                    <div style={{ background: 'rgba(252,93,0,0.06)', border: '1px solid rgba(252,93,0,0.15)', borderRadius: 10, padding: '14px', marginBottom: 14 }}>
                      <p style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'var(--kamo-orange)', marginBottom: 6 }}>Exemple concret</p>
                      <p style={{ fontFamily: F, fontSize: 13, color: '#555', lineHeight: 1.6 }}>{slide.example}</p>
                    </div>
                  )}
                  {slide.practices && (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {slide.practices.map((p, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: theme.color, flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>
                          <span style={{ fontFamily: F, fontSize: 13, color: 'var(--kamo-navy)', lineHeight: 1.5 }}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>

              <div style={S.slideNav}>
                <button style={S.navBtn} onClick={() => setSlideIndex(i => Math.max(0, i - 1))} disabled={slideIndex === 0}>
                  <ChevronLeft size={15} /> Précédent
                </button>
                {slideIndex < theme.slides.length - 1
                  ? <button style={{ ...S.navBtn, background: theme.color, color: 'white', border: 'none' }} onClick={() => setSlideIndex(i => i + 1)}>
                      Suivant <ChevronRight size={15} />
                    </button>
                  : <button style={{ ...S.navBtn, background: theme.color, color: 'white', border: 'none' }} onClick={() => setView('tasks')}>
                      Voir les tâches <ChevronRight size={15} />
                    </button>
                }
              </div>
            </motion.div>
          )}

          {/* Tasks */}
          {view === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <img src={IMG.book} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                <p style={{ fontFamily: F, fontSize: 13, color: '#888' }}>Clique sur une tâche pour la cocher ou la décocher. Certaines ont des infos supplémentaires.</p>
              </div>

              {theme.sections.map((section) => (
                <div key={section.id} style={{ marginBottom: 24 }}>
                  <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', color: theme.color, marginBottom: 10 }}>
                    {section.title}
                  </h3>
                  {section.tasks.map((task, ti) => {
                    const key = `${themeId}-${section.id}-${ti}`
                    const done = isTaskDone(section.id, ti)
                    const hasPopup = !!TASK_POPUPS[key]

                    return (
                      <div key={ti} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <motion.button
                          style={{ ...S.task, flex: 1, background: done ? `${theme.color}0D` : 'white', borderColor: done ? `${theme.color}50` : '#e5e5f0' }}
                          onClick={() => toggleTask(section.id, ti)}
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <span style={{ color: done ? theme.color : '#ccc', flexShrink: 0 }}>
                            {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                          </span>
                          <span style={{ fontFamily: F, fontSize: 13, flex: 1, textAlign: 'left', lineHeight: 1.4, color: done ? theme.color : 'var(--kamo-navy)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.65 : 1 }}>
                            {task}
                          </span>
                          {!done && <span style={{ fontFamily: F, fontSize: 11, color: '#ccc', flexShrink: 0 }}>+1 🪰</span>}
                        </motion.button>

                        {hasPopup && (
                          <motion.button
                            style={S.infoBtn}
                            onClick={() => setPopup(key)}
                            whileHover={{ scale: 1.08 }}
                            title="En savoir plus">
                            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'var(--kamo-violet)' }}>?</span>
                          </motion.button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

              {progress === 1 && (
                <motion.div style={{ ...S.completeBox, borderColor: theme.color, background: `${theme.color}0A` }}
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <img src={IMG.shield} alt="" style={{ width: 60, height: 60, objectFit: 'contain' }} />
                  <p style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: theme.color }}>Thème complété !</p>
                  <p style={{ fontFamily: F, fontSize: 13, color: '#888' }}>Les outils liés à ce thème sont maintenant disponibles.</p>
                  <button style={{ ...S.navBtn, background: theme.color, color: 'white', border: 'none', marginTop: 8, cursor: 'pointer' }} onClick={() => navigate('/tools')}>
                    Voir les outils <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task popup */}
      <AnimatePresence>
        {popup && <TaskPopup popup={TASK_POPUPS[popup]} onClose={() => setPopup(null)} navigate={navigate} />}
      </AnimatePresence>
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
  page: { minHeight: '100vh', background: 'var(--kamo-bg)' },
  headerBg: { padding: '18px 16px', borderBottom: '1px solid rgba(106,106,244,0.1)' },
  headerInner: { maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 },
  back: { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', fontFamily: 'var(--font)', fontSize: 13, color: '#888', cursor: 'pointer', padding: 0 },
  tabs: { background: 'white', borderBottom: '1px solid rgba(106,106,244,0.1)', position: 'sticky', top: 68, zIndex: 10 },
  tabsInner: { maxWidth: 700, margin: '0 auto', display: 'flex' },
  tab: { flex: 1, padding: '14px', background: 'transparent', border: 'none', fontSize: 14, cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all 0.2s' },
  content: { maxWidth: 700, margin: '0 auto', padding: '24px 16px' },
  slideCard: { background: 'white', borderRadius: 16, padding: '22px', boxShadow: '0 4px 20px rgba(106,106,244,0.09)', border: '1px solid rgba(106,106,244,0.1)', marginBottom: 18, minHeight: 180 },
  slideNav: { display: 'flex', justifyContent: 'space-between', gap: 10 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 5, border: '1.5px solid #e5e5f0', borderRadius: 10, padding: '11px 18px', background: 'white', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, color: '#888', cursor: 'pointer' },
  task: { display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid', borderRadius: 10, padding: '11px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
  infoBtn: { width: 36, height: 36, background: 'rgba(106,106,244,0.1)', border: '1.5px solid rgba(106,106,244,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, alignSelf: 'center' },
  completeBox: { borderRadius: 16, border: '2px solid', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 16 },
}
