import axiosInstance from '@/utils/axiosBase'
import type {
  CreateFeedbackInput,
  UpdateFeedbackInput,
} from '@/formSchemas/feedbackSchema'

// Feedback API response types
export interface Feedback {
  id: number
  title: string
  description?: string
  status: string
  sentiment?: string
  type?: string
  source?: string
  workspaceId: number
  isActive: boolean
  createdAt: string
  lastUpdatedAt: string
  issueCount?: number
  customer?: {
    id: number
    name: string
    email: string
    company?: string
  }
  createdBy?: {
    id: number
    name: string
    email: string
  }
}

export interface FeedbackListResponse {
  feedbacks: Feedback[]
  nextCursor?: number
  hasMore: boolean
  total: number
}

export interface SimilarFeedback {
  id: number
  title: string
  similarity: number
  createdAt: string
}

export interface FeedbackKeyword {
  id: number
  keyword: string
  count: number
  sentiment?: string
}

export interface AICopilotResponse {
  message: string
  suggestions?: string[]
}

/**
 * Create a new feedback
 */
export const createFeedback = async (data: CreateFeedbackInput): Promise<Feedback> => {
  try {
    const response = await axiosInstance.post('/feedbacks', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Create feedback failed')
  }
}

/**
 * Get a specific feedback by ID
 */
export const getFeedback = async (id: number): Promise<Feedback> => {
  try {
    const response = await axiosInstance.get(`/feedbacks/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedback failed')
  }
}

/**
 * Update an existing feedback
 */
export const updateFeedback = async (id: number, data: UpdateFeedbackInput): Promise<Feedback> => {
  try {
    const response = await axiosInstance.put(`/feedbacks/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update feedback failed')
  }
}

/**
 * Delete a feedback
 */
export const deleteFeedback = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/feedbacks/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete feedback failed')
  }
}

/**
 * Get feedbacks with pagination and search
 */
export const getFeedbacks = async (
  searchQuery?: string,
  pageParam?: number
): Promise<FeedbackListResponse> => {
  try {
    const response = await axiosInstance.get('/feedbacks', {
      params: {
        search: searchQuery,
        cursor: pageParam,
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedbacks failed')
  }
}

/**
 * Get issues associated with a feedback
 */
export const getIssuesForFeedback = async (id: number): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`/feedbacks/${id}/issues`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get issues for feedback failed')
  }
}

/**
 * Mark feedback as resolved
 */
export const resolveFeedback = async (id: number): Promise<Feedback> => {
  try {
    const response = await axiosInstance.post(`/feedbacks/${id}/resolve`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Resolve feedback failed')
  }
}

/**
 * Mark feedback for later review
 */
export const markLater = async (id: number): Promise<Feedback> => {
  try {
    const response = await axiosInstance.post(`/feedbacks/${id}/later`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Mark later failed')
  }
}

/**
 * Mark feedback as spam
 */
export const markAsSpam = async (id: number): Promise<Feedback> => {
  try {
    const response = await axiosInstance.post(`/feedbacks/${id}/spam`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Mark as spam failed')
  }
}

/**
 * Get feedbacks for workspace
 */
export const getWorkspaceFeedbacks = async (workspaceId?: string): Promise<Feedback[]> => {
  try {
    const url = workspaceId ? `/feedbacks?workspaceId=${workspaceId}` : '/feedbacks'
    const response = await axiosInstance.get(url)
    return response.data.data || []
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get workspace feedbacks failed')
  }
}

/**
 * Bulk upload feedbacks from a file
 */
export const bulkUploadFeedbacks = async (fileName: string): Promise<{ message: string; processed: number }> => {
  try {
    const response = await axiosInstance.post('/feedbacks/bulk-upload', {
      fileName,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Bulk upload feedbacks failed')
  }
}

/**
 * Get similar feedbacks
 */
export const getSimilarFeedbacks = async (id: number): Promise<SimilarFeedback[]> => {
  try {
    const response = await axiosInstance.get(`/feedbacks/${id}/similar`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get similar feedbacks failed')
  }
}

/**
 * Get keywords for a feedback
 */
export const getKeywordsForFeedback = async (id: number): Promise<FeedbackKeyword[]> => {
  try {
    const response = await axiosInstance.get(`/feedbacks/${id}/keywords`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get keywords for feedback failed')
  }
}

/**
 * Get AI copilot chat reply
 */
export const getAICopilotChatReply = async (message: string): Promise<AICopilotResponse> => {
  try {
    const response = await axiosInstance.post('/feedbacks/ai-copilot-chat', {
      message,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get AI copilot chat reply failed')
  }
}

/**
 * Get feedbacks for a specific board
 */
export const getBoardFeedbacks = async (boardId: number): Promise<Feedback[]> => {
  try {
    const response = await axiosInstance.get(`/boards/${boardId}/feedbacks`)
    return response.data.data || []
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get board feedbacks failed')
  }
}