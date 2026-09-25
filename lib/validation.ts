/**
 * Валідація форм (Модуль 5)
 * Поєднує Constraint Validation API браузера з користувацькими правилами.
 */

import { ValidationError, errorLogger } from './errors'

export type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export interface FieldRules {
  minLength?: number
  minLengthMessage?: string
  maxLength?: number
  maxLengthMessage?: string
  pattern?: RegExp
  patternMessage?: string
  min?: number
  minMessage?: string
  max?: number
  maxMessage?: string
  custom?: (value: string) => string | null
}

export const ValidationRules = {
  required: (value: string) => value.trim() !== '',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (value: string, length: number) => value.length >= length,
  maxLength: (value: string, length: number) => value.length <= length,
  pattern: (value: string, regex: RegExp) => regex.test(value),
  range: (value: string, min: number, max: number) => {
    const num = parseFloat(value)
    return !Number.isNaN(num) && num >= min && num <= max
  },
  url: (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
}

/** Повідомлення для вбудованої (HTML5) валідації */
function nativeErrorMessage(field: FormControl): string | null {
  if (field.checkValidity()) return null

  const { validity } = field
  const label = field.dataset.label || ('placeholder' in field && field.placeholder) || 'Поле'

  if (validity.valueMissing) return `${label} є обов'язковим`
  if (validity.typeMismatch) {
    if (field.type === 'email') return 'Введіть коректну email адресу'
    if (field.type === 'url') return 'Введіть коректний URL'
    return `Невірний формат для ${label}`
  }
  if (validity.tooShort && 'minLength' in field) return `Мінімальна довжина: ${field.minLength} символів`
  if (validity.tooLong && 'maxLength' in field) return `Максимальна довжина: ${field.maxLength} символів`
  if (validity.rangeUnderflow && 'min' in field) return `Мінімальне значення: ${field.min}`
  if (validity.rangeOverflow && 'max' in field) return `Максимальне значення: ${field.max}`
  if (validity.patternMismatch) return field.dataset.patternMessage || 'Невірний формат'
  if (validity.stepMismatch && 'step' in field) return `Значення має бути кратним ${field.step}`
  if (validity.badInput) return `Невірне значення для ${label}`
  return 'Невірне значення'
}

/** Перевіряє користувацькі правила; порожнє необов'язкове поле пропускається */
function customErrorMessage(value: string, rules: FieldRules): string | null {
  if (value === '') return null

  const { minLength, maxLength, pattern, min, max, custom } = rules
  if (minLength !== undefined && !ValidationRules.minLength(value, minLength)) {
    return rules.minLengthMessage ?? `Мінімальна довжина: ${minLength} символів`
  }
  if (maxLength !== undefined && !ValidationRules.maxLength(value, maxLength)) {
    return rules.maxLengthMessage ?? `Максимальна довжина: ${maxLength} символів`
  }
  if (pattern && !ValidationRules.pattern(value, pattern)) {
    return rules.patternMessage ?? 'Невірний формат'
  }
  if (min !== undefined && parseFloat(value) < min) {
    return rules.minMessage ?? `Мінімальне значення: ${min}`
  }
  if (max !== undefined && parseFloat(value) > max) {
    return rules.maxMessage ?? `Максимальне значення: ${max}`
  }
  return custom ? custom(value) : null
}

/**
 * Валідує одне поле. Повертає текст помилки або `null`, якщо поле валідне.
 */
export function validateField(field: FormControl, rules: FieldRules = {}): string | null {
  const message = nativeErrorMessage(field) ?? customErrorMessage(field.value, rules)

  if (message) {
    errorLogger.log(new ValidationError(message, field.id || field.name), {
      fieldType: field.type,
      fieldValue: field.value
    })
  }
  return message
}
