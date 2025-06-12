import { z } from 'zod'
import { readUserSchema } from './userSchema'

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  website: z.string().url('Invalid website URL'),
})

export const readCompanySchema = z.object({
  id: z.number().positive(),
  name: z.string().max(200),
  website: z.string().url().max(2083).or(z.literal('')),
  workspaceId: z.number().positive(),
  isActive: z.boolean(),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
  createdBy: readUserSchema,
  lastUpdatedBy: readUserSchema,
  customersCount: z.number().default(0).optional(),
})

export const updateCompanySchema = createCompanySchema.partial()

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
export type ReadCompanyOutput = z.infer<typeof readCompanySchema>