/**
 * Module: Bookmarks Store
 * 收藏管理 - 产品化模块
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '@/types'
import { QuestionEngine } from '@/data/question-bank'
import { storage } from '@/services/local-storage'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref<Set<number>>(
    new Set(storage.get<number[]>('bookmarks') ?? [])
  )

  const bookmarkedQuestions = computed<Question[]>(() =>
    bookmarks.value.size > 0
      ? [...bookmarks.value]
          .map((id) => QuestionEngine.getById(id))
          .filter((q): q is Question => q !== undefined)
      : []
  )

  function toggleBookmark(questionId: number) {
    if (bookmarks.value.has(questionId)) {
      bookmarks.value.delete(questionId)
    } else {
      bookmarks.value.add(questionId)
    }
    bookmarks.value = new Set(bookmarks.value) // trigger reactivity
    save()
  }

  function isBookmarked(questionId: number): boolean {
    return bookmarks.value.has(questionId)
  }

  function save() {
    storage.set('bookmarks', [...bookmarks.value])
  }

  function reset() {
    bookmarks.value = new Set()
    save()
  }

  function exportBookmarks() {
    return JSON.stringify([...bookmarks.value])
  }

  function importBookmarks(jsonStr: string) {
    try {
      const ids = JSON.parse(jsonStr)
      bookmarks.value = new Set(Array.isArray(ids) ? ids : [])
      save()
    } catch {
      throw new Error('导入收藏数据格式错误')
    }
  }

  return {
    bookmarks, bookmarkedQuestions,
    toggleBookmark, isBookmarked, save, reset,
    exportBookmarks, importBookmarks,
  }
})
