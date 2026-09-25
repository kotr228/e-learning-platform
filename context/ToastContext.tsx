'use client'

/**
 * Система нотифікацій (toast)
 */

import { CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react'
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

const TOAST_STYLE: Record<NotificationType, { icon: LucideIcon; className: string }> = {
  success: { icon: CircleCheck, className: 'text-accent-600 dark:text-accent-400' },
  error: { icon: CircleAlert, className: 'text-red-600 dark:text-red-400' },
  info: { icon: Info, className: 'text-brand-600 dark:text-brand-400' }
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
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-4 right-4 left-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-96"
      >
        {toasts.map(toast => {
          const { icon: Icon, className } = TOAST_STYLE[toast.type]
          return (
            <div
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-700 shadow-lg transition-all duration-300 starting:translate-x-4 starting:opacity-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${className}`} aria-hidden />
              <p className="m-0 flex-1">{toast.message}</p>
              <button
                type="button"
                aria-label="Закрити"
                onClick={() => dismiss(toast.id)}
                className="-m-1 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useNotify(): Notify {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useNotify must be used within ToastProvider')
  return ctx
}
