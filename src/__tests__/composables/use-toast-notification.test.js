/**
 * Unit Tests: useToast Composable
 * 提示通知组合式函数 - 单元测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useToast } from '@/composables/use-toast-notification'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { clear } = useToast()
    clear()
  })

  it('should add a toast message', () => {
    const { toasts, show } = useToast()
    show('test message')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('test message')
    expect(toasts.value[0].type).toBe('info')
  })

  it('should auto-remove toast after duration', () => {
    const { toasts, show } = useToast()
    show('test', 'info', 1000)
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1001)
    expect(toasts.value).toHaveLength(0)
  })

  it('should support different types', () => {
    const { toasts, success, error, info } = useToast()
    success('ok')
    expect(toasts.value[0].type).toBe('success')
    error('fail')
    expect(toasts.value[1].type).toBe('error')
    info('info')
    expect(toasts.value[2].type).toBe('info')
  })

  it('should assign unique ids', () => {
    const { toasts, show } = useToast()
    show('a')
    show('b')
    expect(toasts.value[0].id).not.toBe(toasts.value[1].id)
  })
})
