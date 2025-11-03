import { useState, useEffect } from 'react'
import BottomNavigation from './components/BottomNavigation'
import Generate from './pages/Generate'
import Scan from './pages/Scan'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Toast from './components/Toast'
import { TicketProvider } from './context/TicketContext'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('generate')

  const renderPage = () => {
    switch (activeTab) {
      case 'generate':
        return <Generate />
      case 'scan':
        return <Scan />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Generate />
    }
  }

  return (
    <TicketProvider>
      <div className="app">
        <div className="app-container">
          {renderPage()}
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <Toast />
      </div>
    </TicketProvider>
  )
}

export default App
