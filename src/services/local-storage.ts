/**
 * Module: Persistence Utility
 * 本地存储工具 - 独立持久化模块
 *
 * Responsibilities:
 * - 封装 localStorage 读写
 * - 提供类型安全的存取接口
 * - 支持默认值和错误处理
 */

const STORAGE_KEY = 'interview-quiz-state'

export const storage = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}:${key}`)
      return raw ? (JSON.parse(raw) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${STORAGE_KEY}:${key}`)
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_KEY))
      .forEach((k) => localStorage.removeItem(k))
  },
}
