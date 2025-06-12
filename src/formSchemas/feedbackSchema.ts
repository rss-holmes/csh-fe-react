import { z } from 'zod'
import { readUserSchema } from './userSchema'
import {
  FEEDBACK_STATUS,
  FEEDBACK_SENTIMENT,
  FEEDBACK_TYPE,
  FEEDBACK_SOURCE,
} from '../utils/constants'

export const createFeedbackSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  sentiment: z.enum(FEEDBACK_SENTIMENT),
  type: z.enum(FEEDBACK_TYPE),
  customerId: z.number().optional(),
  source: z.enum(['', 'slack', 'hubspot', 'manual', 'email']),
  issues: z.array(z.number()).optional(),
  priority: z.number().min(1).max(4).optional(),
  boardId: z.number().optional(),
})

export const readFeedbackSchema = z.object({
  id: z.number().positive(),
  title: z.string().max(200),
  description: z.string().max(1000).optional().default(''),
  status: z.enum(FEEDBACK_STATUS).default('Open'),
  sentiment: z.enum(FEEDBACK_SENTIMENT).default(''),
  type: z.enum(FEEDBACK_TYPE).default(''),
  source: z.enum(FEEDBACK_SOURCE).default(''),
  workspaceId: z.number().positive(),
  isActive: z.boolean(),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
  issueCount: z.number().default(0).optional(),
  createdBy: readUserSchema,
  lastUpdatedBy: readUserSchema,
  customer: z
    .object({
      id: z.number().positive(),
      name: z.string().max(200),
      email: z.string().email().max(200).or(z.literal('')),
    })
    .nullable(),
})

export const updateFeedbackSchema = createFeedbackSchema.partial()

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>
export type ReadFeedbackInput = z.infer<typeof readFeedbackSchema>
export type ReadFeedbackOutput = z.infer<typeof readFeedbackSchema>