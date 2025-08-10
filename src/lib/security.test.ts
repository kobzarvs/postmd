import { describe, it, expect } from 'vitest'
import { isSafeUrl, sanitizeAttr, ALLOWED_URI_SCHEMES } from './security'

describe('isSafeUrl', () => {
  describe('allowed schemes', () => {
    it('accepts http URLs', () => {
      expect(isSafeUrl('http://example.com')).toBe(true)
    })

    it('accepts https URLs', () => {
      expect(isSafeUrl('https://example.com')).toBe(true)
    })

    it('accepts mailto URLs', () => {
      expect(isSafeUrl('mailto:test@example.com')).toBe(true)
    })

    it('accepts relative URLs with base context', () => {
      expect(isSafeUrl('/relative/path')).toBe(true)
    })

    it('accepts hash URLs', () => {
      expect(isSafeUrl('#anchor')).toBe(true)
    })
  })

  describe('blocked schemes', () => {
    it('rejects javascript: URLs', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false)
    })

    it('rejects data: URLs', () => {
      expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('rejects file: URLs', () => {
      expect(isSafeUrl('file:///etc/passwd')).toBe(false)
    })

    it('rejects ftp: URLs', () => {
      expect(isSafeUrl('ftp://example.com')).toBe(false)
    })

    it('rejects vbscript: URLs', () => {
      expect(isSafeUrl('vbscript:alert(1)')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles malformed URLs', () => {
      // URL с восклицательным знаком может быть валидным (часть пути)
      expect(isSafeUrl('ht!tp://example.com')).toBe(true)
    })

    it('handles empty string', () => {
      expect(isSafeUrl('')).toBe(true)
    })

    it('handles whitespace', () => {
      expect(isSafeUrl('   ')).toBe(true)
    })

    it('handles URLs with mixed case schemes', () => {
      expect(isSafeUrl('HTTPS://example.com')).toBe(true)
      expect(isSafeUrl('JavaScript:alert(1)')).toBe(false)
    })

    it('handles URLs with special characters', () => {
      expect(isSafeUrl('https://example.com/path?query=value&other=123#hash')).toBe(true)
    })
  })
})

describe('sanitizeAttr', () => {
  describe('event handlers', () => {
    it('removes onclick attributes', () => {
      expect(sanitizeAttr('onclick="alert(1)"')).toBe('')
    })

    it('removes onload attributes', () => {
      expect(sanitizeAttr('onload="alert(1)"')).toBe('')
    })

    it('removes onerror attributes', () => {
      expect(sanitizeAttr('onerror="alert(1)"')).toBe('')
    })

    it('removes onmouseover attributes', () => {
      expect(sanitizeAttr('onmouseover="alert(1)"')).toBe('')
    })

    it('removes any attribute starting with "on"', () => {
      expect(sanitizeAttr('onfocus="alert(1)"')).toBe('')
      expect(sanitizeAttr('onblur="alert(1)"')).toBe('')
      expect(sanitizeAttr('onchange="alert(1)"')).toBe('')
    })

    it('handles mixed case event handlers', () => {
      expect(sanitizeAttr('onClick="alert(1)"')).toBe('')
      expect(sanitizeAttr('OnClick="alert(1)"')).toBe('')
      expect(sanitizeAttr('ONCLICK="alert(1)"')).toBe('')
    })
  })

  describe('javascript: URLs in attributes', () => {
    it('removes javascript: URLs', () => {
      expect(sanitizeAttr('javascript:alert(1)')).toBe('')
    })

    it('removes javascript: URLs with mixed case', () => {
      expect(sanitizeAttr('JavaScript:alert(1)')).toBe('')
      expect(sanitizeAttr('JAVASCRIPT:alert(1)')).toBe('')
      expect(sanitizeAttr('jAvAsCrIpT:alert(1)')).toBe('')
    })

    it('removes javascript: URLs with whitespace', () => {
      expect(sanitizeAttr('javascript: alert(1)')).toBe('')
      expect(sanitizeAttr('javascript:	alert(1)')).toBe('')
    })
  })

  describe('safe attributes', () => {
    it('preserves normal attribute values', () => {
      expect(sanitizeAttr('value')).toBe('value')
      expect(sanitizeAttr('my-class')).toBe('my-class')
      expect(sanitizeAttr('data-id="123"')).toBe('data-id="123"')
    })

    it('preserves href with safe URLs', () => {
      expect(sanitizeAttr('https://example.com')).toBe('https://example.com')
      expect(sanitizeAttr('/relative/path')).toBe('/relative/path')
      expect(sanitizeAttr('#anchor')).toBe('#anchor')
    })

    it('preserves empty strings', () => {
      expect(sanitizeAttr('')).toBe('')
    })
  })
})

describe('ALLOWED_URI_SCHEMES', () => {
  it('contains expected schemes', () => {
    expect(ALLOWED_URI_SCHEMES).toContain('http')
    expect(ALLOWED_URI_SCHEMES).toContain('https')
    expect(ALLOWED_URI_SCHEMES).toContain('mailto')
  })

  it('does not contain dangerous schemes', () => {
    expect(ALLOWED_URI_SCHEMES).not.toContain('javascript')
    expect(ALLOWED_URI_SCHEMES).not.toContain('data')
    expect(ALLOWED_URI_SCHEMES).not.toContain('vbscript')
    expect(ALLOWED_URI_SCHEMES).not.toContain('file')
  })
})