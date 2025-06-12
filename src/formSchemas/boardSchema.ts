import { z } from 'zod'

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

export const updateBoardSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>