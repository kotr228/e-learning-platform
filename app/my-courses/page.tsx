'use client'

import { CourseCard } from '@/components/courses/CourseCard'
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
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enrolled.map(course => (
            <li key={course.id} className="flex [&>*]:flex-1">
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
