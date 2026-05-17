/**
 * Module: Global Error Handler
 * 全局错误处理 - 产品化错误边界
 */

import type { App } from 'vue'

export interface AppError {
  type: 'runtime' | 'network' | 'storage' | 'unknown'
  message: string
  detail?: string
  timestamp: number
}

const errorListeners: Array<(error: AppError) => void> = []

export function onError(listener: (error: AppError) => void) {
  errorListeners.push(listener)
}

function notify(error: AppError) {
  errorListeners.forEach(fn => fn(error))
}

export function classifyError(error: unknown): AppError {
  const timestamp = Date.now()

  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    return { type: 'storage', message: '存储空间已满，请清理浏览器数据', timestamp }
  }

  if (error instanceof TypeError && error.message.includes('localStorage')) {
    return { type: 'storage', message: '浏览器存储不可用，部分功能受限', detail: error.message, timestamp }
  }

  if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('NetworkError'))) {
    return { type: 'network', message: '网络连接异常', detail: error.message, timestamp }
  }

  if (error instanceof Error) {
    return { type: 'runtime', message: error.message, detail: error.stack, timestamp }
  }

  return { type: 'unknown', message: String(error), timestamp }
}

export function setupErrorHandler(app: App) {
  // Vue error handler
  app.config.errorHandler = (err, _instance, info) => {
    const error = classifyError(err)
    console.error(`[Vue Error] ${info}:`, error)
    notify(error)
  }

  // Global runtime errors
  window.addEventListener('error', (event) => {
    const error = classifyError(event.error)
    console.error('[Runtime Error]:', error)
    notify(error)
  })

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = classifyError(event.reason)
    console.error('[Unhandled Rejection]:', error)
    notify(error)
  })
}

/**
 * Safe localStorage wrapper with error handling
 */
export const safeStorage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      const error = classifyError(e)
      notify(error)
      return false
    }
  },
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  },
}
