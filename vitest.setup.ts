import { vi } from 'vitest'

// Mock environment variables
vi.stubEnv('DATABASE_URL', 'postgresql://test@localhost/test')
vi.stubEnv('NEXTAUTH_URL', 'http://localhost:3000')
vi.stubEnv('NEXTAUTH_SECRET', 'test-secret')

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))