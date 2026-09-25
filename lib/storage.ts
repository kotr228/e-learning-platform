/**
 * LocalStorage та кешування (Модуль 10)
 */

import { AppError, errorLogger } from './errors'

interface StoredItem<T> {
  data: T
  timestamp: number
  ttl: number | null
}

const PREFIX = 'elearning_'

function logStorageError(message: string, context: Record<string, unknown>) {
  errorLogger.log(new AppError(message, 'STORAGE_ERROR'), context)
}

export const LocalStorageManager = {
  prefix: PREFIX,

  save<T>(key: string, data: T, ttl: number | null = null): boolean {
    try {
      const item: StoredItem<T> = { data, timestamp: Date.now(), ttl }
      localStorage.setItem(PREFIX + key, JSON.stringify(item))
      return true
    } catch (error) {
      logStorageError('Failed to save to LocalStorage', { key, error: (error as Error).message })
      return false
    }
  },

  load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (!raw) return null

      const item = JSON.parse(raw) as StoredItem<T>
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.remove(key)
        return null
      }
      return item.data
    } catch (error) {
      logStorageError('Failed to load from LocalStorage', { key, error: (error as Error).message })
      return null
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(PREFIX + key)
      return true
    } catch (error) {
      logStorageError('Failed to remove from LocalStorage', { key, error: (error as Error).message })
      return false
    }
  },

  clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
      keys.forEach(k => localStorage.removeItem(k))
      return true
    } catch (error) {
      logStorageError('Failed to clear LocalStorage', { error: (error as Error).message })
      return false
    }
  },

  getAllKeys(): string[] {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length))
  },

  getSize(): number {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .reduce((total, k) => total + k.length + (localStorage.getItem(k)?.length ?? 0), 0)
  }
}

const MAX_STORAGE = 5 * 1024 * 1024

export function getStorageStats() {
  const keys = LocalStorageManager.getAllKeys()
  const size = LocalStorageManager.getSize()
  return {
    keys,
    count: keys.length,
    size,
    sizeKB: (size / 1024).toFixed(2),
    maxSize: MAX_STORAGE,
    percentUsed: ((size / MAX_STORAGE) * 100).toFixed(2)
  }
}
