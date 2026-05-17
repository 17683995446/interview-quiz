/**
 * Module: Spaced Repetition Store
 * 间隔重复管理 - 产品化模块
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SpacedRepetitionCard } from '@/types'
import { storage } from '@/services/local-storage'
import {
  calculateQuality,
  calculateNextReview,
  createCard,
  getDueReviews,
  getReviewStats,
} from '@/services/spaced-repetition'

export const useSpacedRepetitionStore = defineStore('spacedRepetition', () => {
  const cards = ref<SpacedRepetitionCard[]>(
    storage.get<SpacedRepetitionCard[]>('spacedRepetition') ?? []
  )

  const dueReviewIds = computed<number[]>(() => getDueReviews(cards.value))

  const stats = computed(() => getReviewStats(cards.value))

  function recordReview(questionId: number, isCorrect: boolean, responseTime?: number) {
    const quality = calculateQuality(isCorrect, responseTime)
    const existingIndex = cards.value.findIndex(c => c.questionId === questionId)

    if (existingIndex >= 0) {
      cards.value[existingIndex] = calculateNextReview(cards.value[existingIndex], quality)
    } else {
      const newCard = createCard(questionId)
      cards.value.push(calculateNextReview(newCard, quality))
    }

    save()
  }

  function save() {
    storage.set('spacedRepetition', cards.value)
  }

  function reset() {
    cards.value = []
    save()
  }

  function exportData() {
    return JSON.stringify(cards.value)
  }

  function importData(jsonStr: string) {
    try {
      const data = JSON.parse(jsonStr)
      if (Array.isArray(data)) cards.value = data
      save()
    } catch {
      throw new Error('导入间隔重复数据格式错误')
    }
  }

  return {
    cards, dueReviewIds, stats,
    recordReview, save, reset, exportData, importData,
  }
})
