/**
 * Обробка помилок (Модуль 8)
 */

// =========================================
// Custom Error Classes
// =========================================

export class AppError extends Error {
  code: string
  timestamp: Date

  constructor(message: string, code = 'APP_ERROR') {
    super(message)
    this.name = new.target.name
    this.code = code
    this.timestamp = new Date()
    Object.setPrototypeOf(this, new.target.prototype)
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
  field: string | null

  constructor(message: string, field: string | null = null) {
    super(message, 'VALIDATION_ERROR')
    this.field = field
  }
}

export class NetworkError extends AppError {
  statusCode: number | null
  url: string | null
  responseData?: unknown

  constructor(message: string, statusCode: number | null = null, url: string | null = null) {
    super(message, 'NETWORK_ERROR')
    this.statusCode = statusCode
    this.url = url
  }
}

export class APIError extends AppError {
  endpoint: string | null
  method: string

  constructor(message: string, endpoint: string | null = null, method = 'GET') {
    super(message, 'API_ERROR')
    this.endpoint = endpoint
    this.method = method
  }
}

// =========================================
// ErrorLogger
// =========================================

export interface ErrorEntry {
  error: Error & { code?: string }
  context: Record<string, unknown>
  timestamp: Date
  userAgent: string
  url: string
}

export class ErrorLogger {
  private errors: ErrorEntry[] = []
  private readonly maxErrors = 50

  log(error: unknown, context: Record<string, unknown> = {}): ErrorEntry {
    const isBrowser = typeof window !== 'undefined'
    const entry: ErrorEntry = {
      error: error instanceof Error ? error : new Error(String(error)),
      context,
      timestamp: new Date(),
      userAgent: isBrowser ? navigator.userAgent : 'server',
      url: isBrowser ? window.location.href : ''
    }

    this.errors.unshift(entry)
    if (this.errors.length > this.maxErrors) {
      this.errors.pop()
    }

    console.group(`❌ Error: ${entry.error.name}`)
    console.error('Message:', entry.error.message)
    console.error('Code:', entry.error.code)
    console.error('Context:', context)
    console.error('Stack:', entry.error.stack)
    console.groupEnd()

    return entry
  }

  getErrors(): ErrorEntry[] {
    return this.errors
  }

  clearErrors() {
    this.errors = []
    console.log('🗑️ Error log cleared')
  }

  getErrorStats(): Record<string, number> {
    return this.errors.reduce<Record<string, number>>((stats, { error }) => {
      stats[error.name] = (stats[error.name] ?? 0) + 1
      return stats
    }, {})
  }
}

export const errorLogger = new ErrorLogger()

// =========================================
// Global Error Handlers
// =========================================

/** Реєструє глобальні обробники; повертає функцію для їх зняття */
export function setupGlobalErrorHandlers(): () => void {
  const onError = (event: ErrorEvent) => {
    errorLogger.log(event.error ?? event.message, {
      type: 'uncaught',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  }

  const onRejection = (event: PromiseRejectionEvent) => {
    errorLogger.log(event.reason, { type: 'unhandled_rejection' })
  }

  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)

  return () => {
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onRejection)
  }
}
