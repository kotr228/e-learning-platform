'use client'

import Link from 'next/link'
import { CourseIcon } from '@/components/courses/CourseIcon'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import type { Course } from '@/lib/types'
import { buttonClass } from '@/components/ui/styles'

export function CourseDetail({ course }: { course: Course }) {
  const { enroll } = useAppState()
  const notify = useNotify()

  const onEnroll = () => {
    enroll(course.id)
    notify(`Ви успішно записались на курс "${course.title}"!`, 'success')
  }

  return (
    <div className="course-detail">
      <div className="mb-4 flex justify-center">
        <div className="flex h-28 min-w-28 items-center justify-center rounded-3xl bg-gradient-to-br px-7 from-brand-500 via-brand-600 to-accent-500 shadow-lg dark:from-brand-700 dark:via-brand-800 dark:to-accent-700">
          <CourseIcon course={course} size={56} className="text-white" />
        </div>
      </div>
      <h2>{course.title}</h2>
      <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>👨‍🏫 {course.instructor}</span>
        <span>⏱️ {course.duration}</span>
        <span>{course.progress}% завершено</span>
      </div>
      <p className="course-detail-description">{course.description}</p>

      {!course.enrolled && (
        <div className="mb-6 text-center">
          <button type="button" className={buttonClass('success')} onClick={onEnroll}>
            Записатись на курс
          </button>
        </div>
      )}

      <h3>📚 Уроки курсу</h3>
      <ol className="lessons-list">
        {course.lessons.map((lesson, index) => (
          <li key={lesson.id} className="lesson-item">
            <div>
              <h4>
                {lesson.completed ? '✅' : '📖'} {index + 1}. {lesson.title}
              </h4>
              <span className="text-slate-500 dark:text-slate-400">⏱️ {lesson.duration}</span>
            </div>
            {course.enrolled ? (
              <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className={buttonClass('primary', 'sm')}>
                {lesson.completed ? 'Переглянути знову' : 'Почати урок'}
              </Link>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">🔒 Недоступно</span>
            )}
          </li>
        ))}
      </ol>

      {course.enrolled && (
        <div className="text-center">
          <Link href={`/courses/${course.id}/test`} className={buttonClass('primary')}>
            📝 Пройти тест
          </Link>
        </div>
      )}
    </div>
  )
}
