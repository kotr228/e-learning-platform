'use client'

/**
 * Форма створення курсу (Модулі 2, 5, 6)
 */

import type { FormEvent } from 'react'
import { FieldError } from '@/components/FieldError'
import { useAppState } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import { useFormValidation } from '@/hooks/useFormValidation'
import { describeApiError, sendCourseToAPI } from '@/lib/api'
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
      icon: String(data.get('course-icon') ?? '').trim()
    }

    createCourse(input)
    onClose()
    notify(`Курс "${input.title}" успішно створено! 🎉`, 'success')

    // Модуль 6: POST на API (локальний курс уже створено)
    sendCourseToAPI(input)
      .then(() => notify('✅ Курс успішно відправлено на сервер!', 'success'))
      .catch(error => notify(`${describeApiError(error)} — курс збережено лише локально`, 'error'))
  }

  return (
    <div id="create-course-form-container" className="panel">
      <h3 className="panel-title">➕ Створити власний курс</h3>
      <form noValidate onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="course-title">Назва курсу</label>
          <input
            {...fieldProps('course-title')}
            type="text"
            required
            placeholder="Наприклад: Python для Data Science"
            data-label="Назва курсу"
          />
          <FieldError id="course-title" message={errors['course-title']} />
        </div>

        <div className="form-group">
          <label htmlFor="course-instructor">Викладач</label>
          <input {...fieldProps('course-instructor')} type="text" required placeholder="Ваше ім'я" data-label="Викладач" />
          <FieldError id="course-instructor" message={errors['course-instructor']} />
        </div>

        <div className="form-group">
          <label htmlFor="course-duration">Тривалість</label>
          <input
            {...fieldProps('course-duration')}
            type="text"
            required
            placeholder="Наприклад: 10 годин"
            data-label="Тривалість"
          />
          <FieldError id="course-duration" message={errors['course-duration']} />
        </div>

        <div className="form-group">
          <label htmlFor="course-description">Опис курсу</label>
          <textarea
            {...fieldProps('course-description')}
            rows={3}
            required
            placeholder="Короткий опис курсу..."
            data-label="Опис курсу"
          />
          <FieldError id="course-description" message={errors['course-description']} />
        </div>

        <div className="form-group">
          <label htmlFor="course-icon">Іконка (емодзі)</label>
          <input {...fieldProps('course-icon')} type="text" placeholder="📚" maxLength={8} data-label="Іконка" />
          <FieldError id="course-icon" message={errors['course-icon']} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Скасувати
          </button>
          <button type="submit" className="btn btn-primary">
            ✓ Створити курс
          </button>
        </div>
      </form>
    </div>
  )
}
