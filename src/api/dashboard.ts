import axiosInstance from '@/utils/axiosBase'

// Dashboard API response types
export interface FeedbackByType {
  type: string
  count: number
  percentage: number
}

export interface FeedbackBySentiment {
  sentiment: string
  count: number
  percentage: number
  color?: string
}

export interface FeedbackBySource {
  source: string
  count: number
  percentage: number
}

export interface FeedbackByCustomer {
  customer: {
    id: number
    name: string
    email: string
    company?: string
  }
  feedbackCount: number
  lastFeedbackDate: string
}

export interface DashboardMetrics {
  totalFeedbacks: number
  totalIssues: number
  totalBoards: number
  totalCustomers: number
  feedbackGrowth: number
  issueResolutionRate: number
  avgResponseTime: number
}

export interface RecentActivity {
  id: number
  type: 'feedback' | 'issue' | 'board'
  title: string
  description?: string
  createdAt: string
  author?: {
    name: string
    email: string
  }
}

/**
 * Get feedback breakdown by type (Bug Report, Feature Request, etc.)
 */
export const getFeedbackByType = async (): Promise<FeedbackByType[]> => {
  try {
    const response = await axiosInstance.get('/dashboard/feedback-by-type')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedback by type failed')
  }
}

/**
 * Get feedback breakdown by sentiment (Positive, Neutral, Negative)
 */
export const getFeedbackBySentiment = async (): Promise<FeedbackBySentiment[]> => {
  try {
    const response = await axiosInstance.get('/dashboard/feedback-by-sentiment')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedback by sentiment failed')
  }
}

/**
 * Get feedback breakdown by source (Slack, Email, Manual, etc.)
 */
export const getFeedbackBySource = async (): Promise<FeedbackBySource[]> => {
  try {
    const response = await axiosInstance.get('/dashboard/feedback-by-source')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedback by source failed')
  }
}

/**
 * Get top customers by feedback volume
 */
export const getFeedbackByCustomer = async (): Promise<FeedbackByCustomer[]> => {
  try {
    const response = await axiosInstance.get('/dashboard/feedback-by-customer')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedback by customer failed')
  }
}

/**
 * Get overall dashboard metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const response = await axiosInstance.get('/dashboard/metrics')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get dashboard metrics failed')
  }
}

/**
 * Get recent activity across the workspace
 */
export const getRecentActivity = async (limit: number = 10): Promise<RecentActivity[]> => {
  try {
    const response = await axiosInstance.get('/dashboard/recent-activity', {
      params: { limit }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get recent activity failed')
  }
}

/**
 * Get feedback trends over time
 */
export const getFeedbackTrends = async (period: string = '30d'): Promise<any> => {
  try {
    const response = await axiosInstance.get('/dashboard/feedback-trends', {
      params: { period }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feedback trends failed')
  }
}

/**
 * Get issue resolution trends
 */
export const getIssueResolutionTrends = async (period: string = '30d'): Promise<any> => {
  try {
    const response = await axiosInstance.get('/dashboard/issue-trends', {
      params: { period }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get issue resolution trends failed')
  }
}