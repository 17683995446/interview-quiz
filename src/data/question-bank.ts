/**
 * Module: Question Bank Engine
 * 题库数据引擎 - 独立数据层模块
 *
 * Responsibilities:
 * - 提供查询、过滤、随机抽取等业务逻辑
 * - 数据导入/导出（JSON格式）
 * - 支持选择题和判断题两种题型
 */

import type {
  Question,
  QuestionType,
  Records,
  CategoryId,
  Difficulty,
  CategoryStats,
  GlobalStats,
  SpacedRepetitionCard,
  ExportData,
} from '@/types'
import { GENERATED_QUESTIONS } from '@/data/questions-generated'

// ===== All Questions =====
/** 所有题目的合并列表（5400题） */
export const ALL_QUESTIONS: Question[] = GENERATED_QUESTIONS

// ===== Query Engine =====
export class QuestionEngine {
  /**
   * 根据ID获取题目
   */
  static getById(id: number): Question | undefined {
    return ALL_QUESTIONS.find((q) => q.id === id)
  }

  /**
   * 按分类、难度和题型过滤题目
   */
  static filter({
    category = 'all',
    difficulty = 'all',
    type,
  }: {
    category?: CategoryId | 'all'
    difficulty?: Difficulty | 'all'
    type?: QuestionType | 'all'
  } = {}): Question[] {
    return ALL_QUESTIONS.filter((q) => {
      if (category !== 'all' && q.cat !== category) return false
      if (difficulty !== 'all' && q.diff !== difficulty) return false
      if (type && type !== 'all' && q.type !== type) return false
      return true
    })
  }

  /**
   * 随机抽取N道题
   */
  static randomPick(
    count: number,
    { category = 'all', difficulty = 'all', type }: { category?: CategoryId | 'all'; difficulty?: Difficulty | 'all'; type?: QuestionType | 'all' } = {}
  ): Question[] {
    const pool = this.filter({ category, difficulty, type })
    const shuffled = this.shuffle([...pool])
    return count > 0 ? shuffled.slice(0, Math.min(count, shuffled.length)) : shuffled
  }

  /**
   * 获取错题
   */
  static getWrongQuestions(records: Records): Question[] {
    const wrongIds = Object.entries(records)
      .filter(([, v]) => v === 'wrong')
      .map(([k]) => parseInt(k))
    return ALL_QUESTIONS.filter((q) => wrongIds.includes(q.id))
  }

  /**
   * 按关键词搜索题目
   */
  static search(keyword: string): Question[] {
    if (!keyword || !keyword.trim()) return ALL_QUESTIONS
    const kw = keyword.toLowerCase().trim()
    return ALL_QUESTIONS.filter(
      (q) =>
        q.q.toLowerCase().includes(kw) ||
        q.exp.toLowerCase().includes(kw) ||
        q.opts.some((o) => o.toLowerCase().includes(kw))
    )
  }

  /**
   * 获取分类统计
   */
  static getCategoryStats(catId: CategoryId, records: Records): CategoryStats {
    const catQuestions = ALL_QUESTIONS.filter((q) => q.cat === catId)
    const done = catQuestions.filter((q) => records[q.id]).length
    const correct = catQuestions.filter((q) => records[q.id] === 'correct').length
    return {
      total: catQuestions.length,
      done,
      correct,
      wrong: done - correct,
      accuracy: done > 0 ? Math.round((correct / done) * 100) : 0,
      progress: catQuestions.length > 0 ? Math.round((done / catQuestions.length) * 100) : 0,
    }
  }

  /**
   * 获取全局统计
   */
  static getGlobalStats(records: Records): GlobalStats {
    const done = Object.keys(records).length
    const correct = Object.values(records).filter((v) => v === 'correct').length
    return {
      total: ALL_QUESTIONS.length,
      done,
      correct,
      wrong: done - correct,
      accuracy: done > 0 ? Math.round((correct / done) * 100) : 0,
    }
  }

  /**
   * 获取题型统计
   */
  static getTypeStats(): { choice: number; truefalse: number } {
    const choice = ALL_QUESTIONS.filter((q) => q.type === 'choice').length
    const truefalse = ALL_QUESTIONS.filter((q) => q.type === 'truefalse').length
    return { choice, truefalse }
  }

  /**
   * Fisher-Yates 洗牌算法
   */
  static shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  /**
   * 导出数据为JSON
   */
  static exportData(
    records: Records,
    bookmarks: Set<number>,
    spacedRepetition: SpacedRepetitionCard[] = []
  ): string {
    const data: ExportData = {
      version: 2,
      records,
      bookmarks: [...bookmarks],
      spacedRepetition,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  /**
   * 从JSON导入数据
   */
  static importData(jsonStr: string): {
    records: Records
    bookmarks: Set<number>
    spacedRepetition: SpacedRepetitionCard[]
  } {
    try {
      const data: ExportData = JSON.parse(jsonStr)
      if (!data.version || !data.records) throw new Error('Invalid format')
      return {
        records: data.records,
        bookmarks: new Set(data.bookmarks || []),
        spacedRepetition: data.spacedRepetition || [],
      }
    } catch (e) {
      throw new Error('数据格式无效：' + (e as Error).message)
    }
  }
}
