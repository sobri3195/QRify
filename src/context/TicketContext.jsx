import { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TicketContext = createContext()

const STORAGE_KEY = 'tix-voucher-suite-v1'
const SETTINGS_KEY = 'tix-voucher-settings-v1'

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([])
  const [settings, setSettings] = useState({
    organizationName: 'My Organization',
    maxUsers: 1
  })
  const [toast, setToast] = useState(null)
  const [lastGeneration, setLastGeneration] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedSettings = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      try {
        setTickets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load tickets:', e)
      }
    }
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const generateTickets = (count, prefix, extra) => {
    const newTickets = []
    const existingNumbers = tickets.map(t => t.number)
    let nextNumber = 1
    
    const prefixPattern = new RegExp(`^${prefix}-(\\d+)$`)
    existingNumbers.forEach(num => {
      const match = num.match(prefixPattern)
      if (match) {
        const n = parseInt(match[1], 10)
        if (n >= nextNumber) {
          nextNumber = n + 1
        }
      }
    })

    for (let i = 0; i < count; i++) {
      const ticket = {
        id: uuidv4(),
        number: `${prefix}-${String(nextNumber).padStart(6, '0')}`,
        generatedAt: new Date().toISOString(),
        extra: extra || '',
        scannedAt: null
      }
      newTickets.push(ticket)
      nextNumber++
    }

    setTickets(prev => [...newTickets, ...prev])
    setLastGeneration(newTickets)
    showToast(`Successfully generated ${count} ticket(s)`, 'success')
    return newTickets
  }

  const scanTicket = (ticketData) => {
    const { id, number } = ticketData
    const ticketIndex = tickets.findIndex(t => t.id === id || t.number === number)

    if (ticketIndex === -1) {
      showToast('Ticket not found in system', 'error')
      return { success: false, message: 'Ticket not found' }
    }

    const ticket = tickets[ticketIndex]

    if (ticket.scannedAt) {
      showToast(`Ticket already scanned on ${new Date(ticket.scannedAt).toLocaleString()}`, 'warning')
      return { 
        success: false, 
        message: 'Already scanned', 
        ticket,
        duplicate: true 
      }
    }

    const updatedTickets = [...tickets]
    updatedTickets[ticketIndex] = {
      ...ticket,
      scannedAt: new Date().toISOString()
    }
    setTickets(updatedTickets)
    showToast(`Ticket ${ticket.number} scanned successfully!`, 'success')
    return { 
      success: true, 
      message: 'Scanned successfully', 
      ticket: updatedTickets[ticketIndex] 
    }
  }

  const undoLastGeneration = () => {
    if (!lastGeneration || lastGeneration.length === 0) {
      showToast('No generation to undo', 'error')
      return false
    }

    const lastIds = lastGeneration.map(t => t.id)
    setTickets(prev => prev.filter(t => !lastIds.includes(t.id)))
    setLastGeneration(null)
    showToast('Last generation undone', 'success')
    return true
  }

  const exportData = () => {
    const data = {
      tickets,
      settings,
      exportedAt: new Date().toISOString(),
      version: 1
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tix-voucher-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.tickets) {
            setTickets(data.tickets)
          }
          if (data.settings) {
            setSettings(data.settings)
          }
          showToast('Data imported successfully', 'success')
          resolve(true)
        } catch (error) {
          showToast('Failed to import data', 'error')
          reject(error)
        }
      }
      reader.onerror = () => {
        showToast('Failed to read file', 'error')
        reject(new Error('Failed to read file'))
      }
      reader.readAsText(file)
    })
  }

  const clearAllData = () => {
    setTickets([])
    setLastGeneration(null)
    showToast('All data cleared', 'success')
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() })
  }

  const hideToast = () => {
    setToast(null)
  }

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    showToast('Settings updated', 'success')
  }

  const value = {
    tickets,
    settings,
    generateTickets,
    scanTicket,
    undoLastGeneration,
    exportData,
    importData,
    clearAllData,
    showToast,
    hideToast,
    toast,
    updateSettings,
    lastGeneration
  }

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (!context) {
    throw new Error('useTickets must be used within TicketProvider')
  }
  return context
}
