import { describe, it, expect } from 'vitest'
import { generateId, generateCode } from './utils'

describe('generateId', () => {
  it('generates ID with correct length', () => {
    const id = generateId()
    expect(id).toHaveLength(8)
  })

  it('generates unique IDs', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100)
  })

  it('generates URL-safe IDs', () => {
    const id = generateId()
    // nanoid uses URL-safe characters: A-Za-z0-9_-
    expect(id).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('consistently generates 8 character IDs', () => {
    for (let i = 0; i < 10; i++) {
      const id = generateId()
      expect(id).toHaveLength(8)
    }
  })
})

describe('generateCode', () => {
  it('generates code with correct length', () => {
    const code = generateCode()
    expect(code).toHaveLength(12)
  })

  it('generates unique codes', () => {
    const codes = new Set()
    for (let i = 0; i < 100; i++) {
      codes.add(generateCode())
    }
    expect(codes.size).toBe(100)
  })

  it('generates URL-safe codes', () => {
    const code = generateCode()
    // nanoid uses URL-safe characters: A-Za-z0-9_-
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('consistently generates 12 character codes', () => {
    for (let i = 0; i < 10; i++) {
      const code = generateCode()
      expect(code).toHaveLength(12)
    }
  })

  it('generates longer codes than IDs', () => {
    const id = generateId()
    const code = generateCode()
    expect(code.length).toBeGreaterThan(id.length)
  })
})

describe('ID vs Code comparison', () => {
  it('generates different values for ID and code', () => {
    // Даже если вызвать подряд, должны быть разные значения
    const id = generateId()
    const code = generateCode()
    expect(id).not.toBe(code)
  })

  it('ID is shorter for URLs, code is longer for security', () => {
    const id = generateId()
    const code = generateCode()
    expect(id).toHaveLength(8) // Короче для удобства в URL
    expect(code).toHaveLength(12) // Длиннее для безопасности
  })
})