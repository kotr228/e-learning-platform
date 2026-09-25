'use client'

import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { THEME_STORAGE_KEY, applyTheme } from '@/lib/theme'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const isDarkNow = () => document.documentElement.classList.contains('dark')

export function ThemeToggle() {
  // Джерело істини — клас на <html>, який виставляє скрипт у <head> ще до гідратації
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => false)
  const label = isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'

  const toggle = () => {
    const next = isDark ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Приватний режим: тема працює до перезавантаження
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent-400"
    >
      {isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  )
}
