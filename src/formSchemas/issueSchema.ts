import { z } from 'zod'
import { readUserSchema } from './userSchema'
import { ISSUE_STATUS } from '../constants'

export const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(ISSUE_STATUS).default('No Status'),
  feedbacks: z.array(z.number()).optional(),
  assignedToId: z.number().optional(),
  boardId: z.number().optional(),
  dueDate: z.date().optional(),
  priority: z.number().min(1).max(4).default(2),
})

export const readIssueSchema = z.object({
  id: z.number().positive(),
  title: z.string().max(200),
  description: z.string().max(1000),
  status: z.enum(ISSUE_STATUS).default('No Status'),
  workspaceId: z.number().positive(),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: readUserSchema.optional(),
  lastUpdatedBy: readUserSchema.optional(),
  feedbackCount: z.number().default(0).optional(),
  priority: z.number().min(1).max(4).default(2),
  assignedTo: readUserSchema.optional(),
  assignedToId: z.number().optional(),
  board: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  boardId: z.number().optional(),
  dueDate: z.string().optional(),
  linkedFeedbacksCount: z.number().optional(),
  upvotes: z.number().optional(),
  downvotes: z.number().optional(),
  commentsCount: z.number().optional(),
})

export const updateIssueSchema = createIssueSchema.partial()

export type CreateIssueInput = z.infer<typeof createIssueSchema>
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>
export type ReadIssueInput = z.infer<typeof readIssueSchema>
export type ReadIssueOutput = z.infer<typeof readIssueSchema>
export type Issue = ReadIssueOutput