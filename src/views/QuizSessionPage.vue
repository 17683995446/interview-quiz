<template>
  <div class="animate-fade-in">
    <!-- Setup Phase -->
    <div v-if="phase === 'setup'">
      <AppCard title="🎯 选择刷题模式">
        <div class="space-y-5">
          <!-- Category -->
          <div>
            <div class="text-xs text-slate-400 font-semibold mb-2">题目分类</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categoryOptions"
                :key="cat.id"
                class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                :class="config.category === cat.id
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-primary-500/50'"
                @click="config.category = cat.id"
              >{{ cat.icon }} {{ cat.name }}</button>
            </div>
          </div>
          <!-- Count -->
          <div>
            <div class="text-xs text-slate-400 font-semibold mb-2">题目数量</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="n in [5, 10, 20, 0]"
                :key="n"
                class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                :class="config.count === n
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-primary-500/50'"
                @click="config.count = n"
              >{{ n === 0 ? '全部' : n + '题' }}</button>
            </div>
          </div>
          <!-- Difficulty -->
          <div>
            <div class="text-xs text-slate-400 font-semibold mb-2">难度筛选</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="d in difficultyOptions"
                :key="d.id"
                class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                :class="config.difficulty === d.id
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-primary-500/50'"
                @click="config.difficulty = d.id"
              >{{ d.label }}</button>
            </div>
          </div>
          <!-- Timer Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400 font-semibold">⏱️ 计时模式</span>
            <button
              class="w-10 h-5 rounded-full transition-colors relative"
              :class="config.timer ? 'bg-primary-500' : 'bg-slate-700'"
              @click="config.timer = !config.timer"
            >
              <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                :class="config.timer ? 'left-5.5' : 'left-0.5'"></span>
            </button>
          </div>
          <!-- Start -->
          <button
            class="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400
                   text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 text-sm"
            @click="startQuiz"
          >开始刷题 🚀</button>
        </div>
      </AppCard>
    </div>

    <!-- Quiz Phase -->
    <div v-else-if="phase === 'quiz'">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 class="text-base font-bold">{{ sessionTitle }}</h2>
        <div class="flex items-center gap-3 text-xs text-slate-400">
          <span v-if="config.timer" class="font-mono text-amber-400">{{ timer.formatted.value }}</span>
          <span>{{ currentIndex + 1 }}/{{ questions.length }}</span>
          <span>正确: <b class="text-emerald-400">{{ store.session.score }}</b></span>
        </div>
      </div>
      <!-- Progress Bar -->
      <div class="h-1.5 bg-slate-800 rounded-full mb-5 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary-500 to-amber-500 rounded-full transition-all duration-400"
          :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"></div>
      </div>
      <!-- Question Card -->
      <div v-if="currentQ" class="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 mb-4">
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/15 text-primary-400 font-semibold">
            {{ currentCat?.icon }} {{ currentCat?.name }}
          </span>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            :class="{
              'bg-emerald-500/15 text-emerald-400': currentQ.diff === 'easy',
              'bg-amber-500/15 text-amber-400': currentQ.diff === 'medium',
              'bg-red-500/15 text-red-400': currentQ.diff === 'hard',
            }">{{ diffLabel }}</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            :class="{
              'bg-blue-500/15 text-blue-400': currentQ.type === 'choice',
              'bg-purple-500/15 text-purple-400': currentQ.type === 'truefalse',
            }">{{ currentQ.type === 'choice' ? '📝 选择题' : '✅ 判断题' }}</span>
        </div>
        <div class="text-base md:text-lg font-semibold leading-relaxed mb-5">{{ currentQ.q }}</div>
        <!-- Options -->
        <div class="space-y-2.5">
          <button
            v-for="(opt, i) in currentQ.opts"
            :key="i"
            class="w-full text-left bg-slate-800/50 border border-slate-800 rounded-lg px-4 py-3
                   flex items-start gap-3 text-sm leading-relaxed transition-all"
            :class="{
              'border-primary-500 bg-primary-500/10': selectedIdx === i && !answered,
              'border-emerald-500 bg-emerald-500/10': answered && i === currentQ.ans,
              'border-red-500 bg-red-500/10': answered && i === selectedIdx && i !== currentQ.ans,
              'opacity-50 cursor-default': answered && i !== selectedIdx && i !== currentQ.ans,
              'hover:border-primary-500/50': !answered,
            }"
            :disabled="answered"
            @click="selectAnswer(i)"
          >
            <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors"
              :class="{
                'bg-primary-500 text-white': selectedIdx === i && !answered,
                'bg-emerald-500 text-white': answered && i === currentQ.ans,
                'bg-red-500 text-white': answered && i === selectedIdx && i !== currentQ.ans,
                'bg-slate-700 text-slate-400': !(selectedIdx === i || (answered && (i === currentQ.ans || i === selectedIdx))),
              }">{{ labels[i] }}</span>
            <span>{{ opt }}</span>
          </button>
        </div>
        <!-- Explanation -->
        <div v-if="answered" class="mt-4 p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg text-sm text-slate-400 leading-relaxed animate-fade-in">
          <strong class="text-slate-200">💡 解析：</strong>{{ currentQ.exp }}
        </div>
      </div>
      <!-- Actions -->
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold
                 hover:border-primary-500/50 transition-colors"
          @click="toggleBookmark"
        >{{ store.isBookmarked(currentQ?.id) ? '⭐ 已收藏' : '⭐ 收藏' }}</button>
        <button
          v-if="answered"
          class="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl
                 text-sm font-bold transition-all hover:-translate-y-0.5"
          @click="goNext"
        >{{ isLast ? '查看结果 →' : '下一题 →' }}</button>
      </div>
    </div>

    <!-- Result Phase -->
    <div v-else-if="phase === 'result'">
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center mb-5 animate-scale-in">
        <div class="text-4xl mb-3">{{ resultEmoji }}</div>
        <div class="text-4xl font-extrabold mb-1" :class="resultColor">{{ resultRate }}%</div>
        <div class="text-sm text-slate-400">{{ resultLabel }}</div>
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="text-center">
            <div class="text-xl font-bold">{{ resultTotal }}</div>
            <div class="text-xs text-slate-500">总题数</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-emerald-400">{{ resultCorrect }}</div>
            <div class="text-xs text-slate-500">正确</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-red-400">{{ resultWrong }}</div>
            <div class="text-xs text-slate-500">错误</div>
          </div>
        </div>
        <div v-if="config.timer && timer.formatted.value !== '00:00'" class="mt-4 text-xs text-slate-500">
          ⏱️ 用时 {{ timer.formatted.value }}
        </div>
      </div>
      <div class="flex gap-3">
        <button class="flex-1 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold
                       hover:border-primary-500/50 transition-colors" @click="goSetup">返回设置</button>
        <button class="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl
                       text-sm font-bold transition-all hover:-translate-y-0.5" @click="retry">再来一次</button>
      </div>
    </div>

    <!-- Detail Modal -->
    <QuestionDetailModal v-if="detailQ" :question="detailQ" @close="detailQ = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz-session'
