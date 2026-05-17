/**
 * Module: Records Store
 * 答题记录管理 - 产品化模块
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Records, CategoryId, CategoryStats, GlobalStats } from '@/types'
import { QuestionEngine } from '@/data/question-bank'
import { storage } from '@/services/local-storage'

export const useRecordsStore = defineStore('records', () => {
  const records = ref<Records>(storage.get<Records>('records') ?? {})

  // Daily learning records
  const dailyRecords = ref<Record<string, { count: number; correct: number }>>(
    storage.get<Record<string, { count: number; correct: number }>>('dailyRecords') ?? {}
  )

  const globalStats = computed<GlobalStats>(() =>
    QuestionEngine.getGlobalStats(records.value)
  )

  const categoryStats = computed<Record<CategoryId, CategoryStats>>(() => {
    const stats = {} as Record<CategoryId, CategoryStats>
    const categories: CategoryId[] = [
      'ai_basic', 'ml', 'dl', 'nlp', 'cv',
      'algorithm', 'network', 'os', 'database', 'python',
    ]
    for (const cat of categories) {
      stats[cat] = QuestionEngine.getCategoryStats(cat, records.value)
    }
    return stats
  })

  const wrongQuestionIds = computed<number[]>(() =>
    Object.entries(records.value)
      .filter(([, v]) => v === 'wrong')
      .map(([k]) => parseInt(k))
  )

  function recordAnswer(questionId: number, isCorrect: boolean, responseTime?: number) {
    records.value[questionId] = isCorrect ? 'correct' : 'wrong'

    // Record daily stats (local timezone)
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    if (!dailyRecords.value[today]) {
      dailyRecords.value[today] = { count: 0, correct: 0 }
    }
    dailyRecords.value[today].count++
    if (isCorrect) dailyRecords.value[today].correct++

    save()
  }

  function save() {
    storage.set('records', records.value)
    storage.set('dailyRecords', dailyRecords.value)
  }

  function reset() {
    records.value = {}
    dailyRecords.value = {}
    save()
  }

  function exportRecords() {
    return JSON.stringify({ records: records.value, dailyRecords: dailyRecords.value })
  }

  function importRecords(jsonStr: string) {
    try {
      const data = JSON.parse(jsonStr)
      if (data.records) records.value = data.records
      if (data.dailyRecords) dailyRecords.value = data.dailyRecords
      save()
    } catch {
      throw new Error('导入数据格式错误')
    }
  }

  return {
    records, dailyRecords, globalStats, categoryStats, wrongQuestionIds,
    recordAnswer, save, reset, exportRecords, importRecords,
  }
})
