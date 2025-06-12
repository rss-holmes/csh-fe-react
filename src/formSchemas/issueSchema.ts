import { z } from 'zod'
import { readUserSchema } from './userSchema'
import { ISSUE_STATUS } from '../utils/constants'

export const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(ISSUE_STATUS),
  feedbacks: z.array(z.number()).optional(),
})

export const readIssueSchema = z.object({
  id: z.number().positive(),
  title: z.string().max(200),
  description: z.string().max(1000),
  status: z.enum(ISSUE_STATUS).default('No Status'),
  workspaceId: z.number().positive(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
  createdBy: readUserSchema,
  lastUpdatedBy: readUserSchema,
  feedbackCount: z.number().default(0).optional(),
})

export const updateIssueSchema = createIssueSchema.partial()

export type CreateIssueInput = z.infer<typeof createIssueSchema>
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>
export type ReadIssueInput = z.infer<typeof readIssueSchema>
export type ReadIssueOutput = z.infer<typeof readIssueSchema>