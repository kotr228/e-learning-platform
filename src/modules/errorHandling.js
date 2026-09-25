/**
 * Обробка помилок (Модуль 8)
 */

// =========================================
// Custom Error Classes
// =========================================

export class AppError extends Error {
  constructor(message, code = 'APP_ERROR') {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.timestamp = new Date()
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR')
    this.field = field
  }
}

export class NetworkError extends AppError {
  constructor(message, statusCode = null, url = null) {
    super(message, 'NETWORK_ERROR')
    this.statusCode = statusCode
    this.url = url
  }
}

export class APIError extends AppError {
  constructor(message, endpoint = null, method = 'GET') {
    super(message, 'API_ERROR')
    this.endpoint = endpoint
    this.method = method
  }
}

// =========================================
// ErrorLogger Class
// =========================================

export class ErrorLogger {
  constructor() {
    this.errors = []
    this.maxErrors = 50
  }

  log(error, context = {}) {
    const errorEntry = {
      error: error instanceof Error ? error : new Error(String(error)),
      context,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.errors.unshift(errorEntry)

    if (this.errors.length > this.maxErrors) {
      this.errors.pop()
    }

    console.group(`❌ Error: ${errorEntry.error.name}`)
    console.error('Message:', errorEntry.error.message)
    console.error('Code:', errorEntry.error.code)
    console.error('Context:', context)
    console.error('Stack:', errorEntry.error.stack)
    console.error('Timestamp:', errorEntry.timestamp)
    console.groupEnd()

    return errorEntry
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
    console.log('🗑️ Error log cleared')
  }

  getErrorStats() {
    const stats = {}
    this.errors.forEach(entry => {
      const name = entry.error.name
      stats[name] = (stats[name] || 0) + 1
    })
    return stats
  }
}

// Створюємо глобальний екземпляр
export const errorLogger = new ErrorLogger()

// =========================================
// Helper Functions
// =========================================

export function safeExecute(fn, fallback = null) {
  try {
    return fn()
  } catch (error) {
    errorLogger.log(error, { function: fn.name })
    return fallback
  }
}

export function showErrorDetails(error) {
  console.group('🔍 Error Details')
  console.log('Name:', error.name)
  console.log('Message:', error.message)
  console.log('Code:', error.code)
  console.log('Stack:', error.stack)
  console.log('JSON:', error.toJSON?.())
  console.groupEnd()
}

// =========================================
// Global Error Handlers
// =========================================

export function setupGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    errorLogger.log(event.error, {
      type: 'uncaught',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
    event.preventDefault()
  })

  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.log(event.reason, {
      type: 'unhandled_rejection',
      promise: event.promise
    })
    event.preventDefault()
  })
}
