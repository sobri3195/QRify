import { useState } from 'react'
import { useTickets } from '../context/TicketContext'
import TicketCard from '../components/TicketCard'
import { Printer, Undo2 } from 'lucide-react'
import './Generate.css'

export default function Generate() {
  const { generateTickets, settings, undoLastGeneration, lastGeneration } = useTickets()
  const [count, setCount] = useState(10)
  const [prefix, setPrefix] = useState('TIX')
  const [extra, setExtra] = useState('')
  const [generatedTickets, setGeneratedTickets] = useState([])
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = () => {
    if (count < 1 || count > 200) {
      alert('Count must be between 1 and 200')
      return
    }
    const tickets = generateTickets(count, prefix, extra)
    setGeneratedTickets(tickets)
    setShowPreview(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleUndo = () => {
    if (undoLastGeneration()) {
      setGeneratedTickets([])
      setShowPreview(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header no-print">
        <h1 className="page-title">Generate Tickets</h1>
        <p className="page-subtitle">Create new tickets with QR codes</p>
      </div>

      <div className="card no-print">
        <div className="form-group">
          <label htmlFor="count">Number of Tickets (1-200)</label>
          <input
            type="number"
            id="count"
            min="1"
            max="200"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prefix">Ticket Prefix</label>
          <input
            type="text"
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            placeholder="TIX"
          />
        </div>

        <div className="form-group">
          <label htmlFor="extra">Additional Information (Optional)</label>
          <input
            type="text"
            id="extra"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="Event name, location, etc."
          />
        </div>

        <button className="button" onClick={handleGenerate}>
          Generate Tickets
        </button>

        {lastGeneration && lastGeneration.length > 0 && (
          <button 
            className="button button-secondary" 
            onClick={handleUndo}
            style={{ marginTop: '0.5rem' }}
          >
            <Undo2 size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Undo Last Generation ({lastGeneration.length} tickets)
          </button>
        )}
      </div>

      {showPreview && generatedTickets.length > 0 && (
        <>
          <div className="preview-header no-print">
            <h2>Preview & Print</h2>
            <button className="button button-success" onClick={handlePrint}>
              <Printer size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Print Tickets
            </button>
          </div>

          <div className="tickets-grid print-area">
            {generatedTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} settings={settings} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
