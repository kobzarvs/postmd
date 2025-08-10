import { describe, it, expect } from 'vitest'
import { createEntrySchema, updateEntrySchema } from './validation'

describe('createEntrySchema', () => {
  describe('content validation', () => {
    it('accepts valid content', () => {
      const result = createEntrySchema.safeParse({
        content: 'This is valid content'
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty content', () => {
      const result = createEntrySchema.safeParse({
        content: ''
      })
      expect(result.success).toBe(false)
    })

    it('rejects content over 200000 characters', () => {
      const longContent = 'a'.repeat(200001)
      const result = createEntrySchema.safeParse({
        content: longContent
      })
      expect(result.success).toBe(false)
    })

    it('accepts content at max length', () => {
      const maxContent = 'a'.repeat(200000)
      const result = createEntrySchema.safeParse({
        content: maxContent
      })
      expect(result.success).toBe(true)
    })
  })

  describe('customUrl validation', () => {
    it('accepts valid custom URL', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: 'my-valid-url_123'
      })
      expect(result.success).toBe(true)
    })

    it('accepts empty custom URL', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: ''
      })
      expect(result.success).toBe(true)
    })

    it('rejects custom URL with special characters', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: 'invalid@url!'
      })
      expect(result.success).toBe(false)
    })

    it('rejects custom URL shorter than 2 characters', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: 'a'
      })
      expect(result.success).toBe(false)
    })

    it('rejects custom URL longer than 100 characters', () => {
      const longUrl = 'a'.repeat(101)
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: longUrl
      })
      expect(result.success).toBe(false)
    })

    it('accepts custom URL with exactly 2 characters', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: 'ab'
      })
      expect(result.success).toBe(true)
    })

    it('accepts custom URL with exactly 100 characters', () => {
      const url = 'a'.repeat(100)
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: url
      })
      expect(result.success).toBe(true)
    })
  })

  describe('editCode validation', () => {
    it('accepts valid edit code', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        editCode: 'secret_code-123'
      })
      expect(result.success).toBe(true)
    })

    it('accepts empty edit code', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        editCode: ''
      })
      expect(result.success).toBe(true)
    })

    it('rejects edit code with special characters', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        editCode: 'invalid@code!'
      })
      expect(result.success).toBe(false)
    })

    it('accepts single character edit code', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        editCode: 'a'
      })
      expect(result.success).toBe(true)
    })

    it('rejects edit code longer than 100 characters', () => {
      const longCode = 'a'.repeat(101)
      const result = createEntrySchema.safeParse({
        content: 'content',
        editCode: longCode
      })
      expect(result.success).toBe(false)
    })
  })

  describe('optional fields', () => {
    it('accepts entry with only content', () => {
      const result = createEntrySchema.safeParse({
        content: 'content'
      })
      expect(result.success).toBe(true)
    })

    it('accepts entry with all fields', () => {
      const result = createEntrySchema.safeParse({
        content: 'content',
        customUrl: 'my-url',
        editCode: 'my-code'
      })
      expect(result.success).toBe(true)
    })
  })
})

describe('updateEntrySchema', () => {
  it('accepts valid update data', () => {
    const result = updateEntrySchema.safeParse({
      content: 'Updated content',
      code: 'secret-code'
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty content', () => {
    const result = updateEntrySchema.safeParse({
      content: '',
      code: 'secret-code'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty code', () => {
    const result = updateEntrySchema.safeParse({
      content: 'content',
      code: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = updateEntrySchema.safeParse({
      content: 'content'
    })
    expect(result.success).toBe(false)
  })

  it('rejects content over 200000 characters', () => {
    const longContent = 'a'.repeat(200001)
    const result = updateEntrySchema.safeParse({
      content: longContent,
      code: 'secret-code'
    })
    expect(result.success).toBe(false)
  })
})