/**
 * Module: Composables - useToastNotification
 * 全局提示组合式函数 - 独立消息通知模块
 */

import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  function show(message: string, type: Toast['type'] = 'info', duration = 2000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  function success(msg: string) {
    show(msg, 'success')
  }
  function error(msg: string) {
    show(msg, 'error')
  }
  function info(msg: string) {
    show(msg, 'info')
  }

  function clear() {
    toasts.value = []
    toastId = 0
  }

  return { toasts, show, success, error, info, clear }
}
