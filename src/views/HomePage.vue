<template>
  <div class="animate-fade-in">
    <!-- Hero -->
    <div class="text-center py-8 md:py-10">
      <h1 class="text-2xl md:text-3xl font-extrabold mb-2">
        🧠 <span class="text-primary-400">AI/计算机</span>面试刷题
      </h1>
      <p class="text-slate-400 text-sm">涵盖人工智能、算法、网络、操作系统等核心面试题 · 5400+题</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <StatCard icon="📝" :value="stats.total" label="总题数" colorClass="text-primary-400" />
      <StatCard icon="✅" :value="stats.correct" label="已答对" colorClass="text-emerald-400" />
      <StatCard icon="🎯" :value="stats.accuracy + '%'" label="正确率" colorClass="text-amber-400" />
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <button
        class="col-span-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400
               text-white font-bold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg
               hover:shadow-primary-500/20 text-sm"
        @click="goQuickQuiz"
      >
        🚀 随机刷题（10题）
      </button>
      <button
        class="bg-slate-900 border border-slate-800 hover:border-primary-500/50 rounded-xl p-3.5
               flex items-center gap-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
        @click="goWrongQuiz"
      >
        <span class="text-lg">❌</span> 错题重练
      </button>
      <button
        class="bg-slate-900 border border-slate-800 hover:border-primary-500/50 rounded-xl p-3.5
               flex items-center gap-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
        @click="$router.push('/collection')"
      >
        <span class="text-lg">⭐</span> 我的收藏
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 搜索题目关键词..."
        class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm
               placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50
               transition-colors"
      />
    </div>

    <!-- Category Grid -->
    <h2 class="text-base font-bold mb-3 flex items-center gap-2">📚 题目分类</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer
               hover:border-primary-500/50 transition-all hover:-translate-y-0.5 group"
        @click="goCategoryQuiz(cat.id)"
      >
        <div class="text-2xl mb-2">{{ cat.icon }}</div>
        <div class="font-bold text-sm mb-1">{{ cat.name }}</div>
        <div class="text-xs text-slate-500 mb-2">{{ catStats[cat.id]?.done || 0 }}/{{ catStats[cat.id]?.total || 0 }} 题</div>
        <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: (catStats[cat.id]?.progress || 0) + '%', background: cat.color }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery.trim()" class="mb-6">
      <h2 class="text-base font-bold mb-3">🔍 搜索结果（{{ searchResults.length }}）</h2>
      <QuestionListItem
        v-for="q in searchResults.slice(0, 20)"
        :key="q.id"
        :question="q"
        @click="showDetail(q)"
      />
      <div v-if="searchResults.length === 0" class="text-center py-8 text-slate-600 text-sm">没有找到匹配的题目</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz-session'
import { CATEGORIES } from '@/config/categories'
import { QuestionEngine } from '@/data/question-bank'
import StatCard from '@/components/common/StatCard.vue'
import QuestionListItem from '@/components/question/QuestionListItem.vue'
import QuestionDetailModal from '@/components/question/QuestionDetailModal.vue'
import { useToast } from '@/composables/use-toast-notification'

const router = useRouter()
const store = useQuizStore()

const stats = computed(() => store.globalStats)
const catStats = computed(() => store.categoryStats)
const categories = CATEGORIES

const searchQuery = ref('')
const searchResults = computed(() => QuestionEngine.search(searchQuery.value))

function goQuickQuiz() {
  router.push({ path: '/quiz', query: { mode: 'quick' } })
}
function goWrongQuiz() {
  if (store.wrongQuestionIds.length === 0) {
    useToast().info('没有错题，继续保持！🎉')
    return
  }
  router.push({ path: '/quiz', query: { mode: 'wrong' } })
}
function goCategoryQuiz(catId) {
  router.push({ path: '/quiz', query: { cat: catId } })
}

// Detail modal
const detailQuestion = ref(null)
function showDetail(q) { detailQuestion.value = q }
function closeDetail() { detailQuestion.value = null }
</script>
