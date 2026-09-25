'use client'

/**
 * Глобальний стан додатку: курси, фільтри, пагінація.
 * Автоматично зберігається в LocalStorage (Модуль 10).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode
} from 'react'
import { initialCourses } from '@/lib/data/courses'
import { isTechIconKey } from '@/lib/courseIcons'
import { DEFAULT_COURSE_GRADIENT, createCustomCourse, withCompletedLesson } from '@/lib/courses'
import { LocalStorageManager } from '@/lib/storage'
import type { Course, CourseLevel, Filters, NewCourseInput, PaginationMode } from '@/lib/types'

// =========================================
// State
// =========================================

export interface AppState {
  courses: Course[]
  nextCourseId: number
  filters: Filters
  pagination: { mode: PaginationMode; currentPage: number }
  /** true після завантаження даних з LocalStorage */
  hydrated: boolean
}

export const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  status: 'all',
  level: 'all',
  sortBy: 'default'
}

const initialState: AppState = {
  courses: initialCourses,
  nextCourseId: Math.max(...initialCourses.map(c => c.id)) + 1,
  filters: DEFAULT_FILTERS,
  pagination: { mode: 'pagination', currentPage: 1 },
  hydrated: false
}

interface PersistedAppState {
  filters?: Partial<Filters>
  nextCourseId?: number
}

export interface ExportedData {
  appState: PersistedAppState
  coursesData: Course[]
  exportDate?: string
}

type Action =
  | { type: 'HYDRATE'; saved: PersistedAppState | null; courses: Course[] | null }
  | { type: 'SET_FILTERS'; filters: Partial<Filters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_PAGINATION_MODE'; mode: PaginationMode }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'ENROLL'; courseId: number }
  | { type: 'ADD_COURSES'; courses: Course[] }
  | { type: 'CREATE_COURSE'; input: NewCourseInput }
  | { type: 'DELETE_COURSE'; courseId: number }
  | { type: 'COMPLETE_LESSON'; courseId: number; lessonId: number }

// =========================================
// Міграція даних, збережених попередніми версіями
// =========================================

const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced']
const FILTER_VALUES: { [K in Exclude<keyof Filters, 'searchQuery'>]: readonly Filters[K][] } = {
  status: ['all', 'available', 'in-progress', 'completed'],
  level: ['all', ...LEVELS],
  sortBy: ['default', 'newest', 'rating', 'title', 'duration']
}

/** Відкидає невідомі значення фільтрів (наприклад, старе `filterEnrolled`) */
function normalizeFilters(saved: Partial<Filters> | undefined): Partial<Filters> {
  if (!saved) return {}
  const result: Partial<Filters> = {}
  if (typeof saved.searchQuery === 'string') result.searchQuery = saved.searchQuery
  if (FILTER_VALUES.status.includes(saved.status!)) result.status = saved.status
  if (FILTER_VALUES.level.includes(saved.level!)) result.level = saved.level
  if (FILTER_VALUES.sortBy.includes(saved.sortBy!)) result.sortBy = saved.sortBy
  return result
}

/** Доповнює курси полями, яких не було в старих збереженнях */
function normalizeCourses(courses: Course[]): Course[] {
  return courses.map(course => {
    const original = initialCourses.find(c => c.id === course.id && !course.isCustom && !course.isFromAPI)
    return {
      ...course,
      level: LEVELS.includes(course.level) ? course.level : (original?.level ?? 'beginner'),
      rating: typeof course.rating === 'number' ? course.rating : (original?.rating ?? 0),
      tech: Array.isArray(course.tech) ? course.tech.filter(isTechIconKey) : original?.tech,
      // Стиль — не дані користувача: для вбудованих курсів завжди беремо актуальний градієнт з вихідних даних,
      // інакше після зміни палітри повернуті користувачі бачили б стару версію зі свого LocalStorage
      gradientClasses:
        original?.gradientClasses ??
        (typeof course.gradientClasses === 'string' && course.gradientClasses ? course.gradientClasses : DEFAULT_COURSE_GRADIENT)
    }
  })
}

function updateCourse(courses: Course[], courseId: number, update: (c: Course) => Course): Course[] {
  return courses.map(c => (c.id === courseId ? update(c) : c))
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE': {
      const courses = action.courses ? normalizeCourses(action.courses) : state.courses
      const maxId = Math.max(0, ...courses.map(c => c.id))
      return {
        ...state,
        courses,
        filters: { ...DEFAULT_FILTERS, ...normalizeFilters(action.saved?.filters) },
        nextCourseId: Math.max(action.saved?.nextCourseId ?? 0, maxId + 1, state.nextCourseId),
        pagination: { ...state.pagination, currentPage: 1 },
        hydrated: true
      }
    }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
        pagination: { ...state.pagination, currentPage: 1 }
      }
    case 'RESET_FILTERS':
      return { ...state, filters: DEFAULT_FILTERS, pagination: { ...state.pagination, currentPage: 1 } }
    case 'SET_PAGINATION_MODE':
      return { ...state, pagination: { mode: action.mode, currentPage: 1 } }
    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, currentPage: action.page } }
    case 'ENROLL':
      return { ...state, courses: updateCourse(state.courses, action.courseId, c => ({ ...c, enrolled: true })) }
    case 'ADD_COURSES': {
      const maxId = Math.max(state.nextCourseId - 1, ...action.courses.map(c => c.id))
      return { ...state, courses: [...state.courses, ...action.courses], nextCourseId: maxId + 1 }
    }
    case 'CREATE_COURSE': {
      const course = createCustomCourse(state.nextCourseId, action.input)
      return { ...state, courses: [...state.courses, course], nextCourseId: state.nextCourseId + 1 }
    }
    case 'DELETE_COURSE':
      return { ...state, courses: state.courses.filter(c => c.id !== action.courseId || !c.isCustom) }
    case 'COMPLETE_LESSON':
      return {
        ...state,
        courses: updateCourse(state.courses, action.courseId, c => withCompletedLesson(c, action.lessonId))
      }
  }
}

