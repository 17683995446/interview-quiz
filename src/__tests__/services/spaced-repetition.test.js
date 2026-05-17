/**
 * Unit Tests: Spaced Repetition (SM-2 Algorithm)
 * 间隔重复算法 - 单元测试
 */
import { describe, it, expect } from 'vitest'
import {
  calculateQuality,
  calculateNextReview,
  createCard,
  getDueReviews,
  getReviewStats,
} from '@/services/spaced-repetition'

describe('spaced-repetition', () => {
  describe('calculateQuality', () => {
    it('should return 0 for incorrect response', () => {
      expect(calculateQuality(false)).toBe(0)
      expect(calculateQuality(false, 5000)).toBe(0)
    })

    it('should return 4 for correct without response time', () => {
      expect(calculateQuality(true)).toBe(4)
    })

    it('should return 5 for fast correct response (<3s)', () => {
      expect(calculateQuality(true, 2000)).toBe(5)
    })

    it('should return 4 for medium correct response (<8s)', () => {
      expect(calculateQuality(true, 5000)).toBe(4)
    })

    it('should return 3 for slow correct response (<15s)', () => {
      expect(calculateQuality(true, 10000)).toBe(3)
    })

    it('should return 2 for very slow correct response (>15s)', () => {
      expect(calculateQuality(true, 20000)).toBe(2)
    })
  })

  describe('calculateNextReview', () => {
    it('should calculate first review interval as 1 day for quality >= 3', () => {
      const card = createCard(1)
      const updated = calculateNextReview(card, 4)
      expect(updated.interval).toBe(1)
      expect(updated.repetitions).toBe(1)
      expect(updated.easeFactor).toBeCloseTo(2.5)
      expect(updated.nextReviewDate).toBeTruthy()
      expect(updated.lastReviewDate).toBeTruthy()
    })

    it('should reset card for quality < 3', () => {
      const card = createCard(1)
      card.repetitions = 3
      card.interval = 10
      const updated = calculateNextReview(card, 0)
      expect(updated.repetitions).toBe(0)
      expect(updated.interval).toBe(1)
    })

    it('should increase interval for consecutive good reviews', () => {
      let card = createCard(1)
      card = calculateNextReview(card, 4)
      expect(card.interval).toBe(1)
      card = calculateNextReview(card, 4)
      expect(card.interval).toBe(6)
      card = calculateNextReview(card, 4)
      // Third review: interval = 6 * easeFactor (easeFactor changes each review)
      expect(card.interval).toBeGreaterThan(6)
    })

    it('should decrease ease factor for quality 3', () => {
      const card = createCard(1)
      card.easeFactor = 2.5
      const updated = calculateNextReview(card, 3)
      expect(updated.easeFactor).toBeLessThan(2.5)
    })

    it('should increase ease factor for quality 5', () => {
      const card = createCard(1)
      card.easeFactor = 2.5
      const updated = calculateNextReview(card, 5)
      expect(updated.easeFactor).toBeGreaterThan(2.5)
    })

    it('should not let ease factor go below 1.3', () => {
      const card = createCard(1)
      card.easeFactor = 1.3
      const updated = calculateNextReview(card, 0)
      expect(updated.easeFactor).toBeGreaterThanOrEqual(1.3)
    })
  })

  describe('createCard', () => {
    it('should create a card with default values', () => {
      const card = createCard(42)
      expect(card.questionId).toBe(42)
      expect(card.repetitions).toBe(0)
      expect(card.interval).toBe(1)
      expect(card.easeFactor).toBe(2.5)
      expect(card.nextReviewDate).toBeTruthy()
    })
  })

  describe('getDueReviews', () => {
    it('should return question IDs of cards that are due for review', () => {
      const now = new Date()
      const pastDate = new Date(now.getTime() - 1000).toISOString()
      const futureDate = new Date(now.getTime() + 86400000).toISOString()

      const cards = [
        { ...createCard(1), nextReviewDate: pastDate },
        { ...createCard(2), nextReviewDate: futureDate },
        { ...createCard(3), nextReviewDate: now.toISOString() },
      ]
      const due = getDueReviews(cards)
      expect(due).toHaveLength(2)
      expect(due).toContain(1)
      expect(due).toContain(3)
    })

    it('should return empty array when no cards are due', () => {
      const cards = [createCard(1), createCard(2)]
      const due = getDueReviews(cards)
      expect(due).toHaveLength(0)
    })

    it('should return empty array for empty input', () => {
      expect(getDueReviews([])).toHaveLength(0)
    })
  })

  describe('getReviewStats', () => {
    it('should return correct stats', () => {
      const now = new Date()
      const pastDate = new Date(now.getTime() - 1000).toISOString()
      const futureDate = new Date(now.getTime() + 86400000).toISOString()

      const cards = [
        { ...createCard(1), nextReviewDate: pastDate, repetitions: 5 },
        { ...createCard(2), nextReviewDate: futureDate, repetitions: 3 },
        { ...createCard(3), nextReviewDate: pastDate, repetitions: 0 },
      ]
      const stats = getReviewStats(cards)
      expect(stats.total).toBe(3)
      expect(stats.dueToday).toBe(2)
      expect(stats.newCards).toBe(1)
      expect(stats.matureCards).toBe(2)
      expect(stats.averageEase).toBeCloseTo(2.5)
    })

    it('should handle empty cards array', () => {
      const stats = getReviewStats([])
      expect(stats.total).toBe(0)
      expect(stats.dueToday).toBe(0)
      expect(stats.newCards).toBe(0)
      expect(stats.matureCards).toBe(0)
      expect(stats.averageEase).toBe(0)
    })
  })
})
