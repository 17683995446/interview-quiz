<template>
  <div class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center" @click.self="$emit('close')">
    <div class="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto
                rounded-t-2xl md:rounded-2xl p-5 md:p-6 animate-slide-up">
      <!-- Close -->
      <button
        class="sticky top-0 float-right w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center
               text-slate-400 hover:text-white transition-colors z-10"
        @click="$emit('close')"
      >✕</button>

      <div class="clear-both">
        <!-- Meta -->
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/15 text-primary-400 font-semibold">
            {{ catLabel }}
          </span>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            :class="{
              'bg-emerald-500/15 text-emerald-400': question.diff === 'easy',
              'bg-amber-500/15 text-amber-400': question.diff === 'medium',
              'bg-red-500/15 text-red-400': question.diff === 'hard',
            }">{{ diffLabel }}</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            :class="{
              'bg-blue-500/15 text-blue-400': question.type === 'choice',
              'bg-purple-500/15 text-purple-400': question.type === 'truefalse',
            }">{{ question.type === 'choice' ? '📝 选择题' : '✅ 判断题' }}</span>
          <span class="text-xs ml-auto" :class="recordClass">{{ recordText }}</span>
        </div>

        <!-- Question -->
        <div class="text-base font-semibold leading-relaxed mb-4">{{ question.q }}</div>

        <!-- Options -->
        <div class="space-y-2 mb-4">
          <div
            v-for="(opt, i) in question.opts"
            :key="i"
            class="p-3 rounded-lg text-sm"
            :class="i === question.ans
              ? 'border border-emerald-500/50 bg-emerald-500/10'
              : 'border border-slate-800'"
          >
            <span class="font-bold mr-2" :class="i === question.ans ? 'text-emerald-400' : 'text-slate-600'">{{ labels[i] }}.</span>
            {{ opt }}
            <span v-if="i === question.ans" class="text-emerald-400 ml-1">✓</span>
          </div>
        </div>

        <!-- Explanation -->
        <div class="p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg text-sm text-slate-400 leading-relaxed">
          <strong class="text-slate-200">💡 解析：</strong>{{ question.exp }}
        </div>

        <!-- Bookmark -->
        <button
          class="mt-4 w-full py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-semibold
                 hover:border-primary-500/50 transition-colors"
          @click="toggleBookmark"
        >{{ store.isBookmarked(question.id) ? '⭐ 取消收藏' : '⭐ 收藏此题' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CATEGORIES, DIFFICULTY_MAP } from '@/config/categories'
import { useQuizStore } from '@/stores/quiz-session'
import { useToast } from '@/composables/use-toast-notification'

const props = defineProps({ question: { type: Object, required: true } })
defineEmits(['close'])

const store = useQuizStore()
const toast = useToast()
const labels = ['A', 'B', 'C', 'D', 'E', 'F']

const catLabel = computed(() => {
  const cat = CATEGORIES.find(c => c.id === props.question.cat)
  return cat ? cat.icon + ' ' + cat.name : ''
})
const diffLabel = computed(() => DIFFICULTY_MAP[props.question.diff]?.label || '')
const record = computed(() => store.records[props.question.id])
const recordText = computed(() => {
  if (record.value === 'correct') return '✓ 已答对'
  if (record.value === 'wrong') return '✗ 答错过'
  return '未作答'
})
const recordClass = computed(() => ({
  'text-emerald-400': record.value === 'correct',
  'text-red-400': record.value === 'wrong',
  'text-slate-600': !record.value,
}))

function toggleBookmark() {
  store.toggleBookmark(props.question.id)
  toast.success(store.isBookmarked(props.question.id) ? '已收藏 ⭐' : '已取消收藏')
}
</script>
