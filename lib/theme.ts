export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

/** Застосовує тему до <html>: клас `.dark` для Tailwind і color-scheme для нативних контролів */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

/**
 * Інлайн-скрипт для <head>: виставляє тему до першого рендеру, щоб не було «спалаху» світлої теми.
 * Без збереженого вибору використовується системна тема.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`
