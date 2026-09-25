/**
 * Валідація форм (Модуль 5)
 */

import { errorLogger, ValidationError } from './errorHandling.js'

// =========================================
// Validation Rules
// =========================================

export const ValidationRules = {
  required: (value) => value.trim() !== '',

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  minLength: (value, length) => value.length >= length,

  maxLength: (value, length) => value.length <= length,

  pattern: (value, regex) => {
    return new RegExp(regex).test(value)
  },

  number: (value) => !isNaN(value) && value.trim() !== '',

  range: (value, min, max) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= min && num <= max
  },

  url: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
}

// =========================================
// Field Validation
// =========================================

export function validateField(field, customRules = {}) {
  const value = field.value
  const fieldName = field.getAttribute('data-label') || field.placeholder || 'Поле'

  // HTML5 валідація через Constraint Validation API
  if (!field.checkValidity()) {
    const validity = field.validity
    let errorMessage = ''

    if (validity.valueMissing) {
      errorMessage = `${fieldName} є обов'язковим`
    } else if (validity.typeMismatch) {
      if (field.type === 'email') {
        errorMessage = 'Введіть коректну email адресу'
      } else if (field.type === 'url') {
        errorMessage = 'Введіть коректний URL'
      } else {
        errorMessage = `Невірний формат для ${fieldName}`
      }
    } else if (validity.tooShort) {
      errorMessage = `Мінімальна довжина: ${field.minLength} символів`
    } else if (validity.tooLong) {
      errorMessage = `Максимальна довжина: ${field.maxLength} символів`
    } else if (validity.rangeUnderflow) {
      errorMessage = `Мінімальне значення: ${field.min}`
    } else if (validity.rangeOverflow) {
      errorMessage = `Максимальне значення: ${field.max}`
    } else if (validity.patternMismatch) {
      errorMessage = field.getAttribute('data-pattern-message') || 'Невірний формат'
    } else if (validity.stepMismatch) {
      errorMessage = `Значення має бути кратним ${field.step}`
    }

    showFieldError(field, errorMessage)

    // Логуємо ValidationError
    const validationError = new ValidationError(errorMessage, field.id || field.name)
    errorLogger.log(validationError, {
      fieldType: field.type,
      fieldValue: value,
      validityState: {
        valueMissing: validity.valueMissing,
        typeMismatch: validity.typeMismatch,
        tooShort: validity.tooShort,
        tooLong: validity.tooLong
      }
    })

    return false
  }

  // Користувацька валідація
  for (const [ruleName, ruleConfig] of Object.entries(customRules)) {
    const rule = ValidationRules[ruleName]
    if (!rule) continue

    const isValid = typeof ruleConfig === 'function'
      ? ruleConfig(value, field)
      : Array.isArray(ruleConfig)
        ? rule(value, ...ruleConfig)
        : rule(value, ruleConfig)

    if (!isValid) {
      const message = customRules[`${ruleName}Message`] || `Помилка валідації: ${ruleName}`
      showFieldError(field, message)

      const validationError = new ValidationError(message, field.id || field.name)
      errorLogger.log(validationError, {
        fieldType: field.type,
        fieldValue: value,
        customRule: ruleName,
        ruleConfig
      })

      return false
    }
  }

  clearFieldError(field)
  field.classList.add('field-valid')

  return true
}

export function validateForm(form, fieldRules = {}) {
  let isValid = true

  const fields = form.querySelectorAll('input, textarea, select')

  fields.forEach(field => {
    if (field.disabled) return

    const fieldId = field.id || field.name
    const customRules = fieldRules[fieldId] || {}

    if (!validateField(field, customRules)) {
      isValid = false
    }
  })

  return isValid
}

// =========================================
// Field Error Display
// =========================================

function showFieldError(field, message) {
  clearFieldError(field)

  field.classList.add('field-error')
  field.classList.remove('field-valid')
  field.setAttribute('aria-invalid', 'true')

  const errorDiv = document.createElement('span')
  errorDiv.className = 'error-message'
  errorDiv.setAttribute('role', 'alert')
  errorDiv.textContent = message

  const errorId = `error-${field.id || Math.random().toString(36).substr(2, 9)}`
  errorDiv.id = errorId
  field.setAttribute('aria-describedby', errorId)

  field.parentElement.appendChild(errorDiv)
}

function clearFieldError(field) {
  field.classList.remove('field-error')
  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')

  const existingError = field.parentElement.querySelector('.error-message')
  if (existingError) {
    existingError.remove()
  }
}

// =========================================
// Real-time Validation
// =========================================

export function addFieldValidation(field, customRules = {}) {
  let debounceTimer

  field.addEventListener('blur', () => {
    validateField(field, customRules)
  })

  field.addEventListener('input', () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (field.value.length > 0) {
        validateField(field, customRules)
      } else {
        clearFieldError(field)
      }
    }, 500)
  })
}
