/**
 * Unit Tests: QuestionEngine
 * 题库引擎模块 - 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { QuestionEngine, ALL_QUESTIONS } from '@/data/question-bank'
import { CATEGORIES, DIFFICULTY_MAP } from '@/config/categories'

describe('QuestionEngine', () => {
  describe('CATEGORIES', () => {
    it('should have 10 categories', () => {
      expect(CATEGORIES).toHaveLength(10)
    })

    it('each category should have required fields', () => {
      CATEGORIES.forEach(cat => {
        expect(cat).toHaveProperty('id')
        expect(cat).toHaveProperty('name')
        expect(cat).toHaveProperty('icon')
        expect(cat).toHaveProperty('color')
        expect(cat.id).toBeTruthy()
        expect(cat.name).toBeTruthy()
      })
    })

    it('category ids should be unique', () => {
      const ids = CATEGORIES.map(c => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('DIFFICULTY_MAP', () => {
    it('should have 3 difficulty levels', () => {
      expect(Object.keys(DIFFICULTY_MAP)).toHaveLength(3)
    })

    it('should include easy, medium, hard', () => {
      expect(DIFFICULTY_MAP).toHaveProperty('easy')
      expect(DIFFICULTY_MAP).toHaveProperty('medium')
      expect(DIFFICULTY_MAP).toHaveProperty('hard')
    })
  })

  describe('ALL_QUESTIONS', () => {
    it('should have 4500 questions', () => {
      expect(ALL_QUESTIONS).toHaveLength(4500)
    })

    it('each question should have valid structure', () => {
      ALL_QUESTIONS.forEach(q => {
        expect(q).toHaveProperty('id')
        expect(q).toHaveProperty('cat')
        expect(q).toHaveProperty('diff')
        expect(q).toHaveProperty('type')
        expect(q).toHaveProperty('q')
        expect(q).toHaveProperty('opts')
        expect(q).toHaveProperty('ans')
        expect(q).toHaveProperty('exp')
        expect(q.opts).toBeInstanceOf(Array)
        expect(q.opts.length).toBeGreaterThanOrEqual(2)
        expect(q.ans).toBeGreaterThanOrEqual(0)
        expect(q.ans).toBeLessThan(q.opts.length)
        expect(['easy', 'medium', 'hard']).toContain(q.diff)
        expect(['choice', 'truefalse']).toContain(q.type)
      })
    })

    it('question ids should be unique', () => {
      const ids = ALL_QUESTIONS.map(q => q.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('each question should reference a valid category', () => {
      const catIds = CATEGORIES.map(c => c.id)
      ALL_QUESTIONS.forEach(q => {
        expect(catIds).toContain(q.cat)
      })
    })

    it('should have both choice and truefalse types', () => {
      const types = new Set(ALL_QUESTIONS.map(q => q.type))
      expect(types).toContain('choice')
      expect(types).toContain('truefalse')
    })

    it('truefalse questions should have exactly 2 options', () => {
      ALL_QUESTIONS.filter(q => q.type === 'truefalse').forEach(q => {
        expect(q.opts).toHaveLength(2)
        expect(q.opts).toContain('正确')
        expect(q.opts).toContain('错误')
      })
    })

    it('choice questions should have exactly 4 options', () => {
      ALL_QUESTIONS.filter(q => q.type === 'choice').forEach(q => {
        expect(q.opts).toHaveLength(4)
      })
    })
  })

  describe('filter()', () => {
    it('should return all questions with no filters', () => {
      const result = QuestionEngine.filter()
      expect(result).toHaveLength(4500)
    })

    it('should filter by category', () => {
      const ml = QuestionEngine.filter({ category: 'ml' })
      expect(ml.length).toBeGreaterThan(0)
      ml.forEach(q => expect(q.cat).toBe('ml'))
    })

    it('should filter by difficulty', () => {
      const easy = QuestionEngine.filter({ difficulty: 'easy' })
      expect(easy.length).toBeGreaterThan(0)
      easy.forEach(q => expect(q.diff).toBe('easy'))
    })

    it('should filter by type', () => {
      const tf = QuestionEngine.filter({ type: 'truefalse' })
      expect(tf.length).toBeGreaterThan(0)
      tf.forEach(q => expect(q.type).toBe('truefalse'))
    })

    it('should filter by both category and difficulty', () => {
      const result = QuestionEngine.filter({ category: 'ml', difficulty: 'easy' })
      result.forEach(q => {
        expect(q.cat).toBe('ml')
        expect(q.diff).toBe('easy')
      })
    })

    it('should filter by category and type', () => {
      const result = QuestionEngine.filter({ category: 'python', type: 'choice' })
      result.forEach(q => {
        expect(q.cat).toBe('python')
        expect(q.type).toBe('choice')
      })
    })

    it('should return empty for non-existent category', () => {
      const result = QuestionEngine.filter({ category: 'nonexistent' })
      expect(result).toHaveLength(0)
    })
  })

  describe('randomPick()', () => {
    it('should return specified count of questions', () => {
      const result = QuestionEngine.randomPick(5)
      expect(result).toHaveLength(5)
    })

    it('should not exceed available questions', () => {
      const result = QuestionEngine.randomPick(9999, { category: 'cv' })
      expect(result.length).toBeLessThanOrEqual(425)
    })

    it('should return all questions when count is 0', () => {
      const result = QuestionEngine.randomPick(0)
      expect(result).toHaveLength(4500)
    })

    it('should respect category filter', () => {
      const result = QuestionEngine.randomPick(10, { category: 'python' })
      result.forEach(q => expect(q.cat).toBe('python'))
    })

    it('should respect type filter', () => {
      const result = QuestionEngine.randomPick(10, { type: 'truefalse' })
      result.forEach(q => expect(q.type).toBe('truefalse'))
    })

    it('should return random order (probabilistic test)', () => {
      const r1 = QuestionEngine.randomPick(20).map(q => q.id)
      const r2 = QuestionEngine.randomPick(20).map(q => q.id)
      // Very unlikely to get same order twice
      expect(r1).not.toEqual(r2)
    })
  })

  describe('getWrongQuestions()', () => {
    it('should return questions marked as wrong', () => {
      const records = { 1: 'correct', 2: 'wrong', 3: 'wrong' }
      const wrong = QuestionEngine.getWrongQuestions(records)
      expect(wrong).toHaveLength(2)
      expect(wrong.map(q => q.id)).toContain(2)
      expect(wrong.map(q => q.id)).toContain(3)
    })

    it('should return empty for no wrong answers', () => {
      const records = { 1: 'correct', 2: 'correct' }
      const wrong = QuestionEngine.getWrongQuestions(records)
      expect(wrong).toHaveLength(0)
    })
  })

  describe('search()', () => {
    it('should return all questions for empty keyword', () => {
      expect(QuestionEngine.search('')).toHaveLength(4500)
      expect(QuestionEngine.search('  ')).toHaveLength(4500)
    })

    it('should search in question text', () => {
      const result = QuestionEngine.search('二分查找')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should search in explanation', () => {
      const result = QuestionEngine.search('面试')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should be case-insensitive', () => {
      const r1 = QuestionEngine.search('tcp')
      const r2 = QuestionEngine.search('TCP')
      expect(r1).toHaveLength(r2.length)
    })

    it('should return empty for non-matching keyword', () => {
      const result = QuestionEngine.search('xyznonexistent12345')
      expect(result).toHaveLength(0)
    })
  })

  describe('getCategoryStats()', () => {
    it('should return correct stats for a category', () => {
      const records = { 22: 'correct', 24: 'wrong' }
      const stats = QuestionEngine.getCategoryStats('ai_basic', records)
      expect(stats.total).toBe(249)
      expect(stats.done).toBe(2)  // id 22,24 属于 ai_basic
      expect(stats.correct).toBe(1)
      expect(stats.wrong).toBe(1)
      expect(stats.accuracy).toBe(50)
    })

    it('should return zeros for empty records', () => {
      const stats = QuestionEngine.getCategoryStats('ml', {})
      expect(stats.done).toBe(0)
      expect(stats.correct).toBe(0)
      expect(stats.accuracy).toBe(0)
    })
  })

  describe('getGlobalStats()', () => {
    it('should return correct global stats', () => {
      const records = { 1: 'correct', 2: 'correct', 3: 'wrong' }
      const stats = QuestionEngine.getGlobalStats(records)
      expect(stats.total).toBe(4500)
      expect(stats.done).toBe(3)
      expect(stats.correct).toBe(2)
      expect(stats.wrong).toBe(1)
      expect(stats.accuracy).toBe(67) // Math.round(2/3*100)
    })

    it('should return 0 accuracy for no records', () => {
      const stats = QuestionEngine.getGlobalStats({})
      expect(stats.done).toBe(0)
      expect(stats.accuracy).toBe(0)
    })
  })

  describe('getTypeStats()', () => {
    it('should return correct type counts', () => {
      const stats = QuestionEngine.getTypeStats()
      expect(stats.choice + stats.truefalse).toBe(4500)
      expect(stats.choice).toBeGreaterThan(0)
      expect(stats.truefalse).toBeGreaterThan(0)
    })
  })

  describe('shuffle()', () => {
    it('should return array of same length', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = QuestionEngine.shuffle([...arr])
      expect(shuffled).toHaveLength(5)
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle empty array', () => {
      expect(QuestionEngine.shuffle([])).toEqual([])
    })

    it('should handle single element', () => {
      expect(QuestionEngine.shuffle([1])).toEqual([1])
    })
  })

  describe('exportData() / importData()', () => {
    it('should export and import data correctly', () => {
      const records = { 1: 'correct', 2: 'wrong' }
      const bookmarks = new Set([1, 3])
      const json = QuestionEngine.exportData(records, bookmarks)
      const parsed = JSON.parse(json)
      expect(parsed.version).toBe(2)
      expect(parsed.records).toEqual(records)
      expect(parsed.bookmarks).toEqual([1, 3])
      expect(parsed.exportedAt).toBeTruthy()

      const imported = QuestionEngine.importData(json)
      expect(imported.records).toEqual(records)
      expect(imported.bookmarks).toEqual(bookmarks)
    })

    it('should throw on invalid import data', () => {
      expect(() => QuestionEngine.importData('not json')).toThrow()
      expect(() => QuestionEngine.importData('{}')).toThrow()
      expect(() => QuestionEngine.importData('{"version":1}')).toThrow()
    })
  })
})
