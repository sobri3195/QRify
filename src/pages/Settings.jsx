import { useState } from 'react'
import { useTickets } from '../context/TicketContext'
import { Download, Upload, Trash2, Building2, Users } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const { 
    settings, 
    updateSettings, 
    exportData, 
    importData, 
    clearAllData,
    tickets 
  } = useTickets()
  
  const [orgName, setOrgName] = useState(settings.organizationName)
  const [maxUsers, setMaxUsers] = useState(settings.maxUsers)

  const handleSaveSettings = () => {
    updateSettings({
      organizationName: orgName,
      maxUsers: parseInt(maxUsers)
    })
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      importData(file)
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all tickets? This action cannot be undone.')) {
      clearAllData()
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your application</p>
      </div>

      <div className="card">
        <h3 className="section-title">
          <Building2 size={24} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Organization Settings
        </h3>
        
        <div className="form-group">
          <label htmlFor="orgName">Organization Name</label>
          <input
            type="text"
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="My Organization"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxUsers">
            <Users size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Max Concurrent Users
          </label>
          <input
            type="number"
            id="maxUsers"
            min="1"
            max="20"
            value={maxUsers}
            onChange={(e) => setMaxUsers(e.target.value)}
          />
          <small className="help-text">
            Demo version supports localStorage only. See README for multi-user backend integration.
          </small>
        </div>

        <button className="button" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>

      <div className="card">
        <h3 className="section-title">Data Management</h3>
        
        <div className="stats-info">
          <div className="info-item">
            <span className="info-label">Total Tickets:</span>
            <span className="info-value">{tickets.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Scanned:</span>
            <span className="info-value">{tickets.filter(t => t.scannedAt).length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Storage:</span>
            <span className="info-value">localStorage</span>
          </div>
        </div>

        <div className="button-group">
          <button className="button button-success" onClick={exportData}>
            <Download size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Export Data (JSON)
          </button>

          <label className="button button-secondary file-input-label">
            <Upload size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Import Data (JSON)
            <input 
              type="file" 
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>

          <button className="button button-danger" onClick={handleClearAll}>
            <Trash2 size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Clear All Data
          </button>
        </div>
      </div>

      <div className="card info-card">
        <h3 className="section-title">About</h3>
        <p><strong>Tix/Voucher Suite v1.0</strong></p>
        <p>A complete ticket generation and management system.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          This demo version uses localStorage for data persistence. For production use with 
          4-20 concurrent users, integrate with a backend API. See README.md for detailed 
          instructions on backend integration.
        </p>
      </div>

      <div className="card info-card">
        <h3 className="section-title">Multi-User Backend Integration</h3>
        <div className="code-block">
          <p style={{ marginBottom: '1rem', fontWeight: 600 }}>Quick Backend Integration Guide:</p>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Create REST API endpoints for tickets (GET, POST, PUT)</li>
            <li>Replace localStorage calls in TicketContext.jsx with API calls</li>
            <li>Add authentication (JWT recommended)</li>
            <li>Implement real-time updates with WebSockets or polling</li>
          </ol>
          <pre style={{ 
            background: '#1f2937', 
            color: '#f9fafb', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
{`// Example API endpoints:
POST   /api/tickets/generate
GET    /api/tickets
PUT    /api/tickets/:id/scan
GET    /api/reports/stats`}
          </pre>
        </div>
      </div>
    </div>
  )
}
