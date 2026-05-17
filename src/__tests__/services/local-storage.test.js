/**
 * Unit Tests: Storage Utility
 * 持久化工具模块 - 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storage } from '@/services/local-storage'

describe('storage', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('should set and get a value', () => {
    storage.set('test', { foo: 'bar' })
    expect(storage.get('test')).toEqual({ foo: 'bar' })
  })

  it('should return default value for missing key', () => {
    expect(storage.get('missing')).toBeNull()
    expect(storage.get('missing', 'default')).toBe('default')
  })

  it('should handle primitive values', () => {
    storage.set('num', 42)
    expect(storage.get('num')).toBe(42)
    storage.set('str', 'hello')
    expect(storage.get('str')).toBe('hello')
    storage.set('bool', true)
    expect(storage.get('bool')).toBe(true)
  })

  it('should overwrite existing value', () => {
    storage.set('key', 'old')
    storage.set('key', 'new')
    expect(storage.get('key')).toBe('new')
  })

  it('should remove a key', () => {
    storage.set('key', 'value')
    storage.remove('key')
    expect(storage.get('key')).toBeNull()
  })

  it('should clear all app keys', () => {
    storage.set('a', 1)
    storage.set('b', 2)
    storage.clear()
    expect(storage.get('a')).toBeNull()
    expect(storage.get('b')).toBeNull()
  })

  it('should not affect non-app keys', () => {
    localStorage.setItem('other-key', 'other-value')
    storage.clear()
    expect(localStorage.getItem('other-key')).toBe('other-value')
  })

  it('should return default on JSON parse error', () => {
    localStorage.setItem('interview-quiz-state:bad', 'not-json{')
    expect(storage.get('bad', 'safe')).toBe('safe')
  })
})
