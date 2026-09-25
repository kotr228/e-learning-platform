/**
 * Доменні типи платформи
 */

export interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
  videoUrl: string
}

export interface Question {
  question: string
  options: string[]
  /** Індекс правильної відповіді в `options` */
  correct: number
}

export interface CourseTest {
  id: number
  questions: Question[]
}

export interface Course {
  id: number
  title: string
  instructor: string
  duration: string
  description: string
  icon: string
  enrolled: boolean
  progress: number
  level: CourseLevel
  /** Середня оцінка від 0 до 5 (0 — ще немає оцінок) */
  rating: number
  lessons: Lesson[]
  test: CourseTest
  category?: string
  /** Курс створений користувачем (можна видалити) */
  isCustom?: boolean
  /** Курс завантажений з API */
  isFromAPI?: boolean
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type LevelFilter = 'all' | CourseLevel
export type StatusFilter = 'all' | 'available' | 'in-progress' | 'completed'
export type SortBy = 'default' | 'newest' | 'rating' | 'title' | 'duration'
export type PaginationMode = 'pagination' | 'loadmore' | 'infinite'

export interface Filters {
  searchQuery: string
  status: StatusFilter
  level: LevelFilter
  sortBy: SortBy
}

export type NotificationType = 'success' | 'error' | 'info'

export interface NewCourseInput {
  title: string
  instructor: string
  duration: string
  description: string
  icon: string
  level: CourseLevel
}

export interface TestAnswer {
  question: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
}
