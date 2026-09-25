import { getCourseIcons } from '@/lib/courseIcons'
import type { Course } from '@/lib/types'

interface CourseIconProps {
  course: Pick<Course, 'tech' | 'icon'>
  /** Розмір іконки в пікселях */
  size?: number
  /** Класи для кольору/ефектів самих іконок (наприклад, `text-white`) */
  className?: string
}

/**
 * Логотип(и) технологій курсу з react-icons.
 * Якщо курс без технології (власний або з API) — показує emoji-заглушку того ж розміру.
 */
export function CourseIcon({ course, size = 48, className = '' }: CourseIconProps) {
  const icons = getCourseIcons(course)

  if (icons.length === 0) {
    return (
      <span className="leading-none" style={{ fontSize: size }} aria-hidden>
        {course.icon || '📚'}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center justify-center gap-3" title={icons.map(i => i.label).join(' + ')}>
      {icons.map(({ key, icon: Icon, label }) => (
        <Icon key={key} size={size} className={`shrink-0 ${className}`} aria-hidden title={label} />
      ))}
    </span>
  )
}
