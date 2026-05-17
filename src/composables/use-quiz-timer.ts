/**
 * Module: Composables - useQuizTimer
 * 计时器组合式函数 - 独立计时模块
 *
 * Features:
 * - 正计时/倒计时
 * - 暂停/恢复/重置
 * - 自动格式化输出
 */

import { ref, computed, onUnmounted } from 'vue'

export function useTimer(initialSeconds = 0, countdown = false) {
  const elapsed = ref(initialSeconds)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const formatted = computed(() => {
    const totalSec = Math.abs(elapsed.value)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  })

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    intervalId = setInterval(() => {
      elapsed.value += countdown ? -1 : 1
      if (countdown && elapsed.value <= 0) {
        elapsed.value = 0
        stop()
      }
    }, 1000)
  }

  function stop() {
    isRunning.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset(seconds?: number) {
    stop()
    elapsed.value = seconds ?? initialSeconds
  }

  function toggle() {
    isRunning.value ? stop() : start()
  }

  onUnmounted(stop)

  return { elapsed, isRunning, formatted, start, stop, reset, toggle }
}
