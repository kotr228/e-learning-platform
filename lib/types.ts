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
  lessons: Lesson[]
  test: CourseTest
  category?: string
  /** Курс створений користувачем (можна видалити) */
  isCustom?: boolean
  /** Курс завантажений з API */
  isFromAPI?: boolean
}

export type EnrollmentFilter = 'all' | 'enrolled' | 'available'
export type SortBy = 'default' | 'title' | 'duration'
export type PaginationMode = 'pagination' | 'loadmore' | 'infinite'

export interface Filters {
  searchQuery: string
  filterEnrolled: EnrollmentFilter
  sortBy: SortBy
}

export type NotificationType = 'success' | 'error' | 'info'

export interface NewCourseInput {
  title: string
  instructor: string
  duration: string
  description: string
  icon: string
}

export interface TestAnswer {
  question: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
}
