/**
 * Глобальний стан додатку
 */

export const appState = {
  currentPage: 'courses',
  selectedCourseId: null,
  currentTestId: null,
  userAnswers: [],
  nextCourseId: 21,
  // Модуль 3: Стан фільтрів та сортування
  searchQuery: '',
  filterEnrolled: 'all', // 'all', 'enrolled', 'available'
  sortBy: 'default' // 'default', 'title', 'duration'
}

export const paginationState = {
  mode: 'pagination', // 'pagination' | 'infinite' | 'loadmore'
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 1,
  isLoading: false,
  hasMore: true,
  observer: null
}
