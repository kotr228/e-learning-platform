<p align="center"><img src="sourse/img/Logo.jpg" alt="e-learning-platform — Your Gateway to Knowledge" width="480"></p>

Інтерактивна платформа для онлайн-навчання: каталог курсів, уроки з відео, тести, статистика прогресу та профіль користувача.

Побудовано на **Next.js 16 (App Router) + TypeScript + React 19 + Tailwind CSS 4**, іконки — `lucide-react`.
Підтримується світла й темна тема (перемикач у шапці; за замовчуванням — системна).

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
| `/` | Каталог курсів: пошук, фільтри за статусом і складністю, сортування, створення курсу, 3 режими відображення |
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
│   └── globals.css            # Tailwind, фірмова тема (@theme), legacy-стилі
├── components/                # React-компоненти
│   ├── courses/               # Каталог: CourseControls, CourseCard, CoursesCatalog, пагінація, форма
│   ├── course/                # Деталі курсу, урок, тест
│   ├── ui/                    # Спільні стилі кнопок/полів, SelectField
│   └── …                      # Header, ThemeToggle, ProgressDashboard, ProfileForm
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
    ├── theme.ts               # Світла/темна тема
    └── validation.ts          # Правила валідації
```

## ✅ Модулі та функціональність

1. **Next.js та Git** — App Router, файлова маршрутизація, TypeScript (strict).
2. **Компоненти** — декларативний рендеринг через React замість ручної роботи з DOM.
3. **Події користувача** — пошук з debounce, фільтри (статус, складність), сортування (нові, рейтинг), `CustomEvent`, клавіатурні скорочення:
   `Ctrl/Cmd + K` — пошук, `Esc` — скинути пошук / закрити форму, `1–4` — перехід між сторінками.
4. **Масиви та об'єкти** — `reduce`, `map`, `filter`, `sort`, `Set` для статистики.
5. **Форми та валідація** — Constraint Validation API + власні правила, real-time валідація.
6. **Tailwind CSS та Axios** — утилітарні стилі з фірмовою темою й темним режимом, Axios з request/response інтерсепторами.
7. **Взаємодія з API** — кеш з `AbortController`, пагінація API, batch (`Promise.allSettled`), retry з exponential backoff.
8. **Обробка помилок** — власні класи помилок, `ErrorLogger`, глобальні обробники.
9. **Пагінація** — класична, «Load More» та нескінченний скрол (`IntersectionObserver`).
10. **LocalStorage** — автозбереження стану та прогресу, TTL, імпорт/експорт JSON.

## 🎨 Фірмові кольори

Взяті з логотипу й задані в `app/globals.css` через `@theme`:

- **brand** — глибокий синій (`brand-600` `#1d67a8`): другорядні дії, посилання, активна навігація
- **accent** — яскравий зелений (`accent-500` `#6bb52e`, для кнопок `accent-600` `#3a7f18` — контраст ≥ 4.5:1 з білим текстом): основні дії, активний режим відображення
