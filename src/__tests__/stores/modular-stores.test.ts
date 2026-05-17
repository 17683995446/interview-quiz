import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecordsStore } from '@/stores/records'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useSpacedRepetitionStore } from '@/stores/spaced-repetition'
import { useQuizStore } from '@/stores/quiz-session'
import { QuestionEngine } from '@/data/question-bank'

describe('Modular Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('useRecordsStore', () => {
    it('records answer correctly', () => {
      const store = useRecordsStore()
      store.recordAnswer(1, true)
      expect(store.records[1]).toBe('correct')
    })

    it('tracks daily records', () => {
      const store = useRecordsStore()
      store.recordAnswer(1, true)
      store.recordAnswer(2, false)
      const today = new Date()
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      expect(store.dailyRecords[dateStr].count).toBe(2)
      expect(store.dailyRecords[dateStr].correct).toBe(1)
    })

    it('resets all records', () => {
      const store = useRecordsStore()
      store.recordAnswer(1, true)
      store.reset()
      expect(Object.keys(store.records)).toHaveLength(0)
      expect(Object.keys(store.dailyRecords)).toHaveLength(0)
    })
  })

  describe('useBookmarksStore', () => {
    it('toggles bookmark', () => {
      const store = useBookmarksStore()
      store.toggleBookmark(1)
      expect(store.isBookmarked(1)).toBe(true)
      store.toggleBookmark(1)
      expect(store.isBookmarked(1)).toBe(false)
    })

    it('returns bookmarked questions', () => {
      const store = useBookmarksStore()
      store.toggleBookmark(1)
      expect(store.bookmarkedQuestions.length).toBeGreaterThan(0)
      expect(store.bookmarkedQuestions[0].id).toBe(1)
    })
  })

  describe('useSpacedRepetitionStore', () => {
    it('records review and creates card', () => {
      const store = useSpacedRepetitionStore()
      store.recordReview(1, true)
      expect(store.cards.length).toBe(1)
      expect(store.cards[0].questionId).toBe(1)
    })

    it('returns due review ids', () => {
      const store = useSpacedRepetitionStore()
      store.recordReview(1, true)
      // dueReviewIds is a computed ref; access it as a property on the store
      expect(Array.isArray(store.dueReviewIds)).toBe(true)
    })
  })

  describe('useQuizStore (backward compatibility)', () => {
    it('delegates to sub-stores', () => {
      const store = useQuizStore()
      store.toggleBookmark(1)
      expect(store.isBookmarked(1)).toBe(true)
    })

    it('startSession and answerCurrent work', () => {
      const store = useQuizStore()
      const questions = QuestionEngine.randomPick(1)
      store.startSession(questions)
      const result = store.answerCurrent(questions[0].ans)
      expect(result?.isCorrect).toBe(true)
      expect(store.session?.score).toBe(1)
    })
  })
})
