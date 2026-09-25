'use client'

import type { ReactNode } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { PageLoading } from '@/components/PageLoading'
import { useAppState } from '@/context/AppStateContext'
import type { Course } from '@/lib/types'

interface CourseGateProps {
  courseId: number
  /** Вимагати запис на курс (уроки, тест) */
  requireEnrollment?: boolean
  children: (course: Course) => ReactNode
}

/** Знаходить курс за id та обробляє стани завантаження / відсутності / доступу */
export function CourseGate({ courseId, requireEnrollment = false, children }: CourseGateProps) {
  const { state, getCourse } = useAppState()
  const course = getCourse(courseId)

  if (!course) {
    // Власні курси з'являються лише після завантаження LocalStorage
    if (!state.hydrated) return <PageLoading />
    return (
      <EmptyState icon="🤷" link={{ href: '/', label: 'Повернутись до каталогу' }}>
        Курс не знайдено.
      </EmptyState>
    )
  }

  if (requireEnrollment && !course.enrolled) {
    return (
      <EmptyState icon="🔒" link={{ href: `/courses/${course.id}`, label: 'Перейти до курсу' }}>
        Спочатку запишіться на курс &laquo;{course.title}&raquo;.
      </EmptyState>
    )
  }

  return <>{children(course)}</>
}
