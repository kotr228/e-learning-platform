'use client'

/**
 * Статистика прогресу (Модуль 4: reduce, map, filter, sort)
 */

import { useEffect, useMemo } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { CourseIcon } from '@/components/courses/CourseIcon'
import { useAppState } from '@/context/AppStateContext'
import { calculateStatistics, getCoursesAnalytics, getTopInstructors, getUniqueInstructors } from '@/lib/courses'

const pluralCourses = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'курс'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'курси'
  return 'курсів'
}

export function ProgressDashboard() {
  const { state } = useAppState()
  const { courses } = state

  const stats = useMemo(() => calculateStatistics(courses), [courses])
  const topInstructors = useMemo(() => getTopInstructors(courses), [courses])
  const enrolled = courses.filter(c => c.enrolled)

  useEffect(() => {
    console.log('📊 Модуль 4: Аналітика курсів', {
      stats: calculateStatistics(courses),
      uniqueInstructors: getUniqueInstructors(courses),
      analytics: getCoursesAnalytics(courses)
    })
  }, [courses])

  const cards = [
    { icon: '📚', value: stats.totalCourses, label: 'Всього курсів', tone: 'violet' },
    { icon: '✅', value: stats.enrolledCourses, label: 'Записано', tone: 'mint' },
    { icon: '🎯', value: stats.completedCourses, label: 'Завершено', tone: 'green' },
    { icon: '⭐', value: stats.customCourses, label: 'Власних', tone: 'peach' },
    { icon: '📖', value: stats.totalLessons, label: 'Всього уроків', tone: 'pink' },
    { icon: '✓', value: stats.completedLessons, label: 'Уроків пройдено', tone: 'sky' }
  ]

  return (
    <div id="progress-stats">
      <section className="mb-12">
        <h3 className="section-title">📊 Загальна статистика</h3>
        <div className="stats-grid">
          {cards.map(({ icon, value, label, tone }) => (
            <div key={label} className={`stat-card stat-${tone}`}>
              <div className="stat-icon" aria-hidden="true">
                {icon}
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {topInstructors.length > 0 && (
        <section className="mb-12">
          <h3 className="section-title">👨‍🏫 Топ викладачів</h3>
          <div className="grid gap-4">
            {topInstructors.map(({ instructor, coursesCount, enrolledCount, courses: titles }, index) => (
              <div key={instructor} className="panel mb-0">
                <div className="mb-2 flex items-center justify-between">
                  <strong>
                    {index + 1}. {instructor}
                  </strong>
                  <span className="badge-soft">
                    {coursesCount} {pluralCourses(coursesCount)}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Записано на {enrolledCount} з {coursesCount}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{titles.join(', ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {enrolled.length > 0 ? (
        <section className="mb-12">
          <h3 className="section-title">📈 Детальний прогрес ({stats.avgProgress}% середній)</h3>
          {enrolled.map(course => {
            const done = course.lessons.filter(l => l.completed).length
            return (
              <div key={course.id} className="panel progress-card">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="m-0 flex items-center gap-2">
                    <CourseIcon course={course} size={20} className="text-brand-600 dark:text-brand-300" />
                    {course.title}
                  </h4>
                  <span className="font-bold">{course.progress}%</span>
                </div>
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={course.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Прогрес курсу ${course.title}`}
                >
                  <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {done} з {course.lessons.length} уроків завершено
                </div>
              </div>
            )
          })}
        </section>
      ) : (
        <EmptyState icon="📚" link={{ href: '/', label: 'Переглянути курси' }}>
          Почніть навчання, щоб побачити свій прогрес!
        </EmptyState>
      )}
    </div>
  )
}
