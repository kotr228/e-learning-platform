'use client'

/**
 * React-хук для валідації форм (Модуль 5):
 * валідація на blur, real-time валідація з debounce та перевірка всієї форми при submit.
 */

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from 'react'
import { validateField, type FieldRules, type FormControl } from '@/lib/validation'

const DEBOUNCE_MS = 500

/** `undefined` — ще не перевірялось, `null` — валідне, рядок — текст помилки */
type ErrorsMap = Record<string, string | null | undefined>

function isFormControl(el: Element): el is FormControl {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement
}

export function useFormValidation(rules: Record<string, FieldRules> = {}) {
  const [errors, setErrors] = useState<ErrorsMap>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    const pending = timers.current
    return () => Object.values(pending).forEach(clearTimeout)
  }, [])

  const check = useCallback(
    (field: FormControl): boolean => {
      const message = validateField(field, rules[field.id])
      setErrors(prev => ({ ...prev, [field.id]: message }))
      return message === null
    },
    [rules]
  )

  const clear = useCallback((id: string) => {
    setErrors(prev => ({ ...prev, [id]: undefined }))
  }, [])

  /** Пропси для поля: обробники подій, ARIA-атрибути, класи стану */
  const fieldProps = (id: string) => {
    const error = errors[id]
    return {
      id,
      name: id,
      onBlur: (e: FocusEvent<FormControl>) => check(e.currentTarget),
      onChange: (e: ChangeEvent<FormControl>) => {
        const field = e.currentTarget
        clearTimeout(timers.current[id])
        // Поле з помилкою перевіряємо одразу, щоб помилка зникла, щойно її виправлено
        if (error) {
          check(field)
          return
        }
        timers.current[id] = setTimeout(() => {
          if (field.value.length > 0) check(field)
          else clear(id)
        }, DEBOUNCE_MS)
      },
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `error-${id}` : undefined,
      className: error ? 'field-error' : error === null ? 'field-valid' : undefined
    }
  }

  /** Валідує всі активні поля форми; повертає true, якщо форма валідна */
  const validateForm = (form: HTMLFormElement): boolean =>
    Array.from(form.elements)
      .filter(isFormControl)
      .filter(el => !el.disabled && !['submit', 'reset', 'button'].includes(el.type))
      .map(check)
      .every(Boolean)

  const reset = () => setErrors({})

  return { errors, fieldProps, validateForm, reset }
}
