'use client'

import Link from 'next/link'
import { EmptyState } from '@/components/EmptyState'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import type { Course } from '@/lib/types'
import { buttonClass } from '@/components/ui/styles'

export function LessonViewer({ course, lessonId }: { course: Course; lessonId: number }) {
  const { completeLesson } = useAppState()
  const notify = useNotify()
  const index = course.lessons.findIndex(l => l.id === lessonId)
  const lesson = course.lessons[index]

  if (!lesson) {
    return (
      <EmptyState icon="🤷" link={{ href: `/courses/${course.id}`, label: 'Повернутись до курсу' }}>
        Урок не знайдено.
      </EmptyState>
    )
  }

  const next = course.lessons[index + 1]

  const onComplete = () => {
    completeLesson(course.id, lesson.id)
    notify('Урок завершено! 🎉', 'success')
  }

  return (
    <div className="lesson-viewer">
      <h2>{lesson.title}</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">⏱️ {lesson.duration}</p>

      <div className="video-wrapper">
        <iframe
          src={lesson.videoUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="lesson-actions">
        <Link href={`/courses/${course.id}`} className={buttonClass('neutral')}>
          ← Назад до курсу
        </Link>
        {lesson.completed ? (
          <span className="lesson-done">✅ Урок завершено</span>
        ) : (
          <button type="button" className={buttonClass('success')} onClick={onComplete}>
            ✓ Позначити як завершений
          </button>
        )}
        {next && (
          <Link href={`/courses/${course.id}/lessons/${next.id}`} className={buttonClass('outline')}>
            Наступний урок →
          </Link>
        )}
      </div>
    </div>
  )
}
