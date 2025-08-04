import { nanoid } from 'nanoid'

export function generateId(): string {
  return nanoid(8)
}

export function generateCode(): string {
  return nanoid(12)
}