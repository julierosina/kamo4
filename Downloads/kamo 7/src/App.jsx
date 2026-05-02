// src/App.jsx
// Using HashRouter for GitHub Pages compatibility.
// HashRouter uses #/route instead of /route, so GitHub Pages never 404s on refresh.

import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { KamoProvider, useKamo } from './context/KamoContext.jsx'
import Navbar from './components/Navbar.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Map from './pages/Map.jsx'
import Tools from './pages/Tools.jsx'
import LocationDetail from './pages/LocationDetail.jsx'
import Chat from './pages/Chat.jsx'

function AppRoutes() {
  const { state } = useKamo()
  if (!state.hasCompletedOnboarding) {
    return <Routes><Route path="*" element={<Onboarding />} /></Routes>
  }
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/map/:themeId" element={<LocationDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <style>{`
        .page-content { padding-bottom: 80px; }
        @media (min-width: 768px) { .page-content { padding-bottom: 0; padding-top: 68px; } }
      `}</style>
    </>
  )
}

export default function App() {
  return (
    <KamoProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </KamoProvider>
  )
}
