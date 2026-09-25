'use client'

import { BookOpen, Clock, Star, Trash2, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { buttonClass } from '@/components/ui/styles'
import { CourseIcon } from './CourseIcon'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import { LEVEL_LABELS } from '@/lib/courses'
import type { Course, CourseLevel } from '@/lib/types'

const LEVEL_BADGE: Record<CourseLevel, string> = {
  beginner: 'bg-accent-50 text-accent-700 ring-accent-200 dark:bg-accent-500/15 dark:text-accent-300 dark:ring-accent-500/30',
  intermediate: 'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/30',
  advanced: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30'
}

const pluralLessons = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'урок'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'уроки'
  return 'уроків'
}

export function CourseCard({ course }: { course: Course }) {
  const router = useRouter()
  const notify = useNotify()
  const { enroll, deleteCourse } = useAppState()
  const href = `/courses/${course.id}`
  const isCompleted = course.enrolled && course.progress === 100

  // Уся картка клікабельна, але вкладені кнопки й посилання працюють самостійно
  const onCardClick = (e: MouseEvent<HTMLElement>) => {
    if (!(e.target as HTMLElement).closest('button, a')) router.push(href)
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
    <article
      data-course-id={course.id}
      onClick={onCardClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50 dark:hover:shadow-black/40"
    >
      {/* Обкладинка */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 dark:from-brand-700 dark:via-brand-800 dark:to-accent-700">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-12 -left-8 size-28 rounded-full bg-white/10" aria-hidden />
        {/* Логотип технології: білий на темному градієнті, по центру обкладинки */}
        <div className="relative flex items-center justify-center drop-shadow-md transition-transform duration-300 group-hover:scale-110">
          <CourseIcon course={course} size={48} className="text-white" />
        </div>

        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${LEVEL_BADGE[course.level]}`}
        >
          {LEVEL_LABELS[course.level]}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
          {course.rating > 0 ? (
            <>
              <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
              <span className="sr-only">Рейтинг</span>
              {course.rating.toFixed(1)}
            </>
          ) : (
            'Новий'
          )}
        </span>
      </div>

      {/* Вміст */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg leading-snug font-semibold">
          <Link
            href={href}
            className="text-slate-900 no-underline transition-colors duration-300 group-hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-white dark:group-hover:text-brand-300"
          >
            {course.title}
          </Link>
        </h3>

        <ul className="m-0 mb-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-slate-500 dark:text-slate-400">
          <li className="inline-flex items-center gap-1">
            <UserRound className="size-3.5" aria-hidden />
            {course.instructor}
          </li>
          <li className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {course.duration}
          </li>
          <li className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5" aria-hidden />
            {course.lessons.length} {pluralLessons(course.lessons.length)}
          </li>
        </ul>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {course.description}
        </p>

        {course.enrolled && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400">{isCompleted ? 'Завершено' : 'Прогрес'}</span>
              <span className="text-accent-700 dark:text-accent-400">{course.progress}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={course.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Прогрес курсу ${course.title}`}
              className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onPrimary}
            className={buttonClass(course.enrolled ? 'primary' : 'success', 'sm', 'flex-1')}
          >
            {course.enrolled ? (isCompleted ? 'Переглянути' : 'Продовжити') : 'Записатись'}
          </button>
          {course.isCustom && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Видалити курс ${course.title}`}
              title="Видалити курс"
              className={buttonClass('danger', 'sm', 'w-9 px-0')}
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
