'use client'

/**
 * Глобальні побічні ефекти: обробники помилок (Модуль 8),
 * клавіатурна навігація та власні події (Модуль 3).
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setupGlobalErrorHandlers } from '@/lib/errors'
import { APP_EVENTS } from '@/lib/events'
import { NAV_ITEMS } from '@/lib/navigation'

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
  )
}

export function AppEffects() {
  const router = useRouter()

  useEffect(() => setupGlobalErrorHandlers(), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K — фокус на пошук
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const search = document.getElementById('search-input') as HTMLInputElement | null
        if (search) {
          e.preventDefault()
          search.focus()
          search.select()
        }
        return
      }

      // 1-4 — швидка навігація між сторінками
      if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)) {
        router.push(NAV_ITEMS[Number(e.key) - 1].href)
      }
    }

    const logEvent = (e: Event) => console.log(`📣 ${e.type}:`, (e as CustomEvent).detail)

    document.addEventListener('keydown', onKeyDown)
    APP_EVENTS.forEach(name => document.addEventListener(name, logEvent))
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      APP_EVENTS.forEach(name => document.removeEventListener(name, logEvent))
    }
  }, [router])

  return null
}
