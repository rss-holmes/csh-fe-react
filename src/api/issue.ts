import axiosInstance from '@/utils/axiosBase'
import type { CreateIssueInput, UpdateIssueInput } from '@/formSchemas/issueSchema'

// Issue API response types
export interface Issue {
  id: number
  title: string
  description: string
  status: string
  workspaceId: number
  isActive: boolean
  createdAt: string
  lastUpdatedAt: string
  feedbackCount?: number
  upvotes?: number
  createdBy?: {
    id: number
    name: string
    email: string
  }
}

export interface IssueFeedback {
  id: number
  title: string
  description?: string
  sentiment?: string
  status: string
  createdAt: string
}

export interface IssueCustomer {
  id: number
  name: string
  email: string
  company?: string
  feedbackCount: number
}

export interface BulkUploadResult {
  success: boolean
  message: string
  processed: number
  errors: string[]
}

/**
 * Create a new issue
 */
export const createIssue = async (data: CreateIssueInput): Promise<Issue> => {
  try {
    const response = await axiosInstance.post('/issues', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Create issue failed')
  }
}

/**
 * Get a specific issue by ID
 */
export const getIssue = async (id: number): Promise<Issue> => {
  try {
    const response = await axiosInstance.get(`/issues/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get issue failed')
  }
}

/**
 * Update an existing issue
 */
export const updateIssue = async (id: number, data: UpdateIssueInput): Promise<Issue> => {
  try {
    const response = await axiosInstance.put(`/issues/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update issue failed')
  }
}

/**
 * Delete an issue
 */
export const deleteIssue = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/issues/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete issue failed')
  }
}

/**
 * Get all issues for the current workspace
 */
export const getIssues = async (): Promise<Issue[]> => {
  try {
    const response = await axiosInstance.get('/issues')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get issues failed')
  }
}

/**
 * Get all feedbacks associated with an issue
 */
export const getFeedbacksForIssue = async (id: number): Promise<IssueFeedback[]> => {
  try {
    const response = await axiosInstance.get(`/issues/${id}/feedbacks`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedbacks for issue failed')
  }
}

/**
 * Bulk upload issues from a file
 */
export const bulkUploadIssues = async (fileName: string): Promise<BulkUploadResult> => {
  try {
    const response = await axiosInstance.post('/issues/bulk-upload', {
      fileName,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Bulk upload issues failed')
  }
}

/**
 * Get all customers associated with an issue
 */
export const getCustomersForIssue = async (id: number): Promise<IssueCustomer[]> => {
  try {
    const response = await axiosInstance.get(`/issues/${id}/customers`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get customers for issue failed')
  }
}

/**
 * Push issue to GitHub
 */
export const pushToGithub = async (id: number): Promise<{ message: string; githubUrl?: string }> => {
  try {
    const response = await axiosInstance.post(`/issues/${id}/push-to-github`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Push to GitHub failed')
  }
}

/**
 * Notify users about an issue
 */
export const notifyIssueUsers = async (
  id: number,
  data: { message: string }
): Promise<{ message: string; notifiedCount: number }> => {
  try {
    const response = await axiosInstance.post(`/issues/${id}/notify`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to notify users')
  }
}