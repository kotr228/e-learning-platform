/**
 * Пагінація та нескінченний скрол (Модуль 9)
 */

import { createElement, setText, appendChildren } from '../utils/dom.js'
import { showNotification } from '../utils/notifications.js'
import { paginationState } from '../state/appState.js'

// =========================================
// Pagination Helper Functions
// =========================================

/**
 * Обчислює загальну кількість сторінок
 */
export function calculateTotalPages(filteredCourses) {
  return Math.ceil(filteredCourses.length / paginationState.itemsPerPage) || 1
}

/**
 * Отримує курси для поточної сторінки
 */
export function getCoursesForPage(filteredCourses, page) {
  const startIndex = (page - 1) * paginationState.itemsPerPage
  const endIndex = startIndex + paginationState.itemsPerPage
  return filteredCourses.slice(startIndex, endIndex)
}

// =========================================
// Classic Pagination
// =========================================

/**
 * Створює пагінацію (класична з номерами сторінок)
 */
export function createPagination(filteredCourses, renderCourses) {
  // Use global renderCourses if not provided as parameter
  const renderFn = renderCourses || window.renderCourses

  const totalPages = calculateTotalPages(filteredCourses)
  paginationState.totalPages = totalPages

  const paginationContainer = createElement('div', ['pagination-container'])
  paginationContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;'

  // Previous button
  const prevBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-primary'])
  setText(prevBtn, '« Попередня')
  prevBtn.disabled = paginationState.currentPage === 1
  prevBtn.addEventListener('click', () => {
    if (paginationState.currentPage > 1) {
      paginationState.currentPage--
      renderFn()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  // Page numbers
  const pageNumbers = createElement('div', [])
  pageNumbers.style.cssText = 'display: flex; gap: 0.25rem;'

  // Логіка показу номерів сторінок (max 7 кнопок)
  let pagesToShow = []

  if (totalPages <= 7) {
    // Показуємо всі сторінки
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else {
    // Показуємо з елліпсисом
    if (paginationState.currentPage <= 3) {
      pagesToShow = [1, 2, 3, 4, 5, '...', totalPages]
    } else if (paginationState.currentPage >= totalPages - 2) {
      pagesToShow = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    } else {
      pagesToShow = [1, '...', paginationState.currentPage - 1, paginationState.currentPage, paginationState.currentPage + 1, '...', totalPages]
    }
  }

  pagesToShow.forEach(page => {
    if (page === '...') {
      const ellipsis = createElement('span', ['px-2'])
      setText(ellipsis, '...')
      ellipsis.style.cssText = 'display: flex; align-items: center; color: #6c757d;'
      pageNumbers.appendChild(ellipsis)
    } else {
      const pageBtn = createElement('button', ['btn', 'btn-sm'])
      if (page === paginationState.currentPage) {
        pageBtn.classList.add('btn-primary')
      } else {
        pageBtn.classList.add('btn-outline-primary')
      }
      setText(pageBtn, String(page))
      pageBtn.style.minWidth = '2.5rem'

      pageBtn.addEventListener('click', () => {
        paginationState.currentPage = page
        renderFn()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })

      pageNumbers.appendChild(pageBtn)
    }
  })

  // Next button
  const nextBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-primary'])
  setText(nextBtn, 'Наступна »')
  nextBtn.disabled = paginationState.currentPage === totalPages
  nextBtn.addEventListener('click', () => {
    if (paginationState.currentPage < totalPages) {
      paginationState.currentPage++
      renderFn()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  // Page info
  const pageInfo = createElement('div', ['text-muted', 'small', 'w-100', 'text-center'])
  pageInfo.style.marginTop = '0.5rem'
  setText(pageInfo, `Сторінка ${paginationState.currentPage} з ${totalPages} (всього курсів: ${filteredCourses.length})`)

  appendChildren(paginationContainer, prevBtn, pageNumbers, nextBtn)
  paginationContainer.appendChild(pageInfo)

  return paginationContainer
}

// =========================================
// Load More Pagination
// =========================================

/**
 * Створює кнопку "Load More"
 */
export function createLoadMoreButton(filteredCourses, createCourseCard) {
  // Use global createCourseCard if not provided as parameter
  const createCardFn = createCourseCard || window.createCourseCard

  const loadedCount = paginationState.currentPage * paginationState.itemsPerPage
  const hasMore = loadedCount < filteredCourses.length

  if (!hasMore) {
    const endMessage = createElement('div', ['text-center', 'text-muted', 'my-4'])
    setText(endMessage, '✓ Всі курси завантажено')
    return endMessage
  }

  const container = createElement('div', ['text-center', 'my-4'])

  const loadMoreBtn = createElement('button', ['btn', 'btn-primary', 'btn-lg'])
  setText(loadMoreBtn, `Завантажити ще (${Math.min(paginationState.itemsPerPage, filteredCourses.length - loadedCount)} курсів)`)

  loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.disabled = true
    setText(loadMoreBtn, 'Завантаження...')

    // Симулюємо затримку завантаження
    await new Promise(resolve => setTimeout(resolve, 500))

    paginationState.currentPage++

    // Рендеримо додаткові курси без очищення попередніх
    const coursesList = document.getElementById('courses-list')
    const coursesToAdd = getCoursesForPage(filteredCourses, paginationState.currentPage)

    coursesToAdd.forEach(course => {
      const card = createCardFn(course)
      coursesList.appendChild(card)
    })

    // Видаляємо стару кнопку і додаємо нову
    const oldLoadMore = document.getElementById('load-more-container')
    if (oldLoadMore) {
      oldLoadMore.remove()
    }

    const newLoadMore = createLoadMoreButton(filteredCourses, createCardFn)
    newLoadMore.id = 'load-more-container'
    coursesList.parentElement.appendChild(newLoadMore)
  })

  container.appendChild(loadMoreBtn)
  return container
}

// =========================================
// Infinite Scroll
// =========================================

/**
 * Створює infinite scroll observer
 */
export function setupInfiniteScroll(filteredCourses, createCourseCard) {
  // Use global createCourseCard if not provided as parameter
  const createCardFn = createCourseCard || window.createCourseCard

  // Видаляємо попередній observer
  if (paginationState.observer) {
    paginationState.observer.disconnect()
  }

  // Створюємо sentinel елемент
  const sentinel = createElement('div', ['infinite-scroll-sentinel'])
  sentinel.id = 'scroll-sentinel'
  sentinel.style.cssText = 'height: 20px; margin: 2rem 0;'

  const loadedCount = paginationState.currentPage * paginationState.itemsPerPage
  const hasMore = loadedCount < filteredCourses.length

  if (!hasMore) {
    const endMessage = createElement('div', ['text-center', 'text-muted', 'my-4'])
    setText(endMessage, '✓ Всі курси завантажено')
    return endMessage
  }

  // Створюємо Intersection Observer
  paginationState.observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries

      if (entry.isIntersecting && !paginationState.isLoading) {
        paginationState.isLoading = true

        // Показуємо loading skeleton
        const coursesList = document.getElementById('courses-list')
        const loadingIndicator = createElement('div', ['text-center', 'my-4'])
        loadingIndicator.id = 'infinite-loading'

        const spinner = createElement('div', ['spinner-border', 'text-primary'])
        spinner.setAttribute('role', 'status')
        const spinnerText = createElement('span', ['visually-hidden'])
        setText(spinnerText, 'Завантаження...')
        spinner.appendChild(spinnerText)

        const loadingText = createElement('div', ['mt-2', 'text-muted'])
        setText(loadingText, 'Завантаження курсів...')

        appendChildren(loadingIndicator, spinner, loadingText)

        // Додаємо індикатор перед sentinel
        sentinel.parentElement?.insertBefore(loadingIndicator, sentinel)

        // Симулюємо затримку завантаження
        await new Promise(resolve => setTimeout(resolve, 800))

        paginationState.currentPage++

        // Додаємо нові курси
        const coursesToAdd = getCoursesForPage(filteredCourses, paginationState.currentPage)

        coursesToAdd.forEach(course => {
          const card = createCardFn(course)
          coursesList.appendChild(card)
        })

        // Видаляємо loading індикатор
        const loader = document.getElementById('infinite-loading')
        if (loader) {
          loader.remove()
        }

        paginationState.isLoading = false

        // Перевіряємо чи є ще курси
        const newLoadedCount = paginationState.currentPage * paginationState.itemsPerPage
        if (newLoadedCount >= filteredCourses.length) {
          paginationState.observer.disconnect()
          const endMessage = createElement('div', ['text-center', 'text-muted', 'my-4'])
          setText(endMessage, '✓ Всі курси завантажено')
          sentinel.replaceWith(endMessage)
        }
      }
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
  )

  paginationState.observer.observe(sentinel)

  return sentinel
}

// =========================================
// Pagination Mode Selector
// =========================================

/**
 * Перемикач режиму пагінації
 */
export function createPaginationModeSelector(renderCourses) {
  // Use global renderCourses if not provided as parameter
  const renderFn = renderCourses || window.renderCourses

  const container = createElement('div', ['pagination-mode-selector', 'mb-3'])
  container.style.cssText = 'display: flex; gap: 0.5rem; align-items: center; padding: 1rem; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;'

  const label = createElement('span', ['fw-bold'])
  setText(label, '📄 Режим відображення:')

  const btnGroup = createElement('div', ['btn-group', 'btn-group-sm'])
  btnGroup.setAttribute('role', 'group')

  const modes = [
    { value: 'pagination', label: 'Пагінація', icon: '📃' },
    { value: 'loadmore', label: 'Load More', icon: '⬇️' },
    { value: 'infinite', label: 'Infinite Scroll', icon: '∞' }
  ]

  modes.forEach(mode => {
    const btn = createElement('button', ['btn'])
    if (paginationState.mode === mode.value) {
      btn.classList.add('btn-primary')
    } else {
      btn.classList.add('btn-outline-primary')
    }
    setText(btn, `${mode.icon} ${mode.label}`)

    btn.addEventListener('click', () => {
      paginationState.mode = mode.value
      paginationState.currentPage = 1
      renderFn()
      showNotification(`Режим змінено на: ${mode.label}`, 'info')

      console.log(`📄 Модуль 9: Режим пагінації змінено на "${mode.label}"`)
    })

    btnGroup.appendChild(btn)
  })

  appendChildren(container, label, btnGroup)
  return container
}

// =========================================
// Main Pagination UI Creator
// =========================================

/**
 * Створює UI пагінації залежно від режиму
 */
export function createPaginationUI(filteredCourses, createCourseCard, renderCourses) {
  // Use global functions if not provided as parameters
  const renderFn = renderCourses || window.renderCourses
  const createCardFn = createCourseCard || window.createCourseCard

  // Відключаємо Intersection Observer якщо він активний
  if (paginationState.observer) {
    paginationState.observer.disconnect()
    paginationState.observer = null
  }

  // Видаляємо ВСІ можливі елементи пагінації
  const elementsToRemove = [
    '.pagination-container',
    '#load-more-container',
    '#scroll-sentinel',
    '#infinite-loading',
    '.infinite-scroll-sentinel'
  ]

  elementsToRemove.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => el.remove())
  })

  // Створюємо відповідний UI залежно від режиму
  if (paginationState.mode === 'pagination') {
    return createPagination(filteredCourses, renderFn)
  } else if (paginationState.mode === 'loadmore') {
    const loadMoreContainer = createLoadMoreButton(filteredCourses, createCardFn)
    loadMoreContainer.id = 'load-more-container'
    return loadMoreContainer
  } else if (paginationState.mode === 'infinite') {
    return setupInfiniteScroll(filteredCourses, createCardFn)
  }

  return null
}
