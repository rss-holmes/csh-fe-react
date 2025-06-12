import { z } from 'zod'
import { readUserSchema } from './userSchema'

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

export const readWorkspaceSchema = z.object({
  id: z.number().positive(),
  name: z.string().max(256),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
  createdBy: readUserSchema,
  lastUpdatedBy: readUserSchema,
})

export const updateWorkspaceSchema = createWorkspaceSchema.partial()

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>
export type ReadWorkspaceOutput = z.infer<typeof readWorkspaceSchema>