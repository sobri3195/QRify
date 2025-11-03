import { useEffect } from 'react'
import { useTickets } from '../context/TicketContext'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import './Toast.css'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

export default function Toast() {
  const { toast, hideToast } = useTickets()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, hideToast])

  if (!toast) return null

  const Icon = icons[toast.type] || Info

  return (
    <div className={`toast toast-${toast.type} no-print`}>
      <Icon size={20} />
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={hideToast}>×</button>
    </div>
  )
}
