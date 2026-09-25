'use client'

/**
 * Режими відображення: пагінація, Load More, нескінченний скрол (Модуль 9)
 */

import {
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  CircleCheck,
  InfinityIcon,
  ListOrdered,
  LoaderCircle,
  type LucideIcon
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { buttonClass } from '@/components/ui/styles'
import { useNotify } from '@/context/ToastContext'
import { getVisiblePages } from '@/lib/courses'
import type { PaginationMode } from '@/lib/types'

const MODES: ReadonlyArray<{ value: PaginationMode; label: string; icon: LucideIcon }> = [
  { value: 'pagination', label: 'Пагінація', icon: ListOrdered },
  { value: 'loadmore', label: 'Load More', icon: ChevronsDown },
  { value: 'infinite', label: 'Infinite Scroll', icon: InfinityIcon }
]

// =========================================
// Перемикач режиму
// =========================================

export function ViewModeToggle({ mode, onChange }: { mode: PaginationMode; onChange: (mode: PaginationMode) => void }) {
  const notify = useNotify()

  return (
    <div
      role="group"
      aria-label="Режим відображення"
      className="inline-flex w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:w-auto dark:border-slate-800 dark:bg-slate-900"
    >
      {MODES.map(({ value, label, icon: Icon }) => {
        const active = mode === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (active) return
              onChange(value)
              notify(`Режим змінено на: ${label}`, 'info')
            }}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-500 sm:flex-none ${
              active
                ? 'bg-accent-50 text-accent-700 shadow-sm ring-1 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-400 dark:ring-accent-500/25'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="max-[380px]:sr-only">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

// =========================================
// Класична пагінація
// =========================================

interface ClassicPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

const pageButton =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-40'

export function ClassicPagination({ currentPage, totalPages, totalItems, onPageChange }: ClassicPaginationProps) {
  if (totalPages <= 1) {
    return <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">Всього курсів: {totalItems}</p>
  }

  const go = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav aria-label="Пагінація курсів" className="mt-10 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => go(currentPage - 1)}
          className={`${pageButton} gap-1 pr-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800`}
        >
          <ChevronLeft className="size-4" aria-hidden />
          <span className="max-sm:sr-only">Попередня</span>
        </button>

        {getVisiblePages(currentPage, totalPages).map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-slate-400" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Сторінка ${page}`}
              onClick={() => go(page)}
              className={`${pageButton} ${
                page === currentPage
                  ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => go(currentPage + 1)}
          className={`${pageButton} gap-1 pl-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800`}
        >
          <span className="max-sm:sr-only">Наступна</span>
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Сторінка {currentPage} з {totalPages} · всього курсів: {totalItems}
      </p>
    </nav>
  )
}

// =========================================
// Load More / Infinite Scroll
// =========================================

function AllLoaded() {
  return (
    <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <CircleCheck className="size-4 text-accent-600 dark:text-accent-400" aria-hidden />
      Всі курси завантажено
    </p>
  )
}

const LOAD_MORE_DELAY = 500
const INFINITE_DELAY = 800

export function LoadMoreButton({
  hasMore,
  remaining,
  onLoadMore
}: {
  hasMore: boolean
  remaining: number
  onLoadMore: () => void
}) {
  const [loading, setLoading] = useState(false)

  if (!hasMore) return <AllLoaded />

  const onClick = async () => {
    setLoading(true)
    // Симулюємо затримку мережі
    await new Promise(resolve => setTimeout(resolve, LOAD_MORE_DELAY))
    setLoading(false)
    onLoadMore()
  }

  return (
    <div id="load-more-container" className="mt-10 flex justify-center">
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className={buttonClass('outline', 'lg', 'hover:-translate-y-0.5 hover:shadow-md')}
      >
        {loading ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden />
        ) : (
          <ChevronsDown className="size-5" aria-hidden />
        )}
        {loading ? 'Завантаження...' : `Завантажити ще (${remaining})`}
      </button>
    </div>
  )
}

export function InfiniteScroll({
  hasMore,
  loadedCount,
  onLoadMore
}: {
  hasMore: boolean
  /** Кількість уже показаних елементів — після зміни спостереження перезапускається */
  loadedCount: number
  onLoadMore: () => void
}) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const loadMore = useRef(onLoadMore)

  useEffect(() => {
    loadMore.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasMore) return

    let timeout: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setLoading(true)
        timeout = setTimeout(() => {
          setLoading(false)
          loadMore.current()
        }, INFINITE_DELAY)
      },
      { rootMargin: '200px', threshold: 0.1 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [hasMore, loadedCount])

  if (!hasMore) return <AllLoaded />

  return (
    <>
      {loading && (
        <div role="status" className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <LoaderCircle className="size-5 animate-spin text-brand-600 dark:text-brand-400" aria-hidden />
          Завантаження курсів...
        </div>
      )}
      <div ref={sentinel} className="h-5" aria-hidden />
    </>
  )
}
