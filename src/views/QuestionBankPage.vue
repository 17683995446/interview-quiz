<template>
  <div class="animate-fade-in">
    <h2 class="text-base font-bold mb-3 flex items-center gap-2">📖 题库浏览</h2>
    <!-- Filter -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" style="scrollbar-width:none;">
      <button
        v-for="cat in filterOptions"
        :key="cat.id"
        class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap"
        :class="activeFilter === cat.id
          ? 'bg-primary-500 border-primary-500 text-white'
          : 'border-slate-700 text-slate-400 hover:border-primary-500/50'"
        @click="activeFilter = cat.id"
      >{{ cat.icon }} {{ cat.name }}</button>
    </div>
    <!-- List -->
    <div class="space-y-2.5">
      <QuestionListItem
        v-for="q in filteredQuestions"
        :key="q.id"
        :question="q"
        @click="detailQ = q"
      />
    </div>
    <div v-if="filteredQuestions.length === 0" class="text-center py-12 text-slate-600 text-sm">
      <div class="text-3xl mb-2">📭</div>暂无题目
    </div>
    <QuestionDetailModal v-if="detailQ" :question="detailQ" @close="detailQ = null" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CATEGORIES } from '@/config/categories'
import { QuestionEngine } from '@/data/question-bank'
import { useQuizStore } from '@/stores/quiz-session'
import QuestionListItem from '@/components/question/QuestionListItem.vue'
import QuestionDetailModal from '@/components/question/QuestionDetailModal.vue'

const store = useQuizStore()
const activeFilter = ref('all')
const detailQ = ref(null)

const filterOptions = [{ id: 'all', name: '全部', icon: '📋' }, ...CATEGORIES]

const filteredQuestions = computed(() =>
  activeFilter.value === 'all'
    ? QuestionEngine.filter()
    : QuestionEngine.filter({ category: activeFilter.value })
)
</script>
