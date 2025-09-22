import { AlertCircle, X } from 'lucide-react'

interface ErrorNotificationProps {
  error: string | null
  onClose: () => void
  type?: 'error' | 'quota' | 'warning'
}

export default function ErrorNotification({ error, onClose, type = 'error' }: ErrorNotificationProps) {
  if (!error) return null

  const getStyles = () => {
    switch (type) {
      case 'quota':
        return {
          bg: 'bg-orange-900/90 border-orange-700',
          text: 'text-orange-200',
          icon: 'text-orange-400'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-900/90 border-yellow-700',
          text: 'text-yellow-200',
          icon: 'text-yellow-400'
        }
      default:
        return {
          bg: 'bg-red-900/90 border-red-700',
          text: 'text-red-200',
          icon: 'text-red-400'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 p-4 rounded-lg border backdrop-blur-sm ${styles.bg} animate-fade-in-up`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${styles.icon} flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>
                Quota exceeded
          </p>
        </div>
        <button
          onClick={onClose}
          className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}