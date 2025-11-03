import { Ticket, ScanLine, BarChart3, Settings } from 'lucide-react'
import './BottomNavigation.css'

const navItems = [
  { id: 'generate', label: 'Generate', icon: Ticket },
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function BottomNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav no-print">
      {navItems.map(item => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <Icon size={24} />
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
