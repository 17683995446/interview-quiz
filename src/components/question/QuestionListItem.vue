<template>
  <div
    class="bg-slate-900 border border-slate-800 rounded-lg p-3.5 cursor-pointer
           hover:border-primary-500/50 transition-all"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-center mb-1.5">
      <span class="text-xs text-primary-400 font-semibold">{{ catLabel }}</span>
      <span class="text-xs" :class="statusClass">{{ statusText }}</span>
    </div>
    <div class="text-sm text-slate-300 leading-relaxed line-clamp-2">{{ question.q }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CATEGORIES } from '@/config/categories'
import { useQuizStore } from '@/stores/quiz-session'

const props = defineProps({ question: { type: Object, required: true } })
defineEmits(['click'])

const store = useQuizStore()

const catLabel = computed(() => {
  const cat = CATEGORIES.find(c => c.id === props.question.cat)
  return cat ? cat.icon + ' ' + cat.name : ''
})

const record = computed(() => store.records[props.question.id])
const statusText = computed(() => {
  if (record.value === 'correct') return '✓ 正确'
  if (record.value === 'wrong') return '✗ 错误'
  return '未答'
})
const statusClass = computed(() => ({
  'text-emerald-400': record.value === 'correct',
  'text-red-400': record.value === 'wrong',
  'text-slate-600': !record.value,
}))
</script>
