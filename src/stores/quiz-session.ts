/**
 * Module: Quiz Session Store
 * 刷题会话管理 - 产品化模块
 * Orchestrates records, bookmarks, and spaced repetition stores
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question, QuizSession, QuizConfig } from '@/types'
import { QuestionEngine } from '@/data/question-bank'
import { useRecordsStore } from './records'
import { useBookmarksStore } from './bookmarks'
import { useSpacedRepetitionStore } from './spaced-repetition'

export const useQuizStore = defineStore('quiz', () => {
  const session = ref<QuizSession | null>(null)

  // Delegate to specialized stores
  const recordsStore = useRecordsStore()
  const bookmarksStore = useBookmarksStore()
  const spacedStore = useSpacedRepetitionStore()

  // Re-export for backward compatibility
  const records = computed(() => recordsStore.records)
  const bookmarks = computed(() => bookmarksStore.bookmarks)
  const dailyRecords = computed(() => recordsStore.dailyRecords)
  const globalStats = computed(() => recordsStore.globalStats)
  const categoryStats = computed(() => recordsStore.categoryStats)
  const wrongQuestionIds = computed(() => recordsStore.wrongQuestionIds)
  const bookmarkedQuestions = computed(() => bookmarksStore.bookmarkedQuestions)
  const dueReviewIds = computed(() => spacedStore.dueReviewIds)
  const spacedRepetitionStats = computed(() => spacedStore.stats)
  const spacedRepetition = computed(() => spacedStore.cards)

  function startSession(questions: Question[], config: QuizConfig = { category: 'all', count: 10, difficulty: 'all', timer: false }) {
    session.value = { questions, current: 0, score: 0, answered: false, results: [], config }
  }

  function answerCurrent(selectedIdx: number, responseTime?: number): { isCorrect: boolean; correctIdx: number } | null {
    if (!session.value || session.value.answered) return null
    const q = session.value.questions[session.value.current]
    const isCorrect = selectedIdx === q.ans
    session.value.answered = true
    session.value.score += isCorrect ? 1 : 0
    session.value.results.push({ questionId: q.id, correct: isCorrect })
    recordsStore.recordAnswer(q.id, isCorrect, responseTime)
    spacedStore.recordReview(q.id, isCorrect, responseTime)
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

  function recordAnswer(questionId: number, isCorrect: boolean, responseTime?: number) {
    recordsStore.recordAnswer(questionId, isCorrect, responseTime)
    spacedStore.recordReview(questionId, isCorrect, responseTime)
  }

  function toggleBookmark(questionId: number) {
    bookmarksStore.toggleBookmark(questionId)
  }

  function isBookmarked(questionId: number): boolean {
    return bookmarksStore.isBookmarked(questionId)
  }

  function resetAll() {
    endSession()
    recordsStore.reset()
    bookmarksStore.reset()
    spacedStore.reset()
  }

  function exportData(): string {
    return QuestionEngine.exportData(recordsStore.records, bookmarksStore.bookmarks, spacedStore.cards)
  }

  function importData(jsonStr: string) {
    const data = QuestionEngine.importData(jsonStr)
    recordsStore.records = data.records
    bookmarksStore.bookmarks = data.bookmarks
    if (data.spacedRepetition) spacedStore.cards = data.spacedRepetition
    recordsStore.save()
    bookmarksStore.save()
    spacedStore.save()
  }

  return {
    session,
    records, bookmarks, spacedRepetition, dailyRecords,
    globalStats, categoryStats, wrongQuestionIds,
    bookmarkedQuestions, dueReviewIds, spacedRepetitionStats,
    recordAnswer, toggleBookmark, isBookmarked,
    startSession, answerCurrent, nextQuestion, endSession,
    resetAll, exportData, importData,
  }
})
