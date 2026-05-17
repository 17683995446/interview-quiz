/**
 * Module: Pinia Store - Quiz Session
 * 刷题状态管理 - 独立状态模块
 *
 * Responsibilities:
 * - 管理答题记录、收藏、刷题会话
 * - 间隔重复算法集成
 * - 持久化到 localStorage
 * - 提供计算属性（统计、进度）
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Records,
  Bookmarks,
  QuizSession,
  QuizConfig,
  Question,
  SpacedRepetitionCard,
  GlobalStats,
  CategoryStats,
  CategoryId,
} from '@/types'
import { QuestionEngine } from '@/data/question-bank'
import { storage } from '@/services/local-storage'
import {
  calculateQuality,
  calculateNextReview,
  createCard,
  getDueReviews,
  getReviewStats,
} from '@/services/spaced-repetition'

export const useQuizStore = defineStore('quiz', () => {
  // ===== State =====
  const records = ref<Records>(storage.get<Records>('records') ?? {})
  const bookmarks = ref<Bookmarks>(new Set(storage.get<number[]>('bookmarks') ?? []))
  const spacedRepetition = ref<SpacedRepetitionCard[]>(storage.get<SpacedRepetitionCard[]>('spacedRepetition') ?? [])

  // Daily learning records: { [dateStr]: { count, correct } }
  const dailyRecords = ref<Record<string, { count: number; correct: number }>>(
    storage.get<Record<string, { count: number; correct: number }>>('dailyRecords') ?? {}
  )

  // Quiz session state
  const session = ref<QuizSession | null>(null)

  // ===== Getters =====
  const globalStats = computed<GlobalStats>(() =>
    QuestionEngine.getGlobalStats(records.value)
  )

  const categoryStats = computed<Record<CategoryId, CategoryStats>>(() => {
    const stats = {} as Record<CategoryId, CategoryStats>
    const categories: CategoryId[] = [
      'ai_basic',
      'ml',
      'dl',
      'nlp',
      'cv',
      'algorithm',
      'network',
      'os',
      'database',
      'python',
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

  const bookmarkedQuestions = computed<Question[]>(() =>
    bookmarks.value.size > 0
      ? [...bookmarks.value]
          .map((id) => QuestionEngine.getById(id))
          .filter((q): q is Question => q !== undefined)
      : []
  )

  /** 今日需要复习的题目 */
  const dueReviewIds = computed<number[]>(() =>
    getDueReviews(spacedRepetition.value)
  )

  /** 间隔重复统计 */
  const spacedRepetitionStats = computed(() =>
    getReviewStats(spacedRepetition.value)
  )

  // ===== Actions =====
  function save() {
    storage.set('records', records.value)
    storage.set('bookmarks', [...bookmarks.value])
    storage.set('spacedRepetition', spacedRepetition.value)
    storage.set('dailyRecords', dailyRecords.value)
  }

  function recordAnswer(questionId: number, isCorrect: boolean, responseTime?: number) {
    records.value[questionId] = isCorrect ? 'correct' : 'wrong'

    // 记录每日学习数据（使用本地时区避免UTC偏移）
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    if (!dailyRecords.value[today]) {
      dailyRecords.value[today] = { count: 0, correct: 0 }
    }
    dailyRecords.value[today].count++
    if (isCorrect) {
      dailyRecords.value[today].correct++
    }

    // 更新间隔重复数据
    const quality = calculateQuality(isCorrect, responseTime)
    const existingIndex = spacedRepetition.value.findIndex(
      (c) => c.questionId === questionId
    )

    if (existingIndex >= 0) {
      spacedRepetition.value[existingIndex] = calculateNextReview(
        spacedRepetition.value[existingIndex],
        quality
      )
    } else {
      const newCard = createCard(questionId)
      spacedRepetition.value.push(calculateNextReview(newCard, quality))
    }

    save()
  }

  function toggleBookmark(questionId: number) {
    if (bookmarks.value.has(questionId)) {
      bookmarks.value.delete(questionId)
    } else {
      bookmarks.value.add(questionId)
    }
    // Trigger reactivity
    bookmarks.value = new Set(bookmarks.value)
    save()
  }

  function isBookmarked(questionId: number): boolean {
    return bookmarks.value.has(questionId)
  }

  function startSession(questions: Question[], config: QuizConfig = { category: 'all', count: 10, difficulty: 'all', timer: false }) {
    session.value = {
      questions,
      current: 0,
      score: 0,
      answered: false,
      results: [],
      config,
    }
  }

  function answerCurrent(selectedIdx: number, responseTime?: number): { isCorrect: boolean; correctIdx: number } | null {
    if (!session.value || session.value.answered) return null
    const q = session.value.questions[session.value.current]
    const isCorrect = selectedIdx === q.ans
    session.value.answered = true
    session.value.score += isCorrect ? 1 : 0
    session.value.results.push({ questionId: q.id, correct: isCorrect })
    recordAnswer(q.id, isCorrect, responseTime)
    return { isCorrect, correctIdx: q.ans }
  }

  function nextQuestion(): boolean {
    if (!session.value) return false
    session.value.current++
    session.value.answered = false
    if (session.value.current >= session.value.questions.length) {
      return false // quiz finished
    }
    return true
  }

  function endSession() {
    session.value = null
  }

  function resetAll() {
    records.value = {}
    bookmarks.value = new Set()
    spacedRepetition.value = []
    dailyRecords.value = {}
    session.value = null
    save()
  }

  function exportData(): string {
    return QuestionEngine.exportData(records.value, bookmarks.value, spacedRepetition.value)
  }

  function importData(jsonStr: string) {
    const data = QuestionEngine.importData(jsonStr)
    records.value = data.records
    bookmarks.value = data.bookmarks
    if (data.spacedRepetition) {
      spacedRepetition.value = data.spacedRepetition
    }
    save()
  }

  return {
    records,
    bookmarks,
    spacedRepetition,
    dailyRecords,
    session,
    globalStats,
    categoryStats,
    wrongQuestionIds,
    bookmarkedQuestions,
    dueReviewIds,
    spacedRepetitionStats,
    recordAnswer,
    toggleBookmark,
    isBookmarked,
    startSession,
    answerCurrent,
    nextQuestion,
    endSession,
    resetAll,
    exportData,
    importData,
  }
})
