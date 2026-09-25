import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { AppEffects } from '@/components/AppEffects'
import { Header } from '@/components/Header'
import { AppStateProvider } from '@/context/AppStateContext'
import { ToastProvider } from '@/context/ToastContext'
import { themeInitScript } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'e-learning-platform — Your Gateway to Knowledge',
  description: 'Інтерактивна платформа для онлайн-навчання: курси, уроки, тести та прогрес.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Клас теми виставляє скрипт до гідратації, тому розбіжність атрибутів очікувана
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ToastProvider>
          <AppStateProvider>
            <AppEffects />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 py-8">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
              <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  &copy; 2025 e-learning-platform. Навчальна практика з розробки WEB-застосунків
                </div>
              </footer>
            </div>
          </AppStateProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
