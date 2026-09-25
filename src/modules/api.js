/**
 * API інтеграція (Модуль 6-7)
 */

import axios from 'axios'
import { errorLogger, NetworkError, APIError } from './errorHandling.js'
import { showNotification } from '../utils/notifications.js'
import { createElement } from '../utils/dom.js'

// =========================================
// Axios Configuration (Модуль 6)
// =========================================

/**
 * Створення екземпляру Axios з базовою конфігурацією
 */
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor - додає токен автентифікації та логування
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Axios Request: ${config.method.toUpperCase()} ${config.url}`)

    // Симуляція додавання токена (якби була справжня авторизація)
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    const requestError = new APIError(
      `Request setup failed: ${error.message}`,
      error.config?.url,
      error.config?.method
    )
    errorLogger.log(requestError, {
      type: 'axios_request',
      config: error.config
    })
    return Promise.reject(requestError)
  }
)

// Response Interceptor - обробка відповідей та помилок
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Axios Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    let customError
    let errorMessage = ''

    if (error.response) {
      // Сервер відповів з кодом помилки
      switch (error.response.status) {
        case 401:
          errorMessage = '🔒 Unauthorized - потрібна авторизація'
          break
        case 404:
          errorMessage = '🔍 Not Found - ресурс не знайдено'
          break
        case 500:
          errorMessage = '💥 Server Error - помилка сервера'
          break
        default:
          errorMessage = `⚠️ HTTP Error ${error.response.status}`
      }

      customError = new NetworkError(
        errorMessage,
        error.response.status,
        error.config?.url
      )
      customError.responseData = error.response.data

      errorLogger.log(customError, {
        type: 'axios_response',
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      })
    } else if (error.request) {
      // Запит був відправлений, але відповіді не було
      customError = new NetworkError(
        '📡 No response received from server',
        null,
        error.config?.url
      )

      errorLogger.log(customError, {
        type: 'axios_no_response',
        request: error.request
      })
    } else {
      // Щось пішло не так при налаштуванні запиту
      customError = new APIError(
        `⚙️ Request configuration error: ${error.message}`,
        error.config?.url,
        error.config?.method
      )

      errorLogger.log(customError, {
        type: 'axios_config_error',
        originalMessage: error.message
      })
    }

    return Promise.reject(customError)
  }
)

// =========================================
// Basic CRUD Operations (Модуль 6)
// =========================================

/**
 * Завантажує курси з API
 * Демонструє: GET запит, params, error handling
 */
export async function loadCoursesFromAPI(coursesData, appState, renderCourses) {
  // Use global functions/objects if not provided as parameters
  const coursesDataRef = coursesData || window.coursesData
  const appStateRef = appState || window.appState
  const renderCoursesRef = renderCourses || window.renderCourses

  try {
    // Показуємо loading стан
    showNotification('⏳ Завантаження курсів з API...', 'info')

    // GET запит до API
    const response = await api.get('/posts', {
      params: {
        _limit: 3 // Отримуємо тільки 3 пости для демонстрації
      }
    })

    // Трансформуємо дані з API в формат наших курсів
    const apiCourses = response.data.map((post, index) => ({
      id: appStateRef.nextCourseId++,
      title: post.title.slice(0, 50), // Обрізаємо довгі назви
      instructor: `API Instructor #${post.userId}`,
      duration: `${Math.floor(Math.random() * 10) + 5} годин`,
      description: post.body,
      icon: ['🌐', '📡', '☁️'][index % 3],
      enrolled: false,
      progress: 0,
      isFromAPI: true, // Позначаємо що курс з API
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
        id: appStateRef.nextCourseId,
        questions: [
          {
            question: 'Чи сподобався вам курс?',
            options: ['Так', 'Дуже так', 'Неймовірно!', 'Супер!'],
            correct: 0
          }
        ]
      }
    }))

    // Додаємо курси до масиву
    coursesDataRef.push(...apiCourses)

    // Оновлюємо список
    renderCoursesRef()

    showNotification(`✅ Завантажено ${apiCourses.length} курсів з API!`, 'success')

    console.log('📊 Модуль 6: Курси завантажені з API', apiCourses)

    return apiCourses
  } catch (error) {
    // Детальна обробка помилок залежно від типу
    if (error instanceof NetworkError) {
      if (error.statusCode === 404) {
        showNotification('❌ API endpoint не знайдено', 'error')
      } else if (error.statusCode === 500) {
        showNotification('❌ Помилка сервера. Спробуйте пізніше', 'error')
      } else if (!error.statusCode) {
        showNotification('❌ Немає зв\'язку з сервером', 'error')
      } else {
        showNotification(`❌ Помилка завантаження: ${error.message}`, 'error')
      }
    } else if (error instanceof APIError) {
      showNotification('❌ Помилка налаштування запиту', 'error')
    } else {
      showNotification('❌ Невідома помилка завантаження курсів', 'error')
      errorLogger.log(error, { function: 'loadCoursesFromAPI' })
    }
    throw error
  }
}

