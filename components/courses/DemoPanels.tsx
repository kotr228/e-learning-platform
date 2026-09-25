'use client'

/**
 * Демонстраційні панелі: API (Модуль 7), обробка помилок (Модуль 8), LocalStorage (Модуль 10)
 */

import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { buttonClass } from '@/components/ui/styles'
import { useAppState, type ExportedData } from '@/context/AppStateContext'
import { useNotify } from '@/context/ToastContext'
import {
  api,
  batchLoadData,
  clearAPICache,
  describeApiError,
  fetchWithRetry,
  loadUsersWithPagination,
  loadWithCache
} from '@/lib/api'
import { downloadJson, readFileAsText } from '@/lib/download'
import { AppError, ValidationError, errorLogger } from '@/lib/errors'
import { LocalStorageManager, getStorageStats } from '@/lib/storage'

const TONE = {
  primary: 'hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300',
  secondary: '',
  info: 'hover:border-sky-400 hover:text-sky-700 dark:hover:text-sky-300',
  warning: 'hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300',
  danger: 'hover:border-red-400 hover:text-red-600 dark:hover:text-red-400',
  success: 'hover:border-accent-500 hover:text-accent-700 dark:hover:text-accent-400',
  dark: 'hover:border-slate-500 hover:text-slate-900 dark:hover:text-white'
} as const

/** Кнопка, що блокується на час виконання асинхронної дії */
function DemoButton({ variant, onClick, children }: { variant: keyof typeof TONE; onClick: () => unknown; children: ReactNode }) {
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    setBusy(true)
    try {
      await onClick()
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" className={buttonClass('outline', 'sm', TONE[variant])} onClick={handleClick} disabled={busy}>
      {children}
    </button>
  )
}

function DemoRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">{title}</h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function ApiDemoPanel() {
  const notify = useNotify()

  return (
    <DemoRow title="API · Модуль 7">
      <DemoButton
        variant="primary"
        onClick={async () => {
          try {
            const result = await loadUsersWithPagination(1, 5)
            console.log('Users page 1:', result)
            notify(`Завантажено ${result.data.length} користувачів (всього ${result.total})`, 'success')
          } catch (error) {
            notify(describeApiError(error), 'error')
          }
        }}
      >
        📄 Pagination
      </DemoButton>
      <DemoButton
        variant="secondary"
        onClick={async () => {
          try {
            await loadWithCache('/posts/1')
            await wait(1000)
            const second = await loadWithCache('/posts/1')
            notify(second.fromCache ? 'Другий запит отримано з кешу! 📦' : 'Дані отримано з API', 'success')
          } catch (error) {
            notify(describeApiError(error), 'error')
          }
        }}
      >
        📦 Cache Demo
      </DemoButton>
      <DemoButton
        variant="info"
        onClick={async () => {
          notify('⏳ Завантаження декількох ресурсів...', 'info')
          const { successful, failed } = await batchLoadData(['/posts/1', '/posts/2', '/users/1'])
          notify(
            failed.length > 0
              ? `⚠️ ${successful.length} успішно, ${failed.length} помилок`
              : `✅ Завантажено всі ${successful.length} ресурсів`,
            failed.length > 0 ? 'info' : 'success'
          )
        }}
      >
        📦 Batch Requests
      </DemoButton>
      <DemoButton
        variant="warning"
        onClick={async () => {
          try {
            await fetchWithRetry('/posts/999')
          } catch {
            notify('Retry вичерпано (перевірте console)', 'error')
          }
        }}
      >
        🔄 Retry Demo
      </DemoButton>
      <DemoButton
        variant="danger"
        onClick={() => {
          clearAPICache()
          notify('Кеш API очищено', 'info')
        }}
      >
        🗑️ Clear Cache
      </DemoButton>
    </DemoRow>
  )
}

