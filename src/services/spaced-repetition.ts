/**
 * Spaced Repetition Service (SM-2 Algorithm)
 * 间隔重复服务 - 基于 SuperMemo-2 算法
 *
 * 开源实现参考：
 * - https://github.com/lo-tp/sm2-plus
 * - https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

import type { SpacedRepetitionCard } from '@/types'

/** 默认简易度因子 */
const DEFAULT_EASE_FACTOR = 2.5

/** 最小简易度因子 */
const MIN_EASE_FACTOR = 1.3

/**
 * 复习质量评级
 * 0-5: 完全不会 -> 完全掌握
 */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5

/**
 * 根据答题结果计算复习质量
 * @param isCorrect 是否答对
 * @param responseTime 响应时间（毫秒）
 */
export function calculateQuality(isCorrect: boolean, responseTime?: number): Quality {
  if (!isCorrect) return 0
  if (!responseTime) return 4
  // 根据响应时间调整质量
  if (responseTime < 3000) return 5 // 3秒内：完美
  if (responseTime < 8000) return 4 // 8秒内：良好
  if (responseTime < 15000) return 3 // 15秒内：及格
  return 2 // 超过15秒：勉强
}

/**
 * SM-2 核心算法
 * 计算下一次复习间隔
 */
export function calculateNextReview(
  card: SpacedRepetitionCard,
  quality: Quality
): SpacedRepetitionCard {
  const now = new Date()
  const newCard = { ...card }

  // 质量小于3：重置重复次数、间隔和简易度因子
  if (quality < 3) {
    newCard.repetitions = 0
    newCard.interval = 1
    newCard.easeFactor = DEFAULT_EASE_FACTOR
  } else {
    // 更新重复次数
    newCard.repetitions += 1

    // 计算新间隔
    if (newCard.repetitions === 1) {
      newCard.interval = 1
    } else if (newCard.repetitions === 2) {
      newCard.interval = 6
    } else {
      newCard.interval = Math.round(newCard.interval * newCard.easeFactor)
    }
  }

  // 更新简易度因子
  newCard.easeFactor = Math.max(
    MIN_EASE_FACTOR,
    newCard.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  // 更新日期
  newCard.lastReviewDate = now.toISOString()
  const nextDate = new Date(now)
  nextDate.setDate(nextDate.getDate() + newCard.interval)
  newCard.nextReviewDate = nextDate.toISOString()

  return newCard
}

/**
 * 创建新卡片
 */
export function createCard(questionId: number): SpacedRepetitionCard {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return {
    questionId,
    interval: 1,
    repetitions: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    nextReviewDate: tomorrow.toISOString(),
  }
}

/**
 * 获取今日需要复习的题目ID列表
 */
export function getDueReviews(cards: SpacedRepetitionCard[]): number[] {
  const now = new Date()
  return cards
    .filter(card => new Date(card.nextReviewDate) <= now)
    .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
    .map(card => card.questionId)
}

/**
 * 获取学习统计
 */
export function getReviewStats(cards: SpacedRepetitionCard[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dueToday = cards.filter(c => new Date(c.nextReviewDate) < tomorrow)
  const newCards = cards.filter(c => c.repetitions === 0)
  const matureCards = cards.filter(c => c.repetitions >= 2)

  return {
    total: cards.length,
    dueToday: dueToday.length,
    newCards: newCards.length,
    matureCards: matureCards.length,
    averageEase: cards.length > 0
      ? cards.reduce((sum, c) => sum + c.easeFactor, 0) / cards.length
      : 0,
  }
}
