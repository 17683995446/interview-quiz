/**
 * Theme Composable
 * 主题切换组合式函数
 *
 * 支持亮色/暗色/跟随系统三种模式
 */

import { ref, watch, onMounted } from 'vue'
import { storage } from '@/services/local-storage'

export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme-mode'
const THEME_CLASS = 'dark'

const currentTheme = ref<ThemeMode>('auto')
const isDark = ref(false)

/**
 * 检测系统偏好
 */
function getSystemPreference(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 应用主题到 DOM
 */
function applyTheme(dark: boolean) {
  isDark.value = dark
  if (dark) {
    document.documentElement.classList.add(THEME_CLASS)
  } else {
    document.documentElement.classList.remove(THEME_CLASS)
  }
}

/**
 * 更新主题
 */
function updateTheme(mode: ThemeMode) {
  currentTheme.value = mode
  storage.set(STORAGE_KEY, mode)

  if (mode === 'auto') {
    applyTheme(getSystemPreference())
  } else {
    applyTheme(mode === 'dark')
  }
}

/**
 * 使用主题
 */
export function useTheme() {
  onMounted(() => {
    // 加载保存的主题
    const saved = storage.get<ThemeMode>(STORAGE_KEY, 'auto')
    updateTheme(saved ?? 'auto')

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (currentTheme.value === 'auto') {
        applyTheme(e.matches)
      }
    })
  })

  return {
    theme: currentTheme,
    isDark,
    setTheme: updateTheme,
    toggleTheme: () => {
      const next = isDark.value ? 'light' : 'dark'
      updateTheme(next)
    },
  }
}
