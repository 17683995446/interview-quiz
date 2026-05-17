/**
 * Type Definitions
 * 全局类型定义 - 使用 TypeScript 替代 JSDoc 注释
 */

// ===== Domain Types =====

/** 题目难度 */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** 答题结果状态 */
export type AnswerResult = 'correct' | 'wrong'

/** 题目分类ID */
export type CategoryId =
  | 'ai_basic'
  | 'ml'
  | 'dl'
  | 'nlp'
  | 'cv'
  | 'algorithm'
  | 'network'
  | 'os'
  | 'database'
  | 'python'

/** 分类配置 */
export interface Category {
  id: CategoryId
  name: string
  icon: string
  color: string
}

/** 难度配置 */
export interface DifficultyConfig {
  label: string
  color: string
}

/** 题目类型 */
export type QuestionType = 'choice' | 'truefalse'

/** 题目对象 */
export interface Question {
  id: number
  cat: CategoryId
  diff: Difficulty
  type: QuestionType
  q: string
  opts: string[]
  ans: number
  exp: string
}

/** 答题记录 */
export type Records = Record<number, AnswerResult>

/** 收藏集合 */
export type Bookmarks = Set<number>

/** 刷题会话配置 */
export interface QuizConfig {
  category: CategoryId | 'all'
  count: number
  difficulty: Difficulty | 'all'
  timer: boolean
  mode?: 'normal' | 'wrong' | 'review'
}

/** 刷题会话状态 */
export interface QuizSession {
  questions: Question[]
  current: number
  score: number
  answered: boolean
  results: SessionResult[]
  config: QuizConfig
}

/** 单次答题结果 */
export interface SessionResult {
  questionId: number
  correct: boolean
}

/** 分类统计 */
export interface CategoryStats {
  total: number
  done: number
  correct: number
  wrong: number
  accuracy: number
  progress: number
}

/** 全局统计 */
export interface GlobalStats {
  total: number
  done: number
  correct: number
  wrong: number
  accuracy: number
}

/** 间隔重复卡片数据 */
export interface SpacedRepetitionCard {
  questionId: number
  interval: number // 间隔天数
  repetitions: number // 重复次数
  easeFactor: number // 简易度因子
  nextReviewDate: string // ISO日期
  lastReviewDate?: string
}

/** 导出数据结构 */
export interface ExportData {
  version: number
  records: Records
  bookmarks: number[]
  spacedRepetition?: SpacedRepetitionCard[]
  exportedAt: string
}
