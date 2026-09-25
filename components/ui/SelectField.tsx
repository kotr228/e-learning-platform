import { ChevronDown, type LucideIcon } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'
import { fieldClass } from './styles'

interface SelectFieldProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label: string
  icon: LucideIcon
  value: T
  options: ReadonlyArray<{ value: T; label: string }>
  onValueChange: (value: T) => void
  /** Підсвічує поле, коли вибрано не значення за замовчуванням */
  active?: boolean
}

/** Нативний select (доступний з клавіатури та на мобільних) з іконкою та власною стрілкою */
export function SelectField<T extends string>({
  label,
  icon: Icon,
  value,
  options,
  onValueChange,
  active = false,
  className = '',
  ...rest
}: SelectFieldProps<T>) {
  return (
    <label className={`relative block min-w-0 ${className}`}>
      <span className="sr-only">{label}</span>
      <Icon
        className={`pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-300 ${
          active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400'
        }`}
        aria-hidden
      />
      <select
        {...rest}
        value={value}
        onChange={e => onValueChange(e.target.value as T)}
        className={`${fieldClass} cursor-pointer appearance-none pr-10 pl-9 ${
          active ? 'border-brand-400 bg-brand-50/60 dark:border-brand-500/60 dark:bg-brand-500/10' : ''
        }`}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </label>
  )
}
