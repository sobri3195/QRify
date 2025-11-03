import { useState, useRef } from 'react'
import { useTickets } from '../context/TicketContext'
import { BrowserQRCodeReader } from '@zxing/browser'
import { Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react'
import './Scan.css'

export default function Scan() {
  const { scanTicket } = useTickets()
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [manualInput, setManualInput] = useState('')
  const videoRef = useRef(null)
  const readerRef = useRef(null)

  const startScanning = async () => {
    try {
      const codeReader = new BrowserQRCodeReader()
      readerRef.current = codeReader
      
      const devices = await codeReader.listVideoInputDevices()
      if (devices.length === 0) {
        alert('No camera found')
        return
      }

      setScanning(true)
      
      codeReader.decodeFromVideoDevice(
        devices[0].deviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScanResult(result.getText())
          }
        }
      )
    } catch (error) {
      console.error('Error starting scanner:', error)
      alert('Failed to start camera. Please ensure you have granted camera permissions.')
      setScanning(false)
    }
  }

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset()
      readerRef.current = null
    }
    setScanning(false)
  }

  const handleScanResult = (data) => {
    try {
      const ticketData = JSON.parse(data)
      if (ticketData.id && ticketData.number) {
        const result = scanTicket(ticketData)
        const scanRecord = {
          timestamp: new Date().toISOString(),
          ticket: ticketData,
          success: result.success,
          duplicate: result.duplicate || false,
          message: result.message
        }
        setLastScan(scanRecord)
        setScanHistory(prev => [scanRecord, ...prev.slice(0, 9)])
        
        if (result.success) {
          stopScanning()
        }
      }
    } catch (error) {
      console.error('Invalid QR code data:', error)
    }
  }

  const handleManualScan = () => {
    if (!manualInput.trim()) return
    
    try {
      const ticketData = JSON.parse(manualInput)
      handleScanResult(manualInput)
      setManualInput('')
    } catch (error) {
      const result = scanTicket({ number: manualInput })
      const scanRecord = {
        timestamp: new Date().toISOString(),
        ticket: { number: manualInput },
        success: result.success,
        duplicate: result.duplicate || false,
        message: result.message
      }
      setLastScan(scanRecord)
      setScanHistory(prev => [scanRecord, ...prev.slice(0, 9)])
      setManualInput('')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Scan Tickets</h1>
        <p className="page-subtitle">Scan QR codes to validate tickets</p>
      </div>

      <div className="card">
        <div className="scanner-container">
          <video 
            ref={videoRef} 
            className={`scanner-video ${scanning ? 'active' : ''}`}
          />
          
          {!scanning && (
            <div className="scanner-placeholder">
              <Camera size={64} color="#9ca3af" />
              <p>Click Start Scanning to begin</p>
            </div>
          )}
        </div>

        <div className="scanner-controls">
          {!scanning ? (
            <button className="button button-success" onClick={startScanning}>
              <Camera size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Start Scanning
            </button>
          ) : (
            <button className="button button-danger" onClick={stopScanning}>
              <CameraOff size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Stop Scanning
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Manual Entry</h3>
        <div className="form-group">
          <label htmlFor="manual">Enter Ticket Number or QR Data</label>
          <input
            type="text"
            id="manual"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="TIX-000001 or JSON data"
            onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
          />
        </div>
        <button className="button" onClick={handleManualScan}>
          Scan Manually
        </button>
      </div>

      {lastScan && (
        <div className={`card scan-result ${lastScan.success ? 'success' : 'error'}`}>
          <div className="scan-result-header">
            {lastScan.success ? (
              <CheckCircle size={32} color="#10b981" />
            ) : (
              <XCircle size={32} color="#ef4444" />
            )}
            <h3>{lastScan.message}</h3>
          </div>
          <div className="scan-result-details">
            <p><strong>Ticket:</strong> {lastScan.ticket.number}</p>
            <p><strong>Time:</strong> {new Date(lastScan.timestamp).toLocaleString()}</p>
            {lastScan.duplicate && (
              <p className="duplicate-warning">This ticket was already scanned!</p>
            )}
          </div>
        </div>
      )}

      {scanHistory.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Recent Scans</h3>
          <div className="scan-history">
            {scanHistory.map((scan, index) => (
              <div key={index} className={`scan-history-item ${scan.success ? 'success' : 'error'}`}>
                <div className="scan-history-icon">
                  {scan.success ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <XCircle size={20} color="#ef4444" />
                  )}
                </div>
                <div className="scan-history-details">
                  <div className="scan-history-ticket">{scan.ticket.number}</div>
                  <div className="scan-history-time">
                    {new Date(scan.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="scan-history-status">
                  {scan.duplicate ? 'Duplicate' : scan.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
