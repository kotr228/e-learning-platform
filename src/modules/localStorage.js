/**
 * LocalStorage та кешування (Модуль 10)
 */

import { errorLogger, AppError } from './errorHandling.js'

// =========================================
// LocalStorage Manager
// =========================================

export const LocalStorageManager = {
  prefix: 'elearning_',

  save(key, data, ttl = null) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttl
      }
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
      console.log(`💾 Модуль 10: Збережено "${key}" в LocalStorage`)
      return true
    } catch (error) {
      errorLogger.log(new AppError('Failed to save to LocalStorage', 'STORAGE_ERROR'), {
        key,
        error: error.message
      })
      return false
    }
  },

  load(key) {
    try {
      const itemStr = localStorage.getItem(this.prefix + key)
      if (!itemStr) {
        return null
      }

      const item = JSON.parse(itemStr)

      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        console.log(`⏰ Модуль 10: Дані "${key}" застаріли, видаляємо`)
        this.remove(key)
        return null
      }

      console.log(`📂 Модуль 10: Завантажено "${key}" з LocalStorage`)
      return item.data
    } catch (error) {
      errorLogger.log(new AppError('Failed to load from LocalStorage', 'STORAGE_ERROR'), {
        key,
        error: error.message
      })
      return null
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key)
      console.log(`🗑️ Модуль 10: Видалено "${key}" з LocalStorage`)
      return true
    } catch (error) {
      errorLogger.log(new AppError('Failed to remove from LocalStorage', 'STORAGE_ERROR'), {
        key,
        error: error.message
      })
      return false
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
      console.log(`🧹 Модуль 10: Очищено ${keys.length} записів з LocalStorage`)
      return true
    } catch (error) {
      errorLogger.log(new AppError('Failed to clear LocalStorage', 'STORAGE_ERROR'), {
        error: error.message
      })
      return false
    }
  },

  getSize() {
    let total = 0
    for (let key in localStorage) {
      if (key.startsWith(this.prefix)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  },

  getAllKeys() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''))
  }
}

// =========================================
// Storage Statistics
// =========================================

export function getStorageStats() {
  const keys = LocalStorageManager.getAllKeys()
  const size = LocalStorageManager.getSize()
  const sizeKB = (size / 1024).toFixed(2)

  return {
    keys,
    count: keys.length,
    size,
    sizeKB,
    maxSize: 5 * 1024 * 1024,
    percentUsed: ((size / (5 * 1024 * 1024)) * 100).toFixed(2)
  }
}
