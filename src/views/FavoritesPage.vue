<template>
  <div class="animate-fade-in">
    <h2 class="text-base font-bold mb-3 flex items-center gap-2">⭐ 我的收藏</h2>
    <div class="space-y-2.5">
      <QuestionListItem
        v-for="q in bookmarked"
        :key="q.id"
        :question="q"
        @click="detailQ = q"
      />
    </div>
    <div v-if="bookmarked.length === 0" class="text-center py-12 text-slate-600 text-sm">
      <div class="text-3xl mb-2">⭐</div>
      <p>还没有收藏的题目</p>
      <p class="text-xs mt-1 text-slate-700">刷题时点击收藏按钮添加</p>
    </div>
    <QuestionDetailModal v-if="detailQ" :question="detailQ" @close="detailQ = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuizStore } from '@/stores/quiz-session'
import type { Question } from '@/types'
import QuestionListItem from '@/components/question/QuestionListItem.vue'
import QuestionDetailModal from '@/components/question/QuestionDetailModal.vue'

const store = useQuizStore()
const detailQ = ref<Question | null>(null)
const bookmarked = computed(() => store.bookmarkedQuestions)
</script>