export function ErrorDemoPanel() {
  const notify = useNotify()

  return (
    <DemoRow title="Обробка помилок · Модуль 8">
      <DemoButton
        variant="danger"
        onClick={async () => {
          try {
            await api.get('/nonexistent-resource-404')
          } catch (error) {
            console.log('✅ 404 Error caught:', error)
            notify('404 помилка успішно оброблена', 'info')
          }
        }}
      >
        🔍 Test 404
      </DemoButton>
      <DemoButton
        variant="warning"
        onClick={async () => {
          try {
            await api.get('https://invalid-domain-that-does-not-exist-12345.com/api')
          } catch (error) {
            console.log('✅ Network error caught:', error)
            notify('Мережева помилка оброблена', 'info')
          }
        }}
      >
        📡 Test Network
      </DemoButton>
      <DemoButton
        variant="info"
        onClick={() => {
          const errors = errorLogger.getErrors()
          console.group('📋 Error Log')
          errors.forEach((entry, i) => console.log(`${i + 1}.`, entry.error.name, ':', entry.error.message))
          console.groupEnd()
          notify(`Лог містить ${errors.length} помилок`, 'info')
        }}
      >
        📋 View Log
      </DemoButton>
      <DemoButton
        variant="secondary"
        onClick={() => {
          console.table(errorLogger.getErrorStats())
          notify('Статистика виведена в console', 'info')
        }}
      >
        📊 Statistics
      </DemoButton>
      <DemoButton
        variant="dark"
        onClick={() => {
          errorLogger.clearErrors()
          notify('Лог помилок очищено', 'success')
        }}
      >
        🗑️ Clear Log
      </DemoButton>
      <DemoButton
        variant="primary"
        onClick={() => {
          errorLogger.log(new ValidationError('Email має бути у форматі user@example.com', 'email'), {
            trigger: 'manual_test'
          })
          notify('ValidationError створено', 'info')
        }}
      >
        ✍️ Test Validation
      </DemoButton>
    </DemoRow>
  )
}

export function StorageDemoPanel() {
  const notify = useNotify()
  const { saveNow, loadSaved, exportData, importData } = useAppState()
  const fileInput = useRef<HTMLInputElement>(null)

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      importData(JSON.parse(await readFileAsText(file)) as ExportedData)
      notify('Дані імпортовано успішно', 'success')
    } catch (error) {
      errorLogger.log(new AppError('Failed to import data', 'IMPORT_ERROR'), { error: (error as Error).message })
      notify('Помилка імпорту даних', 'error')
    }
  }

  return (
    <DemoRow title="LocalStorage · Модуль 10">
      <DemoButton
        variant="success"
        onClick={() =>
          saveNow() ? notify('Стан збережено в LocalStorage', 'success') : notify('Не вдалося зберегти стан', 'error')
        }
      >
        💾 Save State
      </DemoButton>
      <DemoButton
        variant="primary"
        onClick={() =>
          loadSaved() ? notify('Стан завантажено з LocalStorage', 'success') : notify('Немає збережених даних', 'info')
        }
      >
        📂 Load State
      </DemoButton>
      <DemoButton
        variant="info"
        onClick={() => {
          const stats = getStorageStats()
          console.table(stats)
          notify(`LocalStorage: ${stats.sizeKB} KB (${stats.count} ключів)`, 'info')
        }}
      >
        📊 Stats
      </DemoButton>
      <DemoButton
        variant="danger"
        onClick={() => {
          if (confirm('Очистити всі збережені дані?')) {
            LocalStorageManager.clear()
            notify('LocalStorage очищено', 'success')
          }
        }}
      >
        🗑️ Clear All
      </DemoButton>
      <DemoButton
        variant="secondary"
        onClick={() => {
          downloadJson(exportData(), `elearning-export-${Date.now()}.json`)
          notify('Дані експортовано успішно', 'success')
        }}
      >
        📥 Export
      </DemoButton>
      <DemoButton variant="secondary" onClick={() => fileInput.current?.click()}>
        📤 Import
      </DemoButton>
      <input ref={fileInput} type="file" accept="application/json" hidden onChange={onImportFile} />
    </DemoRow>
  )
}
