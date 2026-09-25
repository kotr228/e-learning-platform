'use client'

/**
 * Система нотифікацій (Bootstrap Toast)
 */

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { NotificationType } from '@/lib/types'

interface Toast {
  id: number
  message: string
  type: NotificationType
}

type Notify = (message: string, type?: NotificationType) => void

const ToastContext = createContext<Notify | null>(null)

const TOAST_DELAY = 3000

const BG_CLASS: Record<NotificationType, string> = {
  success: 'bg-success',
  error: 'bg-danger',
  info: 'bg-info'
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts(list => list.filter(t => t.id !== id))
  }, [])

  const notify = useCallback<Notify>(
    (message, type = 'success') => {
      const id = nextId.current++
      setToasts(list => [...list, { id, message, type }])
      setTimeout(() => dismiss(id), TOAST_DELAY)
    },
    [dismiss]
  )

  const value = useMemo(() => notify, [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-white border-0 ${BG_CLASS[toast.type]}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Закрити"
                onClick={() => dismiss(toast.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useNotify(): Notify {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useNotify must be used within ToastProvider')
  return ctx
}
