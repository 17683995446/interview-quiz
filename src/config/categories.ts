/**
 * Module: Categories Configuration
 * 分类配置 - 应用常量层
 */

import type { Category, DifficultyConfig } from '@/types'

export const CATEGORIES: Category[] = [
  { id: 'ai_basic', name: 'AI基础', icon: '🤖', color: '#6366f1' },
  { id: 'ml', name: '机器学习', icon: '📊', color: '#8b5cf6' },
  { id: 'dl', name: '深度学习', icon: '🧠', color: '#ec4899' },
  { id: 'nlp', name: 'NLP', icon: '💬', color: '#14b8a6' },
  { id: 'cv', name: '计算机视觉', icon: '👁️', color: '#f59e0b' },
  { id: 'algorithm', name: '算法与数据结构', icon: '⚡', color: '#ef4444' },
  { id: 'network', name: '计算机网络', icon: '🌐', color: '#3b82f6' },
  { id: 'os', name: '操作系统', icon: '💻', color: '#10b981' },
  { id: 'database', name: '数据库', icon: '🗄️', color: '#f97316' },
  { id: 'python', name: 'Python编程', icon: '🐍', color: '#eab308' },
]

export const DIFFICULTY_MAP: Record<string, DifficultyConfig> = {
  easy: { label: '简单', color: 'emerald' },
  medium: { label: '中等', color: 'amber' },
  hard: { label: '困难', color: 'red' },
}
