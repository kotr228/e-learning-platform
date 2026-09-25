import { CoursesCatalog } from '@/components/courses/CoursesCatalog'

export default function CoursesPage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Доступні курси</h1>
        <p className="m-0 text-slate-500 dark:text-slate-400">
          Знайдіть курс під свій рівень — від перших кроків до професійних тем.
        </p>
      </header>
      <CoursesCatalog />
    </section>
  )
}
