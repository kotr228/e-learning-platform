import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { Header } from '@/components/Header'
import { AppEffects } from '@/components/AppEffects'
import { AppStateProvider } from '@/context/AppStateContext'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: '📚 E-learning Platform - Навчальна платформа',
  description: 'Інтерактивна платформа для онлайн-навчання: курси, уроки, тести та прогрес.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <ToastProvider>
          <AppStateProvider>
            <AppEffects />
            <div id="app">
              <Header />
              <main id="main-content">
                <div className="container">{children}</div>
              </main>
              <footer id="footer">
                <div className="container">
                  <p>&copy; 2025 E-learning Platform. Навчальна практика з розробки WEB-застосунків</p>
                </div>
              </footer>
            </div>
          </AppStateProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
