import Link from 'next/link'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: string
  children: ReactNode
  link?: { href: string; label: string }
}

export function EmptyState({ icon, children, link }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <p>
        {children}
        {link && (
          <>
            {' '}
            <Link href={link.href}>{link.label}</Link>
          </>
        )}
      </p>
    </div>
  )
}
