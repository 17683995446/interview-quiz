<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
    <div class="h-1.5 bg-gradient-to-r" :class="colorClass" :style="{ width: pct + '%' }"></div>
    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="font-semibold text-sm">{{ label }}</span>
        <span class="text-xs text-slate-500">{{ detail }}</span>
      </div>
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" :class="colorClass" :style="{ width: pct + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  detail: String,
  pct: { type: Number, default: 0 },
  colorClass: { type: String, default: 'from-primary-500 to-primary-400' },
})
</script>
