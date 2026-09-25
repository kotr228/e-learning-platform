'use client'

import Link from 'next/link'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import type { Course } from '@/lib/types'

export function CourseDetail({ course }: { course: Course }) {
  const { enroll } = useAppState()
  const notify = useNotify()

  const onEnroll = () => {
    enroll(course.id)
    notify(`Ви успішно записались на курс "${course.title}"!`, 'success')
  }

  return (
    <div className="course-detail">
      <div className="course-detail-icon" aria-hidden="true">
        {course.icon}
      </div>
      <h2>{course.title}</h2>
      <div className="course-card-meta justify-content-center mb-4">
        <span>👨‍🏫 {course.instructor}</span>
        <span>⏱️ {course.duration}</span>
        <span>{course.progress}% завершено</span>
      </div>
      <p className="course-detail-description">{course.description}</p>

      {!course.enrolled && (
        <div className="text-center mb-4">
          <button type="button" className="btn btn-primary" onClick={onEnroll}>
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
              <span className="text-muted">⏱️ {lesson.duration}</span>
            </div>
            {course.enrolled ? (
              <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="btn btn-primary">
                {lesson.completed ? 'Переглянути знову' : 'Почати урок'}
              </Link>
            ) : (
              <span className="text-muted">🔒 Недоступно</span>
            )}
          </li>
        ))}
      </ol>

      {course.enrolled && (
        <div className="text-center">
          <Link href={`/courses/${course.id}/test`} className="btn btn-primary">
            📝 Пройти тест
          </Link>
        </div>
      )}
    </div>
  )
}
