'use client'

/**
 * Каталог курсів: панель керування + адаптивна сітка карток + режим відображення
 */

import { ChevronDown, SearchX, Wrench } from 'lucide-react'
import { useState } from 'react'
import { buttonClass, panelClass } from '@/components/ui/styles'
import { useAppState } from '@/context/AppStateContext'
import { ITEMS_PER_PAGE, calculateTotalPages, getFilteredCourses, getPageItems } from '@/lib/courses'
import { CourseCard } from './CourseCard'
import { CourseControls } from './CourseControls'
import { CreateCourseForm } from './CreateCourseForm'
import { ApiDemoPanel, ErrorDemoPanel, StorageDemoPanel } from './DemoPanels'
import { ClassicPagination, InfiniteScroll, LoadMoreButton, ViewModeToggle } from './Pagination'

export function CoursesCatalog() {
  const { state, setPage, setPaginationMode, resetFilters } = useAppState()
  const [isFormOpen, setFormOpen] = useState(false)

  const filtered = getFilteredCourses(state.courses, state.filters)
  const { mode, currentPage } = state.pagination
  const totalPages = calculateTotalPages(filtered.length)
  const page = Math.min(currentPage, totalPages)

  // Пагінація показує одну сторінку; Load More / Infinite — все від початку до поточної сторінки
  const visible = mode === 'pagination' ? getPageItems(filtered, page) : filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = page * ITEMS_PER_PAGE < filtered.length
  const remaining = Math.min(ITEMS_PER_PAGE, filtered.length - visible.length)

  return (
    <div className="flex flex-col gap-6">
      <CourseControls
        isFormOpen={isFormOpen}
        onToggleForm={() => setFormOpen(open => !open)}
        onCloseForm={() => setFormOpen(false)}
      />

      {isFormOpen && <CreateCourseForm onClose={() => setFormOpen(false)} />}

      {/* Панель результатів і режиму відображення */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id="results-count" aria-live="polite" className="m-0 text-sm text-slate-600 dark:text-slate-400">
          Знайдено курсів:{' '}
          <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{filtered.length}</span>
          {!state.hydrated && <span className="sr-only"> (завантаження збережених даних)</span>}
        </p>
        <ViewModeToggle mode={mode} onChange={setPaginationMode} />
      </div>

      {filtered.length === 0 ? (
        <div className={`${panelClass} flex flex-col items-center px-6 py-16 text-center`}>
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <SearchX className="size-7 text-slate-400" aria-hidden />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Курсів не знайдено</h3>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Спробуйте змінити запит або параметри фільтрів.</p>
          <button type="button" onClick={resetFilters} className={buttonClass('neutral', 'sm')}>
            Скинути фільтри
          </button>
        </div>
      ) : (
        <section aria-label="Список курсів">
          <ul id="courses-list" className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map(course => (
              <li
                key={course.id}
                className="flex transition-all duration-300 ease-out starting:translate-y-3 starting:opacity-0 [&>*]:flex-1"
              >
                <CourseCard course={course} />
              </li>
            ))}
          </ul>

          {mode === 'pagination' && (
            <ClassicPagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} onPageChange={setPage} />
          )}
          {mode === 'loadmore' && (
            <LoadMoreButton hasMore={hasMore} remaining={remaining} onLoadMore={() => setPage(page + 1)} />
          )}
          {mode === 'infinite' && (
            <InfiniteScroll hasMore={hasMore} loadedCount={visible.length} onLoadMore={() => setPage(page + 1)} />
          )}
        </section>
      )}

      {/* Навчальні демо з модулів 7, 8, 10 — згорнуті, щоб не заважати каталогу */}
      <details className={`${panelClass} group mt-4 p-0`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-semibold text-slate-600 select-none dark:text-slate-300 [&::-webkit-details-marker]:hidden">
          <Wrench className="size-4" aria-hidden />
          Інструменти розробника
          <span className="hidden font-normal text-slate-400 sm:inline">— API, обробка помилок, LocalStorage</span>
          <ChevronDown
            className="ml-auto size-4 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="flex flex-col gap-5 border-t border-slate-100 px-5 py-5 dark:border-slate-800">
          <ApiDemoPanel />
          <ErrorDemoPanel />
          <StorageDemoPanel />
        </div>
      </details>
    </div>
  )
}
