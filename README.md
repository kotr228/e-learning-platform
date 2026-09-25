# 🎓 E-Learning Platform

Інтерактивна платформа для онлайн-навчання: каталог курсів, уроки з відео, тести, статистика прогресу та профіль користувача.

Побудовано на **Next.js 16 (App Router) + TypeScript + React 19**.

## 🚀 Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # запуск production build
npm run lint       # ESLint
npm run typecheck  # перевірка типів TypeScript
```

## 🗺️ Маршрути

| URL | Сторінка |
| --- | --- |
| `/` | Каталог курсів: пошук, фільтри, сортування, створення курсу, пагінація |
| `/courses/[id]` | Деталі курсу та список уроків |
| `/courses/[id]/lessons/[lessonId]` | Перегляд уроку |
| `/courses/[id]/test` | Тест по курсу |
| `/my-courses` | Курси, на які записаний користувач |
| `/progress` | Статистика та прогрес |
| `/profile` | Форма профілю з валідацією |

## 📁 Структура проекту

```
e-learning-platform/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Кореневий layout: header, footer, провайдери
│   ├── page.tsx               # Каталог курсів
│   ├── courses/[id]/…         # Деталі курсу, урок, тест
│   ├── my-courses/ progress/ profile/
│   └── globals.css            # Глобальні стилі (пастельна палітра)
├── components/                # React-компоненти
│   ├── courses/               # Каталог: фільтри, форма, пагінація, демо-панелі
│   ├── course/                # Деталі курсу, урок, тест
│   └── …                      # Header, CourseCard, ProgressDashboard, ProfileForm
├── context/
│   ├── AppStateContext.tsx    # Глобальний стан (useReducer) + автозбереження
│   └── ToastContext.tsx       # Bootstrap Toast нотифікації
├── hooks/
│   └── useFormValidation.ts   # Валідація форм (Constraint Validation API)
└── lib/                       # Логіка без UI
    ├── types.ts               # Доменні типи
    ├── data/courses.ts        # Початкові курси
    ├── courses.ts             # Фільтрація, сортування, пагінація, аналітика
    ├── api.ts                 # Axios: інтерсептори, CRUD, кеш, retry, batch
    ├── errors.ts              # Класи помилок, ErrorLogger, глобальні обробники
    ├── storage.ts             # LocalStorage з TTL
    └── validation.ts          # Правила валідації
```

## ✅ Модулі та функціональність

1. **Next.js та Git** — App Router, файлова маршрутизація, TypeScript (strict).
2. **Компоненти** — декларативний рендеринг через React замість ручної роботи з DOM.
3. **Події користувача** — пошук з debounce, фільтри, `CustomEvent`, клавіатурні скорочення:
   `Ctrl/Cmd + K` — пошук, `Esc` — скинути пошук / закрити форму, `1–4` — перехід між сторінками.
4. **Масиви та об'єкти** — `reduce`, `map`, `filter`, `sort`, `Set` для статистики.
5. **Форми та валідація** — Constraint Validation API + власні правила, real-time валідація.
6. **Bootstrap та Axios** — Bootstrap 5, Axios з request/response інтерсепторами.
7. **Взаємодія з API** — кеш з `AbortController`, пагінація API, batch (`Promise.allSettled`), retry з exponential backoff.
8. **Обробка помилок** — власні класи помилок, `ErrorLogger`, глобальні обробники.
9. **Пагінація** — класична, «Load More» та нескінченний скрол (`IntersectionObserver`).
10. **LocalStorage** — автозбереження стану та прогресу, TTL, імпорт/експорт JSON.

## 🎨 Кольорова палітра

- **Primary**: `#a7ffd8` (М'ятний)
- **Secondary**: `#ffaa7f` (Персиковий)
- **Accent**: `#ff9fdc` (Рожевий)
- **Background**: `#ffffef` (Кремовий)
