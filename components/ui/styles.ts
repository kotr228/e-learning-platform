/** Спільні Tailwind-класи для кнопок і полів (одна точка правди для фірмового стилю) */

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:focus-visible:outline-brand-400'

export const buttonBase = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`

export const buttonSize = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
} as const

export const buttonVariant = {
  /** Основна дія — фірмовий зелений */
  success:
    'bg-accent-600 text-white shadow-sm shadow-accent-600/25 hover:bg-accent-700 hover:shadow-md active:scale-[0.98] dark:bg-accent-600 dark:hover:bg-accent-500 dark:hover:text-accent-950',
  /** Другорядна дія — фірмовий синій */
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 hover:shadow-md active:scale-[0.98] dark:bg-brand-500 dark:hover:bg-brand-400',
  /** Нейтральна дія (скидання тощо) */
  neutral:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98] dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300',
  danger:
    'border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10'
} as const

export type ButtonVariant = keyof typeof buttonVariant
export type ButtonSize = keyof typeof buttonSize

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') {
  return `${buttonBase} ${buttonSize[size]} ${buttonVariant[variant]} ${extra}`.trim()
}

/** Поле введення / select */
export const fieldClass = `h-11 w-full rounded-xl border border-slate-300 bg-white text-sm text-slate-800 shadow-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20`

/** Панель-картка */
export const panelClass =
  'rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900'
