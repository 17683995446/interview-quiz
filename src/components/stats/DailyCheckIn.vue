<script setup lang="ts">
/**
 * Component: DailyCheckIn
 * 每日学习打卡组件
 */
import { computed } from 'vue'

const props = defineProps<{
  checkInData: { date: string; completed: boolean; count: number }[]
}>()

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const recentDays = computed(() => {
  return props.checkInData.slice(-7)
})

const streak = computed(() => {
  let count = 0
  for (let i = props.checkInData.length - 1; i >= 0; i--) {
    if (props.checkInData[i].completed) {
      count++
    } else {
      break
    }
  }
  return count
})

const totalDays = computed(() => {
  return props.checkInData.filter(d => d.completed).length
})
</script>

<template>
  <div class="space-y-4">
    <!-- 统计信息 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-400">{{ streak }}</div>
          <div class="text-xs text-slate-400">连续打卡</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-emerald-400">{{ totalDays }}</div>
          <div class="text-xs text-slate-400">累计天数</div>
        </div>
      </div>
      <div v-if="streak >= 7" class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
        🔥 学习达人
      </div>
    </div>

    <!-- 打卡日历 -->
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in recentDays"
        :key="day.date"
        class="aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all"
        :class="[
          day.completed
            ? 'bg-primary-500/30 text-primary-400 border border-primary-500/50'
            : 'bg-slate-800/50 text-slate-500',
          index === recentDays.length - 1 ? 'ring-2 ring-primary-400' : '',
        ]"
      >
        <span class="text-[10px] opacity-70">{{ weekDays[new Date(day.date).getDay()] }}</span>
        <span class="font-semibold">{{ day.date.slice(8) }}</span>
        <span v-if="day.completed" class="text-[8px] mt-0.5">✓</span>
      </div>
    </div>

    <!-- 今日状态 -->
    <div
      v-if="recentDays.length > 0"
      class="p-3 rounded-lg text-center text-sm"
      :class="recentDays[recentDays.length - 1].completed
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        : 'bg-slate-800/50 text-slate-400'"
    >
      {{ recentDays[recentDays.length - 1].completed
        ? '🎉 今日已完成学习，继续保持！'
        : '📚 今日还未学习，开始刷题吧！' }}
    </div>
  </div>
</template>
