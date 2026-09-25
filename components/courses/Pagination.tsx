'use client'

/**
 * Пагінація та нескінченний скрол (Модуль 9)
 */

import { useEffect, useRef, useState } from 'react'
import { useNotify } from '@/context/ToastContext'
import { getVisiblePages } from '@/lib/courses'
import type { PaginationMode } from '@/lib/types'

const MODES: Array<{ value: PaginationMode; label: string; icon: string }> = [
  { value: 'pagination', label: 'Пагінація', icon: '📃' },
  { value: 'loadmore', label: 'Load More', icon: '⬇️' },
  { value: 'infinite', label: 'Infinite Scroll', icon: '∞' }
]

export function PaginationModeSelector({
  mode,
  onChange
}: {
  mode: PaginationMode
  onChange: (mode: PaginationMode) => void
}) {
  const notify = useNotify()

  return (
    <div className="pagination-mode-selector">
      <span className="fw-bold">📄 Режим відображення:</span>
      <div className="btn-group btn-group-sm" role="group" aria-label="Режим відображення">
        {MODES.map(m => (
          <button
            key={m.value}
            type="button"
            className={`btn ${mode === m.value ? 'btn-primary' : 'btn-outline-primary'}`}
            aria-pressed={mode === m.value}
            onClick={() => {
              if (m.value === mode) return
              onChange(m.value)
              notify(`Режим змінено на: ${m.label}`, 'info')
            }}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ClassicPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function ClassicPagination({ currentPage, totalPages, totalItems, onPageChange }: ClassicPaginationProps) {
  const go = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="pagination-container" aria-label="Пагінація курсів">
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        disabled={currentPage === 1}
        onClick={() => go(currentPage - 1)}
      >
        « Попередня
      </button>
      <div className="d-flex gap-1">
        {getVisiblePages(currentPage, totalPages).map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`btn btn-sm page-number ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => go(page)}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        disabled={currentPage === totalPages}
        onClick={() => go(currentPage + 1)}
      >
        Наступна »
      </button>
      <div className="text-muted small w-100 text-center mt-2">
        Сторінка {currentPage} з {totalPages} (всього курсів: {totalItems})
      </div>
    </nav>
  )
}

function AllLoaded() {
  return <div className="text-center text-muted my-4">✓ Всі курси завантажено</div>
}

interface IncrementalProps {
  hasMore: boolean
  remaining: number
  onLoadMore: () => void
}

const LOAD_MORE_DELAY = 500
const INFINITE_DELAY = 800

export function LoadMoreButton({ hasMore, remaining, onLoadMore }: IncrementalProps) {
  const [loading, setLoading] = useState(false)

  if (!hasMore) return <AllLoaded />

  const onClick = async () => {
    setLoading(true)
    // Симулюємо затримку завантаження
    await new Promise(resolve => setTimeout(resolve, LOAD_MORE_DELAY))
    setLoading(false)
    onLoadMore()
  }

  return (
    <div id="load-more-container" className="text-center my-4">
      <button type="button" className="btn btn-primary btn-lg" disabled={loading} onClick={onClick}>
        {loading ? 'Завантаження...' : `Завантажити ще (${remaining} курсів)`}
      </button>
    </div>
  )
}

interface InfiniteScrollProps {
  hasMore: boolean
  /** Кількість уже показаних елементів — після зміни спостереження перезапускається */
  loadedCount: number
  onLoadMore: () => void
}

export function InfiniteScroll({ hasMore, loadedCount, onLoadMore }: InfiniteScrollProps) {
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
      { rootMargin: '100px', threshold: 0.1 }
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
        <div className="text-center my-4" role="status">
          <div className="spinner-border text-primary" aria-hidden="true" />
          <div className="mt-2 text-muted">Завантаження курсів...</div>
        </div>
      )}
      <div ref={sentinel} className="infinite-scroll-sentinel" aria-hidden="true" />
    </>
  )
}
