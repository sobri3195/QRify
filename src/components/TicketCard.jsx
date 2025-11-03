import { QRCodeSVG } from 'qrcode.react'
import './TicketCard.css'

export default function TicketCard({ ticket, settings }) {
  const qrData = JSON.stringify({
    id: ticket.id,
    number: ticket.number
  })

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h3 className="ticket-org">{settings?.organizationName || 'Tix/Voucher Suite'}</h3>
        <div className="ticket-number">{ticket.number}</div>
      </div>
      
      <div className="ticket-qr">
        <QRCodeSVG 
          value={qrData} 
          size={150}
          level="H"
          includeMargin={true}
        />
      </div>
      
      <div className="ticket-info">
        <div className="ticket-meta">
          <span className="ticket-meta-label">Generated:</span>
          <span className="ticket-meta-value">
            {new Date(ticket.generatedAt).toLocaleString()}
          </span>
        </div>
        
        {ticket.extra && (
          <div className="ticket-extra">
            <span className="ticket-meta-label">Info:</span>
            <span className="ticket-meta-value">{ticket.extra}</span>
          </div>
        )}
        
        {ticket.scannedAt && (
          <div className="ticket-scanned">
            <span className="ticket-meta-label">Scanned:</span>
            <span className="ticket-meta-value">
              {new Date(ticket.scannedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      
      <div className="ticket-footer">
        <div className="ticket-id">ID: {ticket.id.substring(0, 8)}...</div>
      </div>
    </div>
  )
}
