'use client'

import { useState } from 'react'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { useAppState } from '@/context/AppStateContext'
import { ITEMS_PER_PAGE, calculateTotalPages, getFilteredCourses, getPageItems } from '@/lib/courses'
import { CourseControls } from './CourseControls'
import { CreateCourseForm } from './CreateCourseForm'
import { ClassicPagination, InfiniteScroll, LoadMoreButton, PaginationModeSelector } from './Pagination'

export function CoursesCatalog() {
  const { state, setPage, setPaginationMode } = useAppState()
  const [isFormOpen, setFormOpen] = useState(false)

  const filtered = getFilteredCourses(state.courses, state.filters)
  const { mode, currentPage } = state.pagination
  const totalPages = calculateTotalPages(filtered.length)
  const page = Math.min(currentPage, totalPages)

  const visible = mode === 'pagination' ? getPageItems(filtered, page) : filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = page * ITEMS_PER_PAGE < filtered.length
  const remaining = Math.min(ITEMS_PER_PAGE, filtered.length - visible.length)

  return (
    <>
      <CourseControls
        isFormOpen={isFormOpen}
        onToggleForm={() => setFormOpen(open => !open)}
        onCloseForm={() => setFormOpen(false)}
      />
      <PaginationModeSelector mode={mode} onChange={setPaginationMode} />
      {isFormOpen && <CreateCourseForm onClose={() => setFormOpen(false)} />}

      <div id="results-count" aria-live="polite">
        📚 Знайдено курсів: {filtered.length}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍">Курсів не знайдено. Спробуйте змінити параметри пошуку.</EmptyState>
      ) : (
        <>
          <div id="courses-list" className="courses-grid">
            {visible.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {mode === 'pagination' && (
            <ClassicPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              onPageChange={setPage}
            />
          )}
          {mode === 'loadmore' && (
            <LoadMoreButton hasMore={hasMore} remaining={remaining} onLoadMore={() => setPage(page + 1)} />
          )}
          {mode === 'infinite' && <InfiniteScroll hasMore={hasMore} loadedCount={visible.length} onLoadMore={() => setPage(page + 1)} />}
        </>
      )}
    </>
  )
}
