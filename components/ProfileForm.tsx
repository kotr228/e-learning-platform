'use client'

/**
 * Форма профілю (Модуль 5): HTML5-атрибути валідації + користувацькі правила.
 * Рендериться лише на клієнті, тому може одразу читати збережений профіль з LocalStorage.
 */

import { useState, type FormEvent } from 'react'
import { FieldError } from '@/components/FieldError'
import { useNotify } from '@/context/ToastContext'
import { useFormValidation } from '@/hooks/useFormValidation'
import { LocalStorageManager } from '@/lib/storage'
import type { FieldRules } from '@/lib/validation'

interface Profile {
  name: string
  email: string
  phone: string
  birthdate: string
  level: string
  hours: string
  motivation: string
  website: string
  notifications: boolean
}

const EMPTY_PROFILE: Profile = {
  name: '',
  email: '',
  phone: '',
  birthdate: '',
  level: '',
  hours: '',
  motivation: '50',
  website: '',
  notifications: true
}

const PROFILE_KEY = 'profile'

const LEVELS = [
  { value: 'початківець', label: 'Початківець' },
  { value: 'середній', label: 'Середній' },
  { value: 'досвідчений', label: 'Досвідчений' },
  { value: 'експерт', label: 'Експерт' }
]

const RULES: Record<string, FieldRules> = {
  'profile-name': { minLength: 3, minLengthMessage: "Ім'я має містити мінімум 3 символи" },
  'profile-hours': {
    min: 1,
    max: 168,
    minMessage: 'Мінімум 1 година на тиждень',
    maxMessage: 'Максимум 168 годин на тиждень'
  }
}

export default function ProfileForm() {
  const notify = useNotify()
  const { errors, fieldProps, validateForm, reset } = useFormValidation(RULES)
  const [initial] = useState<Profile>(() => ({ ...EMPTY_PROFILE, ...LocalStorageManager.load<Profile>(PROFILE_KEY) }))
  const [motivation, setMotivation] = useState(initial.motivation)
  const today = new Date().toISOString().split('T')[0]

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!validateForm(form)) {
      notify('Будь ласка, виправте помилки у формі', 'error')
      return
    }

    const data = new FormData(form)
    const field = (name: string) => String(data.get(`profile-${name}`) ?? '')
    const profile: Profile = {
      name: field('name'),
      email: field('email'),
      phone: field('phone'),
      birthdate: field('birthdate'),
      level: field('level'),
      hours: field('hours'),
      motivation: field('motivation'),
      website: field('website'),
      notifications: data.has('profile-notifications')
    }

    LocalStorageManager.save(PROFILE_KEY, profile)
    console.log('📝 Модуль 5: Дані профілю', profile)
    notify('Профіль успішно збережено! 🎉', 'success')
  }

  const onReset = () => {
    reset()
    setMotivation(initial.motivation)
  }

  return (
    <div className="panel profile-panel">
      <h3 className="panel-title">✏️ Редагувати профіль</h3>
      <form noValidate onSubmit={onSubmit} onReset={onReset}>
        <fieldset className="form-section">
          <legend>👤 Особиста інформація</legend>

          <div className="form-group">
            <label htmlFor="profile-name">Повне ім&apos;я *</label>
            <input
              {...fieldProps('profile-name')}
              type="text"
              placeholder="Іван Петренко"
              required
              minLength={3}
              defaultValue={initial.name}
              data-label="Ім'я"
              autoComplete="name"
            />
            <FieldError id="profile-name" message={errors['profile-name']} />
          </div>

          <div className="form-group">
            <label htmlFor="profile-email">Email *</label>
            <input
              {...fieldProps('profile-email')}
              type="email"
              placeholder="ivan@example.com"
              required
              defaultValue={initial.email}
              data-label="Email"
              autoComplete="email"
            />
            <FieldError id="profile-email" message={errors['profile-email']} />
          </div>

          <div className="form-group">
            <label htmlFor="profile-phone">Телефон</label>
            <input
              {...fieldProps('profile-phone')}
              type="tel"
              placeholder="+380 (XX) XXX-XX-XX"
              pattern="\+?[0-9\s\(\)\-]{10,}"
              defaultValue={initial.phone}
              data-label="Телефон"
              data-pattern-message="Введіть коректний номер телефону"
              autoComplete="tel"
            />
            <FieldError id="profile-phone" message={errors['profile-phone']} />
          </div>

          <div className="form-group">
            <label htmlFor="profile-birthdate">Дата народження</label>
            <input
              {...fieldProps('profile-birthdate')}
              type="date"
              max={today}
              defaultValue={initial.birthdate}
              data-label="Дата народження"
            />
            <FieldError id="profile-birthdate" message={errors['profile-birthdate']} />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>🎓 Навчальні налаштування</legend>

          <div className="form-group">
            <label htmlFor="profile-level">Рівень підготовки *</label>
            <select {...fieldProps('profile-level')} required defaultValue={initial.level} data-label="Рівень підготовки">
              <option value="" disabled>
                -- Оберіть рівень --
              </option>
              {LEVELS.map(l => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <FieldError id="profile-level" message={errors['profile-level']} />
          </div>

          <div className="form-group">
            <label htmlFor="profile-hours">Годин навчання на тиждень</label>
            <input
              {...fieldProps('profile-hours')}
              type="number"
              min={1}
              max={168}
              step={1}
              placeholder="10"
              defaultValue={initial.hours}
              data-label="Годин на тиждень"
            />
            <FieldError id="profile-hours" message={errors['profile-hours']} />
          </div>

          <div className="form-group">
            <div className="d-flex justify-content-between">
              <label htmlFor="profile-motivation">Рівень мотивації</label>
              <output htmlFor="profile-motivation" className="motivation-value">
                {motivation}%
              </output>
            </div>
            <input
              id="profile-motivation"
              name="profile-motivation"
              type="range"
              min={0}
              max={100}
              step={10}
              value={motivation}
              onChange={e => setMotivation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-website">Особистий сайт/портфоліо</label>
            <input
              {...fieldProps('profile-website')}
              type="url"
              placeholder="https://myportfolio.com"
              defaultValue={initial.website}
              data-label="Веб-сайт"
              autoComplete="url"
            />
            <FieldError id="profile-website" message={errors['profile-website']} />
          </div>

          <label className="checkbox-label">
            <input
              id="profile-notifications"
              name="profile-notifications"
              type="checkbox"
              defaultChecked={initial.notifications}
            />
            <span>Отримувати email сповіщення про нові курси</span>
          </label>
        </fieldset>

        <div className="form-actions">
          <button type="reset" className="btn btn-secondary">
            Скинути
          </button>
          <button type="submit" className="btn btn-primary">
            💾 Зберегти профіль
          </button>
        </div>
      </form>
    </div>
  )
}