/**
 * Відправляє дані курсу на API
 * Демонструє: POST запит, data payload
 */
export async function sendCourseToAPI(courseData) {
  try {
    showNotification('📤 Відправка курсу на сервер...', 'info')

    // POST запит з даними
    const response = await api.post('/posts', {
      title: courseData.title,
      body: courseData.description,
      userId: 1
    })

    console.log('✅ Модуль 6: Курс відправлено на API', response.data)
    showNotification('✅ Курс успішно відправлено на сервер!', 'success')

    return response.data
  } catch (error) {
    // Детальна обробка помилок
    if (error instanceof NetworkError) {
      if (error.statusCode === 401) {
        showNotification('❌ Необхідна авторизація', 'error')
      } else if (error.statusCode === 403) {
        showNotification('❌ Доступ заборонено', 'error')
      } else if (error.statusCode >= 500) {
        showNotification('❌ Помилка сервера при збереженні', 'error')
      } else {
        showNotification('❌ Помилка відправки на сервер', 'error')
      }
    } else if (error instanceof APIError) {
      showNotification('❌ Невірні дані для відправки', 'error')
    } else {
      showNotification('❌ Невідома помилка відправки', 'error')
      errorLogger.log(error, { function: 'sendCourseToAPI', courseData })
    }
    throw error
  }
}

/**
 * Оновлює курс на API
 * Демонструє: PUT запит
 */
export async function updateCourseOnAPI(courseId, updates) {
  try {
    const response = await api.put(`/posts/${courseId}`, updates)
    console.log('✅ Модуль 6: Курс оновлено', response.data)
    return response.data
  } catch (error) {
    if (error instanceof NetworkError) {
      showNotification(`❌ Помилка оновлення: ${error.message}`, 'error')
    } else {
      errorLogger.log(error, { function: 'updateCourseOnAPI', courseId, updates })
    }
    throw error
  }
}

/**
 * Видаляє курс з API
 * Демонструє: DELETE запит
 */
export async function deleteCourseFromAPI(courseId) {
  try {
    const response = await api.delete(`/posts/${courseId}`)
    console.log('✅ Модуль 6: Курс видалено з API', response.status)
    return response.data
  } catch (error) {
    if (error instanceof NetworkError) {
      if (error.statusCode === 404) {
        showNotification('❌ Курс не знайдено для видалення', 'error')
      } else {
        showNotification(`❌ Помилка видалення курсу`, 'error')
      }
    } else {
      errorLogger.log(error, { function: 'deleteCourseFromAPI', courseId })
    }
    throw error
  }
}

/**
 * Демонстрація паралельних запитів
 * Демонструє: Promise.all, axios.all
 */
export async function loadMultipleResources() {
  try {
    showNotification('⏳ Завантаження декількох ресурсів...', 'info')

    // Паралельні запити
    const [users, posts, comments] = await Promise.all([
      api.get('/users?_limit=3'),
      api.get('/posts?_limit=3'),
      api.get('/comments?_limit=5')
    ])

    console.log('📊 Модуль 6: Паралельні запити виконано')
    console.log('👥 Users:', users.data)
    console.log('📝 Posts:', posts.data)
    console.log('💬 Comments:', comments.data)

    showNotification(`✅ Завантажено: ${users.data.length} користувачів, ${posts.data.length} постів, ${comments.data.length} коментарів`, 'success')

    return { users: users.data, posts: posts.data, comments: comments.data }
  } catch (error) {
    if (error instanceof NetworkError) {
      showNotification('❌ Помилка завантаження ресурсів', 'error')
      console.error('Network Error:', error.message, 'Status:', error.statusCode)
    } else {
      showNotification('❌ Невідома помилка паралельних запитів', 'error')
      errorLogger.log(error, { function: 'loadMultipleResources' })
    }
    throw error
  }
}

// =========================================
// Advanced API Interactions (Модуль 7)
// =========================================

// Simple cache для API responses
export const apiCache = new Map()
let abortController = null

/**
 * Завантажує дані з кешуванням
 * Демонструє: Cache strategy, AbortController
 */