// =========================================
// Persistence helpers
// =========================================

const APP_STATE_KEY = 'appState'
const COURSES_KEY = 'coursesProgress'
const AUTOSAVE_DELAY = 2000

function persist(state: AppState): boolean {
  const saved: PersistedAppState = { filters: state.filters, nextCourseId: state.nextCourseId }
  return LocalStorageManager.save(APP_STATE_KEY, saved) && LocalStorageManager.save(COURSES_KEY, state.courses)
}

function readPersisted() {
  const saved = LocalStorageManager.load<PersistedAppState>(APP_STATE_KEY)
  const courses = LocalStorageManager.load<Course[]>(COURSES_KEY)
  return { saved, courses: Array.isArray(courses) && courses.length > 0 ? courses : null }
}

// =========================================
// Context
// =========================================

interface AppStateContextValue {
  state: AppState
  setFilters: (filters: Partial<Filters>) => void
  resetFilters: () => void
  setPaginationMode: (mode: PaginationMode) => void
  setPage: (page: number) => void
  enroll: (courseId: number) => void
  addCourses: (courses: Course[]) => void
  createCourse: (input: NewCourseInput) => void
  deleteCourse: (courseId: number) => void
  completeLesson: (courseId: number, lessonId: number) => void
  getCourse: (courseId: number) => Course | undefined
  saveNow: () => boolean
  loadSaved: () => boolean
  importData: (data: ExportedData) => void
  exportData: () => ExportedData
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Початкове завантаження з LocalStorage (лише на клієнті)
  useEffect(() => {
    const { saved, courses } = readPersisted()
    dispatch({ type: 'HYDRATE', saved, courses })
  }, [])

  // Автозбереження з debounce; незбережені зміни скидаються при закритті/перезавантаженні сторінки
  useEffect(() => {
    if (!state.hydrated) return
    const flush = () => persist(state)
    const timeout = setTimeout(() => {
      flush()
      console.log('🔄 Модуль 10: Автозбереження виконано')
    }, AUTOSAVE_DELAY)
    window.addEventListener('pagehide', flush)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('pagehide', flush)
    }
  }, [state])

  const getCourse = useCallback(
    (courseId: number) => state.courses.find(c => c.id === courseId),
    [state.courses]
  )

  const saveNow = useCallback(() => persist(state), [state])

  const loadSaved = useCallback(() => {
    const { saved, courses } = readPersisted()
    if (!saved && !courses) return false
    dispatch({ type: 'HYDRATE', saved, courses })
    return true
  }, [])

  const importData = useCallback((data: ExportedData) => {
    if (!Array.isArray(data.coursesData)) {
      throw new Error('Invalid import file: coursesData is missing')
    }
    dispatch({ type: 'HYDRATE', saved: data.appState ?? null, courses: data.coursesData })
  }, [])

  const exportData = useCallback(
    (): ExportedData => ({
      appState: { filters: state.filters, nextCourseId: state.nextCourseId },
      coursesData: state.courses,
      exportDate: new Date().toISOString()
    }),
    [state]
  )

  const actions = useMemo(
    () => ({
      setFilters: (filters: Partial<Filters>) => dispatch({ type: 'SET_FILTERS', filters }),
      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
      setPaginationMode: (mode: PaginationMode) => dispatch({ type: 'SET_PAGINATION_MODE', mode }),
      setPage: (page: number) => dispatch({ type: 'SET_PAGE', page }),
      enroll: (courseId: number) => dispatch({ type: 'ENROLL', courseId }),
      addCourses: (courses: Course[]) => dispatch({ type: 'ADD_COURSES', courses }),
      createCourse: (input: NewCourseInput) => dispatch({ type: 'CREATE_COURSE', input }),
      deleteCourse: (courseId: number) => dispatch({ type: 'DELETE_COURSE', courseId }),
      completeLesson: (courseId: number, lessonId: number) =>
        dispatch({ type: 'COMPLETE_LESSON', courseId, lessonId })
    }),
    []
  )

  const value = useMemo<AppStateContextValue>(
    () => ({ state, ...actions, getCourse, saveNow, loadSaved, importData, exportData }),
    [state, actions, getCourse, saveNow, loadSaved, importData, exportData]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
