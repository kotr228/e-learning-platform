/**
 * Дані курсів (Модуль 4)
 */

export const coursesData = [
  {
    id: 1,
    title: 'JavaScript для початківців',
    instructor: 'Олександр Петренко',
    duration: '8 годин',
    description: 'Вивчіть основи JavaScript від змінних до функцій та об\'єктів.',
    icon: '💻',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Змінні та типи даних', duration: '45 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Умовні конструкції', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Цикли та масиви', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 4, title: 'Функції', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 1,
      questions: [
        {
          question: 'Що таке змінна в JavaScript?',
          options: ['Контейнер для зберігання даних', 'Тип даних', 'Функція', 'Оператор'],
          correct: 0
        },
        {
          question: 'Який оператор використовується для порівняння?',
          options: ['=', '==', '===', 'Всі вище'],
          correct: 2
        }
      ]
    }
  },
  {
    id: 2,
    title: 'HTML & CSS Основи',
    instructor: 'Марія Іваненко',
    duration: '6 годин',
    description: 'Створюйте красиві та адаптивні веб-сторінки з HTML та CSS.',
    icon: '🎨',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Структура HTML документа', duration: '40 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'CSS селектори', duration: '45 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Flexbox та Grid', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 2,
      questions: [
        {
          question: 'Що означає CSS?',
          options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
          correct: 1
        }
      ]
    }
  },
  {
    id: 3,
    title: 'React для розробників',
    instructor: 'Дмитро Коваленко',
    duration: '12 годин',
    description: 'Опануйте сучасну бібліотеку для створення інтерактивних інтерфейсів.',
    icon: '⚛️',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Компоненти та Props', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'State та життєвий цикл', duration: '75 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Hooks', duration: '80 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 3,
      questions: [
        {
          question: 'Що таке компонент в React?',
          options: ['Функція або клас', 'HTML тег', 'CSS клас', 'JavaScript змінна'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Node.js Backend',
    instructor: 'Ігор Сидоренко',
    duration: '10 годин',
    description: 'Створюйте серверні застосунки з Node.js та Express.',
    icon: '🚀',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Вступ до Node.js', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Express фреймворк', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'REST API', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 4,
      questions: [
        {
          question: 'Що таке Node.js?',
          options: ['JavaScript runtime', 'Фреймворк', 'Бібліотека', 'База даних'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Git та GitHub',
    instructor: 'Анна Мельник',
    duration: '4 години',
    description: 'Освойте систему контролю версій та співпрацю в команді.',
    icon: '📦',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Основи Git', duration: '45 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Робота з GitHub', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 5,
      questions: [
        {
          question: 'Що таке commit в Git?',
          options: ['Збереження змін', 'Видалення файлу', 'Створення гілки', 'Об\'єднання гілок'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 6,
    title: 'TypeScript Основи',
    instructor: 'Сергій Ткаченко',
    duration: '7 годин',
    description: 'Додайте типізацію до JavaScript та пишіть більш надійний код.',
    icon: '📘',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Типи даних', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Інтерфейси', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 6,
      questions: [
        {
          question: 'Чим відрізняється TypeScript від JavaScript?',
          options: ['Статичною типізацією', 'Швидкістю', 'Синтаксисом', 'Нічим'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 7,
    title: 'Python для Data Science',
    instructor: 'Олена Шевченко',
    duration: '15 годин',
    description: 'Аналіз даних, машинне навчання та візуалізація з Python.',
    icon: '🐍',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'NumPy та Pandas', duration: '90 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Matplotlib', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 7,
      questions: [
        { question: 'Що таке Pandas?', options: ['Бібліотека для аналізу даних', 'Тварина', 'База даних', 'Фреймворк'], correct: 0 }
      ]
    }
  },
  {
    id: 8,
    title: 'Vue.js Фреймворк',
    instructor: 'Віктор Бойко',
    duration: '11 годин',
    description: 'Прогресивний JavaScript фреймворк для створення UI.',
    icon: '💚',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Vue Instance', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Vuex State Management', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 8,
      questions: [
        { question: 'Що таке Vuex?', options: ['State management', 'Роутер', 'HTTP клієнт', 'UI бібліотека'], correct: 0 }
      ]
    }
  },
  {
    id: 9,
    title: 'MongoDB Основи',
    instructor: 'Тарас Лисенко',
    duration: '8 годин',
    description: 'NoSQL база даних для сучасних застосунків.',
    icon: '🍃',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Колекції та документи', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Aggregation Pipeline', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 9,
      questions: [
        { question: 'MongoDB це...', options: ['NoSQL база даних', 'SQL база даних', 'ORM', 'Фреймворк'], correct: 0 }
      ]
    }
  },
  {
    id: 10,
    title: 'Docker для розробників',
    instructor: 'Максим Павленко',
    duration: '9 годин',
    description: 'Контейнеризація застосунків з Docker.',
    icon: '🐳',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Docker Images', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Docker Compose', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 10,
      questions: [
        { question: 'Що таке Docker?', options: ['Платформа контейнеризації', 'Мова програмування', 'База даних', 'IDE'], correct: 0 }
      ]
    }
  },
  {
    id: 11,
    title: 'GraphQL API',
    instructor: 'Юлія Романенко',
    duration: '7 годин',
    description: 'Сучасний підхід до створення API.',
    icon: '🔷',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Схеми та типи', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Resolvers', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 11,
      questions: [
        { question: 'GraphQL це...', options: ['Query мова для API', 'База даних', 'Фреймворк', 'Бібліотека'], correct: 0 }
      ]
    }
  },
  {
    id: 12,
    title: 'AWS Cloud Computing',
    instructor: 'Андрій Кравченко',
    duration: '13 годин',
    description: 'Хмарні технології Amazon Web Services.',
    icon: '☁️',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'EC2 та S3', duration: '75 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Lambda Functions', duration: '80 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 12,
      questions: [
        { question: 'AWS це...', options: ['Хмарна платформа', 'Мова програмування', 'База даних', 'IDE'], correct: 0 }
      ]
    }
  },
  {
    id: 13,
    title: 'Angular Framework',
    instructor: 'Катерина Білоус',
    duration: '14 годин',
    description: 'Повнофункціональний фреймворк від Google.',
    icon: '🅰️',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Модулі та компоненти', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'RxJS та Observables', duration: '85 хv', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 13,
      questions: [
        { question: 'Angular використовує...', options: ['TypeScript', 'Python', 'Java', 'C++'], correct: 0 }
      ]
    }
  },
  {
    id: 14,
    title: 'Redux State Management',
    instructor: 'Роман Гончар',
    duration: '6 годин',
    description: 'Керування станом у JavaScript застосунках.',
    icon: '🔄',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Store та Actions', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Reducers', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 14,
      questions: [
        { question: 'Redux це...', options: ['State container', 'База даних', 'Фреймворк', 'Сервер'], correct: 0 }
      ]
    }
  },
  {
    id: 15,
    title: 'Next.js Full-Stack',
    instructor: 'Валентина Кузьменко',
    duration: '16 годин',
    description: 'React фреймворк для production застосунків.',
    icon: '▲',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'SSR та SSG', duration: '90 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'API Routes', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 15,
      questions: [
        { question: 'Next.js підтримує...', options: ['SSR та SSG', 'Лише SSR', 'Лише SSG', 'Жодне'], correct: 0 }
      ]
    }
  },
  {
    id: 16,
    title: 'Tailwind CSS',
    instructor: 'Дмитро Савченко',
    duration: '5 годин',
    description: 'Utility-first CSS фреймворк.',
    icon: '🎨',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Utility Classes', duration: '40 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Customization', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 16,
      questions: [
        { question: 'Tailwind це...', options: ['CSS фреймворк', 'JS бібліотека', 'База даних', 'Сервер'], correct: 0 }
      ]
    }
  },
  {
    id: 17,
    title: 'PostgreSQL Database',
    instructor: 'Ігор Мороз',
    duration: '10 годин',
    description: 'Потужна реляційна база даних.',
    icon: '🐘',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'SQL Queries', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Indexing', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 17,
      questions: [
        { question: 'PostgreSQL це...', options: ['SQL база даних', 'NoSQL база даних', 'Фреймворк', 'Мова'], correct: 0 }
      ]
    }
  },
  {
    id: 18,
    title: 'Jest Testing',
    instructor: 'Оксана Ткач',
    duration: '7 годин',
    description: 'Тестування JavaScript застосунків.',
    icon: '🃏',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Unit Tests', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Mocking', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 18,
      questions: [
        { question: 'Jest це...', options: ['Testing framework', 'База даних', 'Сервер', 'Бібліотека UI'], correct: 0 }
      ]
    }
  },
  {
    id: 19,
    title: 'WebSocket Real-time',
    instructor: 'Василь Петров',
    duration: '8 годин',
    description: 'Real-time комунікація в веб-застосунках.',
    icon: '🔌',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'WebSocket API', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Socket.io', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 19,
      questions: [
        { question: 'WebSocket дозволяє...', options: ['Двосторонню комунікацію', 'Лише запити', 'Лише відповіді', 'Жодне'], correct: 0 }
      ]
    }
  },
  {
    id: 20,
    title: 'Svelte Framework',
    instructor: 'Наталія Коваль',
    duration: '9 годин',
    description: 'Компілятор для створення швидких веб-застосунків.',
    icon: '🔥',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Reactive Statements', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Stores', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 20,
      questions: [
        { question: 'Svelte це...', options: ['Компілятор', 'Інтерпретатор', 'База даних', 'Сервер'], correct: 0 }
      ]
    }
  }
]