export async function loadWithCache(url, cacheTime = 60000) {
  const cached = apiCache.get(url)
  const now = Date.now()

  // Перевіряємо кеш
  if (cached && (now - cached.timestamp) < cacheTime) {
    console.log('📦 Модуль 7: Дані з кешу', url)
    return cached.data
  }

  // Скасовуємо попередній запит, якщо є
  if (abortController) {
    abortController.abort()
  }

  // Створюємо новий AbortController
  abortController = new AbortController()

  try {
    const response = await api.get(url, {
      signal: abortController.signal
    })

    // Зберігаємо в кеш
    apiCache.set(url, {
      data: response.data,
      timestamp: now
    })

    console.log('🌐 Модуль 7: Дані з API (закешовано)', url)
    return response.data
  } catch (error) {
    if (error.name === 'CanceledError') {
      console.log('⏸️ Запит скасовано')
    }
    throw error
  }
}

/**
 * Pagination: Завантажує користувачів зі сторінкою
 * Демонструє: Query parameters, pagination
 */
export async function loadUsersWithPagination(page = 1, limit = 5) {
  try {
    showNotification(`⏳ Завантаження сторінки ${page}...`, 'info')

    const response = await api.get('/users', {
      params: {
        _page: page,
        _limit: limit
      }
    })

    console.log(`📄 Модуль 7: Сторінка ${page}, користувачів: ${response.data.length}`)

    return {
      data: response.data,
      page,
      limit,
      total: parseInt(response.headers['x-total-count'] || '10')
    }
  } catch (error) {
    console.error('❌ Помилка пагінації:', error)
    throw error
  }
}

/**
 * Оптимістичне оновлення: Оновлює UI одразу, потім синхронізує з API
 * Демонструє: Optimistic updates, rollback on error
 */
export async function optimisticUpdate(courseId, updates, coursesData, renderCourses) {
  // Use global functions/objects if not provided as parameters
  const coursesDataRef = coursesData || window.coursesData
  const renderCoursesRef = renderCourses || window.renderCourses

  const course = coursesDataRef.find(c => c.id === courseId)
  if (!course) return

  // Зберігаємо оригінальний стан
  const originalState = { ...course }

  try {
    // Оптимістичне оновлення UI (до запиту до API)
    Object.assign(course, updates)
    renderCoursesRef()

    showNotification('🔄 Синхронізація з сервером...', 'info')

    // Відправляємо на сервер
    await updateCourseOnAPI(courseId, updates)

    showNotification('✅ Оновлено!', 'success')
    console.log('✅ Модуль 7: Оптимістичне оновлення успішне')
  } catch (error) {
    // Rollback при помилці
    Object.assign(course, originalState)
    renderCoursesRef()

    showNotification('❌ Помилка оновлення, відкат змін', 'error')
    console.error('❌ Модуль 7: Rollback оптимістичного оновлення')
  }
}

/**
 * Batch requests: Виконує кілька запитів одночасно з обробкою помилок
 * Демонструє: Promise.allSettled, partial success handling
 */
export async function batchLoadData(endpoints) {
  try {
    showNotification('⏳ Завантаження декількох ресурсів...', 'info')

    // Promise.allSettled - чекає всі проміси, навіть якщо деякі відхиляються
    const results = await Promise.allSettled(
      endpoints.map(endpoint => api.get(endpoint))
    )

    // Аналізуємо результати
    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value.data)
    const failed = results.filter(r => r.status === 'rejected')

    console.log(`✅ Модуль 7: Успішно: ${successful.length}, Помилок: ${failed.length}`)

    if (failed.length > 0) {
      showNotification(`⚠️ ${successful.length} успішно, ${failed.length} помилок`, 'info')
    } else {
      showNotification(`✅ Завантажено всі ${successful.length} ресурсів`, 'success')
    }

    return { successful, failed }
  } catch (error) {
    console.error('❌ Помилка batch запитів:', error)
    throw error
  }
}

/**
 * Retry механізм з exponential backoff
 * Демонструє: Retry logic, exponential backoff
 */
export async function fetchWithRetry(url, maxRetries = 3) {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Модуль 7: Спроба ${attempt}/${maxRetries}`)

      const response = await api.get(url)
      console.log(`✅ Успіх на спробі ${attempt}`)
      return response.data
    } catch (error) {
      lastError = error
      console.log(`❌ Помилка на спробі ${attempt}`)

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000
        console.log(`⏳ Чекаємо ${delay}ms перед наступною спробою...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Показує loading skeleton під час завантаження
 */
export function showLoadingSkeleton(container) {
  container.innerHTML = ''

  for (let i = 0; i < 3; i++) {
    const skeleton = createElement('div', ['card', 'mb-3'])
    skeleton.innerHTML = `
      <div class="card-body">
        <div class="placeholder-glow">
          <span class="placeholder col-6"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-8"></span>
        </div>
      </div>
    `
    container.appendChild(skeleton)
  }
}

/**
 * Очищає кеш
 */
export function clearAPICache() {
  apiCache.clear()
  console.log('🗑️ Модуль 7: Кеш очищено')
  showNotification('Кеш API очищено', 'info')
}
