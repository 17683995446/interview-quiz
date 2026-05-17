/**
 * Integration Tests: Quiz Session Store
 * 状态管理模块 - 集成测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '@/stores/quiz-session'
import { QuestionEngine } from '@/data/question-bank'

describe('useQuizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should have empty records and bookmarks', () => {
      const store = useQuizStore()
      expect(store.globalStats.done).toBe(0)
      expect(store.globalStats.correct).toBe(0)
      expect(store.bookmarks.size).toBe(0)
      expect(store.session).toBeNull()
    })
  })

  describe('recordAnswer', () => {
    it('should record correct answer', () => {
      const store = useQuizStore()
      store.recordAnswer(1, true)
      expect(store.records[1]).toBe('correct')
      expect(store.globalStats.correct).toBe(1)
      expect(store.globalStats.done).toBe(1)
      expect(store.globalStats.accuracy).toBe(100)
    })

    it('should record wrong answer', () => {
      const store = useQuizStore()
      store.recordAnswer(1, false)
      expect(store.records[1]).toBe('wrong')
      expect(store.globalStats.wrong).toBe(1)
      expect(store.globalStats.accuracy).toBe(0)
    })

    it('should update existing record', () => {
      const store = useQuizStore()
      store.recordAnswer(1, false)
      store.recordAnswer(1, true)
      expect(store.records[1]).toBe('correct')
      expect(store.globalStats.correct).toBe(1)
    })
  })

  describe('toggleBookmark', () => {
    it('should add bookmark', () => {
      const store = useQuizStore()
      store.toggleBookmark(1)
      expect(store.isBookmarked(1)).toBe(true)
      expect(store.bookmarks.size).toBe(1)
    })

    it('should remove bookmark', () => {
      const store = useQuizStore()
      store.toggleBookmark(1)
      store.toggleBookmark(1)
      expect(store.isBookmarked(1)).toBe(false)
      expect(store.bookmarks.size).toBe(0)
    })

    it('should persist bookmarks', () => {
      const store = useQuizStore()
      store.toggleBookmark(1)
      store.toggleBookmark(2)
      // Create new store instance (simulates page reload)
      const store2 = useQuizStore()
      expect(store2.isBookmarked(1)).toBe(true)
      expect(store2.isBookmarked(2)).toBe(true)
    })
  })

  describe('quiz session', () => {
    it('should start session with questions', () => {
      const store = useQuizStore()
      const questions = QuestionEngine.randomPick(3)
      store.startSession(questions, { category: 'ml' })
      expect(store.session).not.toBeNull()
      expect(store.session.questions).toHaveLength(3)
      expect(store.session.current).toBe(0)
      expect(store.session.score).toBe(0)
    })

    it('should answer current question', () => {
      const store = useQuizStore()
      const q = QuestionEngine.filter({ category: 'ai_basic' })[0]
      store.startSession([q])
      const result = store.answerCurrent(q.ans)
      expect(result.isCorrect).toBe(true)
      expect(store.session.score).toBe(1)
      expect(store.session.answered).toBe(true)
    })

    it('should record wrong answer in session', () => {
      const store = useQuizStore()
      const q = QuestionEngine.filter({ category: 'ai_basic' })[0]
      store.startSession([q])
      const wrongIdx = q.ans === 0 ? 1 : 0
      const result = store.answerCurrent(wrongIdx)
      expect(result.isCorrect).toBe(false)
      expect(store.session.score).toBe(0)
    })

    it('should move to next question', () => {
      const store = useQuizStore()
      const questions = QuestionEngine.randomPick(3)
      store.startSession(questions)
      store.answerCurrent(questions[0].ans)
      const hasMore = store.nextQuestion()
      expect(hasMore).toBe(true)
      expect(store.session.current).toBe(1)
      expect(store.session.answered).toBe(false)
    })

    it('should return false when no more questions', () => {
      const store = useQuizStore()
      const q = QuestionEngine.randomPick(1)[0]
      store.startSession([q])
      store.answerCurrent(q.ans)
      const hasMore = store.nextQuestion()
      expect(hasMore).toBe(false)
    })

    it('should not answer twice', () => {
      const store = useQuizStore()
      const q = QuestionEngine.randomPick(1)[0]
      store.startSession([q])
      store.answerCurrent(q.ans)
      const result = store.answerCurrent(q.ans)
      expect(result).toBeNull()
    })
  })

  describe('endSession', () => {
    it('should clear session', () => {
      const store = useQuizStore()
      store.startSession(QuestionEngine.randomPick(3))
      store.endSession()
      expect(store.session).toBeNull()
    })
  })

  describe('resetAll', () => {
    it('should clear everything', () => {
      const store = useQuizStore()
      store.recordAnswer(1, true)
      store.toggleBookmark(1)
      store.startSession(QuestionEngine.randomPick(3))
      store.resetAll()
      expect(store.globalStats.done).toBe(0)
      expect(store.bookmarks.size).toBe(0)
      expect(store.session).toBeNull()
    })
  })

  describe('exportData / importData', () => {
    it('should export and import correctly', () => {
      const store = useQuizStore()
      store.recordAnswer(1, true)
      store.recordAnswer(2, false)
      store.toggleBookmark(1)

      const json = store.exportData()
      store.resetAll()
      expect(store.globalStats.done).toBe(0)

      store.importData(json)
      expect(store.records[1]).toBe('correct')
      expect(store.records[2]).toBe('wrong')
      expect(store.isBookmarked(1)).toBe(true)
    })
  })

  describe('computed properties', () => {
    it('wrongQuestionIds should return correct ids', () => {
      const store = useQuizStore()
      store.recordAnswer(1, true)
      store.recordAnswer(2, false)
      store.recordAnswer(3, false)
      expect(store.wrongQuestionIds).toEqual([2, 3])
    })

    it('categoryStats should have all categories', () => {
      const store = useQuizStore()
      const stats = store.categoryStats
      expect(Object.keys(stats)).toHaveLength(10)
      // Verify each category has correct total
      expect(stats.ai_basic.total).toBe(249)
      expect(stats.ml.total).toBe(428)
      expect(stats.algorithm.total).toBe(704)
    })

    it('bookmarkedQuestions should return question objects', () => {
      const store = useQuizStore()
      store.toggleBookmark(1)
      expect(store.bookmarkedQuestions).toHaveLength(1)
      expect(store.bookmarkedQuestions[0].id).toBe(1)
    })
  })
})
