<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center" role="status">
    <div class="text-3xl mb-2">{{ icon }}</div>
    <div class="text-2xl font-extrabold" :class="colorClass">{{ value }}</div>
    <div class="text-xs text-slate-500 mt-1">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: String,
  value: [String, Number],
  label: String,
  colorClass: { type: String, default: 'text-primary-400' },
})
</script>
