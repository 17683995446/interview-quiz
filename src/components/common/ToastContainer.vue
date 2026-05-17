<template>
  <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg pointer-events-auto
               bg-slate-800 border border-slate-700 text-slate-200 animate-scale-in"
        :class="{
          'border-emerald-600/50 bg-emerald-950/80': t.type === 'success',
          'border-red-600/50 bg-red-950/80': t.type === 'error',
        }"
      >
        {{ t.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/use-toast-notification'
const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-12px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(-8px) scale(0.95); }
</style>
