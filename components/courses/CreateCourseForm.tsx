'use client'

/**
 * Форма створення курсу (Модулі 2, 5, 6)
 */

import { Plus, X } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { FieldError } from '@/components/FieldError'
import { buttonClass, fieldClass, panelClass } from '@/components/ui/styles'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import { useFormValidation } from '@/hooks/useFormValidation'
import { describeApiError, sendCourseToAPI } from '@/lib/api'
import { LEVEL_LABELS } from '@/lib/courses'
import type { CourseLevel } from '@/lib/types'
import type { FieldRules } from '@/lib/validation'

const RULES: Record<string, FieldRules> = {
  'course-title': {
    minLength: 5,
    minLengthMessage: 'Назва курсу має містити мінімум 5 символів',
    maxLength: 100,
    maxLengthMessage: 'Назва курсу занадто довга (макс. 100 символів)'
  },
  'course-instructor': {
    minLength: 3,
    minLengthMessage: "Ім'я викладача має містити мінімум 3 символи"
  },
  'course-duration': {
    pattern: /\d+\s*(год|хв|хвилин|годин|hours?|minutes?)/i,
    patternMessage: 'Вкажіть тривалість у форматі "10 годин" або "45 хв"'
  },
  'course-description': {
    minLength: 20,
    minLengthMessage: 'Опис курсу має містити мінімум 20 символів',
    maxLength: 500,
    maxLengthMessage: 'Опис курсу занадто довгий (макс. 500 символів)'
  }
}

export function CreateCourseForm({ onClose }: { onClose: () => void }) {
  const { createCourse } = useAppState()
  const notify = useNotify()
  const { errors, fieldProps, validateForm } = useFormValidation(RULES)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!validateForm(form)) {
      notify('Будь ласка, виправте помилки у формі', 'error')
      return
    }

    const data = new FormData(form)
    const input = {
      title: String(data.get('course-title')).trim(),
      instructor: String(data.get('course-instructor')).trim(),
      duration: String(data.get('course-duration')).trim(),
      description: String(data.get('course-description')).trim(),
      icon: String(data.get('course-icon') ?? '').trim(),
      level: String(data.get('course-level')) as CourseLevel
    }

    createCourse(input)
    onClose()
    notify(`Курс "${input.title}" успішно створено! 🎉`, 'success')

    // Модуль 6: POST на API (локальний курс уже створено)
    sendCourseToAPI(input)
      .then(() => notify('✅ Курс успішно відправлено на сервер!', 'success'))
      .catch(error => notify(`${describeApiError(error)} — курс збережено лише локально`, 'error'))
  }

  /** Пропси поля з хука валідації + фірмові стилі */
  const field = (id: string, extra = 'px-3') => {
    const props = fieldProps(id)
    return { ...props, className: `${fieldClass} ${extra} ${props.className ?? ''}` }
  }

  return (
    <section
      id="create-course-form-container"
      aria-labelledby="create-course-title"
      className={`${panelClass} p-5 transition-all duration-300 starting:-translate-y-2 starting:opacity-0 sm:p-6`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="create-course-title" className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Створити власний курс
          </h2>
          <p className="m-0 text-sm text-slate-500 dark:text-slate-400">Поля з * обов&apos;язкові</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Закрити форму" className={buttonClass('ghost', 'sm', 'w-9 px-0')}>
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <form id="create-course-form" noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="course-title" label="Назва курсу *" error={errors['course-title']} className="md:col-span-2">
          <input {...field('course-title')} type="text" required placeholder="Наприклад: Python для Data Science" data-label="Назва курсу" />
        </Field>

        <Field id="course-instructor" label="Викладач *" error={errors['course-instructor']}>
          <input {...field('course-instructor')} type="text" required placeholder="Ваше ім'я" data-label="Викладач" />
        </Field>

        <Field id="course-duration" label="Тривалість *" error={errors['course-duration']}>
          <input {...field('course-duration')} type="text" required placeholder="Наприклад: 10 годин" data-label="Тривалість" />
        </Field>

        <Field id="course-level" label="Складність" error={errors['course-level']}>
          <select {...field('course-level', 'cursor-pointer px-3')} defaultValue="beginner" data-label="Складність">
            {(Object.keys(LEVEL_LABELS) as CourseLevel[]).map(level => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </Field>

        <Field id="course-icon" label="Іконка (емодзі)" error={errors['course-icon']}>
          <input {...field('course-icon')} type="text" placeholder="📚" maxLength={8} data-label="Іконка" />
        </Field>

        <Field id="course-description" label="Опис курсу *" error={errors['course-description']} className="md:col-span-2">
          <textarea
            {...field('course-description', 'h-auto px-3 py-2.5')}
            rows={3}
            required
            placeholder="Короткий опис курсу (20–500 символів)..."
            data-label="Опис курсу"
          />
        </Field>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4 md:col-span-2 dark:border-slate-800">
          <button type="button" className={buttonClass('neutral')} onClick={onClose}>
            Скасувати
          </button>
          <button type="submit" className={buttonClass('success')}>
            <Plus className="size-5" aria-hidden />
            Створити курс
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({
  id,
  label,
  error,
  className = '',
  children
}: {
  id: string
  label: string
  error: string | null | undefined
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      <FieldError id={id} message={error} />
    </div>
  )
}
