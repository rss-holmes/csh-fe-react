import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

export const readUserSchema = z.object({
  id: z.number().positive(),
  name: z.string().max(256),
  email: z.string().email().max(256),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ReadUserOutput = z.infer<typeof readUserSchema>