/**
 * API інтеграція (Модулі 6-7)
 * Функції не залежать від UI: помилки прокидаються нагору, де компоненти показують нотифікації.
 */

import axios, { type AxiosError } from 'axios'
import { APIError, NetworkError, errorLogger } from './errors'
import type { Course } from './types'

// =========================================
// Axios Configuration (Модуль 6)
// =========================================

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
  config => {
    console.log(`📤 Axios Request: ${config.method?.toUpperCase()} ${config.url}`)
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    const requestError = new APIError(
      `Request setup failed: ${error.message}`,
      error.config?.url ?? null,
      error.config?.method
    )
    errorLogger.log(requestError, { type: 'axios_request' })
    return Promise.reject(requestError)
  }
)

const STATUS_MESSAGES: Record<number, string> = {
  401: '🔒 Unauthorized - потрібна авторизація',
  403: '⛔ Forbidden - доступ заборонено',
  404: '🔍 Not Found - ресурс не знайдено',
  500: '💥 Server Error - помилка сервера'
}

api.interceptors.response.use(
  response => {
    console.log(`📥 Axios Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    // Скасовані запити прокидаємо як є
    if (axios.isCancel(error)) return Promise.reject(error)

    let customError: NetworkError | APIError

    if (error.response) {
      const { status, data } = error.response
      customError = new NetworkError(
        STATUS_MESSAGES[status] ?? `⚠️ HTTP Error ${status}`,
        status,
        error.config?.url ?? null
      )
      customError.responseData = data
      errorLogger.log(customError, { type: 'axios_response', status })
    } else if (error.request) {
      customError = new NetworkError('📡 No response received from server', null, error.config?.url ?? null)
      errorLogger.log(customError, { type: 'axios_no_response' })
    } else {
      customError = new APIError(
        `⚙️ Request configuration error: ${error.message}`,
        error.config?.url ?? null,
        error.config?.method
      )
      errorLogger.log(customError, { type: 'axios_config_error' })
    }

    return Promise.reject(customError)
  }
)

/** Людиночитне повідомлення для будь-якої помилки API */
export function describeApiError(error: unknown): string {
  if (error instanceof NetworkError) {
    if (error.statusCode === null) return '❌ Немає зв\'язку з сервером'
    if (error.statusCode === 404) return '❌ Ресурс не знайдено'
    if (error.statusCode >= 500) return '❌ Помилка сервера. Спробуйте пізніше'
    return `❌ ${error.message}`
  }
  if (error instanceof APIError) return '❌ Помилка налаштування запиту'
  return '❌ Невідома помилка'
}

// =========================================
// CRUD (Модуль 6)
// =========================================

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

/** GET: завантажує пости та перетворює їх на курси */
export async function fetchCoursesFromAPI(firstId: number, limit = 3): Promise<Course[]> {
  const { data } = await api.get<Post[]>('/posts', { params: { _limit: limit } })

  return data.map((post, index) => {
    const id = firstId + index
    return {
      id,
      title: post.title.slice(0, 50),
      instructor: `API Instructor #${post.userId}`,
      duration: `${Math.floor(Math.random() * 10) + 5} годин`,
      description: post.body,
      icon: ['🌐', '📡', '☁️'][index % 3],
      enrolled: false,
      progress: 0,
      isFromAPI: true,
      lessons: [
        {
          id: 1,
          title: 'Вступний урок',
          duration: '30 хв',
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ],
      test: {
        id,
        questions: [
          {
            question: 'Чи сподобався вам курс?',
            options: ['Так', 'Дуже так', 'Неймовірно!', 'Супер!'],
            correct: 0
          }
        ]
      }
    }
  })
}

/** POST: відправляє курс на сервер */
export async function sendCourseToAPI(course: Pick<Course, 'title' | 'description'>) {
  const { data } = await api.post<Post>('/posts', {
    title: course.title,
    body: course.description,
    userId: 1
  })
  return data
}

/** PUT: оновлює курс */
export async function updateCourseOnAPI(courseId: number, updates: Partial<Course>) {
  const { data } = await api.put(`/posts/${courseId}`, updates)
  return data
}

/** DELETE: видаляє курс */
export async function deleteCourseFromAPI(courseId: number) {
  const { data } = await api.delete(`/posts/${courseId}`)
  return data
}

// =========================================
// Advanced (Модуль 7)
// =========================================

const apiCache = new Map<string, { data: unknown; timestamp: number }>()
let abortController: AbortController | null = null

/** Завантаження з кешем і скасуванням попереднього запиту */
export async function loadWithCache<T>(url: string, cacheTime = 60_000): Promise<{ data: T; fromCache: boolean }> {
  const cached = apiCache.get(url)
  const now = Date.now()

  if (cached && now - cached.timestamp < cacheTime) {
    console.log('📦 Модуль 7: Дані з кешу', url)
    return { data: cached.data as T, fromCache: true }
  }

  abortController?.abort()
  abortController = new AbortController()

  const { data } = await api.get<T>(url, { signal: abortController.signal })
  apiCache.set(url, { data, timestamp: now })
  console.log('🌐 Модуль 7: Дані з API (закешовано)', url)
  return { data, fromCache: false }
}

export function clearAPICache() {
  apiCache.clear()
}

/** Пагінація на рівні API */
export async function loadUsersWithPagination(page = 1, limit = 5) {
  const response = await api.get<unknown[]>('/users', { params: { _page: page, _limit: limit } })
  return {
    data: response.data,
    page,
    limit,
    total: parseInt(String(response.headers['x-total-count'] ?? '10'), 10)
  }
}

/** Batch: Promise.allSettled з частковим успіхом */
export async function batchLoadData(endpoints: string[]) {
  const results = await Promise.allSettled(endpoints.map(endpoint => api.get(endpoint)))
  const successful = results.flatMap(r => (r.status === 'fulfilled' ? [r.value.data] : []))
  const failed = results.filter(r => r.status === 'rejected')
  return { successful, failed }
}

/** Retry з exponential backoff: 1s, 2s, 4s... */
export async function fetchWithRetry<T>(url: string, maxRetries = 3): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Модуль 7: Спроба ${attempt}/${maxRetries}`)
      const { data } = await api.get<T>(url)
      return data
    } catch (error) {
      lastError = error
      if (attempt < maxRetries) {
        const delay = 2 ** (attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}
