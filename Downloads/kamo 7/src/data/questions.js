// src/data/questions.js
// Questions du diagnostic Kamo
// Chaque question a : id, texte, icône lucide, catégorie de score, et options pondérées

export const QUESTIONS = [
  {
    id: 'q1',
    icon: 'KeyRound',
    emoji: '🔐',
    label: 'Mots de passe',
    category: 'passwords',
    question: 'Comment gères-tu tes mots de passe ?',
    multi: false,
    options: [
      { text: "J'utilise le même mot de passe pour plusieurs sites", score: 0 },
      { text: "J'utilise des mots de passe différents mais je les retiens de tête", score: 30 },
      { text: "J'utilise un gestionnaire de mots de passe (Bitwarden, 1Password, etc.)", score: 100 },
      { text: "J'utilise le gestionnaire intégré à mon navigateur", score: 70 },
    ],
  },
  {
    id: 'q2',
    icon: 'ShieldCheck',
    emoji: '🛡️',
    label: 'Double authentification',
    category: 'passwords',
    question: 'Utilises-tu la double authentification (2FA) ?',
    multi: false,
    options: [
      { text: "Non, je ne sais pas ce que c'est", score: 0 },
      { text: "Non, je trouve ça trop contraignant", score: 10 },
      { text: "Oui, par SMS", score: 60 },
      { text: "Oui, par application (Authy, Google Authenticator, etc.)", score: 100 },
    ],
  },
  {
    id: 'q3',
    icon: 'Wifi',
    emoji: '📡',
    label: 'Réseaux Wi-Fi publics',
    category: 'networks',
    question: "Que fais-tu quand tu te connectes à un Wi-Fi public (café, aéroport…) ?",
    multi: false,
    options: [
      { text: "Je me connecte sans réfléchir", score: 0 },
      { text: "J'évite les sites sensibles (banque, etc.)", score: 40 },
      { text: "J'utilise un VPN", score: 90 },
      { text: "Je ne me connecte jamais aux Wi-Fi publics", score: 100 },
    ],
  },
  {
    id: 'q4',
    icon: 'VpnKey',
    emoji: '🕵️',
    label: 'VPN',
    category: 'networks',
    question: "Utilises-tu un VPN ?",
    multi: false,
    options: [
      { text: "Non, jamais", score: 0 },
      { text: "Rarement, seulement quand j'y pense", score: 25 },
      { text: "Oui, parfois", score: 60 },
      { text: "Oui, presque tout le temps", score: 100 },
    ],
  },
  {
    id: 'q5',
    icon: 'FishOff',
    emoji: '🎣',
    label: 'Phishing',
    category: 'phishing',
    question: "Qu'est-ce que tu fais quand tu reçois un email suspect te demandant de cliquer sur un lien ?",
    multi: false,
    options: [
      { text: "Je clique si ça a l'air officiel", score: 0 },
      { text: "Je lis attentivement avant de cliquer", score: 30 },
      { text: "Je vérifie l'adresse de l'expéditeur et le lien avant tout", score: 80 },
      { text: "Je signale le mail et je le supprime sans cliquer", score: 100 },
    ],
  },
  {
    id: 'q6',
    icon: 'Smartphone',
    emoji: '📱',
    label: 'Réseaux sociaux',
    category: 'privacy',
    question: "Quels réseaux sociaux utilises-tu régulièrement ?",
    multi: true,
    options: [
      { text: "Instagram", score: 0 },
      { text: "TikTok", score: 0 },
      { text: "Snapchat", score: 0 },
      { text: "LinkedIn", score: 0 },
      { text: "X (Twitter)", score: 0 },
      { text: "Discord", score: 0 },
      { text: "Aucun", score: 100 },
    ],
    // Question informative, pas de scoring direct
    infoOnly: true,
  },
  {
    id: 'q7',
    icon: 'Eye',
    emoji: '👁️',
    label: 'Vie privée',
    category: 'privacy',
    question: "As-tu déjà vérifié les paramètres de confidentialité de tes réseaux sociaux ?",
    multi: false,
    options: [
      { text: "Non, jamais", score: 0 },
      { text: "Oui, lors de l'inscription", score: 30 },
      { text: "Oui, je les vérifie régulièrement", score: 80 },
      { text: "J'ai tout mis en privé et je contrôle mes données", score: 100 },
    ],
  },
]

/**
 * Calcule les scores par catégorie à partir des réponses du diagnostic
 * @param {Object} answers - { questionId: [optionIndices] }
 * @returns {Object} scores - { passwords, networks, phishing, privacy, tools }
 */
export function computeScores(answers) {
  const totals = { passwords: [], networks: [], phishing: [], privacy: [], tools: [] }

  for (const q of QUESTIONS) {
    if (q.infoOnly) continue
    const selected = answers[q.id] || []
    if (selected.length === 0) continue
    // Prendre le meilleur score parmi les réponses sélectionnées
    const best = Math.max(...selected.map(i => q.options[i]?.score ?? 0))
    totals[q.category].push(best)
  }

  const scores = {}
  for (const [cat, vals] of Object.entries(totals)) {
    scores[cat] = vals.length > 0
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 0
  }
  return scores
}
