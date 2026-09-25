'use client'

/**
 * Панель керування каталогом: дії, пошук, фільтри та сортування (Модуль 3)
 */

import {
  ArrowUpDown,
  ChartNoAxesColumnIncreasing,
  CloudDownload,
  ListFilter,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  X
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { SelectField } from '@/components/ui/SelectField'
import { buttonClass, fieldClass, panelClass } from '@/components/ui/styles'
import { DEFAULT_FILTERS, useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import { describeApiError, fetchCoursesFromAPI } from '@/lib/api'
import { LEVEL_LABELS } from '@/lib/courses'
import { dispatchAppEvent } from '@/lib/events'
import type { LevelFilter, SortBy, StatusFilter } from '@/lib/types'

const SEARCH_DEBOUNCE_MS = 300

const STATUS_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Всі курси' },
  { value: 'available', label: 'Доступні' },
  { value: 'in-progress', label: 'В процесі' },
  { value: 'completed', label: 'Завершено' }
]

const LEVEL_OPTIONS: ReadonlyArray<{ value: LevelFilter; label: string }> = [
  { value: 'all', label: 'Будь-яка складність' },
  { value: 'beginner', label: LEVEL_LABELS.beginner },
  { value: 'intermediate', label: LEVEL_LABELS.intermediate },
  { value: 'advanced', label: LEVEL_LABELS.advanced }
]

const SORT_OPTIONS: ReadonlyArray<{ value: SortBy; label: string }> = [
  { value: 'default', label: 'За замовчуванням' },
  { value: 'newest', label: 'Нові' },
  { value: 'rating', label: 'З найвищим рейтингом' },
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
  const { searchQuery, status, level, sortBy } = state.filters

  // Локальне значення пошуку: миттєвий відгук у полі, а фільтрація — з debounce.
  // Якщо запит змінився ззовні (скидання, Escape), синхронізуємо поле під час рендеру.
  const [search, setSearch] = useState(searchQuery)
  const [prevQuery, setPrevQuery] = useState(searchQuery)
  if (searchQuery !== prevQuery) {
    setPrevQuery(searchQuery)
    setSearch(searchQuery)
  }

  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [loadingApi, setLoadingApi] = useState(false)

  const hasActiveFilters =
    search !== '' ||
    status !== DEFAULT_FILTERS.status ||
    level !== DEFAULT_FILTERS.level ||
    sortBy !== DEFAULT_FILTERS.sortBy

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

  const clearSearch = () => {
    setSearch('')
    applySearch('')
  }

  useEffect(() => () => clearTimeout(searchTimer.current), [])

  // Escape — закрити форму створення або очистити пошук
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (isFormOpen) onCloseForm()
      else if (search) clearSearch()
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
    <section id="courses-controls" aria-label="Пошук і фільтри курсів" className={`${panelClass} p-4 sm:p-5`}>
      {/* Верхній рядок: дії та пошук */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggleForm}
          aria-expanded={isFormOpen}
          aria-controls="create-course-form"
          className={buttonClass('success', 'md', 'w-full sm:w-auto')}
        >
          <Plus
            className={`size-5 transition-transform duration-300 ${isFormOpen ? 'rotate-45' : ''}`}
            aria-hidden
          />
          {isFormOpen ? 'Закрити форму' : 'Створити курс'}
        </button>

        <button
          type="button"
          onClick={onLoadFromApi}
          disabled={loadingApi}
          className={buttonClass('primary', 'md', 'w-full sm:w-auto')}
        >
          {loadingApi ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden />
          ) : (
            <CloudDownload className="size-5" aria-hidden />
          )}
          {loadingApi ? 'Завантаження...' : 'Завантажити з API'}
        </button>

        <div className="relative w-full min-w-0 md:w-auto md:min-w-64 md:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id="search-input"
            type="search"
            value={search}
            onChange={onSearchChange}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applySearch(search)
              }
            }}
            placeholder="Пошук курсів... (Ctrl+K)"
            aria-label="Пошук курсів"
            aria-keyshortcuts="Control+K Meta+K"
            autoComplete="off"
            className={`${fieldClass} pr-10 pl-11 [&::-webkit-search-cancel-button]:hidden`}
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Очистити пошук"
              className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all duration-300 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Нижній рядок: фільтри та сортування */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <SelectField
          id="filter-select"
          label="Статус курсу"
          icon={ListFilter}
          value={status}
          options={STATUS_OPTIONS}
          active={status !== DEFAULT_FILTERS.status}
          onValueChange={value => {
            setFilters({ status: value })
            dispatchAppEvent('coursesFiltered', { status: value })
          }}
          className="w-full sm:w-auto sm:min-w-44 sm:flex-1 lg:flex-none"
        />
        <SelectField
          id="level-select"
          label="Складність"
          icon={ChartNoAxesColumnIncreasing}
          value={level}
          options={LEVEL_OPTIONS}
          active={level !== DEFAULT_FILTERS.level}
          onValueChange={value => {
            setFilters({ level: value })
            dispatchAppEvent('coursesFiltered', { level: value })
          }}
          className="w-full sm:w-auto sm:min-w-52 sm:flex-1 lg:flex-none"
        />
        <SelectField
          id="sort-select"
          label="Сортування"
          icon={ArrowUpDown}
          value={sortBy}
          options={SORT_OPTIONS}
          active={sortBy !== DEFAULT_FILTERS.sortBy}
          onValueChange={value => {
            setFilters({ sortBy: value })
            dispatchAppEvent('coursesSorted', { sortBy: value })
          }}
          className="w-full sm:w-auto sm:min-w-56 sm:flex-1 lg:flex-none"
        />

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className={buttonClass('neutral', 'md', 'w-full sm:w-auto lg:ml-auto')}
        >
          <RefreshCw className="size-4" aria-hidden />
          Скинути
        </button>
      </div>
    </section>
  )
}
