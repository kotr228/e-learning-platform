'use client'

/**
 * Панель пошуку, фільтрів та сортування (Модуль 3)
 */

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import { describeApiError, fetchCoursesFromAPI } from '@/lib/api'
import { dispatchAppEvent } from '@/lib/events'
import type { EnrollmentFilter, SortBy } from '@/lib/types'
import { ApiDemoPanel, ErrorDemoPanel, StorageDemoPanel } from './DemoPanels'

const SEARCH_DEBOUNCE_MS = 300

const FILTER_OPTIONS: Array<{ value: EnrollmentFilter; label: string }> = [
  { value: 'all', label: 'Всі курси' },
  { value: 'enrolled', label: 'Мої курси' },
  { value: 'available', label: 'Доступні' }
]

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'default', label: 'За замовчуванням' },
  { value: 'title', label: 'За назвою' },
  { value: 'duration', label: 'За тривалістю' }
]

interface CourseControlsProps {
  isFormOpen: boolean
  onToggleForm: () => void
  onCloseForm: () => void
}

export function CourseControls({ isFormOpen, onToggleForm, onCloseForm }: CourseControlsProps) {
  const { state, setFilters, resetFilters, addCourses } = useAppState()
  const notify = useNotify()
  const { searchQuery, filterEnrolled, sortBy } = state.filters

  // Локальне значення пошуку синхронізується з глобальним станом з debounce
  const [search, setSearch] = useState(searchQuery)
  const [prevQuery, setPrevQuery] = useState(searchQuery)
  if (searchQuery !== prevQuery) {
    setPrevQuery(searchQuery)
    setSearch(searchQuery)
  }

  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [loadingApi, setLoadingApi] = useState(false)

  const applySearch = (value: string) => {
    clearTimeout(searchTimer.current)
    setFilters({ searchQuery: value })
    dispatchAppEvent('coursesFiltered', { query: value })
  }

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => applySearch(value), SEARCH_DEBOUNCE_MS)
  }

  useEffect(() => () => clearTimeout(searchTimer.current), [])

  // Escape — закрити форму або скинути пошук
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (isFormOpen) {
        onCloseForm()
      } else if (searchQuery || search) {
        setSearch('')
        applySearch('')
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  const onLoadFromApi = async () => {
    setLoadingApi(true)
    notify('⏳ Завантаження курсів з API...', 'info')
    try {
      const courses = await fetchCoursesFromAPI(state.nextCourseId)
      addCourses(courses)
      notify(`✅ Завантажено ${courses.length} курсів з API!`, 'success')
    } catch (error) {
      notify(describeApiError(error), 'error')
    } finally {
      setLoadingApi(false)
    }
  }

  const onReset = () => {
    clearTimeout(searchTimer.current)
    setSearch('')
    resetFilters()
    dispatchAppEvent('filtersReset')
  }

  return (
    <div id="courses-controls" className="panel">
      <div className="controls-row">
        <button type="button" className="btn btn-success shadow-sm" onClick={onToggleForm} aria-expanded={isFormOpen}>
          ➕ Створити курс
        </button>
        <button type="button" className="btn btn-info shadow-sm" onClick={onLoadFromApi} disabled={loadingApi}>
          {loadingApi ? '⏳ Завантаження...' : '🌐 Завантажити з API'}
        </button>
        <input
          id="search-input"
          type="search"
          className="form-control form-control-lg search-input"
          placeholder="🔍 Пошук курсів... (Ctrl+K)"
          aria-label="Пошук курсів"
          value={search}
          onChange={onSearchChange}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              applySearch(search)
            }
          }}
        />
      </div>

      <div className="controls-row align-items-center">
        <label htmlFor="filter-select" className="controls-label">
          Фільтр:
        </label>
        <select
          id="filter-select"
          className="form-select w-auto"
          value={filterEnrolled}
          onChange={e => {
            const value = e.target.value as EnrollmentFilter
            setFilters({ filterEnrolled: value })
            dispatchAppEvent('coursesFiltered', { filter: value })
          }}
        >
          {FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <label htmlFor="sort-select" className="controls-label">
          Сортування:
        </label>
        <select
          id="sort-select"
          className="form-select w-auto"
          value={sortBy}
          onChange={e => {
            const value = e.target.value as SortBy
            setFilters({ sortBy: value })
            dispatchAppEvent('coursesSorted', { sortBy: value })
          }}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button type="button" className="btn btn-secondary ms-auto" onClick={onReset}>
          🔄 Скинути
        </button>
      </div>

      <ApiDemoPanel />
      <ErrorDemoPanel />
      <StorageDemoPanel />
    </div>
  )
}
