/**
 * Unit Tests: useTimer Composable
 * 计时器组合式函数 - 单元测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '@/composables/use-quiz-timer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with correct value', () => {
    const timer = useTimer(0)
    expect(timer.elapsed.value).toBe(0)
    expect(timer.isRunning.value).toBe(false)
    expect(timer.formatted.value).toBe('00:00')
  })

  it('should count up when started', () => {
    const timer = useTimer(0)
    timer.start()
    expect(timer.isRunning.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(timer.elapsed.value).toBe(1)
    expect(timer.formatted.value).toBe('00:01')

    vi.advanceTimersByTime(59000)
    expect(timer.elapsed.value).toBe(60)
    expect(timer.formatted.value).toBe('01:00')
  })

  it('should stop when stopped', () => {
    const timer = useTimer(0)
    timer.start()
    vi.advanceTimersByTime(3000)
    timer.stop()
    expect(timer.isRunning.value).toBe(false)

    vi.advanceTimersByTime(5000)
    expect(timer.elapsed.value).toBe(3) // should not advance
  })

  it('should reset to specified value', () => {
    const timer = useTimer(0)
    timer.start()
    vi.advanceTimersByTime(5000)
    timer.reset(30)
    expect(timer.elapsed.value).toBe(30)
    expect(timer.isRunning.value).toBe(false)
  })

  it('should toggle start/stop', () => {
    const timer = useTimer(0)
    timer.toggle()
    expect(timer.isRunning.value).toBe(true)
    timer.toggle()
    expect(timer.isRunning.value).toBe(false)
  })

  it('should format time correctly', () => {
    const timer = useTimer(0)
    timer.reset(0)
    expect(timer.formatted.value).toBe('00:00')
    timer.reset(65)
    expect(timer.formatted.value).toBe('01:05')
    timer.reset(3661)
    expect(timer.formatted.value).toBe('61:01')
  })

  it('should support countdown mode', () => {
    const timer = useTimer(10, true)
    timer.start()
    vi.advanceTimersByTime(3000)
    expect(timer.elapsed.value).toBe(7)

    vi.advanceTimersByTime(7000)
    expect(timer.elapsed.value).toBe(0)
    expect(timer.isRunning.value).toBe(false) // auto-stop at 0
  })

  it('should not start if already running', () => {
    const timer = useTimer(0)
    timer.start()
    timer.start() // double start
    vi.advanceTimersByTime(1000)
    expect(timer.elapsed.value).toBe(1) // only one interval
  })
})
