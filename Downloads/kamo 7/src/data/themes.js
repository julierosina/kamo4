// src/data/themes.js
// Définition des 5 thèmes / lieux de la Carte Kamo
// Chaque thème contient : métadonnées, slides pédagogiques et tâches

export const THEMES = [
  {
    id: 'banque',
    name: 'La Banque',
    subtitle: 'Mots de passe & Accès',
    emoji: '🏦',
    icon: 'KeyRound',
    color: 'var(--kamo-blue-act)',
    colorLight: '#e8f4ff',
    category: 'passwords',
    slides: [
      {
        title: 'Bienvenue à La Banque',
        content: "[CONTENU PLACEHOLDER — Thème : La Banque / Slide 1]\nTes mots de passe sont les clés de ton identité numérique. Un mot de passe faible, c'est comme laisser ta porte ouverte. Dans ce module, tu vas apprendre à créer des accès vraiment sécurisés.",
        type: 'intro',
      },
      {
        title: "Qu'est-ce qu'un bon mot de passe ?",
        content: "[CONTENU PLACEHOLDER — Thème : La Banque / Slide 2]\nUn bon mot de passe est long (12+ caractères), aléatoire, et unique par site. Il combine majuscules, minuscules, chiffres et symboles.",
        knowThat: "Le saviez-vous ? 80 % des violations de données impliquent des mots de passe compromis ou trop simples.",
        type: 'concept',
      },
      {
        title: 'La menace : le Credential Stuffing',
        content: "[CONTENU PLACEHOLDER — Thème : La Banque / Slide 3]\nSi tu utilises le même mot de passe partout et que l'un de tes comptes est compromis, les hackers vont tester ce même mot de passe sur tous les autres sites. C'est automatique et massif.",
        example: "Exemple : En 2021, 3,2 milliards de paires email/mot de passe ont été publiées en ligne.",
        type: 'threat',
      },
      {
        title: 'Les bonnes pratiques',
        content: "[CONTENU PLACEHOLDER — Thème : La Banque / Slide 4]",
        practices: [
          "Utilise un gestionnaire de mots de passe (Bitwarden est gratuit et open source)",
          "Active la double authentification partout où c'est possible",
          "Utilise une application d'authentification plutôt que le SMS",
          "Ne partage jamais tes mots de passe, même avec des amis",
        ],
        type: 'practices',
      },
      {
        title: 'Récapitulatif',
        content: "[CONTENU PLACEHOLDER — Thème : La Banque / Slide 5]\nTu sais maintenant l'importance des mots de passe forts et uniques. Place aux actions concrètes !",
        type: 'recap',
      },
    ],
    sections: [
      {
        id: 'A',
        title: 'Comprendre les mots de passe',
        tasks: [
          "Lire la fiche sur ce qu'est un bon mot de passe",
          "Tester la force de ton mot de passe actuel (→ outil)",
          "Identifier tes 3 comptes les plus importants",
        ],
      },
      {
        id: 'B',
        title: 'Adopter un gestionnaire',
        tasks: [
          "Lire la comparaison Bitwarden vs 1Password vs Dashlane",
          "Installer un gestionnaire de mots de passe",
          "Créer ton premier mot de passe sécurisé avec le gestionnaire",
        ],
      },
      {
        id: 'C',
        title: 'Double authentification',
        tasks: [
          "Activer le 2FA sur ton compte email principal",
          "Activer le 2FA sur ton réseau social le plus utilisé",
          "Télécharger une application d'authentification",
        ],
      },
    ],
  },
  {
    id: 'tour',
    name: 'La Tour',
    subtitle: 'Réseaux & Connexions',
    emoji: '📡',
    icon: 'Wifi',
    color: 'var(--kamo-teal)',
    colorLight: '#e0f7f7',
    category: 'networks',
    slides: [
      {
        title: 'Bienvenue à La Tour',
        content: "[CONTENU PLACEHOLDER — Thème : La Tour / Slide 1]\nChaque connexion que tu fais laisse des traces. Les réseaux publics, ton Wi-Fi à la maison, ton VPN… tout ça joue un rôle dans ta sécurité en ligne.",
        type: 'intro',
      },
      {
        title: 'Qu\'est-ce que le chiffrement ?',
        content: "[CONTENU PLACEHOLDER — Thème : La Tour / Slide 2]\nQuand tu te connectes à un site en HTTPS, tes données sont chiffrées entre toi et le serveur. Sur un Wi-Fi public, sans chiffrement, tout le monde peut lire ton trafic.",
        knowThat: "Le saviez-vous ? Sur un Wi-Fi public non sécurisé, une attaque 'man in the middle' peut intercepter tes données en quelques secondes.",
        type: 'concept',
      },
      {
        title: 'La menace : les réseaux publics',
        content: "[CONTENU PLACEHOLDER — Thème : La Tour / Slide 3]\nLes hackers créent parfois de faux réseaux Wi-Fi avec des noms comme 'Free_Airport_WiFi'. Une fois connecté, ils interceptent tout.",
        example: "Exemple concret : un hacker dans un café peut voir tous tes mots de passe si tu n'utilises pas HTTPS ou un VPN.",
        type: 'threat',
      },
      {
        title: 'Les bonnes pratiques',
        content: "[CONTENU PLACEHOLDER — Thème : La Tour / Slide 4]",
        practices: [
          "Utilise un VPN sur les réseaux publics",
          "Vérifie toujours que l'URL commence par HTTPS",
          "Change le mot de passe par défaut de ta box internet",
          "Active le chiffrement WPA3 sur ton réseau domestique",
        ],
        type: 'practices',
      },
      {
        title: 'Récapitulatif',
        content: "[CONTENU PLACEHOLDER — Thème : La Tour / Slide 5]\nTu comprends maintenant les risques des réseaux. Passons aux actions !",
        type: 'recap',
      },
    ],
    sections: [
      {
        id: 'A',
        title: 'Wi-Fi public',
        tasks: [
          "Lire les risques du Wi-Fi public",
          "Identifier les situations où tu te connectes à des Wi-Fi publics",
          "Apprendre à vérifier si une connexion est sécurisée (HTTPS)",
        ],
      },
      {
        id: 'B',
        title: 'VPN',
        tasks: [
          "Comprendre à quoi sert un VPN",
          "Comparer 3 VPN recommandés (Mullvad, ProtonVPN, etc.)",
          "[Optionnel] Installer et tester un VPN gratuit",
        ],
      },
      {
        id: 'C',
        title: 'Ton réseau à la maison',
        tasks: [
          "Vérifier le nom et la sécurité de ton réseau Wi-Fi",
          "Changer le mot de passe de ta box si c'est le mot de passe par défaut",
          "Activer le chiffrement WPA3 si disponible",
        ],
      },
    ],
  },
  {
    id: 'port',
    name: 'Le Port',
    subtitle: 'Phishing & Arnaques',
    emoji: '🎣',
    icon: 'FishOff',
    color: 'var(--kamo-orange)',
    colorLight: '#fff3ea',
    category: 'phishing',
    slides: [
      {
        title: 'Bienvenue au Port',
        content: "[CONTENU PLACEHOLDER — Thème : Le Port / Slide 1]\nLe phishing est l'arnaque en ligne la plus répandue. Des millions de personnes se font avoir chaque année. Dans ce module, tu vas apprendre à détecter et éviter ces pièges.",
        type: 'intro',
      },
      {
        title: "Qu'est-ce que le phishing ?",
        content: "[CONTENU PLACEHOLDER — Thème : Le Port / Slide 2]\nLe phishing (hameçonnage) consiste à se faire passer pour une entité de confiance pour voler tes données : mot de passe, carte bancaire, identité.",
        knowThat: "Le saviez-vous ? En 2023, 3,4 milliards d'emails de phishing sont envoyés chaque jour dans le monde.",
        type: 'concept',
      },
      {
        title: 'La menace : le spear phishing',
        content: "[CONTENU PLACEHOLDER — Thème : Le Port / Slide 3]\nLe spear phishing cible une personne spécifique avec des informations personnelles. L'email semble provenir de quelqu'un que tu connais.",
        example: "Exemple : un email apparemment de ta banque, avec ton prénom, ton numéro de compte masqué et un bouton 'Vérifier mon identité'.",
        type: 'threat',
      },
      {
        title: 'Les 5 signes d\'un email de phishing',
        content: "[CONTENU PLACEHOLDER — Thème : Le Port / Slide 4]",
        practices: [
          "L'adresse email de l'expéditeur est bizarre ou mal orthographiée",
          "Le message crée une urgence artificielle ('Ton compte sera supprimé dans 24h')",
          "Il y a des fautes d'orthographe ou une mise en forme étrange",
          "Le lien ne correspond pas au domaine officiel",
          "On te demande ton mot de passe ou des informations bancaires",
        ],
        type: 'practices',
      },
      {
        title: 'Récapitulatif',
        content: "[CONTENU PLACEHOLDER — Thème : Le Port / Slide 5]\nTu sais maintenant reconnaître les tentatives de phishing. Entraîne-toi avec les tâches ci-dessous !",
        type: 'recap',
      },
    ],
    sections: [
      {
        id: 'A',
        title: 'Reconnaître le phishing',
        tasks: [
          "Lire les 5 signes d'un email de phishing",
          "Analyser un exemple d'email frauduleux (interactif)",
          "Faire le mini-quiz : vrai ou faux email ?",
        ],
      },
      {
        id: 'B',
        title: 'Réagir à une tentative',
        tasks: [
          "Savoir quoi faire si tu as cliqué sur un lien suspect",
          "Apprendre à signaler un phishing (Signal Spam, ANSSI)",
          "Vérifier si un lien est sûr avant de cliquer (outil VirusTotal)",
        ],
      },
      {
        id: 'C',
        title: 'Arnaques sur les réseaux',
        tasks: [
          "Identifier les arnaques courantes sur Instagram et TikTok",
          "Comprendre les faux concours et faux cadeaux",
          "Signaler un compte frauduleux sur un réseau social",
        ],
      },
    ],
  },
  {
    id: 'place',
    name: 'La Place publique',
    subtitle: 'Vie privée & Réseaux sociaux',
    emoji: '👁️',
    icon: 'Eye',
    color: 'var(--kamo-purple)',
    colorLight: '#f9eef9',
    category: 'privacy',
    slides: [
      {
        title: 'Bienvenue à La Place publique',
        content: "[CONTENU PLACEHOLDER — Thème : La Place publique / Slide 1]\nTes réseaux sociaux en savent plus sur toi que tu ne le crois. Dans ce module, tu vas reprendre le contrôle de ton empreinte numérique.",
        type: 'intro',
      },
      {
        title: 'Ton empreinte numérique',
        content: "[CONTENU PLACEHOLDER — Thème : La Place publique / Slide 2]\nChaque publication, like, localisation partagée construit un profil de toi. Ces données sont précieuses pour les annonceurs — et dangereuses si elles tombent dans de mauvaises mains.",
        knowThat: "Le saviez-vous ? Facebook connaît plus de 98 points de données personnels sur chaque utilisateur, même ceux qui n'ont pas de compte.",
        type: 'concept',
      },
      {
        title: 'La menace : le doxxing',
        content: "[CONTENU PLACEHOLDER — Thème : La Place publique / Slide 3]\nLe doxxing consiste à collecter et publier des informations personnelles sur quelqu'un sans son consentement. Ça peut aller de l'adresse personnelle aux informations bancaires.",
        example: "Exemple : à partir de tes posts Instagram, quelqu'un peut identifier ta ville, ton quartier, ton lieu de travail et tes habitudes.",
        type: 'threat',
      },
      {
        title: 'Les bonnes pratiques',
        content: "[CONTENU PLACEHOLDER — Thème : La Place publique / Slide 4]",
        practices: [
          "Mets tes comptes en privé sur les réseaux sociaux",
          "Ne partage pas ta localisation en temps réel",
          "Utilise des pseudonymes pour les inscriptions non-essentielles",
          "Vérifie régulièrement tes paramètres de confidentialité",
          "Exercice ton droit d'accès et de suppression (RGPD)",
        ],
        type: 'practices',
      },
      {
        title: 'Récapitulatif',
        content: "[CONTENU PLACEHOLDER — Thème : La Place publique / Slide 5]\nTu as maintenant les clés pour protéger ta vie privée en ligne. Passons aux actions !",
        type: 'recap',
      },
    ],
    sections: [
      {
        id: 'A',
        title: 'Tes paramètres de confidentialité',
        tasks: [
          "Vérifier les paramètres de confidentialité d'Instagram",
          "Vérifier les paramètres de confidentialité de TikTok",
          "Décider quelles infos sont publiques sur ton profil LinkedIn",
        ],
      },
      {
        id: 'B',
        title: 'Tes données personnelles',
        tasks: [
          "Comprendre quelles données les apps collectent sur toi",
          "Savoir exercer ton droit d'accès (RGPD)",
          "Utiliser l'outil 'Email de demande de données' dans Outils",
        ],
      },
      {
        id: 'C',
        title: 'Ton empreinte numérique',
        tasks: [
          "Googler ton propre nom et voir ce qui apparaît",
          "Utiliser le générateur de pseudonyme pour certains usages",
          "Comprendre les métadonnées des photos que tu partages",
        ],
      },
    ],
  },
  {
    id: 'labo',
    name: 'Le Laboratoire',
    subtitle: 'Outils & Bonnes pratiques',
    emoji: '🛠️',
    icon: 'FlaskConical',
    color: 'var(--kamo-green)',
    colorLight: '#e8f5ee',
    category: 'tools',
    slides: [
      {
        title: 'Bienvenue au Laboratoire',
        content: "[CONTENU PLACEHOLDER — Thème : Le Laboratoire / Slide 1]\nIci, tu vas découvrir des outils concrets pour améliorer ta sécurité numérique au quotidien. Des gestes simples qui font une grande différence.",
        type: 'intro',
      },
      {
        title: 'Les alias email',
        content: "[CONTENU PLACEHOLDER — Thème : Le Laboratoire / Slide 2]\nUn alias email te permet de créer une adresse temporaire pour t'inscrire sur des services sans exposer ton vrai email. Si tu reçois du spam, tu supprimes l'alias.",
        knowThat: "Le saviez-vous ? SimpleLogin et AnonAddy permettent de créer des alias email gratuitement et de les désactiver en un clic.",
        type: 'concept',
      },
      {
        title: 'La menace : les mises à jour ignorées',
        content: "[CONTENU PLACEHOLDER — Thème : Le Laboratoire / Slide 3]\nLes mises à jour corrigent des failles de sécurité. Un appareil non mis à jour est une cible facile pour les hackers.",
        example: "Exemple : la faille WannaCry en 2017 a infecté 200 000 ordinateurs dans 150 pays — tous tournaient sur des systèmes non mis à jour.",
        type: 'threat',
      },
      {
        title: 'Les bonnes pratiques',
        content: "[CONTENU PLACEHOLDER — Thème : Le Laboratoire / Slide 4]",
        practices: [
          "Active les mises à jour automatiques sur tous tes appareils",
          "Utilise un alias email pour les inscriptions non-essentielles",
          "Supprime les applications que tu n'utilises plus",
          "Consulte le guide ANSSI pour aller plus loin",
        ],
        type: 'practices',
      },
      {
        title: 'Récapitulatif',
        content: "[CONTENU PLACEHOLDER — Thème : Le Laboratoire / Slide 5]\nTu maîtrises maintenant les bons outils pour ta sécurité numérique. Bravo !",
        type: 'recap',
      },
    ],
    sections: [
      {
        id: 'A',
        title: 'Emails et identités',
        tasks: [
          "Créer un alias email pour les inscriptions non-importantes",
          "Utiliser l'outil générateur d'email aléatoire",
          "Comprendre pourquoi utiliser des emails différents",
        ],
      },
      {
        id: 'B',
        title: 'Mises à jour et sécurité système',
        tasks: [
          "Vérifier que ton smartphone est à jour",
          "Activer les mises à jour automatiques sur ton appareil principal",
          "Vérifier les applications installées et supprimer celles inutilisées",
        ],
      },
      {
        id: 'C',
        title: 'Aller plus loin',
        tasks: [
          "Lire le guide ANSSI pour les jeunes",
          "Partager Kamo avec un ami (bouton de partage)",
          "Compléter tous les autres thèmes de la Carte",
        ],
      },
    ],
  },
]

/** Récupère un thème par son id */
export function getTheme(id) {
  return THEMES.find(t => t.id === id)
}

/** Calcule la progression d'un thème (0 à 1) */
export function getThemeProgress(themeId, completedTasks) {
  const theme = getTheme(themeId)
  if (!theme) return 0
  const total = theme.sections.reduce((acc, s) => acc + s.tasks.length, 0)
  let done = 0
  theme.sections.forEach(s => {
    s.tasks.forEach((_, ti) => {
      const key = `${themeId}-${s.id}-${ti}`
      if (completedTasks[key]) done++
    })
  })
  return total > 0 ? done / total : 0
}