import { CATEGORIES, DIFFICULTY_MAP } from '@/config/categories'
import { QuestionEngine } from '@/data/question-bank'
import { useTimer } from '@/composables/use-quiz-timer'
import { useToast } from '@/composables/use-toast-notification'
import { useQuizShortcuts } from '@/composables/use-keyboard-shortcuts'
import AppCard from '@/components/common/AppCard.vue'
import QuestionDetailModal from '@/components/question/QuestionDetailModal.vue'

const route = useRoute()
const router = useRouter()
const store = useQuizStore()
const toast = useToast()
const timer = useTimer(0)

const labels = ['A', 'B', 'C', 'D', 'E', 'F']

// Phase management
const phase = ref('setup')
const config = ref({ category: 'all', count: 10, difficulty: 'all', timer: false })
const selectedIdx = ref(null)
const detailQ = ref(null)

const categoryOptions = [{ id: 'all', name: '全部分类', icon: '📋' }, ...CATEGORIES]
const difficultyOptions = [
  { id: 'all', label: '全部' },
  { id: 'easy', label: '简单' },
  { id: 'medium', label: '中等' },
  { id: 'hard', label: '困难' },
]

// Session computed
const session = computed(() => store.session)
const questions = computed(() => session.value?.questions || [])
const currentIndex = computed(() => session.value?.current || 0)
const currentQ = computed(() => questions.value[currentIndex.value])
const answered = computed(() => session.value?.answered || false)
const isLast = computed(() => currentIndex.value >= questions.value.length - 1)

