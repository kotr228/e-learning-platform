'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import type { Course } from '@/lib/types'

export function CourseCard({ course }: { course: Course }) {
  const router = useRouter()
  const notify = useNotify()
  const { enroll, deleteCourse } = useAppState()
  const href = `/courses/${course.id}`

  const onCardClick = (e: MouseEvent<HTMLElement>) => {
    if (!(e.target as HTMLElement).closest('button, a')) {
      router.push(href)
    }
  }

  const onPrimary = () => {
    if (course.enrolled) {
      router.push(href)
    } else {
      enroll(course.id)
      notify(`Ви успішно записались на курс "${course.title}"!`, 'success')
    }
  }

  const onDelete = () => {
    if (!confirm(`Ви впевнені, що хочете видалити курс "${course.title}"?`)) return
    deleteCourse(course.id)
    notify(`Курс "${course.title}" видалено`, 'success')
  }

  return (
    <article className="course-card" data-course-id={course.id} onClick={onCardClick}>
      <div className="course-card-image" aria-hidden="true">
        {course.icon}
      </div>
      <div className="course-card-content">
        <h3>
          <Link href={href} className="course-card-title">
            {course.title}
          </Link>
        </h3>
        <div className="course-card-meta">
          <span>👨‍🏫 {course.instructor}</span>
          <span>⏱️ {course.duration}</span>
        </div>
        <p>{course.description}</p>
        <div className="course-card-footer">
          <span className="course-progress">{course.enrolled ? `${course.progress}% завершено` : ''}</span>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary" onClick={onPrimary}>
              {course.enrolled ? 'Продовжити' : 'Записатись'}
            </button>
            {course.isCustom && (
              <button type="button" className="btn btn-secondary" onClick={onDelete}>
                🗑️ Видалити
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
