// src/main.jsx
// Point d'entrée de l'application React Kamo
// Monte le composant App dans le DOM avec le contexte global

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
