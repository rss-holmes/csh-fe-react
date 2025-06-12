import { z } from 'zod'
import { readUserSchema } from './userSchema'

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  companyId: z.number().optional(),
  segments: z.string().optional(),
  designation: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const readCustomerSchema = z.object({
  id: z.number().positive(),
  name: z.string().max(200),
  email: z.string().email().max(200).or(z.literal('')),
  workspaceId: z.number().positive(),
  addedVia: z.enum(['', 'api', 'slack', 'manual']),
  segments: z.string().max(200).nullable(),
  designation: z.string().max(200).nullable(),
  tags: z.array(z.any()).nullable(),
  country: z.string().max(200).nullable(),
  browser: z.string().max(200).nullable(),
  os: z.string().max(200).nullable(),
  device: z.string().max(200).nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
  createdBy: readUserSchema,
  lastUpdatedBy: readUserSchema,
  company: z
    .object({
      id: z.number().positive(),
      name: z.string().max(200),
    })
    .nullable(),
})

export const updateCustomerSchema = createCustomerSchema.partial()

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type ReadCustomerOutput = z.infer<typeof readCustomerSchema>