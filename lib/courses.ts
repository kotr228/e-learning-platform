/**
 * Чисті функції для роботи з курсами (Модулі 3, 4, 9)
 */

import type { Course, Filters, NewCourseInput, Question, TestAnswer } from './types'

export const PASSING_SCORE = 70
export const ITEMS_PER_PAGE = 6

// =========================================
// Фільтрація та сортування (Модуль 3)
// =========================================

export function getFilteredCourses(courses: Course[], { searchQuery, filterEnrolled, sortBy }: Filters): Course[] {
  let filtered = [...courses]

  const query = searchQuery.trim().toLowerCase()
  if (query) {
    filtered = filtered.filter(course =>
      [course.title, course.description, course.instructor, course.category ?? '']
        .some(field => field.toLowerCase().includes(query))
    )
  }

  if (filterEnrolled === 'enrolled') {
    filtered = filtered.filter(course => course.enrolled)
  } else if (filterEnrolled === 'available') {
    filtered = filtered.filter(course => !course.enrolled)
  }

  if (sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title, 'uk'))
  } else if (sortBy === 'duration') {
    filtered.sort((a, b) => parseInt(a.duration, 10) - parseInt(b.duration, 10))
  }

  return filtered
}

// =========================================
// Пагінація (Модуль 9)
// =========================================

export function calculateTotalPages(total: number, perPage = ITEMS_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / perPage))
}

export function getPageItems<T>(items: T[], page: number, perPage = ITEMS_PER_PAGE): T[] {
  const start = (page - 1) * perPage
  return items.slice(start, start + perPage)
}

/** Номери сторінок для відображення (максимум 7 кнопок з еліпсисом) */
export function getVisiblePages(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 5, 'ellipsis', total]
  }
  if (current >= total - 2) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

// =========================================
// Створення та оновлення курсів
// =========================================

export function createCustomCourse(id: number, input: NewCourseInput): Course {
  return {
    id,
    ...input,
    icon: input.icon || '📚',
    enrolled: false,
    progress: 0,
    isCustom: true,
    lessons: [
      {
        id: 1,
        title: 'Вступний урок',
        duration: '30 хв',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    test: {
      id,
      questions: [
        {
          question: 'Чи сподобався вам курс?',
          options: ['Так', 'Дуже так', 'Неймовірно!', 'Супер!'],
          correct: 0
        }
      ]
    }
  }
}

export function withCompletedLesson(course: Course, lessonId: number): Course {
  const lessons = course.lessons.map(lesson =>
    lesson.id === lessonId ? { ...lesson, completed: true } : lesson
  )
  const completed = lessons.filter(l => l.completed).length
  return {
    ...course,
    lessons,
    progress: Math.round((completed / lessons.length) * 100)
  }
}

// =========================================
// Тести
// =========================================

export function gradeTest(questions: Question[], userAnswers: Record<number, number>) {
  const answers: TestAnswer[] = questions.map((q, index) => {
    const userAnswer = userAnswers[index] ?? -1
    return {
      question: q.question,
      userAnswer,
      correctAnswer: q.correct,
      isCorrect: userAnswer === q.correct
    }
  })
  const score = answers.filter(a => a.isCorrect).length
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  return { answers, score, percentage, passed: percentage >= PASSING_SCORE }
}

// =========================================
// Аналітика (Модуль 4: reduce, map, filter, sort, Set)
// =========================================

export function calculateStatistics(courses: Course[]) {
  const stats = courses.reduce(
    (acc, { enrolled, progress, lessons, isCustom }) => {
      acc.totalCourses++
      if (enrolled) {
        acc.enrolledCourses++
        acc.totalProgress += progress
      }
      if (isCustom) acc.customCourses++
      if (progress === 100) acc.completedCourses++
      acc.totalLessons += lessons.length
      acc.completedLessons += lessons.filter(l => l.completed).length
      return acc
    },
    {
      totalCourses: 0,
      enrolledCourses: 0,
      customCourses: 0,
      completedCourses: 0,
      totalLessons: 0,
      completedLessons: 0,
      totalProgress: 0
    }
  )

  return {
    ...stats,
    avgProgress: stats.enrolledCourses > 0 ? Math.round(stats.totalProgress / stats.enrolledCourses) : 0
  }
}

export function groupCoursesByInstructor(courses: Course[]): Record<string, Course[]> {
  return courses.reduce<Record<string, Course[]>>((groups, course) => {
    ;(groups[course.instructor] ??= []).push(course)
    return groups
  }, {})
}

export function getTopInstructors(courses: Course[], limit = 3) {
  return Object.entries(groupCoursesByInstructor(courses))
    .map(([instructor, list]) => ({
      instructor,
      coursesCount: list.length,
      enrolledCount: list.filter(c => c.enrolled).length,
      courses: list.map(c => c.title)
    }))
    .sort((a, b) => b.coursesCount - a.coursesCount)
    .slice(0, limit)
}

export function getUniqueInstructors(courses: Course[]): string[] {
  return [...new Set(courses.map(c => c.instructor))]
}

export function getCoursesAnalytics(courses: Course[]) {
  return {
    hasCompletedCourses: courses.some(c => c.progress === 100),
    allCoursesHaveLessons: courses.every(c => c.lessons.length > 0),
    courseInProgress: courses.find(c => c.progress > 0 && c.progress < 100),
    firstAvailableCourseIndex: courses.findIndex(c => !c.enrolled)
  }
}
