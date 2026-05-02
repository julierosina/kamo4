# Kamo — Compagnon de camouflage numérique

## Lancer en local

```bash
npm install
npm run dev
# → http://localhost:5173/
```

## Déployer sur GitHub Pages

### 1. Créer le repo GitHub

Va sur https://github.com/new et crée un repo nommé **`kamo`**.

### 2. Initialiser Git et pusher

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/julierosina/kamo.git
git push -u origin main
```

### 3. Mettre à jour le homepage dans package.json

Ouvre `package.json` et remplace `julierosina` par ton vrai nom d'utilisateur GitHub :

```json
"homepage": "https://julierosina.github.io/kamo"
```

### 4. Déployer

```bash
npm run deploy
```

C'est tout. Ton site sera live sur `https://julierosina.github.io/kamo` dans ~2 minutes.

> **Note :** Le routing utilise HashRouter (`#/dashboard` etc.) pour garantir la compatibilité GitHub Pages — pas besoin de fichier `404.html`.

## Stack

- React 18 + Vite
- React Router v6 (HashRouter)
- Framer Motion
- Lucide React
- Context + localStorage (pas de serveur)
