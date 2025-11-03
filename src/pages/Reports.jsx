import { useState, useMemo } from 'react'
import { useTickets } from '../context/TicketContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, CheckCircle2, Clock } from 'lucide-react'
import './Reports.css'

export default function Reports() {
  const { tickets } = useTickets()
  const [filter, setFilter] = useState('all')
  const [period, setPeriod] = useState('daily')

  const stats = useMemo(() => {
    const total = tickets.length
    const scanned = tickets.filter(t => t.scannedAt).length
    const notScanned = total - scanned
    const scanRate = total > 0 ? ((scanned / total) * 100).toFixed(1) : 0

    return { total, scanned, notScanned, scanRate }
  }, [tickets])

  const chartData = useMemo(() => {
    const data = {}
    
    tickets.forEach(ticket => {
      let dateKey
      const date = new Date(ticket.generatedAt)
      
      if (period === 'daily') {
        dateKey = date.toLocaleDateString()
      } else if (period === 'weekly') {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        dateKey = weekStart.toLocaleDateString()
      } else {
        dateKey = `${date.getMonth() + 1}/${date.getFullYear()}`
      }
      
      if (!data[dateKey]) {
        data[dateKey] = { date: dateKey, generated: 0, scanned: 0 }
      }
      data[dateKey].generated++
      if (ticket.scannedAt) {
        data[dateKey].scanned++
      }
    })
    
    return Object.values(data).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
  }, [tickets, period])

  const filteredTickets = useMemo(() => {
    switch (filter) {
      case 'scanned':
        return tickets.filter(t => t.scannedAt)
      case 'not-scanned':
        return tickets.filter(t => !t.scannedAt)
      default:
        return tickets
    }
  }, [tickets, filter])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Ticket statistics and analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Package size={32} />
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tickets</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <CheckCircle2 size={32} />
          <div className="stat-value">{stats.scanned}</div>
          <div className="stat-label">Scanned</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <Clock size={32} />
          <div className="stat-value">{stats.notScanned}</div>
          <div className="stat-label">Not Scanned</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
          <TrendingUp size={32} />
          <div className="stat-value">{stats.scanRate}%</div>
          <div className="stat-label">Scan Rate</div>
        </div>
      </div>

      <div className="card">
        <div className="chart-header">
          <h3>Generated vs Scanned</h3>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="generated" fill="#3b82f6" name="Generated" />
            <Bar dataKey="scanned" fill="#10b981" name="Scanned" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="table-header">
          <h3>Ticket List</h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tickets</option>
            <option value="scanned">Scanned Only</option>
            <option value="not-scanned">Not Scanned</option>
          </select>
        </div>

        <div className="table-container">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Generated</th>
                <th>Status</th>
                <th>Scanned At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td className="ticket-number-cell">{ticket.number}</td>
                    <td>{new Date(ticket.generatedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${ticket.scannedAt ? 'scanned' : 'pending'}`}>
                        {ticket.scannedAt ? 'Scanned' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {ticket.scannedAt 
                        ? new Date(ticket.scannedAt).toLocaleString()
                        : '-'
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
