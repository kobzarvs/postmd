import { z } from 'zod'

const URL_REGEX = /^[a-zA-Z0-9_-]+$/
const CODE_REGEX = /^[a-zA-Z0-9_-]*$/

export const createEntrySchema = z.object({
  content: z.string().min(1).max(200000),
  customUrl: z
    .string()
    .min(2)
    .max(100)
    .regex(URL_REGEX, 'URL может содержать только латинские буквы, цифры, дефис и подчеркивание')
    .optional(),
  editCode: z
    .string()
    .min(1)
    .max(100)
    .regex(CODE_REGEX, 'Код может содержать только латинские буквы, цифры, дефис и подчеркивание')
    .optional(),
  modifyCode: z
    .string()
    .min(1)
    .max(100)
    .regex(CODE_REGEX, 'Код может содержать только латинские буквы, цифры, дефис и подчеркивание')
    .optional(),
})

export const updateEntrySchema = z.object({
  content: z.string().min(1).max(200000),
  code: z.string().min(1),
})

export type CreateEntryInput = z.infer<typeof createEntrySchema>
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>