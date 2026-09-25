# 🎓 E-Learning Platform

Інтерактивна платформа для онлайн-навчання з підтримкою курсів, тестів, валідації та багато іншого.

## 🎨 Кольорова палітра (Пастельна)

- **Primary**: `#a7ffd8` (М'ятний)
- **Secondary**: `#ffaa7f` (Персиковий)
- **Accent**: `#ff9fdc` (Рожевий)
- **Background**: `#ffffef` (Кремовий)

## 📁 Структура проекту

```
e-learning-platform/
├── src/
│   ├── main.js                 # Точка входу додатку
│   ├── style.css               # Глобальні стилі
│   │
│   ├── components/             # UI компоненти
│   │   ├── CourseCard.js       # Картка курсу
│   │   ├── Navigation.js       # Навігація
│   │   ├── SearchAndFilters.js # Пошук та фільтри
│   │   └── Pagination.js       # Компоненти пагінації
│   │
│   ├── modules/                # Програмні модулі
│   │   ├── errorHandling.js    # Обробка помилок (Модуль 8)
│   │   ├── localStorage.js     # LocalStorage (Модуль 10)
│   │   ├── validation.js       # Валідація форм (Модуль 5)
│   │   ├── pagination.js       # Пагінація (Модуль 9)
│   │   └── api.js              # API інтеграція (Модуль 6-7)
│   │
│   ├── utils/                  # Утиліти
│   │   ├── dom.js              # DOM helpers (Модуль 2)
│   │   └── notifications.js    # Toast нотифікації
│   │
│   ├── state/                  # Управління станом
│   │   └── appState.js         # Глобальний стан
│   │
│   └── data/                   # Дані
│       └── courses.js          # Масив курсів
│
├── index.html                  # HTML файл
├── package.json                # Залежності
├── vite.config.js              # Конфігурація Vite
└── README.md                   # Документація

```

## 🚀 Модулі та функціональність

### ✅ Модуль 1: Vite та Git
- Налаштування проекту з Vite
- Git версіонування

### ✅ Модуль 2: Робота з DOM
- Утиліти для створення елементів
- Маніпуляція DOM деревом

### ✅ Модуль 3: Події користувача
- Event listeners
- Клавіатурна навігація
- Custom events

### ✅ Модуль 4: Масиви та об'єкти
- Фільтрація та сортування
- Map, filter, reduce

### ✅ Модуль 5: HTML-форми та валідація
- Constraint Validation API
- Користувацькі правила валідації
- Real-time валідація

### ✅ Модуль 6: Bootstrap та Axios
- Bootstrap 5 компоненти
- Axios HTTP клієнт
- Request/Response interceptors

### ✅ Модуль 7: Взаємодія з API
- Кешування з AbortController
- Пагінація API
- Optimistic updates
- Batch requests
- Retry з exponential backoff

### ✅ Модуль 8: Обробка помилок
- Custom error classes
- ErrorLogger
- Global error handlers
- Axios error handling

### ✅ Модуль 9: Пагінація
- Класична пагінація
- Load More кнопка
- Infinite Scroll з Intersection Observer

### ✅ Модуль 10: LocalStorage
- Збереження стану
- TTL (Time To Live)
- Import/Export даних
- Автозбереження

## 🛠️ Технології

- **Vite** - Build tool
- **Vanilla JavaScript** - ES6+ модулі
- **Bootstrap 5** - UI framework
- **Axios** - HTTP клієнт
- **LocalStorage API** - Кешування
- **Intersection Observer** - Infinite scroll

## 📦 Встановлення

```bash
npm install
npm run dev
```

## 🎯 Особливості

- 🎨 Пастельна кольорова схема
- 📱 Responsive дизайн
- ♿ Accessibility (ARIA)
- 🔄 Автозбереження прогресу
- 🌐 Три режими пагінації
- ⚠️ Комплексна обробка помилок
- 💾 Кешування даних
- 🎨 Bootstrap Toast нотифікації

## 📊 Статистика

- **20 курсів** для тестування
- **10 модулів** реалізовано
- **4300+ рядків** коду
- **Модульна архітектура**

## 🤝 Автор

Створено як навчальний проект для демонстрації всіх модулів JavaScript розробки.
