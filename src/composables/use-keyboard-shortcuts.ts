/**
 * Keyboard Shortcuts Composable
 * 键盘快捷键组合式函数
 *
 * 使用开源库：@vueuse/core 的 useMagicKeys 理念
 * 但保持轻量，不引入整个库
 */

import { onMounted, onUnmounted, type Ref } from 'vue'

/** 快捷键处理器 */
export type KeyHandler = (event: KeyboardEvent) => void

/** 快捷键配置 */
export interface ShortcutConfig {
  key: string
  handler: KeyHandler
  preventDefault?: boolean
  condition?: (() => boolean) | Ref<boolean>
}

/**
 * 使用键盘快捷键
 * @param shortcuts 快捷键配置数组
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeydown = (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      // 检查条件
      if (shortcut.condition) {
        const condition = typeof shortcut.condition === 'function'
          ? (shortcut.condition as () => boolean)()
          : shortcut.condition.value
        if (!condition) continue
      }

      // 检查按键匹配
      if (matchesKey(event, shortcut.key)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }
        shortcut.handler(event)
        break
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}

/**
 * 检查按键是否匹配
 * 支持：'a', 'ctrl+a', 'shift+enter', '1-4' 等格式
 */
function matchesKey(event: KeyboardEvent, key: string): boolean {
  const parts = key.toLowerCase().split('+')
  const mainKey = parts[parts.length - 1]

  // 检查修饰键
  if (parts.includes('ctrl') && !event.ctrlKey && !event.metaKey) return false
  if (parts.includes('shift') && !event.shiftKey) return false
  if (parts.includes('alt') && !event.altKey) return false

  // 检查主键
  if (mainKey === 'enter') return event.key === 'Enter'
  if (mainKey === 'escape') return event.key === 'Escape'
  if (mainKey === 'space') return event.key === ' '
  if (mainKey === 'arrowup') return event.key === 'ArrowUp'
  if (mainKey === 'arrowdown') return event.key === 'ArrowDown'

  return event.key.toLowerCase() === mainKey
}

/**
 * 刷题页面专用快捷键
 * 选择题支持1-4选择，判断题支持1-2选择
 */
export function useQuizShortcuts(options: {
  onSelectOption: (index: number) => void
  onNext: () => void
  onBookmark: () => void
  canSelect: () => boolean
  canNext: () => boolean
  optionCount?: number
}) {
  const count = options.optionCount ?? 4
  const shortcuts: ShortcutConfig[] = [
    { key: '1', handler: () => options.onSelectOption(0), condition: options.canSelect },
    { key: '2', handler: () => options.onSelectOption(1), condition: options.canSelect },
  ]
  if (count >= 3) {
    shortcuts.push({ key: '3', handler: () => options.onSelectOption(2), condition: options.canSelect })
  }
  if (count >= 4) {
    shortcuts.push({ key: '4', handler: () => options.onSelectOption(3), condition: options.canSelect })
  }
  shortcuts.push(
    { key: 'enter', handler: options.onNext, condition: options.canNext },
    { key: 'b', handler: options.onBookmark },
    { key: 'escape', handler: () => history.back() }
  )
  useKeyboardShortcuts(shortcuts)
}
