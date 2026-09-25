'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NAV_ITEMS, isActivePath } from '@/lib/navigation'
import logoMark from '@/public/brand/logo-mark.png'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/85">
      <nav
        className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Головна навігація"
      >
        <Link href="/" className="group flex items-center gap-3 no-underline" aria-label="e-learning-platform — на головну">
          <Image src={logoMark} alt="" className="h-11 w-auto transition-transform duration-300 group-hover:scale-105" priority />
          <span className="flex flex-col leading-tight">
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl dark:from-brand-300 dark:to-brand-400">
              e-learning-platform
            </span>
            <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">Your Gateway to Knowledge</span>
          </span>
        </Link>

        {/* На мобільних навігація займає окремий рядок на всю ширину, перемикач теми лишається біля логотипа */}
        <div className="order-last w-full md:order-none md:ml-auto md:w-auto">
          <ul className="m-0 flex list-none items-center justify-between gap-1 p-0 md:justify-start">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = isActivePath(pathname, href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-xl px-2.5 py-2 text-sm font-medium whitespace-nowrap no-underline transition-all duration-300 sm:px-3 ${
                      active
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  )
}