const currentCat = computed(() => currentQ.value ? CATEGORIES.find(c => c.id === currentQ.value.cat) : null)
const diffLabel = computed(() => currentQ.value ? DIFFICULTY_MAP[currentQ.value.diff]?.label : '')
const sessionTitle = computed(() => {
  if (!session.value) return ''
  const cfg = session.value.config
  if (cfg.mode === 'wrong') return '错题重练'
  const cat = CATEGORIES.find(c => c.id === cfg.category)
  return cat ? cat.name : '随机刷题'
})

// Result computed
const resultTotal = computed(() => session.value?.results.length || 0)
const resultCorrect = computed(() => session.value?.score || 0)
const resultWrong = computed(() => resultTotal.value - resultCorrect.value)
const resultRate = computed(() => resultTotal.value > 0 ? Math.round(resultCorrect.value / resultTotal.value * 100) : 0)
const resultEmoji = computed(() => resultRate.value >= 80 ? '🎉' : resultRate.value >= 60 ? '👍' : resultRate.value >= 40 ? '💪' : '📖')
const resultColor = computed(() => resultRate.value >= 80 ? 'text-emerald-400' : resultRate.value >= 60 ? 'text-amber-400' : 'text-red-400')
const resultLabel = computed(() =>
  resultRate.value >= 80 ? '太棒了！继续保持！' :
  resultRate.value >= 60 ? '不错，再接再厉！' :
  resultRate.value >= 40 ? '继续加油，多复习错题！' : '基础需要加强，建议先浏览题库'
)

function startQuiz() {
  let pool
  if (config.value.category === 'wrong') {
    pool = QuestionEngine.getWrongQuestions(store.records)
  } else {
    pool = QuestionEngine.randomPick(config.value.count, {
      category: config.value.category,
      difficulty: config.value.difficulty,
    })
  }
  if (pool.length === 0) { toast.info('没有符合条件的题目'); return }
  store.startSession(pool, { ...config.value, mode: config.value.category === 'wrong' ? 'wrong' : 'normal' })
  selectedIdx.value = null
  phase.value = 'quiz'
  if (config.value.timer) { timer.reset(0); timer.start() }
}

function selectAnswer(idx) {
  if (answered.value) return
  selectedIdx.value = idx
  store.answerCurrent(idx)
}

function goNext() {
  const hasMore = store.nextQuestion()
  selectedIdx.value = null
  if (!hasMore) {
    phase.value = 'result'
    timer.stop()
  }
}

function toggleBookmark() {
  if (!currentQ.value) return
  store.toggleBookmark(currentQ.value.id)
  toast.success(store.isBookmarked(currentQ.value.id) ? '已收藏 ⭐' : '已取消收藏')
}

function goSetup() {
  store.endSession()
  timer.reset(0)
  phase.value = 'setup'
}

function retry() {
  store.endSession()
  timer.reset(0)
  startQuiz()
}

// Keyboard shortcuts for quiz
useQuizShortcuts({
  onSelectOption(idx) {
    if (phase.value === 'quiz' && !answered.value) {
      selectAnswer(idx)
    }
  },
  onNext: () => {
    if (answered.value) goNext()
  },
  onBookmark: () => {
    if (currentQ.value) store.toggleBookmark(currentQ.value.id)
  },
  canSelect: () => phase.value === 'quiz' && !answered.value,
  canNext: () => answered.value,
})

// Handle route query params for quick start
onMounted(() => {
  const mode = route.query.mode
  const cat = route.query.cat
  if (mode === 'quick') {
    config.value = { category: 'all', count: 10, difficulty: 'all', timer: false }
    startQuiz()
  } else if (mode === 'wrong') {
    config.value = { category: 'wrong', count: 0, difficulty: 'all', timer: false }
    startQuiz()
  } else if (cat) {
    config.value = { ...config.value, category: cat }
  }
})
</script>
