'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, isActivePath } from '@/lib/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header id="header">
      <nav className="navbar" aria-label="Головна навігація">
        <div className="container">
          <Link href="/" className="logo">
            📚 E-learning Platform
          </Link>
          <ul className="nav-menu">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = isActivePath(pathname, href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`nav-link${active ? ' active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </header>
  )
}
