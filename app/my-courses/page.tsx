'use client'

import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { PageLoading } from '@/components/PageLoading'
import { useAppState } from '@/context/AppStateContext'

export default function MyCoursesPage() {
  const { state } = useAppState()
  const enrolled = state.courses.filter(c => c.enrolled)

  return (
    <section className="page">
      <h2>Мої курси</h2>
      {!state.hydrated ? (
        <PageLoading />
      ) : enrolled.length === 0 ? (
        <EmptyState icon="🎒" link={{ href: '/', label: 'Перейти до каталогу курсів.' }}>
          Ви ще не записані на жоден курс.
        </EmptyState>
      ) : (
        <div className="courses-grid">
          {enrolled.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}
