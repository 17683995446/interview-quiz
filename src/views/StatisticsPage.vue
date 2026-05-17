<template>
  <div class="animate-fade-in space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold flex items-center gap-2">📊 学习统计</h2>
      <div class="text-sm text-slate-400">
        {{ todayDate }}
      </div>
    </div>

    <!-- Top Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard icon="📝" :value="stats.total" label="总题数" colorClass="text-primary-400" />
      <StatCard icon="✅" :value="stats.done" label="已作答" colorClass="text-emerald-400" />
      <StatCard icon="🎯" :value="stats.accuracy + '%'" label="正确率" colorClass="text-amber-400" />
      <StatCard icon="⭐" :value="store.bookmarks.size" label="收藏数" colorClass="text-yellow-400" />
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Radar Chart -->
      <AppCard title="📈 分类掌握度" class="h-fit">
        <CategoryRadarChart :stats="catStats" />
      </AppCard>

      <!-- Daily Check In -->
      <AppCard title="🔥 每日打卡" class="h-fit">
        <DailyCheckIn :checkInData="checkInData" />
      </AppCard>

      <!-- Trend Chart -->
      <AppCard title="📉 学习趋势" class="lg:col-span-2 h-fit">
        <LearningTrendChart :dailyStats="dailyStats" />
      </AppCard>
    </div>

    <!-- Category Progress -->
    <div>
      <h3 class="text-base font-bold mb-3 flex items-center gap-2">📚 分类进度详情</h3>
      <div class="space-y-2.5">
        <ProgressCard
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.icon + ' ' + cat.name"
          :detail="`${catStats[cat.id]?.done || 0}/${catStats[cat.id]?.total || 0} 题 · 正确率 ${catStats[cat.id]?.accuracy || 0}%`"
          :pct="catStats[cat.id]?.progress || 0"
          :colorClass="`from-[${cat.color}] to-[${cat.color}]88`"
        />
      </div>
    </div>

    <!-- Data Management -->
    <div>
      <h3 class="text-base font-bold mb-3 flex items-center gap-2">⚙️ 数据管理</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          class="py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold
                 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2"
          @click="handleExport"
        >
          <span>📤</span> 导出数据
        </button>
        <button
          class="py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold
                 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2"
          @click="triggerImport"
        >
          <span>📥</span> 导入数据
        </button>
        <button
          class="py-3 bg-slate-900 border border-red-900/50 rounded-xl text-sm font-semibold
                 text-red-400 hover:border-red-500/50 transition-colors flex items-center justify-center gap-2"
          @click="handleReset"
        >
          <span>🗑️</span> 重置数据
        </button>
      </div>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useQuizStore } from '@/stores/quiz-session'
import { CATEGORIES } from '@/config/categories'
import { useToast } from '@/composables/use-toast-notification'
import StatCard from '@/components/common/StatCard.vue'
import ProgressCard from '@/components/common/ProgressCard.vue'
import AppCard from '@/components/common/AppCard.vue'
import DailyCheckIn from '@/components/stats/DailyCheckIn.vue'

const CategoryRadarChart = defineAsyncComponent(() => import('@/components/stats/CategoryRadarChart.vue'))
const LearningTrendChart = defineAsyncComponent(() => import('@/components/stats/LearningTrendChart.vue'))

const store = useQuizStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)

const stats = computed(() => store.globalStats)
const catStats = computed(() => store.categoryStats)
const categories = CATEGORIES

// Today's date
const todayDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// Daily stats from store
const dailyStats = computed(() => {
  const data = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    const dayRecord = store.dailyRecords?.[dateStr]
    data.push({
      date: dateStr,
      count: dayRecord?.count ?? 0,
      correct: dayRecord?.correct ?? 0,
    })
  }
  return data
})

// Check-in data from store
const checkInData = computed(() => {
  const data = []
  for (let i = 13; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    const dayRecord = store.dailyRecords?.[dateStr]
    const count = dayRecord?.count ?? 0
    
    data.push({
      date: dateStr,
      completed: count > 0,
      count: count,
    })
  }
  return data
})

function handleExport() {
  const json = store.exportData()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `quiz-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('数据已导出')
}

function triggerImport() { fileInput.value?.click() }

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      store.importData(reader.result as string)
      toast.success('数据导入成功')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '导入失败')
    }
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

function handleReset() {
  if (confirm('确定要重置所有学习数据吗？此操作不可撤销。')) {
    store.resetAll()
    toast.success('数据已重置')
  }
}
</script>
