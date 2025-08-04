import { z } from 'zod'

const URL_REGEX = /^[a-zA-Z0-9_-]+$/
const CODE_REGEX = /^[a-zA-Z0-9_-]*$/

export const createEntrySchema = z.object({
  content: z.string().min(1).max(200000),
  customUrl: z
    .string()
    .refine((val) => val === '' || (val.length >= 2 && val.length <= 100 && URL_REGEX.test(val)), {
      message: 'URL должен быть от 2 до 100 символов и содержать только латинские буквы, цифры, дефис и подчеркивание'
    })
    .optional(),
  editCode: z
    .string()
    .refine((val) => val === '' || (val.length >= 1 && val.length <= 100 && CODE_REGEX.test(val)), {
      message: 'Код должен быть от 1 до 100 символов и содержать только латинские буквы, цифры, дефис и подчеркивание'
    })
    .optional(),
  modifyCode: z
    .string()
    .refine((val) => val === '' || (val.length >= 1 && val.length <= 100 && CODE_REGEX.test(val)), {
      message: 'Код должен быть от 1 до 100 символов и содержать только латинские буквы, цифры, дефис и подчеркивание'
    })
    .optional(),
})

export const updateEntrySchema = z.object({
  content: z.string().min(1).max(200000),
  code: z.string().min(1),
})

export type CreateEntryInput = z.infer<typeof createEntrySchema>
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>